import s from './ContourCalculatorModal.css'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import ContourList from '../ContourList/ContourList'

import * as Coordinates from '../../utils/coordinates'

//Flat	1138.0000	29434.4362
//Spherical	1270.1749	58868.8723
//Contour average intensity: 0.7291146172420285

//Flat	75.0000	29434.4362
//Spherical	81.6155	58868.8723
//Contour average intensity: 0.1703094483950796


class ContourCalculatorModal extends React.Component {
  constructor() {
    super()
    this.state = {
      baseContour: '',
      excludeContours: []
    }
  }

  onBaseChange = title => {
    const { excludeContours } = this.state
    this.props.onChange([title,...excludeContours])
    this.setState({ baseContour: title })
  }

  onExcludeChange = titles => {
    const { baseContour } = this.state

    this.props.onChange([baseContour,...titles])

    this.setState({ excludeContours: titles })
  }

  onCalculate = () => {
    const { frame, item } = this.props
    const { contours, radius, crpix_x, crpix_y, width } = item
    const { baseContour, excludeContours } = this.state

    const base = contours.filter(c => c.title === baseContour)[0]
    const exclude = contours.filter(c => excludeContours.indexOf(c.title) > -1) || []

    if (base && exclude && exclude.length) {
      const contourSquareInfo = Coordinates.getContourSquareInfo(base.contour, exclude.map(c => c.contour), radius, crpix_x, crpix_y)
      const contourIntensityInfo = Coordinates.getContourIntensityInfo(base.contour, exclude.map(c => c.contour), frame, width)

      this.setState({ contourSquareInfo, contourIntensityInfo })
    }
  }

  render() {
    const { item, active, onClose } = this.props
    const { contours } = item

    const { contourSquareInfo, contourIntensityInfo } = this.state
    const { totalContourSquarePixels, totalSquarePixels, totalContourSphericalSquare, totalVisibleSphericalSquare } = contourSquareInfo || {}
    const { aveIntensity } = contourIntensityInfo || {}

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
            <div className={s.selectBox}>
              <ContourList contours={contours} hintText='Base contour' color={'black'} onChange={this.onBaseChange} />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <ContourList contours={contours} hintText='Exclude contours' color={'black'} multiple={true} onChange={this.onExcludeChange} />
            </div>

            {
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
            }
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ContourCalculatorModal