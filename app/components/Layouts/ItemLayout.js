import React from 'react'
import s from './ItemLayout.css'

const ListLayout = props =>
  <div className={s.container}>
    <div className={s.back}>
      <div className={s.backIconHolder}>
        <i className={s.backIcon}></i>
      </div>
      <span className={s.backMessage}>FILE LIST</span>
    </div>
    <div className={s.content}>
      <div className={s.heading}>
        <span className={s.headingMessage}>{props.heading}</span>
      </div>
      {props.children}
    </div>
    <div className={s.controls}>

    </div>
  </div>

export default ListLayout