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
import ItemControlsDock from '../app/components/ItemControls/ItemControlsDock'

import ContourList from '../app/components/ContourList/ContourList'

import Block from '../app/components/Block/Block'

import * as Icons from '../app/components/Icons/Icons'
import IconButton from '../app/components/IconButton/IconButton'
import ContourNewModal from '../app/components/ContourNewModal/ContourNewModal'
import ContourCalculatorModal from '../app/components/ContourCalculatorModal/ContourCalculatorModal'
import AreaInfo from '../app/components/AreaInfo/AreaInfo'

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

//storiesOf('Save File', module)
//  .add('Item Layout', () => (
//    <SaveFile />
//  ));
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

const contours = [
  {
    title: 'Cont 1'
  },
  {
    title: 'Cont 2'
  },
  {
    title: 'Cont 3'
  },
  {
    title: 'Cont 4'
  },
  {
    title: 'Cont 5'
  },
  {
    title: 'Cont 6'
  },
  {
    title: 'Cont 7'
  }
]

const click = () => {
  const link = document.createElement('a')

  link.addEventListener('click', () => console.log('HYL'))

  const event = new Event("click");
  link.dispatchEvent(event);
}

storiesOf('Item', module)
  .add('Item Layout', () => (
    <MUI>
      <ItemLayout>
        <ContourCalculatorModal active={true}
                                item={items[0]}
                                frame={[]}
                                contour={contours[0]}
                                contours={contours}/>
        <Back />
        <ItemImageHolder heading={'D0612115'}>
          {/*<AreaInfo />*/}
        </ItemImageHolder>
        <ItemControls dock={[
              <IconButton key={'New'}       icon="New"        label="New contour"         onClick={() => {}} />,
              <IconButton key={'Remove'}    icon="Remove"     label="Remove all markers"  onClick={() => {}}/>,
              <IconButton key={'RemoveOne'} icon="RemoveOne"  label="Remove last marker"  onClick={() => {}}/>,
              <IconButton key={'Contour'}   icon="Contour"    label="Draw contour"        onClick={() => {}}/>,
              <IconButton key={'Calc'}      icon="Calc"       label="Contour calc"        onClick={() => {}}/>,
              <IconButton key={'ZoomIn'}    icon="ZoomIn"     label="Zoom In"             onClick={() => {}} />,
              <IconButton key={'ZoomOut'}   icon="ZoomOut"    label="Zoom Out"            onClick={() => {}} />,
              <IconButton key={'Image'}     icon="Image"      label="Save image"          onClick={() => {}}/>
        ]}>
          <Block title="Contours">
            <ContourList contours={contours} active={contours[1]} onSelect={console.log} />
          </Block>
          <Block title="Block2">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="New"  label="New contour" onClick={() => {}} />
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
              <IconButton icon="ZoomIn"  label="Remove last marker" onClick={() => {}} />
              <IconButton icon="ZoomOut"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block3">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={() => {}} />
            </div>
          </Block>
          <Block title="Block4">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Contour"    label="Draw contour" disabled={true} onClick={() => {}}/>
              <IconButton icon="Area"       label="Area info" onClick={() => {}} />
              <IconButton icon="Calc"       label="Contour calc" onClick={() => {}} />
              <IconButton icon="Remove"     label="Remove all markers" onClick={() => {}} />
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={click} />
            </div>
          </Block>
        </ItemControls>
        <ContourNewModal active={false} />
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
