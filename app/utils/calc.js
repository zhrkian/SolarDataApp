
// Formulae for the Solar Orientation angles were taken from "Astronomical Algorithm" by Meeus
// Formulae for Calculating the Sunspot lat-long taken from Smith's Astronomical Calculation for Calculators
const radian = 180 / Math.PI

const truncate = angle => {
  const n = Math.floor(angle / 360)
  const tangle = angle - n * 360
  return tangle
}

export const calcJD = (year, month, day, hour) => {
  let y = eval(year)
  let m = eval(month)
  let d = eval(day)
  let t = eval(hour)

  if ( m<=2 ) {
    y = y - 1
    m = m + 12
  }

  let a = Math.floor(y/100)
  let b = 2 - a + Math.floor(a/4)
  d += t / 24
  let jdg = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5
  let jd0 = Math.floor(jdg + 0.5) - 0.5
  return jdg
}


export const calc_solar = jd => {
  let theta = (jd - 2398220) * 360 / 25.38
  let inc = 7.25 / radian
  let k = (73.6667 + 1.3958333 * (jd - 2396758) / 36525) / radian
  let t = (jd - 2451545) / 36525
  let t2 = t * t
  let t3 = t * t2
  let L0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2
  let M = 357.52910 + 35999.05030 * t - 0.0001559 * t2 - 0.00000048 * t3
  let Mr = M / radian
  let C = (1.914600 - 0.004817 * t - 0.000014 * t2) * Math.sin(Mr) + (0.019993 - 0.000101 * t) * Math.sin(2 * Mr) + 0.000290 * Math.sin(3 * Mr)
  let sunL = L0 + C
  let v = M + C
  let omega = 125.04-1934.136 * t
  let lngtd = sunL - 0.00569 - 0.00478 * Math.sin(omega / radian)
  let lngtdr = lngtd / radian
  let diffk = (lngtdr - k)
  let oblr = (23.4392911 - 0.0130042 * t - 0.0000164 * t2 + 0.0000504 * t3) / radian
  let tx = - Math.cos(lngtdr) * Math.tan(oblr)
  let ty = - Math.cos(diffk) * Math.tan(inc)
  let x = Math.atan(tx)
  let y = Math.atan(ty)
  let Pr = (x + y)
  let P = Pr * radian
  let B0r = Math.asin(Math.sin(diffk) * Math.sin(inc))
  let B0 = B0r * radian
  let etay = -Math.sin(diffk) * Math.cos(inc)
  let etax = -Math.cos(diffk)
  let eta = (Math.atan2(etay, etax)) * radian

  L0 = eta - theta
  L0 = truncate(L0)
  let L0r = L0 / radian
  let CarrNo = Math.floor((jd - 2398140.22710) / 27.2752316)

  return { L0, B0, CarrNo, B0r, L0r, Pr, P }
}

export const calc_LBP = (year, month, day, hour) => {
  const jdt = calcJD(year, month, day, hour)
  return calc_solar(jdt)
}

export const lat_long = (rs, r1, pa1, Pr, B0r, L0r) => {
  pa1 = pa1 / radian
  let r2 = Math.asin(r1 / rs)
  let dp = (Pr - pa1)
  let B = Math.asin(Math.sin(B0r) * Math.cos(r2) + Math.cos(B0r) * Math.sin(r2) * Math.cos(dp))
  let L = Math.asin(Math.sin(r2) * Math.sin(dp)/Math.cos(B)) + L0r
  L = radian * L
  B = radian * B
  return { B, L }
}

