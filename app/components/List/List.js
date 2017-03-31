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
  render() {
    const { onView, items } = this.props

    return (
      <div className={s.container}>
        <Table
          height={600}
          fixedHeader={true}
          fixedFooter={true}
          selectable={false}
          multiSelectable={false}>
          <TableHeader className={s.tableHeader} displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} >
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody className={s.tableBody} displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={false} stripedRows={false}>
            {
              items.map( item => (
                <TableRow className={s.tableBodyRow} key={item.id}>
                  <TableRowColumn>{item.item_thinking ? 'Loading...' : Utils.getFilename(item.url)}</TableRowColumn>
                  <TableRowColumn>{item.date ? `Date: ${item.date}` : ''}</TableRowColumn>
                  <TableRowColumn>status</TableRowColumn>
                  <TableRowColumn><Menu /></TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <div className={s.list}>







          {/*<List>
            {
              items.map(item => (
                <div key={item.id}>
                  <ListItem
                    style={{color: 'white', width: '100%'}}
                    rightIconButton={
                      <IconMenu iconButtonElement={iconButtonElement}>
                        <MenuItem onClick={onView.bind(this, item.id)}>View Image</MenuItem>
                        <MenuItem>Image Info</MenuItem>
                        <MenuItem>Delete</MenuItem>
                      </IconMenu>
                    }
                    primaryText={item.item_thinking ? 'Loading...' : Utils.getFilename(item.url)}
                    secondaryText={
                    <p style={{color: grey400}}>
                      <span>{item.date ? `Date: ${item.date}` : ''}</span>
                      <br />
                      <span>{item.wavelength ? `Wavelength: ${item.wavelength}` : ''}&nbsp;{item.telescope ? `Telescope: ${item.telescope}` : ''}</span>
                    </p>
                  }
                    secondaryTextLines={2}
                  />
                  <Divider />
                </div>
              ))
            }
          </List>*/}
        </div>
      </div>
    );
  }
}

export default ItemList