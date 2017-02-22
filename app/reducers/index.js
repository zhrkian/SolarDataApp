// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import items from './items';

console.log(items)

const rootReducer = combineReducers({
  items,
  routing
});

export default rootReducer;
