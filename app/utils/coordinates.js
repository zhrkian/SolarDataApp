export const isIsCircle = (x, y, radius, x0, y0) => Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0)) < radius


export const inPoly = (x, y, points) => {
  let npol = points.length;
  let j = npol - 1;
  let c = 0;
  for (let i = 0; i < npol; i++) {
    if ((((points[i].y <= y) && (y < points[j].y)) || ((points[j].y <= y) && (y < points[i].y))) &&
      (x > (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
      c = !c
    }
    j = i;
  }
  return c;
}