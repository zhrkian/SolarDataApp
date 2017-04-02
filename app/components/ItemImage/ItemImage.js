import React, { Component } from 'react'
import s from './ItemImage.css'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'

import AreaInfo from '../AreaInfo/AreaInfo'
import ItemLayout from '../Layouts/ItemLayout'
import ItemImageHolder from '../ItemImageHolder/ItemImageHolder'
import ItemControls from '../ItemControls/ItemControls'
import IconButton from '../IconButton/IconButton'
import Back from '../Back/Back'
import Block from '../Block/Block'


import ContourNewModal from '../ContourNewModal/ContourNewModal'
import ContourResultModal from '../ContourResultModal/ContourResultModal'
import ContourCalculatorModal from '../ContourCalculatorModal/ContourCalculatorModal'


import SaveImage from '../SaveImage/SaveImage'
import DataLevelControls from '../DataLevelControls/DataLevelControls'
import ImageRadiusControls from '../ImageRadiusControls/ImageRadiusControls'
import ContourSelect from '../ContourSelect/ContourSelect'
import ContourList from '../ContourList/ContourList'

import * as FITSLib from '../../utils/item_creator'
import * as Draw from '../../utils/draw'
import * as Coordinates from '../../utils/coordinates'
import * as Utils from '../../utils'

const COLORS = ['#000088', '#0000AA', '#0000BB', '#0000BB', '#0000CC']
const ZOOM = 1000
const ZOOM_STEPS = 10
const ZOOM_SCALE = 4

const getMouseCoordinates = (canvas, event) => {
  const canvasRect = canvas.getBoundingClientRect()
  const coordinates = event.update ? event : { x: (event.clientX - canvasRect.left), y: (event.clientY - canvasRect.top) }
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
  constructor(props) {
    super(props)
    this.state = {
      currentContour: null,
      imageBuffer: null,
      currentMarkers: [],
      selectedContours: [],
      scale: 1,
      contourModal: false
    }
  }

  componentDidMount() {
    const { item, contour } = this.props
    this.buildCanvasImage()
    this.CanvasCrossHair.addEventListener('mousedown', onMouseClick.bind(this, this.CanvasCrossHair, this.onMouseClick))
    this.CanvasCrossHair.addEventListener('mousemove', renderMouseCursor.bind(this, this.CanvasCrossHair))
    this.CanvasCrossHair.addEventListener('mousewheel', e => e.wheelDelta / 60 > 0 ? this.onZoomIn() : this.onZoomOut())
    renderSolarRadius(this.CanvasDrawRadius, item)
    this.initCurrentContour(item, contour)
  }

  componentWillUpdate(props) {
    if (this.props !== props) {
      const { item, contour } = props
      this.buildCanvasImage()
      renderSolarRadius(this.CanvasDrawRadius, item)
      this.initCurrentContour(item, contour)
    }
  }

  initCurrentContour = (item, contour) => {
    const { markers } = contour || {}
    if (markers && markers.length) {
      const viewMarkers = Coordinates.toViewCoords(item, markers)
      const lastMarker = viewMarkers[viewMarkers.length - 1]
      renderMarkers(this.CanvasDraw, viewMarkers)
      if (contour.contourCreated) Draw.drawContour(this.CanvasDraw, viewMarkers, 'red')
      renderMouseCursor(this.CanvasCrossHair, {...lastMarker, update: true})
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
    if (this.Canvas.width === width && this.Canvas.height === height) return
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
    ctx.imageSmoothingEnabled= false
    ctx.putImageData(imageData, 0, 0)

    this.updateCanvasSize(scaledWidth, scaledHeight)

    mainCTX.translate(0, scaledHeight)
    mainCTX.scale(1, -1)

    mainCTX.imageSmoothingEnabled= false
    mainCTX.drawImage(canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight)

    const { item, onFrameImageUpdate } = this.props
    return onFrameImageUpdate(item.id, canvas.toDataURL())
  }

  onMouseClick = marker => {
    const { item, onUpdateContour, contour } = this.props
    const { radius, crpix_x, crpix_y } = item
    const { x, y } = Coordinates.toImageCoords(item, marker)
    const isIsCircle = Coordinates.isIsCircle(x, y, radius, crpix_x, crpix_y)
    if (isIsCircle && contour) {
      let markers = contour.markers || []
      markers.push(Coordinates.toImageCoords(item, marker))
      return onUpdateContour(item.id, {...contour, markers, contourCreated: false })
    }
  }

  onRemoveLastMarker = () => {
    const { item, onUpdateContour, contour } = this.props
    let { markers } = contour
    markers.pop()
    return onUpdateContour(item.id, {...contour, markers, contourCreated: false })
  }

  onRemoveAllMarker = () => {
    const { item, onUpdateContour, contour } = this.props
    return onUpdateContour(item.id, {...contour, markers: [], contourCreated: false })
  }

  onDrawContour = () => {
    const { item, onUpdateContour, contour } = this.props
    return onUpdateContour(item.id, {...contour, contourCreated: true })
  }

  onZoomIn = () => {
    const { item, onUpdateZoom } = this.props
    const { height, zoom } = item
    const zoomMax = ZOOM / height
    const zoomMin = zoomMax / ZOOM_SCALE
    const zoomStep = (zoomMax - zoomMin) / ZOOM_STEPS
    const nextZoom = zoom + zoomStep
    return zoomMax < nextZoom ? null : onUpdateZoom(item.id, nextZoom)
  }

  onZoomOut = () => {
    const { item, onUpdateZoom } = this.props
    const { height, zoom } = item
    const zoomMax = ZOOM / height
    const zoomMin = zoomMax / ZOOM_SCALE
    const zoomStep = (zoomMax - zoomMin) / ZOOM_STEPS
    const nextZoom = zoom - zoomStep
    return zoomMin > nextZoom ? null : onUpdateZoom(item.id, nextZoom)
  }

  onImageLevelChange = (min, max) => this.props.onImageLevelChange(this.props.item.id, min, max)

  onImageRadiusChange = (radius, xCenter, yCenter) => this.props.onImageRadiusChange(this.props.item.id, radius, xCenter, yCenter)

  onOpenContourCalculator = () => {
    this.setState({ contourCalculatorModal: true })
  }
  onCloseContourCalculatorModal = () => this.setState({ contourCalculatorModal: false })

  onOpenContourNewModal = () => this.setState({ contourNewModal: true })
  onCloseContourNewModal = () => this.setState({ contourNewModal: false })

  onContourEdit = (name, contour) => console.log(name, contour)

  render() {
    const { contourCalculatorModal, contourEditModal, contourNewModal } = this.state
    const { item, frame, contours, contour } = this.props
    const { onAddNewContour, onSelectContour, onEditContour } = this.props
    const markers = contour ? contour.markers : []

    const width = item.width * item.zoom
    const height = item.height * item.zoom

    let heading = `${Utils.getFilename(item.url)}`
    if (contour) heading = `${heading} / ${contour.title}`

    return (
      <ItemLayout>
        <Back />
        <ItemImageHolder heading={heading}>
          <div className={s.drawingContainer}>
            <canvas ref={(c) => { this.Canvas = c; }}></canvas>
            <canvas ref={(c) => { this.CanvasImage = c; }} className={s.image} name="Image"></canvas>
            <canvas ref={(c) => { this.CanvasSavedContours = c; }} className={s.savedContours} name="SavedContours"></canvas>
            <canvas ref={(c) => { this.CanvasDrawRadius = c; }} className={s.radius} name="Radius"></canvas>
            <canvas ref={(c) => { this.CanvasDraw = c; }} className={s.draw} name="Contour"></canvas>
            <canvas ref={(c) => { this.CanvasCrossHair = c; }} className={s.crossHair} name="CrossHair"></canvas>
          </div>
          <div>
            {
              markers.length > 2 ? <AreaInfo item={item} frame={frame} markers={markers} /> : null
            }
          </div>
        </ItemImageHolder>

        {/* SIDEBAR */}
        {/*
          <IconButton key={3} icon="Area"       label="Area info"           onClick={this.onContourSquareInfo} disabled={true}/>,
          <IconButton key={'ZoomIn'}    icon="ZoomIn"     label="Zoom In"             onClick={this.onZoomIn} />,
          <IconButton key={'ZoomOut'}   icon="ZoomOut"    label="Zoom Out"            onClick={this.onZoomOut} />,
        */}
        <ItemControls dock={[
              <IconButton key={'New'}       icon="New"        label="New contour"         onClick={this.onOpenContourNewModal} />,
              <IconButton key={'Remove'}    icon="Remove"     label="Remove all markers"  onClick={this.onRemoveAllMarker} disabled={!markers.length}/>,
              <IconButton key={'RemoveOne'} icon="RemoveOne"  label="Remove last marker"  onClick={this.onRemoveLastMarker} disabled={!markers.length}/>,
              <IconButton key={'Contour'}   icon="Contour"    label="Draw contour"        onClick={this.onDrawContour} disabled={markers.length < 3}/>,
              <IconButton key={'Calc'}      icon="Calc"       label="Contour calc"        onClick={this.onOpenContourCalculator} disabled={true}/>,
              <IconButton key={'Image'}     icon="Image"      label="Save image"          onClick={link => Draw.SaveMergedImage(['Image', 'SavedContours', 'Radius', 'Contour'], width, height, link)} link={true}/>
            ]}>

          {
            contours && contours.length ? (
              <Block title="CONTOURS">
                <ContourList contours={contours}
                             active={contour}
                             onEdit={(n, c) => onEditContour(item.id, n, c)}
                             onSelect={contour => onSelectContour(item.id, contour)} />
              </Block>
            ) : null
          }

          <Block title="THRESHOLD">
            <DataLevelControls {...item} onImageLevelChange={this.onImageLevelChange}/>
          </Block>
          <Block title="RADIUS CORRECTION">
            <ImageRadiusControls {...item} onImageRadiusChange={this.onImageRadiusChange}/>
          </Block>
        </ItemControls>


        {/* MODALS
        <ContourResultModal active={contourInfoModal}
                            contourSquareInfo={contourSquareInfo}
                            contourIntensityInfo={contourIntensityInfo}
                            onSave={this.onSaveContour}
                            onClose={this.onCloseContourResultModal} />

        <ContourCalculatorModal active={contourCalculatorModal}
                                item={item}
                                frame={frame.array}
                                onChange={this.onSavedContoursSelect}
                                onClose={this.onCloseContourCalculatorModal} />*/}

        <ContourNewModal active={contourNewModal}
                         onAdd={name => onAddNewContour(item.id, { title: name, markers: [] }) & this.onCloseContourNewModal()}
                         onClose={this.onCloseContourNewModal}/>

      </ItemLayout>
    )
  }
}

export default ItemImage