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

import * as Draw from '../../utils/draw'


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

  //(
  //  <Chip key={contour.title}>{contour.title}</Chip>
  //)

  return contours.map(contour => {
    return isDisabled(contour.title, disabled) ? null : (
      <Chip key={contour.title}
            style={{margin: 4}}
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
      const size = 250
      const context = this.CanvasImage.getContext('2d')

      const image = new Image()
      image.src = `http://placehold.it/${size}x${size}`
      image.addEventListener('load', () => context.drawImage(image, 0, 0))
      return
    }

    const { item, frame } = this.props
    const { width, height } = item

    const zoom = 250 / item.height
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
    const { radius, crpix_x, crpix_y, width } = item

    if (base && exclude) {
      const contourAreaInfo = Coordinates.getContourAreaInfo(base.markers, exclude.map(c => c.markers), radius, crpix_x, crpix_y)
      const contourIntensityInfo = Coordinates.getContourIntensityInfo(base.markers, exclude.map(c => c.markers), frame.array, width)

      this.setState({ info: {...contourAreaInfo,...contourIntensityInfo} })
    } else {
      this.setState({ info: null })
    }
  }

  onDrawContours = (baseContour, excludeContours) => {
    const canvas = this.CanvasDraw
    const { item, contours } = this.props
    const zoom = 250 / item.height
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

    console.log(base, exclude)
    if (base && base.markers) this.onCalculate(base, exclude)
  }

  render() {
    const { baseContour, excludeContours, info} = this.state
    const { item, contours, active, onClose } = this.props
    const zoom = 250 / item.height
    const width = item.width * zoom
    const height = item.height * zoom
    const { aveIntensity, totalContourAreaPixels, totalAreaPixels, totalContourSphericalArea, totalVisibleSphericalArea } = info || {}
    const actions = [
      <FlatButton
        label="Calculate"
        primary={true}
        onClick={this.onCalculate}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onClick={onClose}
      />,
    ]

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
              <div className={s.contours}>
                <ContourSelect contours={contours} defaultValue={baseContour} hintText='Base contour' color={'black'} onChange={this.onBaseChange} />
                {/* ContoursList(contours, baseContour, false, [], this.onBaseChange) */}
              </div>
              <div className={s.image} style={{width: width, height: height}}>
                <canvas ref={(c) => { this.Canvas = c; }} width={width} height={height}></canvas>
                <canvas style={{zIndex: 1}} className={s.draw} ref={(c) => { this.CanvasImage = c; }} width={width} height={height}></canvas>
                <canvas style={{zIndex: 2}} className={s.draw} ref={(c) => { this.CanvasDraw = c; }} width={width} height={height}></canvas>
              </div>
              <div className={s.contours}>
                { ContoursList(contours, excludeContours, true, [baseContour], this.onExcludeChange) }
              </div>
            </div>

            <div className={s.containerTable}>
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
                        <TableRow>
                          <TableHeaderColumn>Name</TableHeaderColumn>
                          <TableHeaderColumn>Contour Sqare</TableHeaderColumn>
                          <TableHeaderColumn>Total Visible Square</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        <TableRow>
                          <TableRowColumn>Flat</TableRowColumn>
                          <TableRowColumn>{totalContourAreaPixels.toFixed(3)}</TableRowColumn>
                          <TableRowColumn>{totalAreaPixels.toFixed(3)}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                          <TableRowColumn>Spherical</TableRowColumn>
                          <TableRowColumn>{totalContourSphericalArea.toFixed(3)}</TableRowColumn>
                          <TableRowColumn>{totalVisibleSphericalArea.toFixed(3)}</TableRowColumn>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <p>{ `Contour average intensity: ${aveIntensity.toFixed(3)}` }</p>
                  </div>
                ) : null
              }

            </div>



            {/*<div className={s.selectBox}>
              <ContourSelect contours={contours} hintText='Base contour' color={'black'} onChange={this.onBaseChange} />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <ContourSelect contours={contours} hintText='Exclude contours' color={'black'} multiple={true} onChange={this.onExcludeChange} />
            </div>*/}

            {/*
              contourSquareInfo ? (
                <div className={s.container}>
                  <h2>Contour Info</h2>

                  <Table selectable={false}>
                    <TableHeader displaySelectAll={false}
                                 adjustForCheckbox={false}
                                 enableSelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Contour Sqare</TableHeaderColumn>
                        <TableHeaderColumn>Total Visible Square</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      <TableRow>
                        <TableRowColumn>Flat</TableRowColumn>
                        <TableRowColumn>{totalContourSquarePixels.toFixed(4)}</TableRowColumn>
                        <TableRowColumn>{totalSquarePixels.toFixed(4)}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>Spherical</TableRowColumn>
                        <TableRowColumn>{totalContourSphericalSquare.toFixed(4)}</TableRowColumn>
                        <TableRowColumn>{totalVisibleSphericalSquare.toFixed(4)}</TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <p>{ `Contour average intensity: ${aveIntensity}` }</p>
                </div>
              ) : null
            */}
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ContourCalculatorModal