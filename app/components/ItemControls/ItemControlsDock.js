import s from './ItemControlsDock.css'
import React from 'react'

const ItemControlsDock = props =>
  <div className={s.dock}>{props.children}</div>

export default ItemControlsDock
