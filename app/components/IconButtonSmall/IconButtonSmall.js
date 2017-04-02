import s from './IconButtonSmall.css'
import React from 'react'
import IButton from 'material-ui/IconButton'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const { icon, label, disabled, onClick } = props
  const Icon = Icons[icon]
  const styles = disabled ? {opacity: 0.5, cursor: 'not-allowed'} : {}

  return (
    <IButton className={s.container}
             style={styles}
             onClick={onClick}
             disabled={disabled}
             tooltip={label}>
      <div className={s.icon}>
        <Icon />
      </div>
      {/*<div className={s.label}>
        <div className={s.text}>{label}</div>
      </div>*/}
    </IButton>
  )
}

export default IconButton
