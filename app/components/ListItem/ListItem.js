import React from 'react'
import s from './ListItem.css'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'

import Spinner from '../Spinner/Spinner'

const PaperStyle = {
  height: '250px',
  width: '150px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
  padding: '10px',
  position: 'relative',
}

const ListItem = props => {
  const { item } = props
  const { header } = item
  const { item_thinking } = item
  return (
    <Paper style={PaperStyle} zDepth={3}>
      {
        item_thinking ? <Spinner style={{backgroundColor: 'white'}}/> : (
          <div>
            <div className={s.body}>
              <img src="http://placehold.it/150x150" />
            </div>
            <div className={s.footer}>
              <p>{header['DATE-OBS'].value} {header['TIME-OBS'].value}</p>
              {'FOOTER'}
            </div>
          </div>
        )
      }
    </Paper>
  )
}

export default ListItem