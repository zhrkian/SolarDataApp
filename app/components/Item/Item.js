import React from 'react'
import * as IMG from '../../utils/item_creator'

const Item = props => {
  const { item, frame } = props
  const { array } = frame

  console.log(item, frame)
  const image = IMG.getFrameImage(array, item.width, item.height)

  return (
    <div>
      <img src={image} />
    </div>
  )
}

export default Item