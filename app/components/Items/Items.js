// @flow
import React, { Component } from 'react';
import s from './Items.css'
import { Grid, GridItem } from '../Layouts/Grid'
import OpenFITS from '../../components/OpenFITS/OpenFITS'

import ListItem from '../ListItem/ListItem'

//  .container img {
//  /* Just in case there are inline attributes */
//  width: 100% ;
//  height: auto ;
//}
class Items extends Component {
  render() {
    const { onOpenFiles, items } = this.props

    return (
      <div className={s.container}>
        <h2>Solar Data Application</h2>
        <div className={s.main}>
          <OpenFITS onOpenFiles={onOpenFiles} />
        </div>
        <div className={s.footer}>
          <Grid>
            {
              items.map(item => <ListItem key={item.id} item={item} />)
            }
          </Grid>
        </div>
      </div>
    );
  }
}

export default Items
