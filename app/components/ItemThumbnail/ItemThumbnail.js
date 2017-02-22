// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import s from './ItemThumbnail.css';



export default class ItemThumbnail extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { FITS } = window.astro
    const { item } = this.props

    new FITS(item.path, response => {
      console.log(response)
      const { hdus } = response

      const FIST_DATA = hdus[0]

      const bitpix = FIST_DATA.header.get('BITPIX')
      const bzero = FIST_DATA.header.get('BZERO')
      const bscale = FIST_DATA.header.get('BSCALE')
      const { buffer } = FIST_DATA.data

      console.log(
        FIST_DATA,
        FIST_DATA.header.get('BITPIX'),
        FIST_DATA.header.get('BZERO'),
        FIST_DATA.header.get('BSCALE'),
        FIST_DATA.data._getFrame(buffer, bitpix, bzero, bscale)
      )

    })
  }

  render() {
    return (
      <div>
        <div className={s.container}>
          <h2>Solar Data Application</h2>
        </div>
      </div>
    );
  }
}
