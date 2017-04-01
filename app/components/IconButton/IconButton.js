import s from './IconButton.css'
import React from 'react'
import IButton from 'material-ui/IconButton';
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const Icon = Icons[props.icon]
  return (
    <IButton className={s.container} tooltip={props.label.length > 12 ? props.label : null }>
      <div className={s.icon}>
        <Icon />
      </div>
      <div className={s.label}>
        <div className={s.text}>{props.label}</div>
      </div>
    </IButton>
  )
}

export default IconButton
