import s from './List.css'
import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import SaveFile from '../SaveFile/SaveFile'

import * as Utils from '../../utils'

const iconButtonElement = (
  <IconButton
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={'white'} />
  </IconButton>
)

const getContours = item => {
  if (!item || !item.contours || !item.contours.length) return 'No contours'

  switch(item.contours.length) {
    case 1: return `1 contour`
    default:
      return `${item.contours.length} contours`
  }
}

const Menu = props =>
  <IconMenu iconButtonElement={iconButtonElement}>
    {/*<MenuItem onClick={props.onView.bind(this, item.id)}>View Image</MenuItem>*/}
    <MenuItem disabled={true}>Image Info</MenuItem>
    <MenuItem onClick={props.onRemove.bind(this, props.item.id)}>Delete</MenuItem>
  </IconMenu>

class ItemList extends Component {
  onRowClick = (row, cell) => {
    const { items, onView } = this.props
    if (cell === 4) return
    return items[row].item_thinking ? null : onView(items[row].id)
  }

  render() {
    const { items, onRemove } = this.props

    if (!items || !items.length) return null //<div className={s.container}><span className={s.noItemsMessage}>You have no loaded files</span></div>

    return (
      <div className={s.container}>
        <Table height={600} fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false} style={{backgroundColor: 'transparent'}}
          onCellClick={this.onRowClick}
        >
          <TableHeader className={s.tableHeader} displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} style={{borderBottom: 'none'}}>
            <TableRow style={{borderBottom: 'solid 1px rgba(255, 255, 255, 0.1)'}}>
              <TableHeaderColumn className={s.tableHeaderCell} tooltip="File name">File</TableHeaderColumn>
              <TableHeaderColumn className={s.tableHeaderCell} tooltip="Date">Date</TableHeaderColumn>
              <TableHeaderColumn className={s.tableHeaderCell} tooltip="Activity">Activity</TableHeaderColumn>
              <TableHeaderColumn className={s.tableHeaderCell} tooltip="Menu"></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody className={s.tableBody} displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={false} stripedRows={false}>
            {
              items.map( item => (
                <TableRow className={s.tableBodyRow} key={item.id}>
                  <TableRowColumn className={s.tableBodyCell}>{item.item_thinking ? 'Loading...' : Utils.getFilename(item.url)}</TableRowColumn>
                  <TableRowColumn className={s.tableBodyCell}>{item.date ? `${item.date}` : ''}</TableRowColumn>
                  <TableRowColumn className={s.tableBodyCell}>{item.item_thinking ? '' : getContours(item)}</TableRowColumn>
                  <TableRowColumn  className={s.tableBodyCell} style={{textAlign: 'right'}}>{item.item_thinking ? '' : <Menu item={item} onRemove={onRemove} />}</TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <SaveFile />
      </div>
    );
  }
}

export default ItemList
