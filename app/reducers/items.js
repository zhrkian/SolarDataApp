// @flow
import { ITEMS_UPDATE_ALL } from '../actions/items'

const initialState = {
  items: []
}

const items = (state = initialState, action) => {
  switch (action.type) {
    case ITEMS_UPDATE_ALL:
      return {...state, items: action.items}
    default:
      return state
  }
}


export default items