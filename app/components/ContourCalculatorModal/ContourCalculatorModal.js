import s from './ContourCalculatorModal.css'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { blue300 } from 'material-ui/styles/colors'
import Chip from 'material-ui/Chip'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import IconButton from '../IconButton/IconButton'
import * as Icons from '../Icons/Icons'
import ContourSelect from '../ContourSelect/ContourSelect'
import * as Coordinates from '../../utils/coordinates'
import * as Utils from '../../utils'

import * as Draw from '../../utils/draw'

const MAX_HEIGHT = 350

const ContoursList = (contours, selected, multi, disabled = [], onClick) => {
  const isActive = (title, selected, multi) => {
    let active = false
    if (multi)
      active = selected.indexOf(title) > -1
    else
      active = title === selected
    return active ? blue300  : ''
  }

  const isDisabled = (title, disabled) => {
    return disabled.indexOf(title) > -1
  }

  return contours.map(contour => {
    return isDisabled(contour.title, disabled) ? null : (
      <Chip key={contour.title}
            style={{margin: 4, width: 150}}
            backgroundColor={isActive(contour.title, selected, multi)}
            onTouchTap={() => onClick(contour.title)}>{contour.title}</Chip>
    )
  })
}

class ContourCalculatorModal extends React.Component {
  constructor(props) {
    super(props)

    const { contour } = props

    this.state = {
      baseContour: contour ? contour.title : '',
      excludeContours: []
    }
  }

  componentDidMount() {
    if (this.props.dev) {
      const size = MAX_HEIGHT
      const context = this.CanvasImage.getContext('2d')

      const image = new Image()
      image.src = `http://placehold.it/${size}x${size}`
      image.addEventListener('load', () => context.drawImage(image, 0, 0))
      return
    }

    const { item, frame } = this.props
    const { width, height } = item

    const zoom = MAX_HEIGHT / item.height
    const scaledWidth = item.width * zoom
    const scaledHeight = item.height * zoom

    const mainCTX = this.CanvasImage.getContext('2d')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    ctx.imageSmoothingEnabled = false

    const image = new Image()

    image.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0)

      mainCTX.translate(0, scaledHeight)
      mainCTX.scale(1, -1)

      mainCTX.imageSmoothingEnabled = false
      mainCTX.drawImage(canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight)

      const { baseContour, excludeContours } = this.state
      this.onDrawContours(baseContour, excludeContours)
    })

    const { radius, crpix_x, crpix_y, B0 } = item
    const { x, y } = Coordinates.toViewCoords({ ...item, zoom }, { x: crpix_x, y: crpix_y })
    const grid = Coordinates.getCoordinatesGrid(x, y, radius * zoom, B0, false)

    grid.forEach(point => Draw.drawPoint(this.CalcGrid, point.x, point.y, 'yellow'))


    image.src = frame.image
  }

  componentWillUpdate (np, ns) {
    const { baseContour, excludeContours } = this.state

    if (baseContour !== ns.baseContour || excludeContours !== ns.excludeContours) {
      this.onDrawContours(ns.baseContour, ns.excludeContours)
    }
  }

  onBaseChange = title => {
    this.onExcludeChange(title, true)
    this.setState({ baseContour: title })
  }

  onExcludeChange = (title, remove) => {
    const { excludeContours } = this.state

    let titles = []

    if (excludeContours.indexOf(title) > -1) {
      titles = excludeContours.filter(c => c !== title)
    } else if (!remove) {
      titles = [...excludeContours, title]
    }
    this.setState({ excludeContours: titles })
  }

  onCalculate = (base, exclude = []) => {
    const { frame, item } = this.props
    const { radius, crpix_x, crpix_y, width, solar_radius } = item

    if (base && exclude) {
      const contourAreaInfo = Coordinates.getContourAreaInfo(base.markers, exclude.map(c => c.markers), radius, crpix_x, crpix_y, solar_radius)
      const contourIntensityInfo = Coordinates.getContourIntensityInfo(base.markers, exclude.map(c => c.markers), frame.array, width, item)

      this.setState({ info: {...contourAreaInfo,...contourIntensityInfo} })
      setTimeout(() => Draw.CreateInfoImage('areaInfoCalc'), 1000)
    } else {
      this.setState({ info: null })
    }
  }

  onDrawContours = (baseContour, excludeContours) => {
    const canvas = this.CanvasDraw
    const { item, contours } = this.props
    const zoom = MAX_HEIGHT / item.height
    const base = contours.filter(c => c.title === baseContour && c.markers && c.markers.length)[0]
    const exclude = contours.filter(c => excludeContours.indexOf(c.title) > -1 && c.markers && c.markers.length) || []

    Draw.clearCanvas(canvas)

    if (base && base.markers) {
      Draw.drawContour(canvas, Coordinates.toViewCoords({...item, zoom}, base.markers), 'green')
    }

    if (exclude && exclude.length) {
      exclude.forEach(c => {
        Draw.drawContour(canvas, Coordinates.toViewCoords({...item, zoom}, c.markers), 'blue')
      })
    }

    if (base && base.markers) this.onCalculate(base, exclude)
  }

  render() {
    const { baseContour, excludeContours, info} = this.state
    const { item, contours, active, onClose } = this.props
    const zoom = MAX_HEIGHT / item.height
    const width = item.width * zoom
    const height = item.height * zoom
    const filename = Utils.getFilename(item.url)
    const { aveIntensity, sigma, standardDeviation, totalContourAreaPixels, totalAreaPixels, totalContourSphericalArea, totalVisibleSphericalArea, totalContourAreaKM, totalContourSphericalKM } = info || {}
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={onClose}
      />,
    ]
    const tableHeading = (baseContour, excludeContours) => {
      let heading = `Area info for contour ${baseContour}`
      if (excludeContours && excludeContours.length) return `${heading} with excluded contours ${excludeContours.join(', ')}`
      return heading
    }

    return (
      <div>
        <Dialog
          title="Contour Calculator"
          actions={actions}
          modal={false}
          open={!!active}
          onRequestClose={onClose}
          autoScrollBodyContent={true}
        >
          <div className={s.container}>
            <div className={s.body}>
              <div className={s.contourLeft}>
                <ContourSelect contours={contours} defaultValue={baseContour} hintText='Base contour' color={'black'} onChange={this.onBaseChange} />
                {/* ContoursList(contours, baseContour, false, [], this.onBaseChange) */}
              </div>
              <div className={s.image} style={{width: width, height: height}}>
                <canvas ref={(c) => { this.Canvas = c; }} width={width} height={height}></canvas>
                <canvas name="CalcImage" style={{zIndex: 1}} className={s.draw} ref={(c) => { this.CanvasImage = c; }} width={width} height={height}></canvas>
                <canvas name="CalcSavedContours" style={{zIndex: 2}} className={s.draw} ref={(c) => { this.CanvasDraw = c; }} width={width} height={height}></canvas>
                <canvas name="CalcGrid" style={{zIndex: 3}} className={s.draw} ref={(c) => { this.CalcGrid = c; }} width={width} height={height}></canvas>
              </div>
              <div className={s.contourRight}>
                { ContoursList(contours, excludeContours, true, [baseContour], this.onExcludeChange) }

              </div>
            </div>

            <IconButton key={'Image'} icon="Image" label="Save image" simple={true} onClick={link => Draw.SaveMergedImage(['CalcImage', 'CalcSavedContours', 'CalcGrid'], width, height, link, filename, 'areaInfoCalc', 'white')} link={true}/>

            {
              info ? <span className={s.tableHeading}>{tableHeading(baseContour, excludeContours)}</span> : null
            }

            <div className={s.containerTable} id="areaInfoCalc">
              <div className={s.icon}>
                <div className={s.iconHolder}>
                  <Icons.Area />
                </div>
                <span className={s.iconMessage}>AREA INFO</span>
              </div>
              {
                info ? (
                  <div className={s.table}>
                    <Table selectable={false}>
                      <TableHeader displaySelectAll={false}
                                   adjustForCheckbox={false}
                                   enableSelectAll={false}>
                        <TableRow style={{height: 26}}>
                          <TableHeaderColumn style={{height: 26}}>Name</TableHeaderColumn>
                          <TableHeaderColumn style={{height: 26}}>Contour Area</TableHeaderColumn>
                          <TableHeaderColumn style={{height: 26}}>Contour Area (10<sup>9</sup>km)</TableHeaderColumn>
                          <TableHeaderColumn style={{height: 26}}>Total Visible Area</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        <TableRow style={{height: 26}}>
                          <TableRowColumn style={{height: 26}}>Flat</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalContourAreaPixels.toFixed(3)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalContourAreaKM.toFixed(6)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalAreaPixels.toFixed(3)}</TableRowColumn>
                        </TableRow>
                        <TableRow style={{height: 26}}>
                          <TableRowColumn style={{height: 26}}>Spherical</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalContourSphericalArea.toFixed(3)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalContourSphericalKM.toFixed(6)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{totalVisibleSphericalArea.toFixed(3)}</TableRowColumn>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <Table selectable={false}>
                      <TableHeader displaySelectAll={false}
                                   adjustForCheckbox={false}
                                   enableSelectAll={false}>
                        <TableRow style={{height: 26}}>
                          <TableHeaderColumn style={{height: 26}}>Average Intensity</TableHeaderColumn>
                          <TableHeaderColumn style={{height: 26}}>&sigma; (Sigma)</TableHeaderColumn>
                          <TableHeaderColumn style={{height: 26}}>Standard deviation</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        <TableRow style={{height: 26}}>
                          <TableRowColumn style={{height: 26}}>{aveIntensity.toFixed(3)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{sigma.toFixed(3)}</TableRowColumn>
                          <TableRowColumn style={{height: 26}}>{standardDeviation.toFixed(3)}</TableRowColumn>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : null
              }

            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ContourCalculatorModal
