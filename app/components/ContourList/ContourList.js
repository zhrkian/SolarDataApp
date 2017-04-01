import s from './ContourList.css'
import React from 'react'
import ContourListItem from '../ContourListItem/ContourListItem'

const ContourList = props => {
  const { contours, active, onSelect } = props
  return (
    <div className={s.list}>
      {
        contours.map(contour => <ContourListItem key={contour.title} contour={contour} active={active.title === contour.title} onClick={onSelect} />)
      }
    </div>
  )
}

export default ContourList