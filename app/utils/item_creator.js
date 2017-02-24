//http-server -p 3030 --cors
//In fits folder

const chunkArray =  (array,  n) => {
  if ( !array.length ) return []
  return [ array.slice( 0, n ) ].concat( chunkArray(array.slice(n), n) )
}

export const getFITSFrame = (FITS_DATA) => {
  const { header, data } = FITS_DATA
  const bitpix = header.get('BITPIX')
  const bzero = header.get('BZERO')
  const bscale = header.get('BSCALE')
  const { buffer } =  data
  const frame = data._getFrame(buffer, bitpix, bzero, bscale)

  return frame
  //console.log(getFrameImage(frame, data.width, data.height))
}

const setDatePixelColor = (pixel, min, max, minColor, maxColor) => {
  return (min + pixel) / max * (maxColor + minColor)
}

const getFrameImage = (frame, width, height) => {
  const min = 0.4 // Math.min.apply(null, frame)
  const max = 1 //Math.max.apply(null, frame)
  const bufferLength = width * height * 4
  let buffer = new Uint8ClampedArray(bufferLength)

  let framePos = 0
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      let pos = (y * width + x) * 4
      let pixel = setDatePixelColor(frame[framePos], min, max, 0, 255)

      buffer[pos  ] = 1 * pixel
      buffer[pos+1] = 0.4 * pixel
      buffer[pos+2] = 0 * pixel
      buffer[pos+3] = 255

      framePos += 1
    }
  }

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  let idata = ctx.createImageData(width, height)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)

  const dataImageUrl = canvas.toDataURL()


  var elem = document.createElement("img");
  elem.setAttribute("src", dataImageUrl);
  document.body.appendChild(elem);



  return dataImageUrl
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

    item.header = header.cards
    item.width = data.width
    item.height = data.height

    item.frame = getFITSFrame(FITS_DATA)

    cb(item)
  })
}