import React from 'react'
import s from './ListLayout.css'

const ListLayout = props =>
  <div className={s.container}>
    <div className={s.header}>
      <span>FITS FILE LIST</span>
    </div>
      {props.children}
  </div>

export default ListLayout