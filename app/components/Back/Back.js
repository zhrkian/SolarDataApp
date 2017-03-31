import React from 'react'
import s from './Back.css'

const Back = props =>
  <a href={'#0'} className={s.back}>
    <div className={s.backIconHolder}>
      <i className={s.backIcon}></i>
    </div>
    <span className={s.backMessage}>FILE LIST</span>
  </a>

export default Back