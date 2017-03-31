import React from 'react'
import s from './ItemImageHolder.css'

const ItemImageHolder = props =>
  <div className={s.content}>
    <div className={s.heading}>
      <span className={s.headingMessage}>{props.heading}</span>
    </div>
    {props.children}
  </div>

export default ItemImageHolder