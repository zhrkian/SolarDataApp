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
    this.CanvasCrossHair.addEventListener('mousedown', this.mouseClick)
    this.CanvasCrossHair.addEventListener('mousemove', this.renderMouseCursor)
    this.renderSolarRadius()
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      this.buildCanvasImage()
      this.renderSolarRadius()

      const { currentMarkers, contourCreated } = this.state

      this.renderMarkers(currentMarkers)



      if (contourCreated) {
        Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))

        //const { width, height, scale } = props.item
        //const { radiusValue, xCenterValue, yCenterValue } = this.getSolarRadiusData()
        //const scaledWidth = scale * width
        //const scaledHeight = scale * height
        //
        //let totalImageContourPixels = 0
        //let totalContourSphereSquare = 0.0
        //
        //for (let j = 0; j < scaledHeight; j++) {
        //
        //
        //
        //  for (let i = 0; i < scaledWidth; i++) {
        //    const isExtremePixel = j === 0 || j === scaledHeight - 1 || i === 0 && i === scaledWidth - 1
        //
        //    if (!isExtremePixel) {
        //      const isInContour = Coordinates.inPoly(i, j, currentMarkers)
        //
        //      if (isInContour) {
        //        const yRadius = Math.sqrt(radiusValue * radiusValue  - (j - yCenterValue) * (j - yCenterValue))
        //
        //        let xP = i - xCenterValue
        //        let x_minus_05 = xP - 0.5
        //        let x_plus_05 = xP + 0.5
        //        if (x_plus_05 > yRadius) x_plus_05 = yRadius
        //
        //        const theta1 = Math.acos(x_minus_05 / yRadius)
        //        const theta2 = Math.acos(x_plus_05 / yRadius)
        //        const pixelSquare = radiusValue * (theta1 - theta2)
        //
        //        totalContourSphereSquare += pixelSquare < 0 ? (-1) * pixelSquare : pixelSquare
        //
        //        totalImageContourPixels += 1
        //      }
        //    }
        //  }
        //
        //
        //}
        //console.log(totalImageContourPixels, totalContourSphereSquare)


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

  onDrawContour = () => {
    const { currentMarkers } = this.state

    //const context = this.CanvasDraw.getContext('2d')
    //const contourRect = Coordinates.getContourRect(currentMarkers)
    //context.rect(contourRect.x0, contourRect.y0, contourRect.x1 - contourRect.x0, contourRect.y1 - contourRect.y0)
    //context.stroke()

    Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))
  }

  onContourSquareInfo = () => {
    const { currentMarkers } = this.state
    const { radiusValue, xCenterValue, yCenterValue } = this.getSolarRadiusData()
    const contourInfo = Coordinates.getContourSqareInfo(currentMarkers, radiusValue, xCenterValue, yCenterValue)
    console.log(contourInfo)
  }

  render() {
    const { currentMarkers, contourCreated } = this.state
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
          <FlatButton style={{color: 'white'}} label="Gravity" onClick={this.gravity} primary disabled={currentMarkers.length < 3}/>
          <FlatButton style={{color: 'white'}} label="Draw contour" onClick={this.onDrawContour} primary disabled={currentMarkers.length < 3}/>
          <FlatButton style={{color: 'white'}} label="Get contour sqare info" onClick={this.onContourSquareInfo} primary disabled={!contourCreated}/>
        </Grid>
        <DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
        <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>
      </div>
    )
  }
}

export default ItemImage