//http-server -p 3030 --cors
//In fits folder

const chunkArray =  (array,  n) => {
  if ( !array.length ) return []
  return [ array.slice( 0, n ) ].concat( chunkArray(array.slice(n), n) )
}

const flipHorizontaly = (frame, width) => {
  const chunks = chunkArray(frame, width).reverse()
  let result = []
  chunks.forEach(chunk => result = [...result, ...chunk])
  return result

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
  //console.log(getFrameImage(frame, data.width, data.height))
}

const setDatePixelColor = (pixel, min, max, minColor, maxColor) => {
  if (min >= pixel) return 0
  if (max <= pixel) return maxColor
  return (pixel - min) / (max - min) * (maxColor + minColor)
}

export const getFrameImageBuffer = (width, height, min, max, lvl, frame) => {
  const bufferLength = width * height * 4
  let buffer = new Uint8ClampedArray(bufferLength)

  //rgb(0, 0, 0) 0%,
  //  rgb(149, 255, 255) 25%,
  //  rgb(255, 197, 255) 75%,
  //  rgb(255, 255, 255) 100%
  //r - 1.65426434·10-3 x2 - 7.870015171·10-2 x - 3.97903932·10-13
  //g - -2.338148632·10-3 x2 + 8.413259405·10-1 x - 9.663381206·10-13
  //
  //1 28.05 56.1 84.15 112.2 140.25 168.3 196.35 224.4 255
  //1 81 177 212 230 242 250 255 255 255
  //1 18 47 74 103 136 165 195 232 255
  //1 23 52 62 63 64 71 98 183 255
  //



  let framePos = 0
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      let pos = (y * width + x) * 4
      let pixel = setDatePixelColor(frame[framePos], min, max, lvl, 255)

      //let r = -0.024 * pixel * pixel  + 4.4164 * pixel - 17.1448
      //
      //let g = 0.0025 *  Math.pow(pixel, 2) + 0.7515 * pixel - 3.8236
      //
      //let b = 0.0001 * Math.pow(pixel, 3) - 0.0202 * Math.pow(pixel, 2) + 2.2389 * pixel - 22.9435

      buffer[pos    ] = pixel
      buffer[pos + 1] = pixel
      buffer[pos + 2] = pixel
      buffer[pos + 3] = 255

      framePos += 1
    }
  }

  return buffer
}

export const getFrameImage = item => {
  const { frame, frame_min_value, frame_max_value, width, height, lvl } = item

  const buffer = getFrameImageBuffer(width, height, frame_min_value, frame_max_value, lvl, frame)
  //const bufferLength = width * height * 4
  //let buffer = new Uint8ClampedArray(bufferLength)
  //
  ////rgb(0, 0, 0) 0%,
  ////  rgb(149, 255, 255) 25%,
  ////  rgb(255, 197, 255) 75%,
  ////  rgb(255, 255, 255) 100%
  ////r - 1.65426434·10-3 x2 - 7.870015171·10-2 x - 3.97903932·10-13
  ////g - -2.338148632·10-3 x2 + 8.413259405·10-1 x - 9.663381206·10-13
  ////
  ////1 28.05 56.1 84.15 112.2 140.25 168.3 196.35 224.4 255
  ////1 81 177 212 230 242 250 255 255 255
  ////1 18 47 74 103 136 165 195 232 255
  ////
  ////let r = 0.0011 * pixel * pixel * pixel - 0.1458 * pixel * pixel + 6.2675 * pixel - 28.381
  ////
  ////let g = -0.0001 * Math.pow(pixel, 3) + 0.0128 *  Math.pow(pixel, 2) + 2.0493 * pixel - 5.119
  ////
  ////let b = 0.0007 * Math.pow(pixel, 3) - 0.1586 * Math.pow(pixel, 2) + 11.3708 * pixel - 18.2302
  //
  //let framePos = 0
  //for(let y = 0; y < height; y++) {
  //  for(let x = 0; x < width; x++) {
  //    let pos = (y * width + x) * 4
  //    let pixel = setDatePixelColor(frame[framePos], frame_min_value, frame_max_value, 0, 255)
  //
  //    buffer[pos] = pixel
  //    buffer[pos + 1] = pixel
  //    buffer[pos + 2] = pixel
  //    buffer[pos + 3] = 255
  //
  //    framePos += 1
  //  }
  //}

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  let idata = ctx.createImageData(width, height)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)

  return canvas.toDataURL()
}

export const getFITSItem = (file, cb) => {
  const { FITS } = window.astro

  const { name, path } = file

  const url = path || `http://127.0.0.1:3030/${name}`

  let item = { url }

  new FITS(url, response => {
    const { hdus } = response

    const FITS_DATA = hdus[0]
    const { header, data } = FITS_DATA

    header.cards.CRPIX2.value = data.height - header.cards.CRPIX2.value

    item.lvl = 100
    item.scale = data.height > 500 ? 1 : 2
    item.header = header.cards
    item.width = data.width
    item.height = data.height
    item.frame = getFITSFrame(FITS_DATA)
    item.min = Math.min.apply(null, item.frame)
    item.max = Math.max.apply(null, item.frame)
    item.frame_min_value = item.max / 2
    item.frame_max_value = item.max

    item.image = getFrameImage(item)

    cb(item)
  })
}