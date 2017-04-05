import s from './AreaInfo.css'
import React from 'react'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import * as Coordinates from '../../utils/coordinates'

import IconButton from '../IconButton/IconButton'
import * as Icons from '../Icons/Icons'

const copy = obj => JSON.parse(JSON.stringify(obj))

class AreaInfo extends React.Component {
  constructor(props) {
    super(props)
    const { item, frame, markers } = props
    const info = this.getAreaInfo(item, frame, markers)
    this.state = { item: copy(item), markers: copy(markers), info }
  }

  needUpdateAreaInfo = (item, markers, newItem, newMarkers) => {
    return markers !== newMarkers || item.radius !== newItem.radius || item.crpix_x !== newItem.crpix_x || item.crpix_y !== newItem.crpix_y
  }

  getAreaInfo = (item, frame, markers) => {
    const contourAreaInfo = Coordinates.getContourAreaInfo(markers, [], item.radius, item.crpix_x, item.crpix_y)
    const contourIntensityInfo = Coordinates.getContourIntensityInfo(markers, [], frame.array, item.width)

    return {...contourAreaInfo,...contourIntensityInfo}
  }

  componentWillReceiveProps(props) {
    const { item, markers } = this.state
    if (this.needUpdateAreaInfo(item, markers, props.item, props.markers)) {
      const info = this.getAreaInfo(props.item, props.frame, props.markers)
      this.setState({ item: copy(props.item), markers: copy(props.markers), info })
    }
  }

  render() {
    const { info } = this.state
    if (!info) return null
    const { aveIntensity, totalContourAreaPixels, totalAreaPixels, totalContourSphericalArea, totalVisibleSphericalArea } = info

    return (
      <div className={s.container}>
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
          <p>Contour average intensity: {aveIntensity.toFixed(3)}</p>
        </div>
      </div>
    )
  }
}


export default AreaInfo