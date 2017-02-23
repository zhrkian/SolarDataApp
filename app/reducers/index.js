// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import items from './items';
import frames from './frames';


const rootReducer = combineReducers({
  items,
  frames,
  routing
});

export default rootReducer;
