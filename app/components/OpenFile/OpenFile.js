import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import s from './OpenFile.css'

import * as itemCreator from '../../utils/item_creator'

const styles = {
  add: {
    marginRight: 15
  },
  clear: {
    backgroundColor: '#313131'
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

export default class OpenFile extends Component {

  onChange = () => {
    const { restoreStorage } = this.props
    const rawFile = new XMLHttpRequest()
    rawFile.open('GET', this.fileUpload.files[0].path, false)
    rawFile.onreadystatechange = () => {
      if(rawFile.readyState === 4) {
        if(rawFile.status === 200 || rawFile.status == 0) {
          let allText = rawFile.responseText

          if (allText) {
            try {
              const { items } = JSON.parse(allText)
              restoreStorage(items.items)
            } catch (e) {
              console.log(e)
            }
          }

        }
      }
    }
    rawFile.send(null)
  }

  render() {
    return (
      <div className={s.saveButton}>
        <RaisedButton
          label="Choose FITS"
          labelPosition="before"
          style={styles.add}
          containerElement="label"
        >
          <input type="file" style={styles.exampleImageInput} ref={(ref) => this.fileUpload = ref} onChange={this.onChange} />
        </RaisedButton>
      </div>

    )
  }
}