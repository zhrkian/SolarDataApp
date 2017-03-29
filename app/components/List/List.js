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

import OpenFITS from '../../components/OpenFITS/OpenFITS'

import * as Utils from '../../utils'

const iconButtonElement = (
  <IconButton
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={'white'} />
  </IconButton>
)

class ItemList extends Component {
  render() {
    const { onOpenFiles, onRemove, onView, items } = this.props

    return (
      <div className={s.container}>
        <h2>Solar Data Application</h2>
        <div className={s.main}>
          <OpenFITS onOpenFiles={onOpenFiles} onClearAll={() => {}} />
        </div>
        <div className={s.list}>
          <List>
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
          </List>
        </div>
      </div>
    );
  }
}

export default ItemList