import React, { Component } from 'react'
import s from './ItemImage.css'
import FlatButton from 'material-ui/FlatButton'

import DataLevelControls from '../DataLevelControls/DataLevelControls'
import ImageRadiusControls from '../ImageRadiusControls/ImageRadiusControls'

import * as FITSLib from '../../utils/item_creator'


class ItemImage extends Component {
  state = { imageBuffer: null, currentMarkers: [], scale: 1 }

  componentDidMount() {
    this.buildCanvasImage()
    this.CanvasDraw.addEventListener('mousedown', this.mouseClick)
    this.CanvasDraw.addEventListener('mousemove', this.renderMouseCursor)
    this.drawRadius()
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      console.log(this.props.item.frame_min_value.toString(), props.item.frame_min_value.toString())
      this.buildCanvasImage()
      this.drawRadius()

      const { currentMarkers, contourCreated } = this.state
      this.renderMarkers(currentMarkers)

      if (contourCreated) this.drawContour(currentMarkers)
    }
  }

  drawRadius = () => {
    //Draw Solar center
    const { header, scale, radius, xCenter, yCenter } = this.props.item
    const { CRPIX1, CRPIX2, CRVAL1, CRVAL2 } = header

    let radiusValue = radius
    let xCenterValue = xCenter || CRPIX1.value
    let yCenterValue = yCenter || CRPIX2.value

    if (!radiusValue) {
      radiusValue = (CRVAL1.value + CRVAL2.value) / 2 || 100
    }


    this.drawMarker(this.CanvasDrawRadius, scale * xCenterValue, scale * yCenterValue, 1, 'red')
    this.drawCircle(this.CanvasDrawRadius, scale * xCenterValue, scale * yCenterValue, scale * radiusValue, 'red')
  }

  drawCircle = (canvas, cx, cy, r, color) => {
    const context = canvas.getContext('2d')
    context.beginPath();
    context.arc(cx, cy, r, 0, 2 * Math.PI, false);
    context.strokeStyle = color || 'blue';
    context.lineWidth = 1;
    context.stroke();
  }

  drawContour = (markers, color) => {
    const context = this.CanvasDraw.getContext('2d')
    context.beginPath()
    context.moveTo(markers[0].x, markers[0].y)
    markers.forEach(marker => context.lineTo(marker.x, marker.y))
    context.lineTo(markers[0].x, markers[0].y)
    context.strokeStyle = color || 'red'
    context.stroke()
    context.closePath()
    this.setState({ contourCreated: true })
  }

  drawMarker = (canvas, x, y, size = 3, color) => {
    const context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(x - size, y - size)
    context.lineTo(x + size, y + size)
    context.moveTo(x - size, y + size)
    context.lineTo(x + size, y - size)
    context.strokeStyle = color || 'red'
    context.stroke()
    context.closePath()
  }

  mouseClick = e => {
    let { currentMarkers } = this.state
    const marker = this.mouseCoordinates(e)

    if (currentMarkers.indexOf(marker) < 0) {
      currentMarkers.push(marker)
      this.renderMarkers(currentMarkers)
      this.setState({ currentMarkers })
    }
  }

  renderMarkers = markers => {
    const { width, height } = this.CanvasDraw
    const context = this.CanvasDraw.getContext('2d')
    context.clearRect(0, 0, width, height)
    markers.forEach(marker => this.drawMarker(this.CanvasDraw, marker.x, marker.y))
  }

  renderMouseCursor = e => {
    let { x, y } = this.mouseCoordinates(e)
    const { width, height } = this.CanvasCross
    const context = this.CanvasCross.getContext('2d')
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
    const canvasRect = this.CanvasCross.getBoundingClientRect()
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
    this.CanvasImage.width = scaledWidth
    this.CanvasImage.height = scaledHeight
    this.CanvasCross.width = scaledWidth
    this.CanvasCross.height = scaledHeight
    this.CanvasDraw.width = scaledWidth
    this.CanvasDraw.height = scaledHeight
    this.CanvasDrawRadius.width = scaledWidth
    this.CanvasDrawRadius.height = scaledHeight

    mainCTX.drawImage(canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight)
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
    this.drawMarker(this.CanvasDraw, totalX / totalMass, totalY / totalMass, 5, 'green')
  }

  onImageLevelChange = (min, max) => this.props.onImageLevelChange(this.props.item.id, min, max)

  onImageRadiusChange = (radius, xCenter, yCenter) => this.props.onImageRadiusChange(this.props.item.id, radius, xCenter, yCenter)

  render() {
    const { currentMarkers } = this.state
    const { item } = this.props

    return (
      <div className={s.container}>
        <div className={s.drawingContainer}>
          <canvas ref={(c) => { this.CanvasImage = c; }}></canvas>
          <canvas ref={(c) => { this.CanvasCross = c; }} className={s.cross}></canvas>
          <canvas ref={(c) => { this.CanvasDrawRadius = c; }} className={s.radius}></canvas>
          <canvas ref={(c) => { this.CanvasDraw = c; }} className={s.draw}></canvas>
        </div>


        <div className={s.buttonsContainer}>
          <FlatButton style={{color: 'white'}} label="Remove Last marker" onClick={this.onRemoveLastMarker} primary disabled={!currentMarkers.length}/>
          <FlatButton style={{color: 'white'}} label="Remove All markers" onClick={this.onRemoveAllMarker} primary disabled={!currentMarkers.length}/>
          <FlatButton style={{color: 'white'}} label="Gravity" onClick={this.gravity} primary disabled={currentMarkers.length < 5}/>
          <FlatButton style={{color: 'white'}} label="Draw contour" onClick={this.drawContour.bind(this, currentMarkers)} primary disabled={currentMarkers.length < 5}/>
        </div>
        <div className={s.controlsContainer}>
          <DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
          <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>
        </div>
      </div>
    )
  }
}

export default ItemImage