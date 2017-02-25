// @flow
import * as Utils from '../utils'
import * as FITS from '../utils/item_creator'

import * as Frame from './frames'

export const ITEMS_UPDATE_ALL = 'ITEMS_UPDATE_ALL';

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
          console.log(itemWithInfo)
          const { id, frame, image } = itemWithInfo
          console.log({ id, frame, image })
          dispatch(Frame.updateFrameArray(id, frame))
          dispatch(Frame.updateFrameImage(id, image))

          delete itemWithInfo.frame
          delete itemWithInfo.image
          return itemWithInfo
        }
        return item
      })
      setTimeout(() => dispatch({ type: ITEMS_UPDATE_ALL, items }), 1000)
    })
  }
