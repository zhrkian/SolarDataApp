import React from 'react'
import s from './ItemControls.css'

const ItemControls = props =>
  <div className={s.controls}>
    {props.children}
  </div>

export default ItemControls