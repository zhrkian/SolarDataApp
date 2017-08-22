/*
 * Javascript WCS for Solar Data implementation
 * Copyright (c) 2015 Ivica Skokic
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 */

//"use strict";

// angle conversion constants
var DEG2RAD = Math.PI/180.0;
var RAD2DEG = 180.0/Math.PI;

// as defined in SDO/AIA FITS
var RSUN_REF_SDO = 696000000.0; // solar radius [m]
var DSUN_REF_SDO = 1.49597870691e11; // AU [m]

// as defined in AstroPy/Allen's Astrophysical Quantities 4th Ed.
var RSUN_REF_ALLEN = 6.95508e8;
var DSUN_REF_ALLEN = 1.49597870700e11;

// select appropriate constants
var RSUN_REF = RSUN_REF_SDO;
var DSUN_REF = DSUN_REF_SDO;

// various instruments' image scales
var SDO_AIA_IMSCALE = DEG2RAD * (0.6 / 3600.0); // deg/px
var SOHO_EIT_IMSCALE = DEG2RAD * (2.629 / 3600.0); // deg/px
var HINODE_XRT_IMSCALE = DEG2RAD * (1.032 / 3600.0); // deg/px


//utility functions
function trunc(value) {
  if (value < 0) return Math.ceil(value);
  else return Math.floor(value);
}

function frac(value) {
  return value-trunc(value);
}

function remainder(value, interval) {
  value = value / interval;
  if (value < 0) return interval * (value - Math.ceil(value));
  else return interval * (value - Math.floor(value));
}

function int(value) {
  if (value < 0) return Math.ceil(value);
  else return Math.floor(value);
}

function fmod2pi(value) {
  value = remainder(value, 2 * Math.PI);
  if (value < 0) value = value + 2 * Math.PI;
  return value;
}


// this is not universal jd, limited applicability to gregorian calendar
// Gregorian Calendar adopted Oct. 15, 1582
function julianDay(year, month, day, hour, minute, second) {
  if (month < 2) {
    year = year - 1;
    month = month + 12;
  }
  var a = int(year / 100.0);
  var b = 2 - a + int(a / 4.0);
  var julian = int(365.25 * (year + 4716.0)) + int(30.6001 * (month + 1)) + day + b - 1524.5;
  return julian + hour / 24.0 + minute / 1440.0 + second / 86400.0;
}



//Helioprojective-cartesian to heliocentric-cartesian
function hpc2hcc(theta_x, theta_y, obs_sun_distance, rsun) {
  var cosx = Math.cos(theta_x);
  var cosy = Math.cos(theta_y);
  var q = obs_sun_distance * cosy * cosx;
  var d = q * q - obs_sun_distance * obs_sun_distance + rsun * rsun;
  d = q - Math.sqrt(d);
  var x = d * cosy * Math.sin(theta_x);
  var y = d * Math.sin(theta_y);
  var z = obs_sun_distance - d * cosy * cosx;
  return [x, y, z];
}



//Heliocentric-cartesian to helioprojective-cartesian
function hcc2hpc(x, y, z, obs_sun_distance) {
  z = obs_sun_distance - z;
  var d = Math.sqrt(x * x + y * y + z * z);
  var theta_x = Math.atan2(x, z);
  var theta_y = Math.asin(y / d);
  return [theta_x, theta_y, d];
}



//Stonyhurst heliographic to heliocentric-cartesian
function hgs2hcc(lng, lat, r, B0, L0) {
  if (typeof r == "undefined") r = RSUN_REF;
  var x = r * Math.cos(lat) * Math.sin(lng - L0);
  var y = r * (Math.sin(lat) * Math.cos(B0) - Math.cos(lat) * Math.cos(lng - L0) * Math.sin(B0));
  var z = r * (Math.sin(lat) * Math.sin(B0) + Math.cos(lat) * Math.cos(lng - L0) * Math.cos(B0));
  return  [x, y, z];
}



//Heliocentric-cartesian to Stonyhurst heliographic
function hcc2hgs(x, y, z, B0, L0) {
  if (typeof z == "undefined") z = Math.sqrt(RSUN_REF * RSUN_REF - x * x - y * y);
  var r = Math.sqrt(x * x + y * y + z * z);
  var lat = Math.asin((y * Math.cos(B0) + z * Math.sin(B0)) / r);
  var lng = L0 + Math.atan2(x, z * Math.cos(B0) - y * Math.sin(B0));
  if (lng < 0) lng = lng + 2 * Math.PI;
  if (lng > 2 * Math.PI) lng = lng - 2 * Math.PI;
  return [lng, lat, r];
}

function lng2cmd(lng, L0) {
  var cmd = lng - L0;
  if (cmd > Math.PI) cmd = cmd - 2 * Math.PI;
  if (cmd < -Math.PI) cmd = cmd + 2 * Math.PI;
  return cmd;
}

//t in days, A, B, C in deg/day, lat, lng in rad
function rotateDifferentialy(tDays, lat, lng, A, B, C) {
  var x = Math.sin(lat);
  var x2 = x * x;
  var omega = DEG2RAD * (A + B * x2 + C * x2 * x2 - 14.1844);  //14.1844 is Carrington period which is implicit in lat (L)
  return fmod2pi(lng + omega * tDays);
}

function unitCorrection(cunit) {
  var corr = [1,1];
  if (typeof cunit == "undefined") {
    corr[0] = DEG2RAD * 1.0 / 3600.0; corr[1] = DEG2RAD * 1.0 / 3600.0;  //units should be defined in CUNITn fields, but some observatories like Big Bear use CTYPE as "ARCSEC", so let's use arcsec as default
  } else {
    for (var i = 0; i < 2; i++) {
      if (cunit[i] == "arcsec") corr[i] = DEG2RAD * 1.0 / 3600.0;
      else if (cunit[i] == "arcmin") corr[i] = DEG2RAD * 1.0 / 60.0;
      else if (cunit[i] == "deg") corr[i] = DEG2RAD;
      else if (cunit[i] == "mas") corr[i] = DEG2RAD * 1.0 / 3600000.0;
      else corr[i] = DEG2RAD * 1.0 / 3600.0;
    }

  }
  return corr;
}

//Pixel to helioprojective cartesian
function pix2hpc(i, j, crpix, crval, cdelt, crota2, cunit) {
  i = i - crpix[0] + 1;
  j = j - crpix[1] + 1;
  var corr = unitCorrection(cunit);
  if (typeof crota2 == "undefined") crota2 = 0.0;
  var x = corr[0] * cdelt[0] * Math.cos(DEG2RAD * crota2) * i - corr[1] * cdelt[1] * Math.sin(DEG2RAD * crota2) * j + corr[0] * crval[0];
  var y = corr[0] * cdelt[0] * Math.sin(DEG2RAD * crota2) * i + corr[1] * cdelt[1] * Math.cos(DEG2RAD * crota2) * j + corr[1] * crval[1];
  var th_x = Math.atan(x);
  var th_y = Math.atan(y / Math.sqrt(1 + x * x));
  return [th_x, th_y];
}



//Helioprojective cartesian to pixel
function hpc2pix(x, y, crpix, crval, cdelt, crota2, cunit) {
  var corr = unitCorrection(cunit);
  if (typeof crota2 == "undefined") crota2 = 0.0;
  var th_x = Math.tan(x);
  var th_y = Math.tan(y) / Math.cos(x);
  x = th_x - crval[0] * corr[0];
  y = th_y - crval[1] * corr[1];
  var i = Math.cos(DEG2RAD * crota2) * x / cdelt[0] / corr[0] + Math.sin(DEG2RAD * crota2) * y / cdelt[1] / corr[1] + crpix[0] - 1;
  var j = - Math.sin(DEG2RAD * crota2) * x / cdelt[0] / corr[0] + Math.cos(DEG2RAD * crota2) * y / cdelt[1] / corr[1] + crpix[1] - 1;
  return [i, j];
}


//Pixel radial normalized to heliographic, phi is ccw from W limb
function pix_rnc2hgc(rho, phi, P, B0, L0, R, D) {
  var theta;
  if ((typeof R == "undefined") || (typeof D == "undefined")){
    //traditional method, infinite distance assumed, accuracy ~0.1deg
    theta = Math.asin(rho);
  }else{
    var alpha = Math.asin(R / D);
    var theta_p = Math.atan(rho * Math.tan(alpha));
    theta = Math.asin(D / R * Math.sin(theta_p)) - theta_p;
  }
  var lat = Math.asin(Math.cos(theta) * Math.sin(B0) + Math.sin(theta) * Math.sin(phi - P) * Math.cos(B0));
  var cmd = Math.asin(Math.cos(phi - P) * Math.sin(theta) / Math.cos(lat));
  var lng = cmd + L0;
  if (lng < 0) lng = lng + 2 * Math.PI;
  if (lng > 2 * Math.PI) lng = lng - 2 * Math.PI;
  return [lng, lat, cmd];
}


function hpc2radec(x, y, sun_ra, sun_de, sun_P) {
  var theta = Math.atan2(-Math.tan(x), Math.tan(y)) + sun_P;
  var rho = Math.atan(Math.sqrt(Math.tan(x)**2 + Math.tan(y)**2));
  var de = Math.asin(Math.sin(sun_de)*Math.cos(rho) + Math.cos(sun_de) * Math.sin(rho) * Math.cos(theta));
  var ra = Math.atan2(Math.sin(rho)*Math.sin(theta), Math.cos(rho)*Math.cos(sun_de)-Math.sin(rho)*Math.sin(sun_de)*Math.cos(theta)) + sun_ra;
  return [fmod2pi(ra), de];
}

function radec2hpc(ra, de, sun_ra, sun_de, sun_P) {
  // exact, but has roundoff errors because of cos
  // var rho = Math.acos(Math.cos(de)*Math.cos(sun_de)*Math.cos(ra-sun_ra) + Math.sin(de)*Math.sin(sun_de));
  // better way, haversine
  var rho = 2*Math.asin(Math.sqrt(Math.sin((de - sun_de)/2.0)**2 + Math.cos(sun_de) * Math.cos(de) * Math.sin((ra - sun_ra)/2.0)**2));
  var theta = Math.atan2(Math.sin(ra-sun_ra), Math.tan(de)*Math.cos(sun_de) - Math.sin(sun_de)*Math.cos(ra-sun_ra));
  var x = Math.atan(-Math.tan(rho)*Math.sin(theta-sun_P));
  var y = Math.atan(Math.tan(rho)*Math.cos(theta-sun_P));
  return [x, y];
}