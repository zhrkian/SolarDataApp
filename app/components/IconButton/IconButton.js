import s from './IconButton.css'
import React from 'react'
import IButton from 'material-ui/IconButton'
import * as Icons from '../Icons/Icons'

const IconButton = props => {
  const { icon, label, disabled, onClick, link, simple } = props
  const Icon = Icons[icon]
  const styles = disabled ? {opacity: 0.5, cursor: 'not-allowed'} : {}

  const isLink = (element, lvl) => {
    if (element.nodeName.toLowerCase() === 'a') return element
    if (lvl === 10) return false
    lvl += 1
    return isLink(element.parentNode, lvl)
  }

  const click = e => {
    let lvl = 0
    const linkElement = isLink(e.target, lvl)
    if (!link) e.preventDefault()
    return disabled ? null : onClick(linkElement)
  }

  if (simple) {
    return (
      <div style={{paddingTop: 10}}>
        <a href="#0"
           style={{padding: 5, backgroundColor: 'rgb(224, 224, 224)'}}
           onClick={click}>
          {label}
        </a>
      </div>
    )
  }

  return (
    <IButton className={s.container}
             style={styles}
             href="#0"
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
