import React from 'react'
import { Link } from 'react-router'
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
  const { item, frame } = props
  const { image } = frame || {}
  const { header } = item
  const { item_thinking } = item
  return (
    <div className={s.container}>
      {
        item_thinking ? <Spinner /> : (
        <Link to={`/items/${item.id}`}>
          <div className={s.body}>
            <img src={image} style={{width: 'auto', height: '250px'}}/>
          </div>
          <div className={s.close}>
            <ActionDelete />
          </div>
          <div className={s.footer}>
            {'FOOTER'}
          </div>
        </Link>
        )
      }
    </div>
  )
}

export default ListItem