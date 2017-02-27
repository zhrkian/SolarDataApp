import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import { Grid } from '../Layouts/Grid'
import s from './DataLevelControls.css'

class DataLevelControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      min_value: props.frame_min_value,
      max_value: props.frame_max_value
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
    const { frame_min_value, frame_max_value, min, max } = this.props
    const { min_value, max_value } = this.state
    return (
      <div className={s.container}>
        <div className={s.heading}>Data level</div>
        <Grid>
          <div style={{width: '250px', padding: 10}}>
            { min_value ? <span>{'The min data value is: '}{min_value.toFixed(3)}</span> : null }
            <Slider
              min={min < 0 ? 0 : min}
              max={max_value}
              step={0.005}
              defaultValue={frame_min_value}
              value={min_value}
              onDragStop={this.onDragStop}
              onChange={this.handleMinLevel}
            />
          </div>
          <div style={{width: '250px', padding: 10}}>
            { max_value ? <span>{'The max data value is: '}{max_value.toFixed(3)}</span> : null }
            <Slider
              min={min_value}
              max={max}
              step={0.005}
              defaultValue={frame_max_value}
              value={max_value}
              onDragStop={this.onDragStop}
              onChange={this.handleMaxLevel}
            />
          </div>
        </Grid>
      </div>
    )
  }
}

export default DataLevelControls