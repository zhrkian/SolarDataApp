import React from 'react'
import ItemImage from '../ItemImage/ItemImage'
import * as IMG from '../../utils/item_creator'

const Item = props => {
  const { item, frame } = props
  const { array, image } = frame

  return <ItemImage {...props} />
}

export default Item