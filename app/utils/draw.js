import html2canvas from 'html2canvas'

export const drawCircle = (canvas, cx, cy, r, color, cb) => {
  const context = canvas.getContext('2d')
  context.beginPath()
  context.arc(cx, cy, r, 0, 2 * Math.PI, false)
  context.strokeStyle = color || 'blue'
  context.lineWidth = 1
  context.lineWidth = 2
  context.stroke()
  cb ? cb() : null
}

export const drawContour = (canvas, markers, color, cb) => {
  const context = canvas.getContext('2d')
  context.beginPath()
  context.moveTo(markers[0].x, markers[0].y)
  markers.forEach(marker => context.lineTo(marker.x, marker.y))
  context.lineTo(markers[0].x, markers[0].y)
  context.strokeStyle = color || 'blue'
  context.lineWidth = 2
  context.stroke()
  context.closePath()
  cb ? cb() : null
}

export const drawMarker = (canvas, x, y, size = 2, color) => {
  const context = canvas.getContext('2d')
  context.beginPath()
  context.moveTo(x - size, y - size)
  context.lineTo(x + size, y + size)
  context.moveTo(x - size, y + size)
  context.lineTo(x + size, y - size)
  context.strokeStyle = color || 'blue'
  context.lineWidth = 3
  context.stroke()
  context.closePath()
}

export const clearCanvas = canvas => {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
}

export const CreateInfoImage = (selector) => {
  const areaInfoElement = document.querySelector(`#${selector}`)
  const infoCanvas = document.querySelector(`[name="${selector}"]`)

  if (infoCanvas) {
    infoCanvas.parentNode.removeChild(infoCanvas)
  }

  if (!areaInfoElement) return

  html2canvas(areaInfoElement).then(canvasInfo => {
    canvasInfo.setAttribute('style', 'visibility: hidden; position: absolute; top: -1000px;')
    canvasInfo.setAttribute('name', selector)
    areaInfoElement.parentNode.appendChild(canvasInfo)
  })
}



export const SaveMergedImage = (images, width, height, link, name, tableSelector, color) => {
  const canvasImage = document.createElement('canvas')
  const ctx = canvasImage.getContext('2d')

  canvasImage.width = width
  canvasImage.height = height

  images.forEach(image => {
    const imageLayerCanvas = document.querySelector(`[name="${image}"]`)
    ctx.drawImage(imageLayerCanvas, 0, 0)
  })

  const tableCanvas = document.querySelector(`[name="${tableSelector}"]`)

  console.log(tableCanvas)

  if (!tableCanvas) {
    link.href = canvasImage.toDataURL()
    link.download = `${name || 'image'}.png`
    return
  }

  console.log('OOOOK')

  const canvasBig = document.createElement('canvas')
  const ctxBig = canvasBig.getContext('2d')

  canvasBig.width = tableCanvas.width > canvasImage.width ? tableCanvas.width : canvasImage.width
  canvasBig.height = tableCanvas.height + canvasImage.height + 20

  ctxBig.beginPath()
  ctxBig.rect(0, 0, canvasBig.width, canvasBig.height)
  ctxBig.fillStyle = color || 'black'
  ctxBig.fill()

  ctxBig.drawImage(tableCanvas, 0, canvasImage.height + 10) //, tableCanvas.width, tableCanvas.height)

  const imageX = canvasBig.width / 2 - canvasImage.width / 2
  ctxBig.drawImage(canvasImage, imageX, 0) //, imageX + canvasImage.width, canvasImage.height)

  canvasBig.setAttribute('style', 'position: absolute; z-index: 100000')

  link.href = canvasBig.toDataURL()
  link.download = `${name || 'image'}.png`

}