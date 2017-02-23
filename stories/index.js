import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MUI from './MUI'

require('../app/utils/fits')

import InitialPage from '../app/containers/InitialPage/InitialPage'
import Items from '../app/components/Items/Items'
import ItemThumbnail from '../app/components/ItemThumbnail/ItemThumbnail'
import OpenFITS from '../app/components/OpenFITS/OpenFITS'
import MainLayout from '../app/components/Layouts/MainLayout'

const item = {
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
    <ItemThumbnail item={item} />
  ))
  .add('Open FITS', () => (
    <MUI>
      <OpenFITS />
    </MUI>
  ))

