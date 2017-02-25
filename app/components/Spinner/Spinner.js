import React from 'react'
import s from './Spinner.css'
import CircularProgress from 'material-ui/CircularProgress'

const Spinner = props =>
  <div className={s.container}>
    <div className={s.spinner} style={props.style || {}}>
      <CircularProgress
        size={40}
        left={10}
        top={0}
        status="loading"
      />
    </div>
    <div className={s.message}>Loading</div>
  </div>

export default Spinner

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
}