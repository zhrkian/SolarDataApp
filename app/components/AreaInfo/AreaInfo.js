import s from './AreaInfo.css'
import React from 'react'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import * as Coordinates from '../../utils/coordinates'
import * as Draw from '../../utils/draw'

import IconButton from '../IconButton/IconButton'
import * as Icons from '../Icons/Icons'

const copy = obj => JSON.parse(JSON.stringify(obj))

class AreaInfo extends React.Component {
  constructor(props) {
    super(props)
    const { item, frame, markers, build } = props
    const info = this.getAreaInfo(item, frame, markers, build)
    this.state = { item: copy(item), markers: copy(markers), info }
  }

  needUpdateAreaInfo = (item, markers, newItem, newMarkers) => {
    return markers !== newMarkers || item.radius !== newItem.radius || item.crpix_x !== newItem.crpix_x || item.crpix_y !== newItem.crpix_y
  }

  getAreaInfo = (item, frame, markers, build) => {
    if (!build) return null
    const contourAreaInfo = Coordinates.getContourAreaInfo(markers, [], item.radius, item.crpix_x, item.crpix_y)
    const contourIntensityInfo = Coordinates.getContourIntensityInfo(markers, [], frame.array, item.width, item)
    return {...contourAreaInfo,...contourIntensityInfo}
  }

  componentWillReceiveProps(props) {
    const { build } = props
    const { item, markers } = this.state
    if (this.needUpdateAreaInfo(item, markers, props.item, props.markers) && build) {
      const info = this.getAreaInfo(props.item, props.frame, props.markers, build)
      this.setState({ item: copy(props.item), markers: copy(props.markers), info })
      setTimeout(() => Draw.CreateInfoImage('areaInfo'), 1000)
    }
  }

  render() {
    const { info } = this.state
    if (!info) return null
    const { aveIntensity, sigma, standardDeviation, totalContourAreaPixels, totalAreaPixels, totalContourSphericalArea, totalVisibleSphericalArea } = info
    const { item } = this.props

    return (
      <div className={s.container} id="areaInfo">
        <div className={s.icon}>
          <div className={s.iconHolder}>
            <Icons.Area />
          </div>
          <span className={s.iconMessage}>AREA INFO</span>
        </div>
        <div className={s.table}>
          <Table fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false} style={{backgroundColor: 'transparent'}}>
            <TableHeader className={s.tableHeader} displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} style={{borderBottom: 'none'}}>
              <TableRow style={{borderBottom: 'solid 1px rgba(255, 255, 255, 0.1)'}}>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="File name">Type</TableHeaderColumn>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="Date">Contour Area</TableHeaderColumn>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="Activity">Total Visible Area</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody className={s.tableBody} displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={false} stripedRows={false}>
              <TableRow className={s.tableBodyRow}>
                <TableRowColumn className={s.tableBodyCell}>Flat</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{totalContourAreaPixels.toFixed(3)}</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{totalAreaPixels.toFixed(3)}</TableRowColumn>
              </TableRow>
              <TableRow className={s.tableBodyRow}>
                <TableRowColumn className={s.tableBodyCell}>Spherical</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{totalContourSphericalArea.toFixed(3)}</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{totalVisibleSphericalArea.toFixed(3)}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <Table fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false} style={{backgroundColor: 'transparent'}}>
            <TableHeader className={s.tableHeader} displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} style={{borderBottom: 'none'}}>
              <TableRow style={{borderBottom: 'solid 1px rgba(255, 255, 255, 0.1)'}}>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="File name">Average Intensity</TableHeaderColumn>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="Date">&sigma; (Sigma)</TableHeaderColumn>
                <TableHeaderColumn className={s.tableHeaderCell} tooltip="Activity">Standard deviation</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody className={s.tableBody} displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={false} stripedRows={false}>
              <TableRow className={s.tableBodyRow}>
                <TableRowColumn className={s.tableBodyCell}>{aveIntensity.toFixed(3)}</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{sigma.toFixed(3)}</TableRowColumn>
                <TableRowColumn className={s.tableBodyCell}>{standardDeviation.toFixed(3)}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}


export default AreaInfo