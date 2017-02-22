// @flow
import React, { Component } from 'react';
//import Initial from '../../components/Initial/Initial';
import s from './ItemsPage.css'

import OpenFITS from '../../components/OpenFITS/OpenFITS'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: 450,
    overflowY: 'auto',
  },
};


export default class InitialPage extends Component {
  render() {
    return (
      <div className={s.container}>
        ITEMS
        <OpenFITS />
      </div>
    );
  }
}
