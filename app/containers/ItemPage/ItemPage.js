// @flow
import s from './ItemPage.css'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon'
import MainLayout from '../../components/Layouts/MainLayout'
import Item from '../../components/Item/Item'
import Spinner from '../../components/Spinner/Spinner'

import * as ItemsAction from '../../actions/items'
import * as FramesAction from '../../actions/frames'

class ItemPage extends Component {
  constructor(props) {
    super(props)
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {}

  componentWillUnmout() {}

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

  //onScaleUpdate = (id, scale) => this.props.dispatch(ItemsAction.updateItemScale(id, scale))
  //onImageLevelChange = (id, min, max) => console.log(id, min, max) & this.props.dispatch(ItemsAction.updateItemLevel(id, min, max))
  //onImageRadiusChange = (id, radius, xCenter, yCenter) => console.log(id, radius, xCenter, yCenter) & this.props.dispatch(ItemsAction.updateItemRadius(id, radius, xCenter, yCenter))
  //
  onFrameImageUpdate = (id, src) => {
    return

    const { frames } = this.props
    const frame = frames[id]

    if (frame && frame.image !== src) {
      this.props.dispatch(FramesAction.updateFrameImage(id, src))
    }
  }

  render() {

    const { item, frame } = this.initImageData()
    const { array, image } = frame || {}
    const loading = !item || !array || !image

    return (
      <MainLayout>
        {
          loading ? <Spinner /> : <Item item={item}
                                        frame={frame}
                                        onScaleUpdate={this.onScaleUpdate}
                                        onImageLevelChange={this.onImageLevelChange}
                                        onImageRadiusChange={this.onImageRadiusChange}
                                        onFrameImageUpdate={this.onFrameImageUpdate}
          />
        }


        <Link className={s.backLink} to={`/items`}>
          {'< BACK'}
        </Link>
      </MainLayout>
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
