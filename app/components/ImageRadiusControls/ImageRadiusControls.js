import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { Grid } from '../Layouts/Grid'

import s from './ImageRadiusControls.css'

const SOLAR_RADIUS = 695700

const styles = {
  groupInput: {
    fontFamily: 'Roboto',
    fontSize: 14,
    marginTop: -15,
    paddingBottom: 10
  },
  group: {
    fontFamily: 'Roboto',
    fontSize: 14
  },
  slider: {
    paddingTop: 15,
    marginTop: 0,
    marginBottom: 0
  },
  button: {
    backgroundColor: '#313131'
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 14,
  }
}

class ImageRadiusControls extends Component {
  constructor(props) {
    super(props)
    const { radius, crpix_x, crpix_y } = props

    this.state = {
      radius_value: radius,
      x_center: crpix_x,
      y_center: crpix_y,
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

  onSolarRadiusChange = e => {
    e.preventDefault()
    const value = e.target.elements['solar_radius'].value
    const { radius_value, x_center, y_center } = this.state
    return this.props.onImageRadiusChange(radius_value, x_center, y_center, value)
  }

  onDragStop = () => {
    const { solar_radius } = this.props
    const { radius_value, x_center, y_center } = this.state
    return this.props.onImageRadiusChange(radius_value, x_center, y_center, solar_radius || SOLAR_RADIUS)
  }

  onResetToDefaults = () => {
    const { default_radius, default_crpix_x, default_crpix_y } = this.props
    const radius_value = default_radius
    const x_center = default_crpix_x
    const y_center = default_crpix_y
    this.setState({ radius_value, x_center, y_center })
    return this.props.onImageRadiusChange(radius_value, x_center, y_center, SOLAR_RADIUS)
  }

  render() {
    const { height, width, radius, crpix_x, crpix_y, solar_radius } = this.props
    const { radius_value, x_center, y_center } = this.state

    const SR = solar_radius || SOLAR_RADIUS

    const maxRadiusValue = Math.sqrt(height * height / 4 + width * width / 4)

    if (radius_value === undefined || x_center === undefined || y_center === undefined) return null

    return (
      <div className={s.container}>
        <div style={styles.group}>
          <span>{`Radius: ${radius_value.toFixed(3)} `}</span>
          <Slider
            sliderStyle={styles.slider}
            min={0}
            max={maxRadiusValue}
            step={0.005}
            defaultValue={radius}
            value={radius_value}
            onDragStop={this.onDragStop}
            onChange={this.handleRadiusValue}
          />
        </div>
        <div style={styles.group}>
          <span>{`Center X: ${x_center.toFixed(3)} `}</span>
          <Slider
            sliderStyle={styles.slider}
            min={0}
            max={width}
            step={0.005}
            defaultValue={crpix_x}
            value={x_center}
            onDragStop={this.onDragStop}
            onChange={this.handleXCenterValue}
          />
        </div>
        <div style={styles.group}>
          <span>{`Center Y: ${y_center.toFixed(3)} `}</span>
          <Slider
            sliderStyle={styles.slider}
            min={0}
            max={height}
            step={0.005}
            defaultValue={crpix_y}
            value={y_center}
            onDragStop={this.onDragStop}
            onChange={this.handleYCenterValue}
          />
        </div>
        <div style={styles.groupInput}>
          <form onSubmit={this.onSolarRadiusChange}>
            <TextField
              name="solar_radius"
              type="number"
              floatingLabelStyle={{color: 'white'}}
              hintStyle={{color: 'white'}}
              inputStyle={{color: 'white'}}
              floatingLabelFixed={true}
              floatingLabelText="Solar radius (km)"
              hintText="Solar radius (km)"
              defaultValue={SR}
            />
          </form>
        </div>
        <FlatButton style={styles.button} labelStyle={styles.buttonLabel} label="Reset radius to defaults" onClick={this.onResetToDefaults} primary />
      </div>
    )
  }
}

export default ImageRadiusControls