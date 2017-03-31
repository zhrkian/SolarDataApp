import React from 'react'
import s from './ItemLayout.css'

const ListLayout = props =>
  <div className={s.container}>
    {props.children}
  </div>

export default ListLayout