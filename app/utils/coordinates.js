export const isIsCircle = (x, y, radius, x0, y0) => Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0)) < radius

export const from2dToSingle = (x, y, rowLength) => y * rowLength + x

export const inPoly = (x, y, points) => {
  let npol = points.length;
  let j = npol - 1;
  let c = 0;
  for (let i = 0; i < npol; i++) {
    const xCondition = (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x
    if ((((points[i].y < y) && (y < points[j].y)) || ((points[j].y < y) && (y < points[i].y))) &&
      (x >= xCondition)) {
      c = !c
    }
    j = i;
  }
  return c;
}

export const minInArrayOfObjects = (array, field) =>
  Math.min.apply(null, array.map(item => item[field]))

export const maxInArrayOfObjects = (array, field) =>
  Math.max.apply(null, array.map(item => item[field]))

export const getContourRect = contour => {
  const x0 = minInArrayOfObjects(contour, 'x')
  const x1 = maxInArrayOfObjects(contour, 'x')
  const y0 = minInArrayOfObjects(contour, 'y')
  const y1 = maxInArrayOfObjects(contour, 'y')

  return { x0, y0, x1, y1 }
}

export const isInContours = (x, y, contours = []) => {
  let result = false

  contours.forEach(contour => {
    if (!result) {
      result = inPoly(x, y, contour)
    }
  })

  return result
}

export const getContourSquareInfo = (contour, excludeContours, radiusValue, xCenterValue, yCenterValue) => {
  let totalContourSquarePixels = 0
  let totalContourSphericalSquare = 0.0

  const { x0, x1, y0, y1 } = getContourRect(contour)

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const isInContour = inPoly(x, y, contour)
      const isInExcludeContour = isInContours(x, y, excludeContours)

      if (isInContour && !isInExcludeContour) {
        const yRadius = Math.sqrt(radiusValue * radiusValue  - (y - yCenterValue) * (y - yCenterValue))

        let xP = x - xCenterValue
        let x_minus_05 = xP - 0.5
        let x_plus_05 = xP + 0.5
        if (x_minus_05 > yRadius) x_minus_05 = yRadius - 0.5
        if (x_plus_05 > yRadius) x_plus_05 = yRadius

        const theta1 = Math.acos(x_minus_05 / yRadius)
        const theta2 = Math.acos(x_plus_05 / yRadius)
        const pixelSquare = radiusValue * (theta1 - theta2)

        totalContourSphericalSquare += pixelSquare < 0 ? (-1) * pixelSquare : pixelSquare

        totalContourSquarePixels += 1
      }
    }
  }

  totalContourSphericalSquare = isNaN(totalContourSphericalSquare) || !totalContourSphericalSquare ? 0 : totalContourSphericalSquare
  totalContourSquarePixels = isNaN(totalContourSquarePixels) || !totalContourSquarePixels ? 0 : totalContourSquarePixels

  const totalSquarePixels = Math.PI * radiusValue * radiusValue
  const totalVisibleSphericalSquare = 2 * Math.PI * radiusValue * radiusValue

  return { totalContourSquarePixels, totalSquarePixels, totalContourSphericalSquare, totalVisibleSphericalSquare }
}

export const getContourIntensityInfo = (contour, excludeContours, frame, width) => {
  let totalPoints = 0
  let totalIntensity = 0

  const { x0, x1, y0, y1 } = getContourRect(contour)

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const isInContour = inPoly(x, y, contour)
      const isInExcludeContour = isInContours(x, y, excludeContours)

      if (isInContour && !isInExcludeContour) {
        const position = parseInt(from2dToSingle(x, y, width))
        totalIntensity += frame[position]
        totalPoints += 1
      }
    }
  }

  return { aveIntensity: totalIntensity / totalPoints }
}

export const toImageCoords = (item, coords) => {
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

export const toViewCoords = (item, coords) => {
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
