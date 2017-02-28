import React, { Component } from 'react'
import s from './ItemImage.css'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'

import { Grid } from '../Layouts/Grid'

import DataLevelControls from '../DataLevelControls/DataLevelControls'
import ImageRadiusControls from '../ImageRadiusControls/ImageRadiusControls'

import * as FITSLib from '../../utils/item_creator'

import * as Draw from '../../utils/draw'
import * as Coordinates from '../../utils/coordinates'


class ItemImage extends Component {
  state = { imageBuffer: null, currentMarkers: [], scale: 1 }

  componentDidMount() {
    this.buildCanvasImage()
    this.CanvasDraw.addEventListener('mousedown', this.mouseClick)
    this.CanvasDraw.addEventListener('mousemove', this.renderMouseCursor)
    this.renderSolarRadius()
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      this.buildCanvasImage()
      this.renderSolarRadius()

      const { currentMarkers, contourCreated } = this.state
      this.renderMarkers(currentMarkers)



      if (contourCreated) {
        const { width, height, scale } = props.item

        for (let j = 0; j < scale * height; j++) {
          for (let i = 0; i < scale * width; i++) {
            if (Coordinates.inPoly(i, j, currentMarkers)) {
              Draw.drawMarker(this.CanvasDraw, i, j, 1, 'white')
            }
          }
        }

        Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))

      }
    }
  }

  getSolarRadiusData = () => {
    const { header, scale, radius, xCenter, yCenter } = this.props.item
    const { CRPIX1, CRPIX2, CRVAL1, CRVAL2 } = header

    let radiusValue = radius
    let xCenterValue = xCenter || CRPIX1.value
    let yCenterValue = yCenter || CRPIX2.value

    if (!radiusValue) {
      radiusValue = (CRVAL1.value + CRVAL2.value) / 2 || 100
    }

    return { radiusValue: scale * radiusValue, xCenterValue: scale * xCenterValue, yCenterValue: scale * yCenterValue }
  }

  renderSolarRadius = () => {
    const { radiusValue, xCenterValue, yCenterValue } = this.getSolarRadiusData()
    Draw.drawMarker(this.CanvasDrawRadius, xCenterValue, yCenterValue, 1, 'red')
    Draw.drawCircle(this.CanvasDrawRadius,  xCenterValue, yCenterValue, radiusValue, 'red')
  }

  mouseClick = e => {
    const { currentMarkers } = this.state
    const { radiusValue, xCenterValue, yCenterValue } = this.getSolarRadiusData()
    const marker = this.mouseCoordinates(e)

    const isIsCircle = Coordinates.isIsCircle(marker.x, marker.y, radiusValue, xCenterValue, yCenterValue)

    if (currentMarkers.indexOf(marker) < 0 && isIsCircle) {
      const markers = [...currentMarkers, marker]
      this.renderMarkers(markers)
      this.setState({ currentMarkers: markers })

      console.log(JSON.stringify(markers))
    }
  }

  renderMarkers = markers => {
    const { width, height } = this.CanvasDraw
    const context = this.CanvasDraw.getContext('2d')
    context.clearRect(0, 0, width, height)
    markers.forEach(marker => Draw.drawMarker(this.CanvasDraw, marker.x, marker.y))
  }

  renderMouseCursor = e => {
    let { x, y } = this.mouseCoordinates(e)
    const { width, height } = this.CanvasCrossHair
    const context = this.CanvasCrossHair.getContext('2d')
    context.clearRect(0, 0, width, height)
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.strokeStyle = "green"
    context.stroke()
    context.closePath()
  }

  mouseCoordinates = e => {
    const canvasRect = this.CanvasCrossHair.getBoundingClientRect()
    const coordinates = { x: (e.clientX - canvasRect.left), y: (e.clientY - canvasRect.top) }
    return coordinates
  }

  buildCanvasImage = () => {
    const { item, frame } = this.props
    const { scale } = item
    const { width, height, frame_min_value, frame_max_value, lvl } = item
    const imageBuffer = FITSLib.getFrameImageBuffer(width, height, frame_min_value, frame_max_value, lvl, frame.array)
    this.updateCanvas(imageBuffer,  width, height, scale)
  }

  updateCanvasSize = (width, height) => {
    this.Canvas.width = width
    this.Canvas.height = height
    this.CanvasImage.width = width
    this.CanvasImage.height = height
    this.CanvasCrossHair.width = width
    this.CanvasCrossHair.height = height
    this.CanvasDraw.width = width
    this.CanvasDraw.height = height
    this.CanvasDrawRadius.width = width
    this.CanvasDrawRadius.height = height
  }

  updateCanvas = (buffer, width, height, scale = 1) => {
    const scaledWidth = scale * width
    const scaledHeight = scale * height

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    let imageData = ctx.createImageData(width, height)
    imageData.data.set(buffer)
    ctx.putImageData(imageData, 0, 0)

    const mainCTX = this.CanvasImage.getContext('2d')

    this.updateCanvasSize(scaledWidth, scaledHeight)
    mainCTX.drawImage(canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight)

    const { item, onFrameImageUpdate } = this.props
    return onFrameImageUpdate(item.id, canvas.toDataURL())
  }

  onRemoveLastMarker = () => {
    const { currentMarkers } = this.state
    currentMarkers.pop()
    this.renderMarkers(currentMarkers)
    this.setState({ currentMarkers, contourCreated: false })
  }

  onRemoveAllMarker = () => {
    this.renderMarkers([])
    this.setState({ currentMarkers: [], contourCreated: false })
  }

  gravity = () => {
    const { currentMarkers } = this.state
    let totalMass = currentMarkers.length, totalY = 0, totalX = 0
    currentMarkers.forEach(point => {
      totalX += point.x
      totalY += point.y
    })
    Draw.drawMarker(this.CanvasDraw, totalX / totalMass, totalY / totalMass, 5, 'green')
  }

  onImageLevelChange = (min, max) => this.props.onImageLevelChange(this.props.item.id, min, max)

  onImageRadiusChange = (radius, xCenter, yCenter) => this.props.onImageRadiusChange(this.props.item.id, radius, xCenter, yCenter)

  onDrawContour = () => Draw.drawContour(this.CanvasDraw, this.state.currentMarkers, 'red', () => this.setState({ contourCreated: true }))

  render() {
    const { currentMarkers } = this.state
    const { item } = this.props








    return (
      <div className={s.container}>
        <div className={s.drawingContainer}>
          <canvas ref={(c) => { this.Canvas = c; }}></canvas>
          <canvas ref={(c) => { this.CanvasImage = c; }} className={s.image}></canvas>
          <canvas ref={(c) => { this.CanvasDrawRadius = c; }} className={s.radius}></canvas>
          <canvas ref={(c) => { this.CanvasDraw = c; }} className={s.draw}></canvas>
          <canvas ref={(c) => { this.CanvasCrossHair = c; }} className={s.crossHair}></canvas>
        </div>
        <Grid>
          <FlatButton style={{color: 'white'}} label="Remove Last marker" onClick={this.onRemoveLastMarker} primary disabled={!currentMarkers.length}/>
          <FlatButton style={{color: 'white'}} label="Remove All markers" onClick={this.onRemoveAllMarker} primary disabled={!currentMarkers.length}/>
          <FlatButton style={{color: 'white'}} label="Gravity" onClick={this.gravity} primary disabled={currentMarkers.length < 5}/>
          <FlatButton style={{color: 'white'}} label="Draw contour" onClick={this.onDrawContour} primary disabled={currentMarkers.length < 5}/>
        </Grid>
        <DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
        <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>
      </div>
    )
  }
}

export default ItemImage