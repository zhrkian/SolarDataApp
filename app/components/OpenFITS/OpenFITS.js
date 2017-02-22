// @flow
import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import * as itemCreator from '../../utils/item_creator'

//import s from './OpenFITS.css';

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

export default class OpenFITS extends Component {
  //static contextTypes = {
  //  router: React.PropTypes.object.isRequired
  //}

  componentWillMount() {

  }

  onChange = () => itemCreator.getFITSItem(this.fileUpload.files[0])

  render() {
    console.log()
    return (
      <RaisedButton
        label="Choose FITS"
        labelPosition="before"
        style={styles.button}
        containerElement="label"
      >
        <input type="file" accept=".fits, .fit, .fts, .FTS" style={styles.exampleImageInput} ref={(ref) => this.fileUpload = ref} onChange={this.onChange} />
      </RaisedButton>
    )
  }
}