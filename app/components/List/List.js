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

import * as Utils from '../../utils'

const iconButtonElement = (
  <IconButton
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={'white'} />
  </IconButton>
)

const Menu = props =>
  <IconMenu iconButtonElement={iconButtonElement}>
    {/*<MenuItem onClick={props.onView.bind(this, item.id)}>View Image</MenuItem>*/}
    <MenuItem>Image Info</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];

class ItemList extends Component {
  onRowClick = (row, cell) => {
    const { items, onView } = this.props
    if (cell === 4) return
    return items[row].item_thinking ? null : onView(items[row].id)
  }

  render() {
    const { items } = this.props

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
                  <TableRowColumn className={s.tableBodyCell}>status</TableRowColumn>
                  <TableRowColumn  className={s.tableBodyCell} style={{textAlign: 'right'}}>{item.item_thinking ? '' : <Menu />}</TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ItemList
