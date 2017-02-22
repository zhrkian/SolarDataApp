// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import s from './Counter.css'

import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'

class Counter extends Component {


  //props: {
  //  increment: () => void,
  //  incrementIfOdd: () => void,
  //  incrementAsync: () => void,
  //  decrement: () => void,
  //  counter: number
  //};

  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <div>
        <div className={s.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={s.counter}>
          {counter}
        </div>
        <div>
          <RaisedButton className={s.btn} icon={<ContentAdd />} onClick={increment} />
          <RaisedButton className={s.btn} icon={<ContentRemove />} onClick={decrement} />
        </div>
      </div>
    );
  }
}

export default Counter;
