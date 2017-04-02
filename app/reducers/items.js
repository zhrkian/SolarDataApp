// @flow
import {
  ITEMS_UPDATE_ALL,
  ITEMS_UPDATE_ITEM_ZOOM,
  ITEMS_UPDATE_ITEM_LEVEL,
  ITEMS_UPDATE_ITEM_RADIUS
} from '../actions/items'

const initialState = {
  items: []
}

const updateItemZoom = (items, id, zoom) =>
  items.map(item => {
    if (item.id === id) {
      item.zoom = zoom
    }
    return item
  })

const updateItemLevel = (items, id, min, max) =>
  items.map(item => {
    if (item.id === id) {
      item.image_min = min
      item.image_max = max
    }
    return item
  })

const updateItemRadius = (items, id, radius, xCenter, yCenter) =>
  items.map(item => {
    if (item.id === id) {
      item.radius = radius
      item.crpix_x = xCenter
      item.crpix_y = yCenter
    }
    return item
  })

const items = (state = initialState, action) => {
  switch (action.type) {
    case ITEMS_UPDATE_ALL:
      return {...state, items: action.items}
    case ITEMS_UPDATE_ITEM_ZOOM:
      return {...state, items: updateItemZoom(state.items, action.id, action.zoom)}
    case ITEMS_UPDATE_ITEM_LEVEL:
      return {...state, items: updateItemLevel(state.items, action.id, action.min, action.max)}
    case ITEMS_UPDATE_ITEM_RADIUS:
      return {...state, items: updateItemRadius(state.items, action.id, action.radius, action.xCenter, action.yCenter)}
    default:
      return state
  }
}


export default items