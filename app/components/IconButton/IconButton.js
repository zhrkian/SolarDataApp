import s from './IconButton.css'
import React from 'react'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const Icon = Icons[props.icon]
  return (
    <div className={s.button}>
      <Icon />
      <span className={s.label}>{props.label}</span>
    </div>
  )
}

export default IconButton