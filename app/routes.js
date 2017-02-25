// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import InitialPage from './containers/InitialPage/InitialPage';
import ItemsPage from './containers/ItemsPage/ItemsPage';
import ItemPage from './containers/ItemPage/ItemPage';


export default (
  <Route path='/' component={App}>
    <IndexRoute component={InitialPage} />
    <Route path='items' component={ItemsPage} />
    <Route path='items/:id' component={ItemPage} />
  </Route>
);
