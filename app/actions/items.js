// @flow
import * as Utils from '../utils'
import * as FITS from '../utils/item_creator'

import * as Frame from './frames'

export const ITEMS_UPDATE_ALL = 'ITEMS_UPDATE_ALL';
export const ITEMS_UPDATE_ITEM_SCALE = 'ITEMS_UPDATE_ITEM_SCALE';
export const ITEMS_UPDATE_ITEM_LEVEL = 'ITEMS_UPDATE_ITEM_LEVEL';
export const ITEMS_UPDATE_ITEM_RADIUS = 'ITEMS_UPDATE_ITEM_RADIUS';

const isFileExist = (file, items) => {
  const { name, path } = file
  return items.filter(item => item.url === name || item.url === path)[0]
}

const getFileInfoPromise = (id, file) =>
  new Promise(resolve => {
    FITS.getFITSItem(file, item => resolve({ ...item, id }))
  })

export const getItems = files =>
  (dispatch, getState) => {
    files = Object.keys(files).map(key => files[key])

    let { items } = getState().items

    let promises = files.map(file => {
      if (isFileExist(file, items)) return

      const id = Utils.generatePortId(items)

      items = [{ id, item_thinking: true },...items]

      return getFileInfoPromise(id, file)
    })

    dispatch({ type: ITEMS_UPDATE_ALL, items })

    Promise.all(promises).then(itemsWithInfo => {
      items = items.map(item => {
        const itemWithInfo = itemsWithInfo.filter(i => i && i.id === item.id)[0]
        if (itemWithInfo) {
          const { id, frame } = itemWithInfo
          dispatch(Frame.updateFrameArray(id, frame))

          delete itemWithInfo.frame

          return itemWithInfo
        }
        return item
      })
      setTimeout(() => dispatch({ type: ITEMS_UPDATE_ALL, items }), 10)
    })
  }


export const itemThinking = (item, items, thinking) => {
  return items.map(i => {
    if (item.id === i.id) i.item_thinking = thinking
    return i
  })
}

export const updateItem = item =>
  (dispatch, getState) => {
    let { items } = getState().items

    items = itemThinking(item, items, true)

    dispatch({ type: ITEMS_UPDATE_ALL, items })

    FITS.getFITSItem({ path: item.url }, updatedItem => {
      const { frame } = updatedItem

      dispatch(Frame.updateFrameArray(item.id, frame))

      items = itemThinking(item, items, false)

      setTimeout(() => dispatch({ type: ITEMS_UPDATE_ALL, items }), 100)
    })
  }

export const updateItemScale = (id, scale) => {
  return { type: ITEMS_UPDATE_ITEM_SCALE, id, scale }
}

export const updateItemLevel = (id, min, max) => {
  return { type: ITEMS_UPDATE_ITEM_LEVEL, id, min, max }
}

export const updateItemRadius = (id, radius, xCenter, yCenter) => {
  return { type: ITEMS_UPDATE_ITEM_RADIUS, id, radius, xCenter, yCenter }
}


const updateContour = (item, contour) => {
  let contours = item.contours || []
  let isExist = false

  contours = contours.map(c => {
    if (c.title === contour.title) {
      c = contour
      isExist = true
    }
    return c
  })

  if (!isExist) contours.push(contour)

  item.contours = contours

  return item
}

export const updateItemContour = (id, contour) =>
  (dispatch, getState) => {
    let { items } = getState().items

    items = items.map(item => {
      if (id === item.id) {
        item = updateContour(item, contour)
      }
      return item
    })

    return dispatch({ type: ITEMS_UPDATE_ALL, items })
  }
