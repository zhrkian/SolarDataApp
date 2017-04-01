import React, { Component } from 'react'
import s from './ItemImage.css'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'

import ItemLayout from '../Layouts/ItemLayout'
import ItemImageHolder from '../ItemImageHolder/ItemImageHolder'
import ItemControls from '../ItemControls/ItemControls'
import IconButton from '../IconButton/IconButton'
import Back from '../Back/Back'
import Block from '../Block/Block'


import ContourResultModal from '../ContourResultModal/ContourResultModal'
import ContourCalculatorModal from '../ContourCalculatorModal/ContourCalculatorModal'
import SaveImage from '../SaveImage/SaveImage'
import DataLevelControls from '../DataLevelControls/DataLevelControls'
import ImageRadiusControls from '../ImageRadiusControls/ImageRadiusControls'
import ContourList from '../ContourList/ContourList'

import * as FITSLib from '../../utils/item_creator'
import * as Draw from '../../utils/draw'
import * as Coordinates from '../../utils/coordinates'
import * as Utils from '../../utils'

const styles = {
  button: {
    backgroundColor: '#313131',
    marginBottom: 2
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 14,
  }
}

const colors = ['#000088', '#0000AA', '#0000BB', '#0000BB', '#0000CC']

const getMouseCoordinates = (canvas, event) => {
  const canvasRect = canvas.getBoundingClientRect()
  const coordinates = { x: (event.clientX - canvasRect.left), y: (event.clientY - canvasRect.top) }
  return coordinates
}

const onMouseClick = (canvas, callback, event) => {
  const coordinates = getMouseCoordinates(canvas, event)
  return callback ? callback(coordinates) : null
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
  const { x, y } = Coordinates.toViewCoords(item, { x: crpix_x, y: crpix_y })

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
  state = { imageBuffer: null, currentMarkers: [], selectedContours: [], scale: 1, contourModal: false }

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
    const { x, y } = Coordinates.toImageCoords(item, marker)
    const { currentMarkers } = this.state
    const isIsCircle = Coordinates.isIsCircle(x,y, radius, crpix_x, crpix_y)
    if (currentMarkers.indexOf(marker) < 0 && isIsCircle) {
      const markers = [...currentMarkers, marker]
      renderMarkers(this.CanvasDraw, markers)
      this.setState({ currentMarkers: markers })
    }
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      const { item } = props
      this.buildCanvasImage()
      renderSolarRadius(this.CanvasDrawRadius, item)

      const { currentMarkers, contourCreated, selectedContours } = this.state

      renderMarkers(this.CanvasDraw, currentMarkers)

      if (selectedContours && selectedContours.length) {
        this.onSavedContoursSelect(selectedContours)
      }

      if (contourCreated) {
        Draw.drawContour(this.CanvasDraw, currentMarkers, 'red', () => this.setState({ contourCreated: true }))
      }
    }
  }

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
    this.CanvasSavedContours.width = width
    this.CanvasSavedContours.height = height
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

  onSaveContour = contourName => {
    const { contourInfo, currentMarkers } = this.state
    const { item, onSaveContour } = this.props
    const contour = {
      title: contourName,
      contour: Coordinates.toImageCoords(item, currentMarkers),
      contourInfo
    }
    onSaveContour(item.id, contour)
    this.onCloseContourResultModal()
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

  onContourSquareInfo = () => {
    const { item, frame } = this.props
    const { currentMarkers } = this.state
    const imageMarkers = Coordinates.toImageCoords(item, currentMarkers)
    const contourSquareInfo = Coordinates.getContourSquareInfo(imageMarkers, [], item.radius, item.crpix_x, item.crpix_y)
    const contourIntensityInfo = Coordinates.getContourIntensityInfo(imageMarkers, [], frame.array, item.width)

    this.setState({ contourSquareInfo, contourIntensityInfo, contourInfoModal: true })
  }

  onContourCalculator = () => {
    this.setState({ contourCalculatorModal: true })
  }

  onCloseContourResultModal = () => this.setState({ contourInfoModal: false })

  onCloseContourCalculatorModal = () => this.setState({ contourCalculatorModal: false })

  onSavedContoursSelect = titles => {
    let colorIndex = 0
    const { item } = this.props
    const { contours } = item
    const selectedContours = contours.filter(contour => titles.indexOf(contour.title) > -1)
    Draw.clearCanvas(this.CanvasSavedContours)
    selectedContours.forEach(c => {
      const contour = Coordinates.toViewCoords(item, c.contour)
      if (!colors[colorIndex]) colorIndex = 0
      Draw.drawContour(this.CanvasSavedContours, contour, colors[colorIndex], () => {})
      colorIndex += 1
    })
    this.setState({ selectedContours: titles })
  }

  render() {
    const { currentMarkers, contourCreated, contourSquareInfo, contourIntensityInfo, contourInfoModal, contourCalculatorModal } = this.state
    const { item, frame } = this.props
    const { contours } = item
    const width = item.width * item.zoom
    const height = item.height * item.zoom

    return (
      <ItemLayout>
        <Back />
        <ItemImageHolder heading={Utils.getFilename(item.url)}>
          <div className={s.drawingContainer}>
            <div className={s.drawingSubContainer}>
              <SaveImage images={['Image', 'SavedContours', 'Radius', 'Contour']} width={width} height={height} />
              <canvas ref={(c) => { this.Canvas = c; }}></canvas>
              <canvas ref={(c) => { this.CanvasImage = c; }} className={s.image} name="Image"></canvas>
              <canvas ref={(c) => { this.CanvasSavedContours = c; }} className={s.savedContours} name="SavedContours"></canvas>
              <canvas ref={(c) => { this.CanvasDrawRadius = c; }} className={s.radius} name="Radius"></canvas>
              <canvas ref={(c) => { this.CanvasDraw = c; }} className={s.draw} name="Contour"></canvas>
              <canvas ref={(c) => { this.CanvasCrossHair = c; }} className={s.crossHair} name="CrossHair"></canvas>
            </div>
          </div>
        </ItemImageHolder>
        <ItemControls>
          <Block title="TOOLS">
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              <IconButton icon="Remove"     label="Remove all markers" onClick={this.onRemoveAllMarker} disabled={!currentMarkers.length}/>
              <IconButton icon="RemoveOne"  label="Remove last marker" onClick={this.onRemoveLastMarker} disabled={!currentMarkers.length}/>
              <IconButton icon="Contour"    label="Draw contour" onClick={this.onDrawContour} disabled={currentMarkers.length < 3}/>
              <IconButton icon="Area"       label="Area info" onClick={this.onContourSquareInfo} disabled={!contourCreated}/>
              <IconButton icon="Calc"       label="Contour calc" onClick={this.onContourCalculator} disabled={!contours || !contours.length}/>
            </div>
          </Block>
          <Block title="THRESHOLD">
            <DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
          </Block>
          <Block title="RADIUS CORRECTION">
            <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>
          </Block>
        </ItemControls>
        <ContourResultModal active={contourInfoModal}
                            contourSquareInfo={contourSquareInfo}
                            contourIntensityInfo={contourIntensityInfo}
                            onSave={this.onSaveContour}
                            onClose={this.onCloseContourResultModal} />

        <ContourCalculatorModal active={contourCalculatorModal}
                                item={item}
                                frame={frame.array}
                                onChange={this.onSavedContoursSelect}
                                onClose={this.onCloseContourCalculatorModal} />
      </ItemLayout>
    )
  }
}

export default ItemImage