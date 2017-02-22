// @flow
import React, { Component } from 'react';
import Initial from '../../components/Initial/Initial';
import s from './InitialPage.css'

export default class InitialPage extends Component {
  render() {
    return (
      <div className={s.container}>
        <Initial />
      </div>
    );
  }
}
