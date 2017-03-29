// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainLayout from '../../components/Layouts/MainLayout'
import List from '../../components/List/List'

import * as ItemsAction from '../../actions/items'

class ItemsPage extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  onOpenFiles = files => this.props.dispatch(ItemsAction.getItems(files))

  onView = id => this.context.router.push(`/items/${id}`)

  render() {
    const { items } = this.props.items

    return (
      <MainLayout>
        <List items={items}
               onView={this.onView}
               onOpenFiles={this.onOpenFiles} />
      </MainLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items
  }
}

export default connect(mapStateToProps)(ItemsPage)
