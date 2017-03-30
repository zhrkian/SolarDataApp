//http-server -p 3030 --cors
//In fits folder
import { RedTemperature } from './pattern'

const ZOOM = 500

const chunkArray =  (array,  n) => {
  if ( !array.length ) return []
  return [ array.slice( 0, n ) ].concat( chunkArray(array.slice(n), n) )
}

const flipHorizontaly = (frame, width) => {
  return frame
}

export const getFITSFrame = (FITS_DATA) => {
  const { header, data } = FITS_DATA
  const bitpix = header.get('BITPIX')
  const bzero = header.get('BZERO')
  const bscale = header.get('BSCALE')
  const width = header.get('NAXIS1')
  const { buffer } =  data
  const frame = data._getFrame(buffer, bitpix, bzero, bscale)

  const flipedFrame = flipHorizontaly(frame, width)

  return flipedFrame
}

const setDatePixelColor = (pixel, min, max, minColor, maxColor) => {
  if (min >= pixel) return 0
  if (max <= pixel) return maxColor
  return (pixel - min) / (max - min) * (maxColor + minColor)
}

export const getFrameImageBuffer = (width, height, min, max, lvl, frame) => {
  const bufferLength = width * height * 4
  let buffer = new Uint8ClampedArray(bufferLength)
  let framePos = 0
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      let pos = (y * width + x) * 4
      let pixel = setDatePixelColor(frame[framePos], min, max, lvl, 255)

      pixel = parseInt(pixel)



      if (pixel < 0) pixel = 0
      if (pixel > 255) pixel = 255

      buffer[pos    ] = RedTemperature[pixel].r
      buffer[pos + 1] = RedTemperature[pixel].g
      buffer[pos + 2] = RedTemperature[pixel].b
      buffer[pos + 3] = 255

      framePos += 1
    }
  }

  return buffer
}

export const getFrameImage = item => {
  const { frame, image_min, image_max, width, height, lvl } = item

  const buffer = getFrameImageBuffer(width, height, image_min, image_max, 0, frame)

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  let idata = ctx.createImageData(width, height)
  idata.data.set(buffer)

  ctx.putImageData(idata, 0, 0)

  //ctx.drawImage(canvas, 0, 0)

  return canvas.toDataURL()
}

export const getImageMin = (frame, header) => {
  const MIN =  header.cards['IMGMIN01'] || header.cards['DATAMIN'] || {}

  const { value } = MIN

  if (!value && frame) return Math.min.apply(null, frame)

  return value
}

const getImageMax = (frame, header) => {
  const MAX = header.cards['IMGMAX01'] || header.cards['DATAMAX'] || {}
  const { value } = MAX

  if (!value && frame) return Math.max.apply(null, frame)

  return value
}

const getImageCenterX = header => {
  const { value } = header.cards['CRPIX1'] || {}
  return value || null
}

const getImageCenterY = header => {
  const { value } = header.cards['CRPIX2'] || {}
  return value || null
}

const getImageRadius = header => {
  const { CRVAL1, CRVAL2 } = header.cards

  if (CRVAL1 && CRVAL1.value && CRVAL2 && CRVAL2.value) return (CRVAL1.value + CRVAL2.value) / 2
  if ((CRVAL1 && CRVAL1.value) || (CRVAL2 && CRVAL2.value)) return CRVAL1.value || CRVAL2.value

  const { NAXIS1, NAXIS2 } = header.cards

  if (NAXIS1.value > NAXIS2.value) return NAXIS2.value / 2

  return NAXIS1.value / 2
}

const getImageDate = header => {
  const { value } = header.cards['DATE-OBS'] || {}
  return value || null
}

const getImageTime = header => {
  const { value } = header.cards['TIME-OBS'] || {}
  return value || null
}

const getImageTelescope = header => {
  const { value, comment } = header.cards['TELESCOP'] || {}

  if (value) return `${value} ${comment}`

  return null
}

const getImageWavelength = header => {
  let wavelength = null

  for (let key in header.cards) {
    if (header.cards.hasOwnProperty(key) && key.indexOf('WAVE') > -1 && header.cards[key].value) {
      wavelength = `${header.cards[key].value} ${header.cards[key].comment}`
    }
  }

  return wavelength
}

export const getFITSItem = (file, cb) => {
  const { FITS } = window.astro

  const { name, path } = file

  const url = path || `http://127.0.0.1:3030/${name}`

  new FITS(url, response => {

    const { hdus } = response
    const FITS_DATA = hdus[0]

    let { header, data } = FITS_DATA

    const frame = getFITSFrame(FITS_DATA)

    const width = data.width
    const height = data.height

    const frame_min = getImageMin(frame, header)
    const frame_max = getImageMax(frame, header)

    const image_min = (frame_min + frame_max) / 2
    const image_max = frame_max

    const crpix_x = getImageCenterX(header)
    const crpix_y = getImageCenterY(header)

    const radius = getImageRadius(header)

    const date = getImageDate(header)
    const time = getImageTime(header)

    const telescope = getImageTelescope(header)
    const wavelength = getImageWavelength(header)

    const zoom = ZOOM / height

    cb({ frame, url, width, height, frame_min, frame_max, image_min, image_max, crpix_x, crpix_y, radius, date, time, telescope, wavelength, zoom })
  })
}