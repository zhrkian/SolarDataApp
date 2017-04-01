import s from './IconButton.css'
import React from 'react'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const Icon = Icons[props.icon]
  return (
    <div className={s.container}>
      <div className={s.icon}>
        <Icon />
      </div>
      <div className={s.label}>{props.label}</div>
    </div>
  )
}

export default IconButton
