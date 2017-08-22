/*
 * Javascript solar ephemeris tool functions
 * Copyright (c) 2015-2017 Ivica Skokic
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 */



//  don't forget to check if all tests have been removed before release (search for !!! or debug to find them)

// version 0.7  2017-04-12
// version 0.6  2016-12-05
// version 0.5  2016-11-28
// version 0.4  2016-04-13
// version 0.3  2016-03-04
var PROG_VERSION = "0.7";

// "use strict";


//Pointing class
function Pointing() {
  this.hpc = {x: null, y: null};  //helioprjective cartesian asthe basis fo
  this.date_obs = null;
  this.solar = { P: null, B0: null, L0: null, dsun_obs: null};
}

Pointing.prototype.setBy = function() {
  return this.firstName + " " + this.lastName;
};


function sign(x) {
  var a = 1 / x === 1 / Math.abs(x);
  if (a === true) return 1;
  else return -1;
}

function deg2dms(deg) {
  var d = trunc(deg);
  var t1 = (deg - d) * 60;
  var m = trunc(t1);
  var s = (t1 - m) * 60;
  return [d, m, s];
}

function dms2deg(d, m, s) {
  var deg = sign(d) * (Math.abs(d) + (m / 60.0) + (s / 3600.0));
  return deg;
}

function formatStr(s, count, alignLeft) {
  var i = s.length;
  while(i < count){
    if (alignLeft) s = s + " ";
    else s = " " + s;
    i++;
  }
  return s;
}

function formatNum(x, digits, decimals, leadingZeros, plusChar) {
  var s = Math.abs(x).toFixed(decimals);
  if (sign(x) < 0) s = "-" + s;
  else if (plusChar === true) s = "+" + s;
  var i = s.length;
  var c = s.substring(0, 1);
  var idx = 0;
  if (((c === "+") || (c === "-")) && (leadingZeros === true)) idx = 1;
  var leadChar = " ";
  if (leadingZeros === true) leadChar = "0";
  while(i < digits + idx){
    s = s.substring(0, idx) + leadChar + s.substring(idx, s.length);
    i++;
  }
  return s + "";
}

function formatRA(dms) {
  return formatNum(dms[0], 2, 0, true, false).concat(" ", formatNum(Math.abs(dms[1]), 2, 0, true, false)," ", formatNum(Math.abs(dms[2]), 5, 2, true, false));
}

function formatDEC(dms) {
  return formatNum(dms[0], 2, 0, true, true) + " " + formatNum(Math.abs(dms[1]), 2, 0, true, false) + " " + formatNum(Math.abs(dms[2]), 4, 1, true, false);
}

function change_user_interface() {
  var show_gui = document.getElementById("gui").checked;
  document.getElementById("input_fits").hidden = !show_gui;
  document.getElementById("visualization").hidden = !show_gui;
  document.getElementById("canvascontainer").hidden = !show_gui;
  document.getElementById("text_input").hidden = show_gui;
  document.getElementById("pointing").hidden = !show_gui;
}

function toggleLocation() {
  var change_loc = document.getElementById("changeLoc").checked;
  document.getElementById("selectObservatory").disabled = !change_loc;
  if (!change_loc) document.getElementById("selectObservatory").selectedIndex = 0;
  observatoryChange();
}

function updateCanvas() {
  var show_grid = document.getElementById("showheliogrid").checked;
  if ((show_grid === true) && (in_move === false)) drawCoordGrid(fits);
  var show_fov = document.getElementById("showALMAFOV").checked;
  if (show_fov === true) drawALMAFOV();
  var show_mosaic = document.getElementById("showmosaic").checked;
  if (show_mosaic === true) drawMosaic(fits);
  if (show_mosaic === true) document.getElementById("num_pointings").innerHTML = "Estimated min. no. of pointings for ALMA 12m array is " + String(estimateNumPointings()+".");
  else document.getElementById("num_pointings").innerHTML = "Estimated min. no. of pointings for ALMA 12m array is 1 (single pointing).";
  drawCrosshair(fits);
}

function updateFits(params) {
  fits.update(params);
  updateCanvas();
}

function zoom(zoomfactor) {
  var mx = document.getElementById("FITSimage").clientWidth;
  var my = document.getElementById("FITSimage").clientHeight;
  fits.zoom(zoomfactor, mx/2, my/2);
  updateCanvas();
}

function setLocationDisable(disabled){
  document.getElementById("obs_lat").disabled = disabled;
  document.getElementById("obs_lon").disabled = disabled;
  document.getElementById("obs_alt").disabled = disabled;

}

function observatoryChange() {
  var obs = document.getElementById("selectObservatory");
  var index = obs.options[obs.selectedIndex].value;
  var obs_lat = document.getElementById("obs_lat");
  var obs_lon = document.getElementById("obs_lon");
  var obs_alt = document.getElementById("obs_alt");
  switch (index) {
    case "alma":  //ALMA (-7)
      obs_lat.value = -23.029211;
      obs_lon.value = 292.245252;
      obs_alt.value = 5074.887;
      setLocationDisable(true);
      break;
    case "vla":  //VLA (-5)
      obs_lat.value =  34.0786848;
      obs_lon.value =  252.382300;
      obs_alt.value =  2115.291;
      setLocationDisable(true);
      break;
    case "nobeyama":  //Nobeyama
      obs_lat.value = 35.944524;
      obs_lon.value = 138.472492;
      obs_alt.value = 1413.0;
      setLocationDisable(true);
      break;
    case "ssrt":  //SSRT
      obs_lat.value = 51.759367;
      obs_lon.value = 102.2181258;
      obs_alt.value = 334.0;
      setLocationDisable(true);
      break;
    case "muser":  //MUSER
      obs_lat.value = 42.21185;
      obs_lon.value = 115.25053;
      obs_alt.value = 1365.0;
      setLocationDisable(true);
      break;
    case "geocenter":  //Geocenter (500)
      obs_lat.value = 0;
      obs_lon.value = 0;
      obs_alt.value = -6378160.0;
      setLocationDisable(true);
      break;
    default:  //use specified
      setLocationDisable(false);
  }
}

function setDiffRotDisable(disabled){
  document.getElementById("param_A").disabled = disabled;
  document.getElementById("param_B").disabled = disabled;
  document.getElementById("param_C").disabled = disabled;
}

function diffRotChange() {
  var diffRot = document.getElementById("selectDiffRot");
  var index = diffRot.options[diffRot.selectedIndex].value;
  var A = document.getElementById("param_A");
  var B = document.getElementById("param_B");
  var C = document.getElementById("param_C");
  var H = document.getElementById("param_height");
  H.disabled = false;
  switch (index) {
    case "earth_sync":  //Earth synchronized
      A.value = "-";
      B.value = "-";
      C.value = "-";
      H.value = 0;
      setDiffRotDisable(true);
      H.disabled = true;
      break;
    case "no_rot":  //no rotation
      A.value = 0;
      B.value = 0;
      C.value = 0;
      H.value = 0;
      setDiffRotDisable(true);
      break;
    case "solid":  //Carrington
      A.value = 14.1844;
      B.value = 0;
      C.value = 0;
      H.value = 0;
      setDiffRotDisable(true);
      break;
    case "sunspot":  //Sunspots
      A.value = 14.499;
      B.value = -2.64;
      C.value = 0;
      H.value = 0;
      setDiffRotDisable(true);
      break;
    case "halpha":  //Filaments
      A.value = 14.45;
      B.value = -0.11;
      C.value = -3.69;
      H.value = 40000;
      setDiffRotDisable(true);
      break;
    case "cbp":  //CBPs
      A.value = 14.499;
      B.value = -2.54;
      C.value = -0.77;
      H.value = 10000;
      setDiffRotDisable(true);
      break;
    default:  //use specified
      setDiffRotDisable(false);
  }
}

function showPreTextWindow(s) {
  var rect = document.getElementById("FITSimage").getBoundingClientRect();
  var x = window.open("", "", "width=400, height=400, scrollbars=yes, resizable=yes, top=" + rect.top + ", left=" + rect.left);
  x.document.write("<div><pre>"+String(s)+"</pre></div>");
  x.document.close();
}


function showFitsHeaderInWindow() {
  showPreTextWindow(String(fits.header_str));
}

function clearStatusBox() {
  document.getElementById("statusbox").value = "";
}

function addStatusBoxText(s) {
  var sold = document.getElementById("statusbox").value;
  if (sold != "") s = "\n" + s;
  document.getElementById("statusbox").value = document.getElementById("statusbox").value + s;
}

function addWarning(s) {
  addStatusBoxText("Warning: " + s);
}

function addError(s) {
  addStatusBoxText("Error: " + s);
}

function estimateNumPointings() {
  var w = document.getElementById("mosaic_p").value;
  var h = document.getElementById("mosaic_q").value;
  var band = document.getElementById("almaband").value;
  var bands = {"Band 3" : 100, "Band 4" : 152, "Band 5" : 194, "Band 6" : 239, "Band 7" : 336, "Band 8" : 416, "Band 9" : 669, "Band 10" : 861};
  var freq_GHz = bands[band];
  var fwhm = 1.13 * 0.3/freq_GHz/12 * RAD2DEG * 3600.0; //arcsec
  var nx = int(w/0.511/fwhm + 1);
  var ny = int(2*h/0.511/fwhm/Math.sqrt(3) + 1);
  return int((2.0*nx-1.0)*ny/2.0)
}

function drawALMAFOV(){
  if (!show_cross) return;
  var hdr = fits.header;
  var crpix = [hdr.CRPIX1, hdr.CRPIX2];
  var crval = [hdr.CRVAL1, hdr.CRVAL2];
  var cdelt = [hdr.CDELT1, hdr.CDELT2];
  var crota2 = hdr.CROTA2;
  var cunit = [hdr.CUNIT1, hdr.CUNIT2];
  var L0 = hdr.CRLN_OBS * DEG2RAD;
  var B0 = hdr.CRLT_OBS * DEG2RAD;
  var R = hdr.RSUN_REF;
  var D = hdr.DSUN_OBS;
  var band = document.getElementById("almaband").value;
  var bands = {"Band 3" : 100, "Band 4" : 152, "Band 5" : 194, "Band 6" : 239, "Band 7" : 336, "Band 8" : 416, "Band 9" : 669, "Band 10" : 861};
  var freq_GHz = bands[band];
  //var ang_res = 0.2 * (300 / freq_GHz) * (1.0 / max_baseline) * DEG2RAD / 3600.0;
  var primary_beam_12m = 20.6 * (300.0 / freq_GHz) * DEG2RAD / 3600.0;
  //var primary_beam_7m = 35.0 * (300.0 / freq_GHz) * DEG2RAD / 3600.0;
  var pix1 = hpc2pix(primary_beam_12m / 2.0, 0, crpix, crval, cdelt, crota2, cunit);
  var px1 = {x:pix1[0], y:pix1[1]};
  var pix2 = hpc2pix(0, 0, crpix, crval, cdelt, crota2, cunit);
  var px2 = {x:pix2[0], y:pix2[1]};
  var p1 = fits.data2screen(px1);
  var p2 = fits.data2screen(px2);
  var e = fits.data2screen(cross);
  var r = Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
  fits.ctx.strokeStyle = "white";
  fits.ctx.beginPath();
  //fits.ctx.arc(fits.canvas.width / 2, fits.canvas.height / 2, r, 0, 2*Math.PI); //to draw at image center
  fits.ctx.arc(e.x, e.y, r, 0, 2*Math.PI); //to draw at cross position
  fits.ctx.stroke();
  fits.ctx.strokeStyle = "black";
  fits.ctx.beginPath();
  //fits.ctx.arc(fits.canvas.width / 2, fits.canvas.height / 2, r + 1, 0, 2*Math.PI); //to draw at image center
  fits.ctx.arc(e.x, e.y, r + 1, 0, 2*Math.PI); //to draw at cross position
  fits.ctx.stroke();
  fits.ctx.closePath();
}

function drawMosaic(fits) {
  if (!show_cross) return;
  var hdr = fits.header;
  var crpix = [hdr.CRPIX1, hdr.CRPIX2];
  var crval = [hdr.CRVAL1, hdr.CRVAL2];
  var cdelt = [hdr.CDELT1, hdr.CDELT2];
  var crota2 = hdr.CROTA2;
  var cunit = [hdr.CUNIT1, hdr.CUNIT2];
  var L0 = hdr.CRLN_OBS * DEG2RAD;
  var B0 = hdr.CRLT_OBS * DEG2RAD;
  var R = hdr.RSUN_REF;
  var D = hdr.DSUN_OBS;
  var w = document.getElementById("mosaic_p").value / 2.0 * DEG2RAD / 3600.0;
  var h = document.getElementById("mosaic_q").value / 2.0 * DEG2RAD / 3600.0;
  var angle = DEG2RAD * document.getElementById("mosaic_angle").value;
  var p, p0, tx=[-w,w,w,-w], ty=[-h,-h,h,h], x, y, pix;
  var center = pix2hpc(cross.x, cross.y, crpix, crval, cdelt, crota2, cunit);

  fits.ctx.strokeStyle = "blue";
  fits.ctx.beginPath();
  for (var i = 0; i < 4; i++) {
    x = tx[i] * Math.cos(angle) - ty[i] * Math.sin(angle);
    y = tx[i] * Math.sin(angle) + ty[i] * Math.cos(angle);
    pix = hpc2pix(x + center[0], y + center[1], crpix, crval, cdelt, crota2, cunit);
    p = fits.data2screen({x:pix[0], y:pix[1]});
    if (i===0) {
      fits.ctx.moveTo(p.x, p.y);
      p0 = p;
    }
    else fits.ctx.lineTo(p.x, p.y);
  }
  fits.ctx.lineTo(p0.x, p0.y);
  fits.ctx.stroke();
  fits.ctx.closePath();

}

function drawCoordGrid(fits){
  fits.ctx.fillStyle = "gray";
  var hdr = fits.header;
  var crpix = [hdr.CRPIX1, hdr.CRPIX2];
  var crval = [hdr.CRVAL1, hdr.CRVAL2];
  var cdelt = [hdr.CDELT1, hdr.CDELT2];
  var crota2 = hdr.CROTA2;
  var cunit = [hdr.CUNIT1, hdr.CUNIT2];
  var L0 = hdr.CRLN_OBS * DEG2RAD;
  var B0 = hdr.CRLT_OBS * DEG2RAD;
  var R = hdr.RSUN_REF;
  var D = hdr.DSUN_OBS;
  var lat, lng, hcc, hpc, pix, px, p, x, y;
  var grid_type = document.getElementById("heliogridtype");
  var gd_index = grid_type.options[grid_type.selectedIndex].value;
  if (gd_index==0) L0 = 0;
  if (gd_index==2) {
    for (x = -1200  * DEG2RAD / 3600.0; x<1201 * DEG2RAD / 3600.0; x = x + 150 * DEG2RAD / 3600.0){
      for (y = -1200 * DEG2RAD / 3600.0; y<=1201 * DEG2RAD / 3600.0; y = y + 10 * DEG2RAD / 3600.0){
        pix = hpc2pix(x, y, crpix, crval, cdelt, crota2, cunit);
        px = {x:pix[0], y:pix[1]};
        p = fits.data2screen(px);
        fits.ctx.fillRect(p.x, p.y, 1, 1);
      }
    }
    for (y = -1200 * DEG2RAD / 3600.0; y<=1201 * DEG2RAD / 3600.0; y = y + 150 * DEG2RAD / 3600.0){
      for (x = -1200 * DEG2RAD / 3600.0; x<=1201 * DEG2RAD / 3600.0; x = x + 10 * DEG2RAD / 3600.0){
        pix = hpc2pix(x, y, crpix, crval, cdelt, crota2, cunit);
        px = {x:pix[0], y:pix[1]};
        p = fits.data2screen(px);
        fits.ctx.fillRect(p.x, p.y, 1, 1);
      }
    }
    return;
  }

  for (lat = -90; lat<90; lat = lat + 10){
    for (lng = 0; lng<360; lng++){
      hcc = hgs2hcc(DEG2RAD * lng, DEG2RAD * lat, R, B0, L0);
      if (hcc[2]>0){
        hpc = hcc2hpc(hcc[0], hcc[1], hcc[2], D);
        pix = hpc2pix(hpc[0], hpc[1], crpix, crval, cdelt, crota2, cunit);
        px = {x:pix[0], y:pix[1]};
        p = fits.data2screen(px);
        fits.ctx.fillRect(p.x, p.y, 1, 1);
      }
    }
  }
  for (lng = 0; lng<360; lng = lng + 10){
    for (lat = -80; lat<=80; lat++){
      hcc = hgs2hcc(DEG2RAD * lng, DEG2RAD * lat, R, B0, L0);
      if (hcc[2]>0){
        hpc = hcc2hpc(hcc[0], hcc[1], hcc[2], D);
        pix = hpc2pix(hpc[0], hpc[1], crpix, crval, cdelt, crota2, cunit);
        px = {x:pix[0], y:pix[1]};
        p = fits.data2screen(px);
        fits.ctx.fillRect(p.x, p.y, 1, 1);
      }
    }
  }
}


function createURLObject(file){
  if (window.webkitURL){
    return window.webkitURL.createObjectURL(file);
  } else if (window.URL && window.URL.createObjectURL){
    return window.URL.createObjectURL(file);
  } else { return null;}
}

function downloadTableData() {
  var jpl = document.getElementById("JPLHorizons").value;
  var data = new Blob([jpl]);
  var dnld = document.getElementById("dnloadData");
  var d = new Date();
  dnld.download = d.toISOString().substr(0,19).replace(/-/g,"").replace(/:/g,"") + "_solar_ephem.txt";
  dnld.href = createURLObject(data);
}

function drawCrosshair(fits) {
  if (!show_cross) return;
  var e = fits.data2screen(cross);
  fits.ctx.strokeStyle = "lime";
  fits.ctx.beginPath();
  fits.ctx.moveTo(e.x - 10, e.y);
  fits.ctx.lineTo(e.x + 10, e.y);
  fits.ctx.moveTo(e.x, e.y - 10);
  fits.ctx.lineTo(e.x, e.y + 10);
  fits.ctx.stroke();
  fits.ctx.closePath();
}


function loadFITS(fitsurl){
  fits.ctx.font = "20px Georgia";
  fits.ctx.strokeStyle = "lime";
  fits.ctx.fillStyle = "lime";
  fits.ctx.fillText("Loading...", 50, 50);
  if (fitsurl.indexOf("local_")==0) {
    var url = fitsurl.substr(6);
    fits.load(url);
  } else if (fitsurl.indexOf("test_")==0) {
    fits.load(fitsurl);
  } else {
    var url = "fitsproxy.php?" + fitsurl;
    fits.load(url);
  }
}





// Parameters used for JPL Horizons batch interface
/*
COMMAND= '10'
CENTER= '-7@399'
MAKE_EPHEM= 'YES'
TABLE_TYPE= 'OBSERVER'
START_TIME= '2015-04-23T12:20:33'
STOP_TIME= '2015-04-25T12:20:33'
STEP_SIZE= '26 m'
CAL_FORMAT= 'CAL'
TIME_DIGITS= 'MINUTES'
ANG_FORMAT= 'HMS'
OUT_UNITS= 'KM-S'
RANGE_UNITS= 'AU'
APPARENT= 'AIRLESS'
SOLAR_ELONG= '0,180'
SUPPRESS_RANGE_RATE= 'NO'
SKIP_DAYLT= 'NO'
EXTRA_PREC= 'NO'
R_T_S_ONLY= 'NO'
REF_SYSTEM= 'J2000'
CSV_FORMAT= 'NO'
OBJ_DATA= 'YES'
QUANTITIES= '1,20'
*/

function prepareLocation() {
  var obs = document.getElementById("selectObservatory");
  var index = obs.options[obs.selectedIndex].value;
  var obs_lat = document.getElementById("obs_lat");
  var obs_lon = document.getElementById("obs_lon");
  var obs_alt = document.getElementById("obs_alt");
  var jpl_code = "CENTER=%27-7@399%27"; //ALMA, default location
  switch (index) {
    case "alma":  //ALMA (-7)
      jpl_code = "CENTER=%27-7@399%27";
      break;
    case "vla":  //VLA (-5)
      jpl_code = "CENTER=%27-5@399%27";
      break;
    case "nobeyama":  //Nobeyama
      jpl_code = "CENTER=%27coord@399%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%27+138.472492,+35.944524,1.413%27";
      break;
    case "ssrt":  //SSRT
      jpl_code = "CENTER=%27coord@399%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%27102.2181258,51.759367,0.334%27";
      break;
    case "muser":  //MUSER
      jpl_code = "CENTER=%27coord@399%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%27115.25053,42.21185,1.365%27";
      break;
    case "geocenter":  //Geocenter (500)
      jpl_code = "CENTER=%27500@399%27";
      break;
    case "user":  //user specified
      jpl_code = "CENTER=%27coord@399%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%27"+obs_lon.value+","+obs_lat.value+","+String(obs_alt.value/1000.0)+"%27";
      break;
    default:  //ALMA
      jpl_code = "CENTER=%27-7@399%27";
  }
  return jpl_code;
}

function prepareJPLQuery(start_time, stop_time, step_size, quantities) {
  var action = "jplhorizons.php";
  var loc_code = prepareLocation();
  var querystring = "?batch=1&COMMAND=%2710%27&"+loc_code+"&MAKE_EPHEM=%27YES%27&TABLE_TYPE=%27OBSERVER%27&START_TIME=%27";
  querystring = querystring.concat(start_time, "&STOP_TIME=%27", stop_time, "%27&STEP_SIZE=%27", step_size, "%20m%27&QUANTITIES=%27", quantities, "%27&CSV_FORMAT=%27NO%27");
  return action + querystring;
}

function prepareJPLQueryFromCurrentForm(quantities) {
  var start_time = document.getElementById("obstimestart").value;
  var stop_time = document.getElementById("obstimeend").value;
  var step_size = document.getElementById("stepsize").value;
  return prepareJPLQuery(start_time, stop_time, step_size, quantities);
}

function showOriginalJPLData() {
  clearStatusBox();
  document.getElementById("JPLHorizons").value = "Please wait...";
  var url = prepareJPLQueryFromCurrentForm("1,20");
  $.get(url)
    .done(function(data) {
      document.getElementById("JPLHorizons").value = data;
    })
    .fail(function() {
      document.getElementById("JPLHorizons").value = "Error occured retrieving data from JPL Horizons.";
    })
}


function formatTableRowAsInfo(s, idx, tags, jd, ra, de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0) {
  var tblascii = "";
  tblascii = tblascii + " " + s[0] + " " + s[1] + " " + formatNum(jd, 16, 6, false, false) + "  ";
  tblascii = tblascii + formatRA(deg2dms(ra/15.0*RAD2DEG)) + " " + formatDEC(deg2dms(de*RAD2DEG)) + "  ";
  tblascii = tblascii + formatRA(deg2dms(sun_ra/15.0*RAD2DEG)) + " " + formatDEC(deg2dms(sun_de*RAD2DEG)) + "  ";
  tblascii = tblascii + s[12 + idx] + " " + formatStr(s[13 + idx], 11, false) + "    ";
  tblascii = tblascii + formatNum(3600.0 * RAD2DEG * (ra-sun_ra), 8, 3, false, false) + "     ";
  tblascii = tblascii + formatNum(3600.0 * RAD2DEG * (de-sun_de), 8, 3, false, false) + "   ";
  tblascii = tblascii + formatNum(3600.0 * RAD2DEG * hpc[0], 8, 3, false, false) + "   ";
  tblascii = tblascii + formatNum(3600.0 * RAD2DEG * hpc[1], 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * CMD, 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * L, 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * B, 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * P0, 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * B0, 8, 3, false, false) + "  ";
  tblascii = tblascii + formatNum(RAD2DEG * L0, 8, 3, false, false) + " ";
  tblascii = tblascii + "\n";
  return tblascii;
}

function formatTableRowAsJPL(s, idx, tags, jd, ra, de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0) {
  var tblascii = "";
  tblascii = tblascii + " " + s[0] + " " + s[1] + " ";
  tblascii = tblascii + tags + " ";
  tblascii = tblascii + formatRA(deg2dms(ra/15.0*RAD2DEG))+" "+formatDEC(deg2dms(de*RAD2DEG));
  tblascii = tblascii + " " + s[12 + idx] + " " + formatStr(s[13 + idx], 11, false) + "\n";
  return tblascii;
}

function formatTableRow(table_type, s, idx, tags, jd, ra, de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0) {
  var tblascii = "";
  if (table_type === "tab_jpl") tblascii = formatTableRowAsJPL(s, idx, tags, jd, ra, de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0);
  if (table_type === "tab_info") tblascii = formatTableRowAsInfo(s, idx, tags, jd, ra, de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0);
  return tblascii;
}


function finalizeJPLTable(tblascii, date_ref, fits, data, th, feature, height, use_diffrot, A, B, C, P0, B0, L0, dsun_obs) {
  tblascii = tblascii + data.match(/(\$\$EOE[\S\s]*?)\sOb-lon\sOb-lat\s=/)[1];
  tblascii = tblascii + data.match(/\sdelta\s\sdeldot\s=[\S\s]*/);
  tblascii = tblascii.replace("QUANTITIES = '1,14,17,20'","QUANTITIES = '1,20'");
  //tblascii = tblascii.replace(/(\*{80,})/g,"*".repeat(80)); //repeat is not available in many browsers
  var aster = Array(81).join("*");
  tblascii = tblascii.replace(/(\*{80,})/g, aster);
  //add user info
  var gui_used = document.getElementById("gui").checked;
  var d = new Date();
  var user_info = "ALMA Solar Observing Parameters (added by the ALMA Solar Ephemeris Generator)\n";
  user_info = user_info.concat(("Generated on    : " + d.toISOString().substr(0, 22) + "\n").substr(0, 80));
  user_info = user_info.concat(("Generator       : Solar Ephemeris Generator v"+PROG_VERSION+ "\n").substr(0,80));
  user_info = user_info.concat(("Ref. obs. date  : " + date_ref.toISOString().substr(0, 22) + "\n").substr(0, 80));
  if (gui_used == "true") {
    user_info = user_info.concat(("Image origin    : " + fits.header["ORIGIN"] + "\n").substr(0, 80));
    user_info = user_info.concat(("Telescope       : " + fits.header["TELESCOP"] + "\n").substr(0, 80));
    user_info = user_info.concat(("Wavelength      : " + fits.header["WAVELNTH"] + "\n").substr(0, 80));
  }
  user_info = user_info.concat(("Target hpc      : x=" + (th[0] * RAD2DEG * 3600.0).toFixed(2) + " y=" + (th[1] * RAD2DEG * 3600.0).toFixed(2) + " arcsec\n").substr(0, 80));
  user_info = user_info.concat(("Target Carring. : L=" + (feature.L * RAD2DEG).toFixed(3) + " B=" + (feature.B * RAD2DEG).toFixed(3) + " deg\n").substr(0, 80));
  user_info = user_info.concat(("Target height   : " + height.toFixed(0) + " km\n").substr(0,80));
  user_info = user_info.concat(("Sun orientation : P=" + (P0 * RAD2DEG).toFixed(3) + " B0=" + (B0 * RAD2DEG).toFixed(3) + " L0=" + (L0 * RAD2DEG).toFixed(3) + " deg\n").substr(0, 80));
  user_info = user_info.concat(("Sun distance    : " + (dsun_obs).toFixed(3) + " m\n").substr(0, 80));
  if (isNaN(feature.L)) user_info = user_info.concat(("Dif.rot. profile: not used (feature outside solar disc)\n").substr(0, 80));
  else if (!use_diffrot) user_info = user_info.concat(("Dif.rot. profile: not used (Earth-synchronized rotation)\n").substr(0, 80));
  else user_info = user_info.concat(("Dif.rot. profile: A=" + A.toFixed(3) + " B=" + B.toFixed(3) + " C=" + C.toFixed(3) + " deg/day\n").substr(0, 80));
  if (gui_used == true) {
    var p = document.getElementById("mosaic_p").value;
    var q = document.getElementById("mosaic_q").value;
    var angle = document.getElementById("mosaic_angle").value;
    var show_mosaic = document.getElementById("showmosaic").checked;
    if (show_mosaic === true) user_info = user_info.concat(("Mosaic          : p=" + p + " q=" + q + " arcsec, angle=" + angle + " deg (sky_angle=" + (parseFloat(angle)+P0*RAD2DEG).toFixed(1)+" deg)\n").substr(0, 80));
    else user_info = user_info.concat(("Mosaic          : no\n").substr(0, 80));
  }
  //user_info = user_info.concat("*".repeat(80) + "\n");//repeat is not available in many browsers
  user_info = user_info.concat(aster + "\n");
  var idx = tblascii.indexOf(" Date__(UT)__HR:MN"); //watch out, if obs date supplied to JPL is 0 sec e.g. 12:23:00 it will trim the result data to HR:MN, otherwise it is HR:MN:SS
  tblascii = tblascii.substr(0, idx) + user_info + tblascii.substr(idx);
  return tblascii;
}

function generateTable(table_type) {
  clearStatusBox();
  document.getElementById("JPLHorizons").value = "Please wait...";
  var url = prepareJPLQueryFromCurrentForm("1,14,17,20");
  //url = "test_alma_all.txt"; // !!! debug
  var jd, CMD;
  var month = {"Jan" : "01", "Feb" : "02", "Mar" : "03", "Apr" : "04", "May" : "05", "Jun" : "06", "Jul" : "07", "Aug" : "08", "Sep" : "09", "Oct" : "10", "Nov" : "11", "Dec" : "12"};
  $.get(url).done(function(jpldata) {
    var orig_jpl_data = jpldata;
    var ephem = jpldata.match(/\$\$SOE([\S\s]*?)\$\$EOE/)[1];
    ephem = (" " + ephem.trim()).split("\n");
    var tblascii = "";
    if (table_type === "tab_jpl") {
      tblascii = tblascii + jpldata.match(/^[\S\s]*?R.A._\(ICRF\/J2000\.0\)_DEC/);
      tblascii = tblascii + jpldata.match(/\s{12}delta\s{6}deldot[\S\s]*?\$\$SOE/) + "\n";
    }
    if (table_type === "tab_info") {
      tblascii = tblascii + jpldata.match(/ Date__\(UT\)_(.*?) /)[0];
      tblascii = tblascii + "  JD              R.A._(ICRF/J2000.0)_DEC  Sun_RA_DEC(ICRF/J2000.0)         delta      deldot     dRA_arcsec  dDEC_arcsec   x_arcsec   y_arcsec   CMD_deg     L_deg     B_deg     P_deg    B0_deg    L0_deg\n";
    }
    var difrot = {A:0, B:0, C:0};
    var use_difrot = document.getElementById("selectDiffRot").selectedIndex > 0;
    if (use_difrot){
      difrot.A = parseFloat(document.getElementById("param_A").value);
      difrot.B = parseFloat(document.getElementById("param_B").value);
      difrot.C = parseFloat(document.getElementById("param_C").value);
    }
    var height = parseFloat(document.getElementById("param_height").value);
    var th, s, tags, d, date_obs, date_ref, dt, idx, sun_ra, sun_de, L0, B0, P0, D, L, B, hcc, hpc, hgc, new_ra, new_de, on_back_side;
    var ref_sunP, ref_sunB0, ref_sunL0, ref_sunD, sky;
    var hdr = fits.header;
    var gui_used = document.getElementById("gui").checked;
    if (gui_used == true) {
      date_ref = new Date(fits.header["DATE-OBS"] + "Z");
      ref_sunP = 0.0;
      ref_sunB0 = DEG2RAD * parseFloat(hdr.CRLT_OBS);
      ref_sunL0 = DEG2RAD * parseFloat(hdr.CRLN_OBS);
      ref_sunD = parseFloat(hdr.DSUN_OBS);
      th = pix2hpc(cross.x, cross.y, [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      hcc = hpc2hcc(th[0], th[1], ref_sunD, RSUN_REF + height * 1000.0);
      hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], ref_sunB0, ref_sunL0);
    } else {
      date_ref = new Date(document.getElementById("override_dateobs").value + "Z");
      var thx = DEG2RAD/3600.0 * parseFloat(document.getElementById("override_hpc_x").value);
      var thy = DEG2RAD/3600.0 * parseFloat(document.getElementById("override_hpc_y").value);
      ref_sunP = DEG2RAD * parseFloat(document.getElementById("override_P0").value);
      ref_sunB0 = DEG2RAD * parseFloat(document.getElementById("override_B0").value);
      ref_sunL0 = DEG2RAD * parseFloat(document.getElementById("override_L0").value);
      ref_sunD = parseFloat(document.getElementById("override_dsunobs").value);
      th = [thx, thy];
      hcc = hpc2hcc(th[0], th[1], ref_sunD, RSUN_REF + height * 1000.0);
      hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], ref_sunB0, ref_sunL0);
    }
    feature.L = hgc[0];
    feature.B = hgc[1];
    feature.R = hgc[2];
    for (var i = 0; i < ephem.length; i++){
      s = ephem[i].trim().match(/\S+/g);
      tags = ephem[i].substr((" " + s[0] + " " + s[1] + " ").length, 3);
      d = s[0].split("-");
      date_obs = new Date(d[0] + "-" + month[d[1]] + "-" + d[2] + "T" + s[1] + "Z");
      dt = (date_obs - date_ref)/(1000.0 * 3600 * 24.0);
      idx = s.length - 14;
      if ((idx > 1) || (idx < 0)){
        addError("unexpected number of columns in JPL Horizons file " + s.length);
      }
      if (Math.abs(dt)>3.0){
        addWarning("Predicting positions for more than 3 days from the image reference date - the ephemeris might not be accurate (beacuse of proper motions of solar features etc.)");
      }
      sun_ra = DEG2RAD * 15 * dms2deg(s[2 + idx], s[3 + idx], s[4 + idx]);
      sun_de = DEG2RAD * dms2deg(s[5 + idx], s[6 + idx], s[7 + idx]);
      L0 = DEG2RAD * parseFloat(s[8 + idx]);
      B0 = DEG2RAD * parseFloat(s[9 + idx]);
      P0 = DEG2RAD * parseFloat(s[10 + idx]);
      D = DSUN_REF * parseFloat(s[12 + idx]);
      jd = julianDay(date_obs.getUTCFullYear(), date_obs.getUTCMonth()+1, date_obs.getUTCDate(), date_obs.getUTCHours(), date_obs.getUTCMinutes(), date_obs.getUTCSeconds());

      L = feature.L;
      B = feature.B;
      hpc = th;
      on_back_side = false;

      if (!isNaN(L) && use_difrot) { //if feature is on the disk and diff. rot. profile is specified
        L = rotateDifferentialy(dt, B, L, difrot.A, difrot.B, difrot.C);
        hcc = hgs2hcc(L, feature.B, RSUN_REF + height * 1000.0, B0, L0);
        on_back_side = hcc[2] < 0;
        if (!on_back_side){
          hpc = hcc2hpc(hcc[0], hcc[1], hcc[2], D);
        }
      } else {
        hcc = hpc2hcc(th[0], th[1], D, RSUN_REF + height * 1000.0);
        hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], B0, L0);
        L = hgc[0];
        B = hgc[1];
      }

      CMD = fmod2pi(L - L0);
      if (CMD > Math.PI) CMD = CMD - 2 * Math.PI;

      if (on_back_side){
        tblascii = tblascii + " " + s[0] + " " + s[1] + " " + "Not visibe (on the back side of the Sun)\n";
        addWarning(" ephemeris on " + s[0] + " " + s[1] + ": feature on the back side of the Sun");
      } else {
        //rotate from solar coordinates to sky coordinates
        sky = hpc2radec(hpc[0], hpc[1], sun_ra, sun_de, P0);
        new_ra = sky[0];
        new_de = sky[1];
        tblascii = tblascii + formatTableRow(table_type, s, idx, tags, jd, new_ra, new_de, sun_ra, sun_de, hpc, CMD, L, B, P0, B0, L0);
      }
    }
    if (table_type === "tab_jpl") tblascii = finalizeJPLTable(tblascii, date_ref, fits, orig_jpl_data, th, feature, height, use_difrot, difrot.A, difrot.B, difrot.C, ref_sunP, ref_sunB0, ref_sunL0, ref_sunD);
    document.getElementById("JPLHorizons").value = tblascii;
  }).fail(function(){document.getElementById("JPLHorizons").value = "Error generating file.";});
}


function getJPLHorizonsSolarParams() {
  var dateobs = document.getElementById("override_dateobs").value;
  var d = new Date(dateobs + "Z");
  d.setSeconds(d.getSeconds() + 2);
  var s = d.toISOString();
  var stoptime = s.substring(0, s.length - 5);
  var url = prepareJPLQuery(dateobs, stoptime, 5, "1,14,17,20");
  //url = "test_alma_all.txt"; // !!! debug
  $.get(url).done(function(jpldata) {
    var ephem = jpldata.match(/\$\$SOE([\S\s]*?)\$\$EOE/)[1];
    ephem = (" " + ephem.trim()).split("\n");
    var s, idx, ra, de, L0, B0, P0, D;
    if (ephem.length == 1) {
      s = ephem[0].trim().match(/\S+/g);
      idx = s.length - 14;
      if ((idx > 1) || (idx < 0)){
        addError("unexpected number of columns in JPL Horizons file " + s.length);
      }
      ra = 15 * dms2deg(s[2 + idx], s[3 + idx], s[4 + idx]);
      de = dms2deg(s[5 + idx], s[6 + idx], s[7 + idx]);
      L0 = parseFloat(s[8 + idx]);
      B0 = parseFloat(s[9 + idx]);
      P0 = parseFloat(s[10 + idx]);
      D = DSUN_REF * parseFloat(s[12 + idx]);
      document.getElementById("override_dsunobs").value = D.toFixed(3); //formatNum(D, 8, 3, false, false);
      document.getElementById("override_P0").value = P0.toFixed(3); //formatNum(P0, 8, 3, false, false);
      document.getElementById("override_B0").value = B0.toFixed(3); //formatNum(B0, 8, 3, false, false);
      document.getElementById("override_L0").value = L0.toFixed(3); //formatNum(L0, 8, 3, false, false);
    } else {
      addError("unexpected number of rows in JPL Horizons file " + ephem.length);
    }
  }).fail(function(){document.getElementById("JPLHorizons").innerHTML = "Error getting data from JPL Horizons.";});
}


function updateMosaic(sender) {
  var show_mosaic = document.getElementById("showmosaic").checked;
//        if (show_mosaic === true) drawMosaic(fits);
  document.getElementById("mosaic_p").disabled = !show_mosaic;
  document.getElementById("mosaic_q").disabled = !show_mosaic;
  document.getElementById("mosaic_angle").disabled = !show_mosaic;
  fits.redraw();
  updateCanvas();
}

function updateCoords(sender){
  if (disable_input===true) return;
  disable_input = true;
  //var height = parseFloat(document.getElementById('param_height').value);
  //if (height==null) height = 0;
  var height = 0;
  var hdr = fits.header;
  switch (sender.id) {
    case "in_pixel_x":
    case "in_pixel_y":
      var px = document.getElementById('in_pixel_x').value;
      var py = document.getElementById('in_pixel_y').value;
      var th = pix2hpc(px, py, [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      var hcc = hpc2hcc(th[0], th[1], hdr.DSUN_OBS, RSUN_REF + height * 1000.0);
      var hgs = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * 0);
      var hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * hdr.CRLN_OBS);
      document.getElementById('in_hpc_x').value = (th[0] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hpc_y').value = (th[1] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hgs_l').value = (hgs[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgs_b').value = (hgs[1] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_l').value = (hgc[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_b').value = (hgc[1] * RAD2DEG).toFixed(3);
      break;
    case "in_hpc_x":
    case "in_hpc_y":
      var tx = document.getElementById('in_hpc_x').value * DEG2RAD / 3600.0;
      var ty = document.getElementById('in_hpc_y').value * DEG2RAD / 3600.0;
      var px = hpc2pix(tx, ty, [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      var hcc = hpc2hcc(tx, ty, hdr.DSUN_OBS, RSUN_REF + height * 1000.0);
      var hgs = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * 0);
      var hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * hdr.CRLN_OBS);
      document.getElementById('in_pixel_x').value = px[0].toFixed(2);
      document.getElementById('in_pixel_y').value = px[1].toFixed(2);
      document.getElementById('in_hgs_l').value = (hgs[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgs_b').value = (hgs[1] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_l').value = (hgc[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_b').value = (hgc[1] * RAD2DEG).toFixed(3);
      break;
    case "in_hgs_l":
    case "in_hgs_b":
      var hgs_l = document.getElementById('in_hgs_l').value * DEG2RAD;
      var hgs_b = document.getElementById('in_hgs_b').value * DEG2RAD;
      var hcc = hgs2hcc(hgs_l, hgs_b, RSUN_REF + height * 1000.0, DEG2RAD * hdr.CRLT_OBS, DEG2RAD * 0);
      var th = hcc2hpc(hcc[0], hcc[1], hcc[2], hdr.DSUN_OBS);
      var px = hpc2pix(th[0], th[1], [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      var hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * hdr.CRLN_OBS);
      document.getElementById('in_pixel_x').value = px[0].toFixed(2);
      document.getElementById('in_pixel_y').value = px[1].toFixed(2);
      document.getElementById('in_hpc_x').value = (th[0] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hpc_y').value = (th[1] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hgc_l').value = (hgc[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_b').value = (hgc[1] * RAD2DEG).toFixed(3);
      break;
    case "in_hgc_l":
    case "in_hgc_b":
      var hgc_l = document.getElementById('in_hgc_l').value * DEG2RAD;
      var hgc_b = document.getElementById('in_hgc_b').value * DEG2RAD;
      var hcc = hgs2hcc(hgc_l, hgc_b, RSUN_REF + height * 1000.0, DEG2RAD * hdr.CRLT_OBS, DEG2RAD * hdr.CRLN_OBS);
      var th = hcc2hpc(hcc[0], hcc[1], hcc[2], hdr.DSUN_OBS);
      var px = hpc2pix(th[0], th[1], [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      var hgs = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * 0);
      document.getElementById('in_pixel_x').value = px[0].toFixed(2);
      document.getElementById('in_pixel_y').value = px[1].toFixed(2);
      document.getElementById('in_hpc_x').value = (th[0] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hpc_y').value = (th[1] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hgs_l').value = (hgs[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgs_b').value = (hgs[1] * RAD2DEG).toFixed(3);
      break;
    default:
      var px = cross.x;
      var py = cross.y;
      var th = pix2hpc(px, py, [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
      var hcc = hpc2hcc(th[0], th[1], hdr.DSUN_OBS, RSUN_REF + height * 1000.0);
      var hgs = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * 0);
      var hgc = hcc2hgs(hcc[0], hcc[1], hcc[2], DEG2RAD * hdr.CRLT_OBS, DEG2RAD * hdr.CRLN_OBS);
      document.getElementById('in_pixel_x').value = (px * 1.0).toFixed(2);
      document.getElementById('in_pixel_y').value = (py * 1.0).toFixed(2);
      document.getElementById('in_hpc_x').value = (th[0] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hpc_y').value = (th[1] * RAD2DEG * 3600).toFixed(2);
      document.getElementById('in_hgs_l').value = (hgs[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgs_b').value = (hgs[1] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_l').value = (hgc[0] * RAD2DEG).toFixed(3);
      document.getElementById('in_hgc_b').value = (hgc[1] * RAD2DEG).toFixed(3);
  }
  feature.L = hgc[0];
  feature.B = hgc[1];
  feature.R = hgc[2];
  // for off the limb feature, disable diff rot
  var isDisabled = isNaN(hgc[0]);
  if (isDisabled) {
    document.getElementById("selectDiffRot").value = "earth_sync";
    diffRotChange();
  }
  document.getElementById("selectDiffRot").disabled = isDisabled;
  /*       document.getElementById("param_A").disabled = isDisabled;
         document.getElementById("param_B").disabled = isDisabled;
         document.getElementById("param_C").disabled = isDisabled;
         document.getElementById("param_height").disabled = isDisabled;*/
  //remember target pos
  cross.x = document.getElementById("in_pixel_x").value;
  cross.y = document.getElementById("in_pixel_y").value;
  fits.redraw();
  updateCanvas();
  disable_input = false;
}



var fits = new FITS();
var mx;
var my;
var oldx;
var oldy;
var mouse_down = false;
var mouse_panned = false;
var show_cross = false;
var show_grid = true;
var cross = {x:0, y:0};
var feature = {L:0, B:0, R:0};
var disable_input = false;
var in_move = false;
fits.setZoomLimits(0.1,20);


fits.bind("click", function(e){
  //document.getElementById('status').innerHTML ='click=(' + e.x + ',' + e.y + ')';
  if (!mouse_panned){
    show_cross = true;
    cross = this.screen2data(e);
    updateCoords(document.getElementById("FITSimage"));
  }
  mouse_panned = false;
  in_move = false;
}).bind("mousemove", function(e){
  mx = e.x; my = e.y;
  var scale = this.scale;
  var px = ((mx - this.x0) / scale);
  var py = (this.height + (this.y0 - my) / scale);
  var index = Math.round(py) * this.width + Math.round(px);
  var value = null;
  if (this.image == null) return;
  var hdr = this.header;
  if ((px>=0) & (px<this.width) & (py>=0) & (py<this.height)) value = this.image[index];
  var th = pix2hpc(px, py, [hdr.CRPIX1, hdr.CRPIX2], [hdr.CRVAL1, hdr.CRVAL2], [hdr.CDELT1, hdr.CDELT2], hdr.CROTA2, [hdr.CUNIT1, hdr.CUNIT2]);
  document.getElementById("status").innerHTML = "cursor (wcs) = (" + (th[0] * RAD2DEG * 3600).toFixed(2) + "," + (th[1] * RAD2DEG * 3600).toFixed(2) + "), intensity = " + value;
  if (mouse_down === true) {
    mouse_panned = true;
    in_move = true;
    this.pan(mx - oldx, my - oldy);
    updateCanvas();
    oldx = mx;
    oldy = my;
  }
}).bind("load", function(){
  if ((typeof this.image == "undefined") || (this.image == null)){
    alert("error");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "20px Georgia";
    this.ctx.strokeStyle = "lime";
    this.ctx.fillStyle = "lime";
    this.ctx.fillText("Error", 50, 50);
  }
  document.getElementById("dateobs").innerHTML = this.header["DATE-OBS"];
  document.getElementById("bitpix").innerHTML = this.header.BITPIX;
  document.getElementById("depth").innerHTML = this.depth;
  document.getElementById("width").innerHTML = this.width;
  document.getElementById("height").innerHTML = this.height;
  document.getElementById("z").value = 0;
  document.getElementById("override_dateobs").innerHTML = this.header["DATE-OBS"];
  document.getElementById("override_dsunobs").innerHTML = this.header["DSUN_OBS"];
  document.getElementById("override_B0").innerHTML = this.header["CRLT_OBS"];
  document.getElementById("override_L0").innerHTML = this.header["CRLN_OBS"];
  show_cross = false;
  mouse_panned = false;
  mouse_down = false;
  this.draw("FITSimage");
  updateCanvas();
})

fits.load("AIAlocal.fits");

$(document).ready(function() {
  change_user_interface();
  toggleLocation();
  diffRotChange();

  var d = new Date();
  var s = d.toISOString();
  document.getElementById("obstimestart").value = s.substring(0, s.length - 5);
  d.setDate(d.getDate() + 2);
  s = d.toISOString();
  document.getElementById("obstimeend").value = s.substring(0, s.length - 5);
  $("#history").load("history.txt");

  var canvas = document.getElementById("FITSimage");
  if (canvas.addEventListener) {
    canvas.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera
    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox
  } else canvas.attachEvent("onmousewheel", MouseWheelHandler); // IE 6/7/8
  canvas.addEventListener("touchstart", touchStartHandler, false);
  canvas.addEventListener("touchend", touchEndHandler, false);
  canvas.addEventListener("touchmove", touchMoveHandler, false);
  canvas.addEventListener("touchcancel", touchEndHandler, false);

  window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    addError(errorMsg+" ("+lineNumber+")");//or any message
    return false;
  }

  canvas.onmousedown = function(e){
    oldx = mx;
    oldy = my;
    mouse_down = true;
  }

  canvas.onmouseup = function(e){
    mouse_down = false;
    in_move = false;
    updateCoords(document.getElementById("FITSimage"));
  }

});



var ongoingTouches = [];
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}


function touchStartHandler(e) {
  e.preventDefault();
  var atouches = e.changedTouches;
  for (var i = 0; i < atouches.length; i++) {
    ongoingTouches.push({ identifier: atouches[i].identifier, pageX: atouches[i].pageX, pageY: atouches[i].pageY, clientX: atouches[i].clientX, clientY: atouches[i].clientY});
  }
}


function touchEndHandler(e) {
  e.preventDefault();
  var atouches = e.changedTouches;
  if (!in_move){
    show_cross = true;
    var canvas = document.getElementById("FITSimage");
    var rect = canvas.getBoundingClientRect();
    var pt = {x:(ongoingTouches[0].clientX - rect.left), y:(ongoingTouches[0].clientY - rect.top)};
    cross = fits.screen2data(pt);
  }
  in_move = false;
  updateCoords(document.getElementById("FITSimage"));
  for (var i = 0; i < atouches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }

}



function touchMoveHandler(e) {
  //var atouches = e.changedTouches;
  var idx = ongoingTouchIndexById(e.changedTouches[0].identifier);
  if (idx>=0) {
    in_move = true;
    var dx = e.changedTouches[0].pageX - ongoingTouches[idx].pageX;
    var dy = e.changedTouches[0].pageY - ongoingTouches[idx].pageY;
    ongoingTouches.splice(idx, 1);
    ongoingTouches.splice(idx, 1);
    ongoingTouches.push({ identifier: e.changedTouches[0].identifier, pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY});
    fits.pan(dx, dy);
    updateCanvas();
  }
  e.preventDefault();
  return false;
}


function MouseWheelHandler(e) {
  // cross-browser wheel delta
  var e = window.event || e; // old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  var zoomfactor;
  if (delta<0) zoomfactor = 1.12;
  else zoomfactor = 1 / 1.12;

  fits.zoom(zoomfactor, mx, my);
  updateCanvas();
  e.preventDefault();
  return false;
}
