import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MUI from './MUI'

require('../app/utils/fits')

import InitialPage from '../app/containers/InitialPage/InitialPage'
import Items from '../app/components/Items/Items'
import ItemThumbnail from '../app/components/ItemThumbnail/ItemThumbnail'
import OpenFITS from '../app/components/OpenFITS/OpenFITS'
import MainLayout from '../app/components/Layouts/MainLayout'
import ListItem from '../app/components/ListItem/ListItem'
import { Grid, GridItem } from '../app/components/Layouts/Grid'
import Item from '../app/components/Item/Item'

import item from './item'
console.log(item)
const _item = {
  path: 'http://127.0.0.1:3030/D0612115.fts'
}

const items = [
  {
    id: 0,
    path: 'http://127.0.0.1:3030/D0612115.fts'
  },
  {
    id: 1,
    path: 'http://127.0.0.1:3030/D0612115.fts'
  },
  {
    id: 2,
    path: 'http://127.0.0.1:3030/D0612115.fts'
  },
  {
    id: 3,
    path: 'http://127.0.0.1:3030/D0612115.fts'
  }
]


storiesOf('Pages', module)
  .add('Initial', () => (
    <MUI>
      <InitialPage />
    </MUI>
  ));

storiesOf('Components', module)
  .add('Item', () => (
    <MUI>
      <MainLayout>
        <Item item={item.item} frame={item.frame} />
      </MainLayout>
    </MUI>
  ))
  .add('List Item', () => (
    <MUI>
      <MainLayout>
        <Grid>
          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
        </Grid>
      </MainLayout>
    </MUI>
  ))
  .add('Items', () => (
    <MUI>
      <MainLayout>
        <Items items={items} />
      </MainLayout>
    </MUI>
  ))
  .add('Items empty list', () => (
    <MUI>
      <MainLayout>
        <Items items={[]} />
      </MainLayout>
    </MUI>
  ))
  .add('ItemThumbnail', () => (
    <ItemThumbnail item={_item} />
  ))
  .add('Open FITS', () => (
    <MUI>
      <OpenFITS />
    </MUI>
  ))

