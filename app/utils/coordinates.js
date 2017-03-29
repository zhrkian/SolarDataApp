export const isIsCircle = (x, y, radius, x0, y0) => Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0)) < radius


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

export const getContourSquareInfo = (contour, radiusValue, xCenterValue, yCenterValue) => {
  let totalContourSquarePixels = 0
  let totalContourSphericalSquare = 0.0

  const { x0, x1, y0, y1 } = getContourRect(contour)

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const isInContour = inPoly(x, y, contour)

      if (isInContour) {
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

