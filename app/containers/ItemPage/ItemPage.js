// @flow
import s from './ItemPage.css'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon'
import ItemLayout from '../../components/Layouts/ItemLayout'
import Item from '../../components/Item/Item'
import Spinner from '../../components/Spinner/Spinner'

import * as Utils from '../../utils'
import * as ItemsAction from '../../actions/items'
import * as FramesAction from '../../actions/frames'

class ItemPage extends Component {
  constructor(props) {
    super(props)
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  getItem = () => {
    const { id } = this.props.params
    const { items } = this.props.items
    return items.filter(i => i.id === id)[0] || null
  }

  getFrame = () => {
    const item = this.getItem()
    const { frames } = this.props.frames
    if (!item) return null
    return frames[item.id] || null
  }

  initImageData = () => {
    const item = this.getItem()
    if (!item) {
      const { router } = this.context
      router.push('/items')
      return {}
    }

    if (item.item_thinking) return {}

    const frame = this.getFrame()

    if (!frame || !frame.array) {
      this.props.dispatch(ItemsAction.updateItem(item))
      return {}
    }

    if (!frame.image) {
      setTimeout(() => this.props.dispatch(FramesAction.createImage(item, frame.array)), 500)
      return {}
    }

    return { item, frame }
  }

  onAddNewContour = (id, contour) => this.props.dispatch(ItemsAction.updateItemContour(id, contour, true))

  onEditContour = (id, name, contour) => this.props.dispatch(ItemsAction.updateItemContourName(id, contour, name))

  onUpdateContour = (id, contour) => this.props.dispatch(ItemsAction.updateItemContour(id, contour))

  onSelectContour = (id, contour) => this.props.dispatch(ItemsAction.updateItemContour(id, contour, true))

  onUpdateZoom = (id, zoom) => this.props.dispatch(ItemsAction.updateItemZoom(id, zoom))

  onImageLevelChange = (id, min, max) => console.log(id, min, max) & this.props.dispatch(ItemsAction.updateItemLevel(id, min, max))

  onImageRadiusChange = (id, radius, xCenter, yCenter) => console.log(id, radius, xCenter, yCenter) & this.props.dispatch(ItemsAction.updateItemRadius(id, radius, xCenter, yCenter))

  onFrameImageUpdate = (id, src) => {
    return

    const { frames } = this.props
    const frame = frames[id]

    if (frame && frame.image !== src) {
      this.props.dispatch(FramesAction.updateFrameImage(id, src))
    }
  }

  onSaveContour = (id, contour) => this.props.dispatch(ItemsAction.updateItemContour(id, contour))

  render() {
    const { item, frame } = this.initImageData()
    const { array, image } = frame || {}
    const loading = !item || !array || !image

    if (loading) return <ItemLayout><Spinner /></ItemLayout>

    const { contours, activeContour } = item
    let contour = contours.filter(c => c.title === activeContour)[0]

    if (!contour && contours.length) {
      this.onSelectContour(item.id, contour[0])
    }


    return (
      <ItemLayout heading={Utils.getFilename(item.url)}>
        <Item item={item}
              frame={frame}

              contours={contours}
              contour={contour}

              onAddNewContour={this.onAddNewContour}
              onUpdateContour={this.onUpdateContour}
              onSelectContour={this.onSelectContour}
              onEditContour={this.onEditContour}

              onUpdateZoom={this.onUpdateZoom}
              onImageLevelChange={this.onImageLevelChange}
              onImageRadiusChange={this.onImageRadiusChange}
              onFrameImageUpdate={this.onFrameImageUpdate}
              onSaveContour={this.onSaveContour}
        />
      </ItemLayout>
    )
  }
}

function mapStateToProps(state) {
  return {
    items: state.items,
    frames: state.frames
  }
}

export default connect(mapStateToProps)(ItemPage)
