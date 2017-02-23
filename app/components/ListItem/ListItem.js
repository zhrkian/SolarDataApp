import React from 'react'
import s from './ListItem.css'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'

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
  return (
    <Paper style={PaperStyle} zDepth={3}>
      <div className={s.body}>
        <img src="http://placehold.it/150x150" />
      </div>
      <div className={s.footer}>
        <p>{header['DATE-OBS'].value} {header['TIME-OBS'].value}</p>
        {'FOOTER'}
      </div>
    </Paper>
  )
}

export default ListItem