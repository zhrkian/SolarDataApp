import s from './AreaInfo.css'
import React from 'react'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import IconButton from '../IconButton/IconButton'
import * as Icons from '../Icons/Icons'

const AreaInfo = props => {
  return (
    <div className={s.container}>
      <div className={s.icon}>
        <Icons.Area />
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
              <TableRowColumn className={s.tableBodyCell}>0.545646464654</TableRowColumn>
              <TableRowColumn className={s.tableBodyCell}>0.545646464654</TableRowColumn>
            </TableRow>
            <TableRow className={s.tableBodyRow}>
              <TableRowColumn className={s.tableBodyCell}>Spherical</TableRowColumn>
              <TableRowColumn className={s.tableBodyCell}>0.545646464654</TableRowColumn>
              <TableRowColumn className={s.tableBodyCell}>0.545646464654</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <p>Contour average intensity: 0.9887010679309668</p>
      </div>
    </div>
  )
}

export default AreaInfo