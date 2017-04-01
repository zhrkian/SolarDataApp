import React from 'react'
import s from './ItemControls.css'

const ItemControls = props =>
  <div className={s.controls}>
    <div className={s.dock}>
      {props.dock}
    </div>
    <div className={s.blocks}>
      {props.children}
    </div>

  </div>

export default ItemControls