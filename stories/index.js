import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MUI from './MUI'

require('../app/utils/fits')

import InitialPage from '../app/containers/InitialPage/InitialPage'
import ItemThumbnail from '../app/components/ItemThumbnail/ItemThumbnail'
import OpenFITS from '../app/components/OpenFITS/OpenFITS'

const item = {
  path: 'http://127.0.0.1:3030/D0612115.fts'
}


storiesOf('Pages', module)
  .add('Initial', () => (
    <InitialPage />
  ));

storiesOf('Components', module)
  .add('ItemThumbnail', () => (
    <ItemThumbnail item={item} />
  ))
  .add('Open FITS', () => (
    <MUI>
      <OpenFITS />
    </MUI>
  ))

