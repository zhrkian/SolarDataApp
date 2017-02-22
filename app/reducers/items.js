// @flow
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/items'

const initialState = {}

const items = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    default:
      return state
  }
}


export default items