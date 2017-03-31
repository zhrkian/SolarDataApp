import React from 'react'
import s from './ItemLayout.css'

const ListLayout = props =>
  <div className={s.container}>
    <a href={'#0'} className={s.back}>
      <div className={s.backIconHolder}>
        <i className={s.backIcon}></i>
      </div>
      <span className={s.backMessage}>FILE LIST</span>
    </a>
    <div className={s.content}>
      <div className={s.heading}>
        <span className={s.headingMessage}>{props.heading}</span>
      </div>
      {props.children}
    </div>
    <div className={s.controls}>
      <div className={s.block}>
        <div className={s.blockTitleHolder}>
          <span className={s.blockTitleMessage}>TITLE</span>
        </div>
      </div>
    </div>
  </div>

export default ListLayout