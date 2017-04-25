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

  restoreStorage = items => console.log(items) & this.props.dispatch({ type: 'ITEMS_UPDATE_ALL', items })

  onView = id => this.context.router.push(`/items/${id}`)

  onRemove = id => this.props.dispatch(ItemsAction.removeItem(id))

  onRemoveAll = () => this.props.dispatch(ItemsAction.removeAllItems())

  render() {
    const { items } = this.props.items

    return (
      <ListLayout>
        <OpenFITS onOpenFiles={this.onOpenFiles} onRemoveAll={this.onRemoveAll} />
        <List items={items} onView={this.onView} onRemove={this.onRemove} restoreStorage={this.restoreStorage}/>
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
