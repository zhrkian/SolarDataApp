import React, { Component } from 'react'
import Slider from 'material-ui/Slider'

import s from './ImageControls.css'

class ImageControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      min_value: props.frame_min_value,
      max_value: props.frame_max_value
    }
  }


  handleFirstSlider = (event, value) => {
    this.setState({min_value: value});
  }

  handleSecondSlider = (event, value) => {
    this.setState({max_value: value});
  }

  onDragStop = () => {
    const { min_value, max_value } = this.state
    return this.props.onImageLevelChange(min_value, max_value)
  }

  render() {
    const { frame_min_value, frame_max_value, min, max } = this.props
    const { min_value, max_value } = this.state
    return (
      <div>
        <Slider
          min={min < 0 ? 0 : min}
          max={max_value}
          step={0.005}
          defaultValue={frame_min_value}
          value={min_value}
          onDragStop={this.onDragStop}
          onChange={this.handleFirstSlider}
        />
        {
          min_value ? (
            <p>
              <span>{'The min level value is: '}</span>
              <span>{min_value.toFixed(3)}</span>
            </p>
          ) : null
        }
        <Slider
          min={min_value}
          max={max}
          step={0.005}
          defaultValue={frame_max_value}
          value={max_value}
          onDragStop={this.onDragStop}
          onChange={this.handleSecondSlider}
        />
        {
          max_value ? (
            <p>
              <span>{'The max level value is: '}</span>
              <span>{max_value.toFixed(3)}</span>
            </p>
          ) : null
        }

      </div>
    )
  }
}

export default ImageControls