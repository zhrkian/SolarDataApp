// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import s from './HomePage.css'

export default class HomePage extends Component {
  render() {
    return (
      <div className={s.container}>
        <Home />
      </div>
    );
  }
}
