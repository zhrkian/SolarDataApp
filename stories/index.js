import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MUI from './MUI'

require('../app/utils/fits')
require('../app/app.global.css')

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

import InitialPage from '../app/containers/InitialPage/InitialPage'
import Items from '../app/components/Items/Items'
import ItemThumbnail from '../app/components/ItemThumbnail/ItemThumbnail'
import OpenFITS from '../app/components/OpenFITS/OpenFITS'
import MainLayout from '../app/components/Layouts/MainLayout'
import ListItem from '../app/components/ListItem/ListItem'
import { Grid, GridItem } from '../app/components/Layouts/Grid'
import Item from '../app/components/Item/Item'
import ItemImage from '../app/components/ItemImage/ItemImage'

//import item from './item'
//console.log(item)

import ListLayout from '../app/components/Layouts/ListLayout'
import List from '../app/components/List/List'


import ItemLayout from '../app/components/Layouts/ItemLayout'
import Back from '../app/components/Back/Back'
import ItemImageHolder from '../app/components/ItemImageHolder/ItemImageHolder'
import ItemControls from '../app/components/ItemControls/ItemControls'

import Block from '../app/components/Block/Block'

import * as Icons from '../app/components/Icons/Icons'
import IconButton from '../app/components/IconButton/IconButton'

import SaveFile from '../app/components/SaveFile/SaveFile'
const _item = {
  path: 'http://127.0.0.1:3030/D0612115.fts'
}

const items = [
  {
    id: 0,
    url: 'http://127.0.0.1:3030/D0612115.fts',
    date: 'date',
    item_thinking: true
  },
  {
    id: 1,
    url: 'http://127.0.0.1:3030/D0612115.fts',
    date: 'date'
  },
  {
    id: 2,
    url: 'http://127.0.0.1:3030/D0612115.fts',
    date: 'date'
  },
  {
    id: 3,
    url: 'http://127.0.0.1:3030/D0612115.fts',
    date: 'date'
  }
]

storiesOf('Save File', module)
  .add('Item Layout', () => (
    <SaveFile />
  ));
//storiesOf('List', module)
//  .add('List Layout', () => (
//    <MUI>
//      <ListLayout>
//        <OpenFITS onOpenFiles={() => {}} clearAll={() => {}} />
//        <List items={items} onView={console.log}/>
//      </ListLayout>
//    </MUI>
//  ))
//  .add('List Layout empty list', () => (
//    <MUI>
//      <ListLayout>
//        <OpenFITS onOpenFiles={() => {}} clearAll={() => {}} />
//        <List items={[]} onView={console.log}/>
//      </ListLayout>
//    </MUI>
//  ));

storiesOf('Item', module)
  .add('Item Layout', () => (
    <MUI>
      <ItemLayout>
        <Back />
        <ItemImageHolder heading={'D0612115'}/>
        <ItemControls>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
        </ItemControls>
      </ItemLayout>
    </MUI>
  ));

storiesOf('Icons', module)
  .add('Icons', () => (
    <MUI>
      <ItemLayout>
        <div style={{width: 435}}>
          <Block title="Block1">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
        </div>

      </ItemLayout>
    </MUI>
  ))
  .add('Icon Calc', () => (
    <MUI>
      <ItemLayout>
        <IconButton icon="Calc"       label="Contour calc" />
      </ItemLayout>
    </MUI>
  ));

//storiesOf('Components', module)
//  .add('Item Image', () => (
//    <MUI>
//      <MainLayout>
//        <ItemImage {...item} />
//      </MainLayout>
//    </MUI>
//  ))
//  .add('Item', () => (
//    <MUI>
//      <MainLayout>
//        <Item item={item.item} frame={item.frame} />
//      </MainLayout>
//    </MUI>
//  ))
//  .add('List Item', () => (
//    <MUI>
//      <MainLayout>
//        <Grid>
//          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
//          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
//          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
//          <ListItem item={{}} frame={{image: 'https://placeholdit.imgix.net/~text?txtsize=23&txt=250%C3%97250&w=250&h=250'}} />
//        </Grid>
//      </MainLayout>
//    </MUI>
//  ))
//  .add('Items', () => (
//    <MUI>
//      <MainLayout>
//        <Items items={items} />
//      </MainLayout>
//    </MUI>
//  ))
//  .add('Items empty list', () => (
//    <MUI>
//      <MainLayout>
//        <Items items={[]} />
//      </MainLayout>
//    </MUI>
//  ))
//
