// @flow
import * as Utils from '../utils'
import * as FITS from '../utils/item_creator'

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const ITEMS_UPDATE_ALL = 'ITEMS_UPDATE_ALL';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
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
      const id = Utils.generatePortId(items)
      items = [{ id, item_thinking: true },...items]
      return getFileInfoPromise(id, file)
    })

    dispatch({ type: ITEMS_UPDATE_ALL, items })

    Promise.all(promises).then(itemsWithInfo => {
      items = items.map(item => {
        const itemWithInfo = itemsWithInfo.filter(i => i.id === item.id)[0]
        return itemWithInfo || item
      })


      console.log(items)

      setTimeout(() => dispatch({ type: ITEMS_UPDATE_ALL, items }), 1000)
    })
  }
