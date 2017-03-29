import React, { Component } from 'react'
import s from './ItemImage.css'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'

import { Grid } from '../Layouts/Grid'
import ContourResultModal from '../ContourResultModal/ContourResultModal'
import SaveImage from '../SaveImage/SaveImage'
import DataLevelControls from '../DataLevelControls/DataLevelControls'
import ImageRadiusControls from '../ImageRadiusControls/ImageRadiusControls'

import * as FITSLib from '../../utils/item_creator'

import * as Draw from '../../utils/draw'
import * as Coordinates from '../../utils/coordinates'


const getMouseCoordinates = (canvas, event) => {
  const canvasRect = canvas.getBoundingClientRect()
  const coordinates = { x: (event.clientX - canvasRect.left), y: (event.clientY - canvasRect.top) }
  return coordinates
}

const onMouseClick = (canvas, callback, event) => {
  const coordinates = getMouseCoordinates(canvas, event)
  return callback ? callback(coordinates) : null
}

const toImageCoords = (item, coords) => {
  const { height, zoom } = item
  const fromView = c => {
    const y = height - c.y / zoom
    return { x: c.x / zoom, y: y }
  }
  if (Array.isArray(coords)) {
    let result = []
    coords.forEach(co => result.push(fromView(co)))
    return result
  }
  return fromView(coords)
}

const toViewCoords = (item, coords) => {
  const { height, zoom } = item
  const fromImage = c => {
    const y = (height - c.y) * zoom
    return { x: c.x * zoom, y: y }
  }
  if (Array.isArray(coords)) {
    let result = []
    coords.forEach(co => result.push(fromImage(co)))
    return result
  }
  return fromImage(coords)
}

const renderMouseCursor = (canvas, event) => {
  let { x, y } = getMouseCoordinates(canvas, event)
  const { width, height } = canvas
  const context = canvas.getContext('2d')
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

const renderSolarRadius = (canvas, item) => {
  const { zoom, radius, crpix_x, crpix_y } = item
  const { x, y } = toViewCoords(item, { x: crpix_x, y: crpix_y })

  Draw.drawMarker(canvas, x, y, 1, 'red')
  Draw.drawCircle(canvas, x, y, radius * zoom, 'red')
}

const renderMarkers = (canvas, markers) => {
  const { width, height } = canvas
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, width, height)
  markers.forEach(marker => Draw.drawMarker(canvas, marker.x, marker.y))
}

class ItemImage extends Component {
  state = { imageBuffer: null, currentMarkers: [], scale: 1, contourModal: false }

  componentDidMount() {
    const { item } = this.props
    this.buildCanvasImage()
    this.CanvasCrossHair.addEventListener('mousedown', onMouseClick.bind(this, this.CanvasCrossHair, this.onMouseClick))
    this.CanvasCrossHair.addEventListener('mousemove', renderMouseCursor.bind(this, this.CanvasCrossHair))
    renderSolarRadius(this.CanvasDrawRadius, item)
  }

  onMouseClick = marker => {
    const { item } = this.props
    const { radius, crpix_x, crpix_y } = item
    const { x, y } = toImageCoords(item, marker)
    const { currentMarkers } = this.state
    const isIsCircle = Coordinates.isIsCircle(x,y, radius, crpix_x, crpix_y)
    if (currentMarkers.indexOf(marker) < 0 && isIsCircle) {
      const markers = [...currentMarkers, marker]
      renderMarkers(this.CanvasDraw, markers)
      this.setState({ currentMarkers: markers })
    }
  }

  //componentWillReceiveProps(props) {
  //  if (this.props !== props) {
  //    this.buildCanvasImage()
  //    this.renderSolarRadius()
  //
  //    const { currentMarkers, contourCreated } = this.state
  //
  //    this.renderMarkers(currentMarkers)
  //
  //    if (contourCreated) {
  //      Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))
  //    }
  //  }
  //}

  buildCanvasImage = () => {
    const { item, frame } = this.props
    const { zoom } = item
    const { width, height, image_min, image_max } = item
    const imageBuffer = FITSLib.getFrameImageBuffer(width, height, image_min, image_max, 0, frame.array)
    this.updateCanvas(imageBuffer,  width, height, zoom)
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
    //this.DrawingContainer.setAttribute('style', `width: ${width}px; height: ${height}px;`)
  }

  updateCanvas = (buffer, width, height, zoom = 1) => {
    const scaledWidth = zoom * width
    const scaledHeight = zoom * height

    const mainCTX = this.CanvasImage.getContext('2d')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(buffer)
    ctx.putImageData(imageData, 0, 0)

    this.updateCanvasSize(scaledWidth, scaledHeight)

    mainCTX.translate(0, scaledHeight)
    mainCTX.scale(1, -1)

    mainCTX.drawImage(canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight)

    const { item, onFrameImageUpdate } = this.props
    return onFrameImageUpdate(item.id, canvas.toDataURL())
  }

  onRemoveLastMarker = () => {
    const { currentMarkers } = this.state
    currentMarkers.pop()
    renderMarkers(this.CanvasDraw, currentMarkers)
    this.setState({ currentMarkers, contourCreated: false })
  }

  onRemoveAllMarker = () => {
    renderMarkers(this.CanvasDraw, [])
    this.setState({ currentMarkers: [], contourCreated: false })
  }

  onDrawContour = () => {
    const { currentMarkers } = this.state
    Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))
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

  //onImageLevelChange = (min, max) => this.props.onImageLevelChange(this.props.item.id, min, max)
  //
  //onImageRadiusChange = (radius, xCenter, yCenter) => this.props.onImageRadiusChange(this.props.item.id, radius, xCenter, yCenter)
  //

  onContourSquareInfo = () => {
    const { item } = this.props
    const { currentMarkers } = this.state
    const imageMarkers = toImageCoords(item, currentMarkers)
    const contourInfo = Coordinates.getContourSquareInfo(imageMarkers, item.radius, item.crpix_x, item.crpix_y)
    this.setState({ contourInfo })
  }

  onCloseContourResultModal = () => this.setState({ contourInfo: null })

  render() {
    const { currentMarkers, contourCreated } = this.state
    const { item } = this.props

    const width = item.width * item.zoom
    const height = item.height * item.zoom

    return (
      <div className={s.container}>
        <div className={s.drawingContainer}>
          <SaveImage images={['Image', 'Radius', 'Contour']} width={width} height={height} />
          <canvas ref={(c) => { this.Canvas = c; }}></canvas>
          <canvas ref={(c) => { this.CanvasImage = c; }} className={s.image} name="Image"></canvas>
          <canvas ref={(c) => { this.CanvasDrawRadius = c; }} className={s.radius} name="Radius"></canvas>
          <canvas ref={(c) => { this.CanvasDraw = c; }} className={s.draw} name="Contour"></canvas>
          <canvas ref={(c) => { this.CanvasCrossHair = c; }} className={s.crossHair} name="CrossHair"></canvas>
        </div>
        <Grid>
          <FlatButton style={{color: 'white'}} label="Remove Last marker" onClick={this.onRemoveLastMarker} primary disabled={!currentMarkers.length}/>
          <FlatButton style={{color: 'white'}} label="Remove All markers" onClick={this.onRemoveAllMarker} primary disabled={!currentMarkers.length}/>
          {/*<FlatButton style={{color: 'white'}} label="Gravity" onClick={this.gravity} primary disabled={currentMarkers.length < 3}/>*/}
          <FlatButton style={{color: 'white'}} label="Draw contour" onClick={this.onDrawContour} primary disabled={currentMarkers.length < 3}/>
          <FlatButton style={{color: 'white'}} label="Get contour sqare info" onClick={this.onContourSquareInfo} primary disabled={!contourCreated}/>
        </Grid>
        {/*<DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
        <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>*/}

        <ContourResultModal contourInfo={this.state.contourInfo} onClose={this.onCloseContourResultModal} />
      </div>
    )
  }
}

export default ItemImage