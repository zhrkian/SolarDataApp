// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ListLayout from '../../components/Layouts/ListLayout'
import OpenFITS from '../../components/OpenFITS/OpenFITS'
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
      <ListLayout>
        <OpenFITS onOpenFiles={this.onOpenFiles} clearAll={() => {}} />
        <List items={items} onView={this.onView}/>
      </ListLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items
  }
}

export default connect(mapStateToProps)(ItemsPage)
