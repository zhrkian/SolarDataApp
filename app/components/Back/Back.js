import React from 'react'
import { Link } from 'react-router'
import s from './Back.css'

const Back = props =>
  <Link className={s.back} to={`/items`}>
    <div className={s.backIconHolder}>
      <i className={s.backIcon}></i>
    </div>
    <span className={s.backMessage}>FILE LIST</span>
  </Link>

export default Back