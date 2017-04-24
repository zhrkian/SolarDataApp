// @flow
import {
  ITEMS_UPDATE_ALL,
  ITEMS_UPDATE_ITEM_ZOOM,
  ITEMS_UPDATE_ITEM_LEVEL,
  ITEMS_UPDATE_ITEM_RADIUS,
  ITEMS_REMOVE_ITEM,
  ITEMS_REMOVE_ALL_ITEMS
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

const updateItemLevel = (items, id, min, max, f_min, f_max) =>
  items.map(item => {
    if (item.id === id) {
      if (f_max < max) {
        max = f_max
      }
      if (f_min > min) {
        min = f_min
      }

      item.image_min = min
      item.image_max = max
      item.frame_min = f_min
      item.frame_max = f_max
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

const removeItem = (items, id) =>
  items.filter(item => item.id !== id)

const items = (state = initialState, action) => {
  switch (action.type) {
    case ITEMS_UPDATE_ALL:
      return {...state, items: action.items}
    case ITEMS_UPDATE_ITEM_ZOOM:
      return {...state, items: updateItemZoom(state.items, action.id, action.zoom)}
    case ITEMS_UPDATE_ITEM_LEVEL:
      return {...state, items: updateItemLevel(state.items, action.id, action.min, action.max, action.f_min, action.f_max)}
    case ITEMS_UPDATE_ITEM_RADIUS:
      return {...state, items: updateItemRadius(state.items, action.id, action.radius, action.xCenter, action.yCenter)}
    case ITEMS_REMOVE_ITEM: {
      return {...state, items: removeItem(state.items, action.id)}
    }
    case ITEMS_REMOVE_ALL_ITEMS: {
      return {...state, items: []}
    }
    default:
      return state
  }
}


export default items