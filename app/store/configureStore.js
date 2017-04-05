// @flow
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'

const router = routerMiddleware(hashHistory)

const enhancer = applyMiddleware(thunk, router)

//localStorage.clear()

const getLocalStorageStore = () => {
  const store = localStorage.getItem('SolarAppStorage')
  return store ? JSON.parse(store) : {}
}

const writeLocalStorageStore = (data, blacklist) => {
  let toWrite = {}
  for (let key in data) {
    if (data.hasOwnProperty(key) && blacklist.indexOf(key) < 0) {
      toWrite[key] = data[key]
    }
  }
  localStorage.setItem('SolarAppStorage', JSON.stringify(toWrite))
}

const storeHandler = (store, blacklist) => {
  let data = store.getState() || {}
  writeLocalStorageStore(data, blacklist)
}

export default function configureStore(blacklist) {
  let savedStore = getLocalStorageStore()
  const store = createStore(rootReducer, savedStore, enhancer)
  store.subscribe(() => storeHandler(store, blacklist || []))
  return store
}
