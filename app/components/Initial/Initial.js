// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import s from './Initial.css';



export default class Initial extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { router } = this.context
    setTimeout(() => router.push('/items'), 2000)
  }

  render() {
    return (
      <div>
        <div className={s.container}>
          <h2>Solar Data Application</h2>
          <Link to='/items'>to Application</Link>
        </div>
      </div>
    );
  }
}
