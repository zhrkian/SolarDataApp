// @flow
import React, { Component } from 'react';
import s from './App.css'

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div className={s.container}>
        {this.props.children}
      </div>
    );
  }
}
