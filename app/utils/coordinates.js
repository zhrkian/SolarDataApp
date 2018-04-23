import MainLayout from "../components/Layouts/MainLayout";

require('./calc')

export const isIsCircle = (x, y, radius, x0, y0) => Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0)) < radius

export const from2dToSingle = (x, y, rowLength) => parseInt(y) * rowLength + parseInt(x)

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

export const getContourAreaInfo = (contour, excludeContours, radiusValue, xCenterValue, yCenterValue, solarRadius) => {
  let totalContourAreaPixels = 0
  let totalContourSphericalArea = 0.0

  console.log(solarRadius)

  const SR = solarRadius || 695700
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
        const pixelArea = radiusValue * (theta1 - theta2)

        totalContourSphericalArea += pixelArea < 0 ? (-1) * pixelArea : pixelArea

        totalContourAreaPixels += 1
      }
    }
  }

  totalContourSphericalArea = isNaN(totalContourSphericalArea) || !totalContourSphericalArea ? 0 : totalContourSphericalArea
  totalContourAreaPixels = isNaN(totalContourAreaPixels) || !totalContourAreaPixels ? 0 : totalContourAreaPixels

  const totalAreaPixels = Math.PI * radiusValue * radiusValue
  const totalVisibleSphericalArea = 2 * Math.PI * radiusValue * radiusValue

  const totalContourAreaKM = totalContourAreaPixels * (SR * SR) / (radiusValue * radiusValue) / 1000000000
  const totalContourSphericalKM = totalContourSphericalArea * (SR * SR) / (radiusValue * radiusValue) / 1000000000

  return { totalContourAreaPixels, totalAreaPixels, totalContourSphericalArea, totalVisibleSphericalArea, totalContourAreaKM, totalContourSphericalKM }
}

const getStandardDeviation = (points, sigma) => {
  const length = points.length

  return Math.sqrt(length * sigma * sigma / (length - 1))
}

const getSigma = (points, ave) => {
  const length = points.length
  let result = 0

  points.forEach(point => {
    result += (point - ave) * (point - ave) / length
  })

  return Math.sqrt(result)
}

export const getContourIntensityInfo = (contour, excludeContours, frame, width, item) => {
  let totalPoints = 0
  let totalIntensity = 0
  let points = []

  const { x0, x1, y0, y1 } = getContourRect(contour)

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const isInContour = inPoly(x, y, contour)
      const isInExcludeContour = isInContours(x, y, excludeContours)

      if (isInContour && !isInExcludeContour) {
        const position = parseInt(from2dToSingle(x, y, width))
        if (frame[position] <= item.frame_max && frame[position] >= item.frame_min) {
          totalIntensity += frame[position]
          totalPoints += 1
          points.push(frame[position])
        }
      }
    }
  }

  const aveIntensity = totalIntensity / totalPoints
  const sigma = getSigma(points, aveIntensity)
  const standardDeviation = getStandardDeviation(points, sigma)


  return { aveIntensity, sigma, standardDeviation }
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

const GRID_STEP = 0.5 * Math.PI / 180
const HORIZONTAL_GLID_STEP = 10 * Math.PI / 180

const horizontalGridLine = (x0, y0, radius) => {
  let coordinates = []
  for (let angle = 0; angle <= Math.PI; angle += GRID_STEP) {
    const y = parseInt(y0)
    const z = radius * Math.sin(angle)
    const x = parseInt(radius * Math.cos(angle) + x0)

    if (coordinates.indexOf({ x, y, z }) < 0) {
      coordinates.push({ x, y, z })
    }
  }

  return coordinates
}

const verticalGridLine = (x0, y0, radius) => {
  let coordinates = []
  for (let angle = 0; angle <= Math.PI; angle += GRID_STEP) {
    const y = parseInt(y0)
    const z = radius * Math.sin(angle)
    const x = parseInt(radius * Math.cos(angle) + x0)

    if (coordinates.indexOf({ x, y, z }) < 0) {
      coordinates.push({ x, y, z })
    }
  }

  return coordinates
}

export const getCoordinatesGrid = (x0, y0, radius, B0, vertical) => {
  let equator = horizontalGridLine(x0, y0, radius)
  let coordinates = [...equator]


  for (let b = 5 * HORIZONTAL_GLID_STEP; b < Math.PI - 5 * HORIZONTAL_GLID_STEP; b += HORIZONTAL_GLID_STEP) {
    const r = radius * Math.sin(b)
    const y = radius * Math.cos(b) + y0
    coordinates = [...coordinates, ...horizontalGridLine(x0, y, r)]
  }

  coordinates = coordinates.map(point => {
    const angle = (90 - B0) * Math.PI / 180
    return {
      x: point.x, // * Math.cos(angle),
      y: 2 * y0 - point.y * Math.sin(angle) + point.z * Math.cos(angle)
    }
  })

  const hLine = equator.map(point => {
    const angle = Math.PI / 2
    return {
      x: x0 + point.x * Math.cos(angle) - point.y * Math.sin(angle),
      y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
      z: point.z
    }
  })

  if (vertical) coordinates = []

  for (let l = - Math.PI / 2 + HORIZONTAL_GLID_STEP; l < Math.PI / 2 - HORIZONTAL_GLID_STEP; l += HORIZONTAL_GLID_STEP) {
    const L = hLine.map(point => {
      return {
        x: x0 + point.x * Math.cos(l) + point.z * Math.sin(l),
        y: point.y,
        z: - point.x * Math.sin(l) + point.z * Math.cos(l)
      }
    })

    coordinates = [...coordinates, ...L]
  }

  return coordinates
}

export const sphericalCoordinate = (x, y, r, B0, L0) => {
  const drxy = Math.sqrt(x * x + y * y)
  const z = Math.sqrt(r * r - drxy * drxy)
  const angle = B0 * Math.PI / 180
  const xs = x
  const ys = y * Math.cos(angle) + z * Math.sin(angle)
  const zs = - y * Math.sin(angle) + z * Math.cos(angle)

  const B = Math.asin(ys / r) * 180 / Math.PI
  const L = L0 + Math.atan(xs / zs) * 180 / Math.PI

  return { B, L }

}
