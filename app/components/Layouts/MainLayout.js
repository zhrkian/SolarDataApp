import React from 'react'
import s from './MainLayout.css'

const MainLayout = props =>
  <div className={s.container}>
    {props.children}
  </div>

export default MainLayout