import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import { Grid } from '../Layouts/Grid'

import s from './ImageRadiusControls.css'

class ImageRadiusControls extends Component {
  constructor(props) {
    super(props)
    const { CRVAL1, CRPIX1, CRPIX2, radius, xCenter, yCenter } = props.header

    this.state = {
      radius_value: radius || CRVAL1.value,
      x_center: xCenter || CRPIX1.value,
      y_center: yCenter || CRPIX2.value,
    }
  }

  handleRadiusValue = (event, value) => {
    this.setState({radius_value: value});
  }

  handleXCenterValue = (event, value) => {
    this.setState({x_center: value});
  }

  handleYCenterValue = (event, value) => {
    this.setState({y_center: value});
  }

  onDragStop = () => {
    const { radius_value, x_center, y_center } = this.state
    return this.props.onImageRadiusChange(radius_value, x_center, y_center)
  }

  onResetToDefaults = () => {
    const { CRVAL1, CRPIX1, CRPIX2 } = this.props.header
    const radius_value = CRVAL1.value
    const x_center = CRPIX1.value
    const y_center = CRPIX2.value
    this.setState({ radius_value, x_center, y_center })
    return this.props.onImageRadiusChange(radius_value, x_center, y_center)
  }

  render() {
    const { height, width, header, radius, xCenter, yCenter } = this.props
    const { CRVAL1, CRPIX1, CRPIX2 } = header
    const { radius_value, x_center, y_center } = this.state

    const maxRadiusValue = Math.sqrt(height * height / 4 + width * width / 4)

    return (
      <div className={s.container}>
        <div className={s.heading}>Radius correction</div>
        <Grid>
          <div style={{width: '250px', padding: 10}}>
            { radius_value ? <span>{`The radius value is: ${radius_value.toFixed(3)} `}</span> : null }
            <Slider
              min={0}
              max={maxRadiusValue}
              step={0.005}
              defaultValue={radius || CRVAL1.value}
              value={radius_value}
              onDragStop={this.onDragStop}
              onChange={this.handleRadiusValue}
            />
          </div>
          <div style={{width: '250px', padding: 10}}>
            { x_center ? <span>{`The center X value is: ${x_center.toFixed(3)} `}</span> : null }
            <Slider
              min={0}
              max={width}
              step={0.005}
              defaultValue={xCenter || CRPIX1.value}
              value={x_center}
              onDragStop={this.onDragStop}
              onChange={this.handleXCenterValue}
            />
          </div>
          <div style={{width: '250px', padding: 10}}>
            { y_center ? <span>{`The center Y value is: ${y_center.toFixed(3)} `}</span> : null }
            <Slider
              min={0}
              max={height}
              step={0.005}
              defaultValue={yCenter || CRPIX2.value}
              value={y_center}
              onDragStop={this.onDragStop}
              onChange={this.handleYCenterValue}
            />
          </div>
        </Grid>
        <FlatButton style={{color: 'white'}} label="Reset radius data to defaults" onClick={this.onResetToDefaults} primary />

      </div>
    )
  }
}

export default ImageRadiusControls