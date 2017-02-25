// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import MainLayout from '../../components/Layouts/MainLayout'
import Items from '../../components/Items/Items'

import * as ItemsAction from '../../actions/items'

class ItemPage extends Component {
  componentWillMount() {

    const { id } = this.props.params
    const { items } = this.props.items
    const { frames } = this.props.frames

    const item = items.filter(i => i.id === id)[0]
    const frame = frames[item.id]

  }

  componentWillUnmout() {
    console.log('BYE SU4ARY')
  }

  onOpenFiles = files => this.props.dispatch(ItemsAction.getItems(files))

  render() {

    return (
      <MainLayout>
        HELLO SU4ARY
        <Link to={`/items`}>BACK</Link>
      </MainLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items,
    frames: state.frames,
  }
}

export default connect(mapStateToProps)(ItemPage)
