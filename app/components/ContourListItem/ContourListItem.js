import s from './ContourListItem.css'
import React from 'react'
import IButton from 'material-ui/IconButton'
import * as Icons from '../Icons/Icons'

const Buttons = props => {
  const { icon, onClick } = props
  const Icon = Icons[icon]
  return (
    <a className={s.icon} onClick={e => e.preventDefault() & onClick()}>
      <Icon />
    </a>
  )
}

const ContourListItem = props => {
  const { contour, active, onClick, onEdit, onRemove } = props
  const styles = active ? { backgroundColor: '#4a90e2' } : {}
  return (
    <div className={s.container} style={styles}>
      <div className={s.title} onClick={onClick.bind(this, contour)}>
        {contour.title}
      </div>
      <div className={s.controls}>
        <Buttons icon="Edit" onClick={onEdit.bind(this, contour)} />
        <Buttons icon="Delete" onClick={onRemove.bind(this, contour)} />
      </div>
    </div>
  )
}

export default ContourListItem