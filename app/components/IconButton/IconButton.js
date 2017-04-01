import s from './IconButton.css'
import React from 'react'
import IButton from 'material-ui/IconButton'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const { icon, label, disabled, onClick } = props
  const Icon = Icons[icon]
  const styles = disabled ? {opacity: 0.5, cursor: 'not-allowed'} : {}
  const click = e => {
    e.preventDefault()
    return disabled ? null : onClick()
  }

  return (
    <IButton className={s.container}
             style={styles}
             onClick={click}
             tooltip={label.length > 12 ? label : null}>
      <div className={s.icon}>
        <Icon />
      </div>
      <div className={s.label}>
        <div className={s.text}>{label}</div>
      </div>
    </IButton>
  )
}

export default IconButton
