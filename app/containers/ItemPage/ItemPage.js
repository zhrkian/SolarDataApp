// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import MainLayout from '../../components/Layouts/MainLayout'
import Item from '../../components/Item/Item'

import * as ItemsAction from '../../actions/items'

class ItemPage extends Component {
  constructor(props) {
    super(props)

  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {

  }

  componentWillUnmout() {
    console.log('BYE SU4ARY')
  }

  onScaleUpdate = (id, scale) => this.props.dispatch(ItemsAction.updateItemScale(id, scale))
  onImageLevelChange = (id, min, max) => console.log(id, min, max) & this.props.dispatch(ItemsAction.updateItemLevel(id, min, max))

  render() {
    if (!this.props.params) {
      const { router } = this.context
      router.push('/items')
      return null
    }

    const { id } = this.props.params
    const { items } = this.props.items
    const { frames } = this.props.frames

    const item = items.filter(i => i.id === id)[0]
    const frame = frames[item.id]

    return (
      <MainLayout>
        <Item item={item}
              frame={frame}
              onScaleUpdate={this.onScaleUpdate}
              onImageLevelChange={this.onImageLevelChange}
        />
        <Link to={`/items`}>BACK</Link>
      </MainLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items,
    frames: state.frames
  }
}

export default connect(mapStateToProps)(ItemPage)
