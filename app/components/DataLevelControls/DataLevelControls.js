import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

import InputRange from 'react-input-range'
import { Grid } from '../Layouts/Grid'
import s from './DataLevelControls.css'

const styles = {
  groupRange: {
    padding: '10px 0px',
    fontFamily: 'Roboto',
    fontSize: 14
  },
  group: {
    fontFamily: 'Roboto',
    fontSize: 14
  },
  slider: {
    paddingTop: 15,
    marginTop: 0,
    marginBottom: 0
  }
}

class DataLevelControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        min: props.image_min,
        max: props.image_max
      },
      min_value: props.image_min,
      max_value: props.image_max
    }
  }

  onFrameMinChange = e => {
    e.preventDefault()
    const value = e.target.elements['frame_min'].value
    const { frame_max } = this.props
    const { min, max } = this.state.value
    return this.props.onImageLevelChange(min, max, parseFloat(value), frame_max)
  }

  onFrameMaxChange = e => {
    e.preventDefault()
    const value = e.target.elements['frame_max'].value
    const { frame_min } = this.props
    const { min, max } = this.state.value
    return this.props.onImageLevelChange(min, max, frame_min, parseFloat(value))
  }

  onDragStop = value => {
    const { min, max } = value
    const { frame_min, frame_max } = this.props
    return this.props.onImageLevelChange(min, max, frame_min, frame_max)
  }

  render() {
    const { frame_min, frame_max } = this.props
    const { min_value, max_value, value } = this.state

    if (min_value === undefined || max_value === undefined || frame_min === undefined || frame_max === undefined) return null

    return (
      <div className={s.container}>
        <div className={s.range}>
          <InputRange
            step={0.01}
            minValue={frame_min}
            maxValue={frame_max}
            formatLabel={v => `${v.toFixed(2)}`}
            value={value}
            onChange={v => this.setState({ value: v })}
            onChangeComplete={v => console.log(v) & this.onDragStop(v)} />
        </div>

        <div style={styles.groupRange}>
          <form onSubmit={this.onFrameMinChange}>
            <TextField
              name="frame_min"
              floatingLabelStyle={{color: 'white'}}
              hintStyle={{color: 'white'}}
              inputStyle={{color: 'white'}}
              floatingLabelFixed={true}
              floatingLabelText="Min image value"
              hintText="Input min image value"
              defaultValue={frame_min}
            />
          </form>
        </div>

        <div style={styles.group}>
          <form onSubmit={this.onFrameMaxChange}>
            <TextField
              name="frame_max"
              floatingLabelStyle={{color: 'white'}}
              hintStyle={{color: 'white'}}
              inputStyle={{color: 'white'}}
              floatingLabelFixed={true}
              floatingLabelText="Max image value"
              hintText="Input max image value"
              defaultValue={frame_max}
            />
          </form>
        </div>

      </div>
    )
  }
}

export default DataLevelControls