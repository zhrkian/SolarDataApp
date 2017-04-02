import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import { Grid } from '../Layouts/Grid'
import s from './DataLevelControls.css'

const styles = {
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
      min_value: props.image_min,
      max_value: props.image_max
    }
  }


  handleMinLevel = (event, value) => {
    this.setState({min_value: value});
  }

  handleMaxLevel = (event, value) => {
    this.setState({max_value: value});
  }

  onDragStop = () => {
    const { min_value, max_value } = this.state
    return this.props.onImageLevelChange(min_value, max_value)
  }

  render() {
    const { image_min, image_max, frame_min, frame_max } = this.props
    const { min_value, max_value } = this.state

    if (min_value === undefined || max_value === undefined) return null

    return (
      <div className={s.container}>
        <div style={styles.group}>
          <span>{'Min: '}{min_value.toFixed(3)}</span>
          <Slider
            sliderStyle={styles.slider}
            min={frame_min < 0 ? 0 : frame_min}
            max={max_value}
            step={0.005}
            defaultValue={image_min}
            value={min_value}
            onDragStop={this.onDragStop}
            onChange={this.handleMinLevel}
          />
        </div>

        <div style={styles.group}>
          <span>{'Max: '}{max_value.toFixed(3)}</span>
          <Slider
            sliderStyle={styles.slider}
            min={min_value}
            max={frame_max}
            step={0.005}
            defaultValue={image_max}
            value={max_value}
            onDragStop={this.onDragStop}
            onChange={this.handleMaxLevel}
          />
        </div>

      </div>
    )
  }
}

export default DataLevelControls