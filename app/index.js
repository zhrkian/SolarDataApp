import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'
import './app.global.css'

require('./utils/fits')
require('../fonts/fonts.css')

const store = configureStore([ 'frames', 'routing' ])
const history = syncHistoryWithStore(hashHistory, store)
const muiTheme = getMuiTheme({})

injectTapEventPlugin()

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={history} routes={routes} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
