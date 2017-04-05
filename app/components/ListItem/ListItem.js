import React from 'react'
import { Link } from 'react-router'
import s from './ListItem.css'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'

import Spinner from '../Spinner/Spinner'

const ListItem = props => {
  const { item, frame } = props
  const { image } = frame || {}
  const { header } = item
  const { item_thinking } = item
  return (
    <div className={s.container} style={{border: 'solid red'}}>
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
            {
              header ? (
                <div className={s.footerContent}>
                  <span>{header['DATE-OBS'].value}</span>
                  {/*<span>{header['TIME-OBS'].value}</span>*/}
                </div>
              ) : null
            }
          </div>
        </Link>
        )
      }
    </div>
  )
}

export default ListItem