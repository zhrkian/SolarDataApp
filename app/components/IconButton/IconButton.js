import s from './IconButton.css'
import React from 'react'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const { icon, label, disabled, onClick } = props
  const Icon = Icons[icon]
  const styles = disabled ? {filter: 'grayscale(100%)', cursor: 'not-allowed'} : {}
  const click = e => {
    e.preventDefault()
    return disabled ? null : onClick()
  }

  return (
    <a className={s.container}
       href={'#0'}
       style={styles}
       onClick={click}>
      <div className={s.icon}>
        <Icon />
      </div>
      <div className={s.label}>{label}</div>
    </a>
  )
}

export default IconButton
