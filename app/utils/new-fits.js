/*
 * Javascript FITS Reader 0.2
 * Copyright (c) 2010 Stuart Lowe http://lcogt.net/
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 * Requires Jacob Seidelin's binaryajax.js from http://www.nihilogic.dk/labs/exif/
 *
 * 2015-03-02 Modified by I. Skokic
 *  - added support for 32 integer FITS
 *  - rendering to off-screen canvas
 *  - pan/zoom support
 * 2016-11-26 Modified by I. Skokic
 *  - added support for 64 bit float FITS
 *  - support for loading of local files through html5 file api
 */


// "use strict";


// Helpful functions

// Cross-browser way to add an event
if(typeof addEvent!="function") {
  function addEvent(oElement, strEvent, fncHandler) {
    if (oElement.addEventListener) oElement.addEventListener(strEvent, fncHandler, false);
    else if(oElement.attachEvent) oElement.attachEvent("on" + strEvent, fncHandler);
  }
}

// Cross-browser way to remove an event
if(typeof removeEvent!="function") {
  function removeEvent(oElement, strEvent, fncHandler) {
    if (oElement.removeEventListener) oElement.removeEventListener(strEvent, fncHandler, false);
    else if(oElement.detachEvent) oElement.detachEvent("on" + strEvent, fncHandler);
  }
}


function trim(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, "");
  s = s.replace(/[ ]{2,}/gi, " ");
  s = s.replace(/\n /, "\n");
  return s;
}

function FITS(input){
  this.src = (typeof input=="string") ? input : "";
  this.img = { complete: false };
  this.xmp = "";    // Will hold the XMP string (for test purposes)
  this.avmdata = false;
  this.tags = {};
  this.stretch = "cuberoot";
  this.color = "heat";
  this.depth = 0;
  this.z = 0;
  this.events = {load:"",click:"",mousemove:""};	// Let's define some events
  this.scale = 1.0;
  this.default_scale = 1.0;
  this.zoom_max = 0;
  this.zoom_min = 0;
  this.x0 = 0;
  this.y0 = 0;
  this.header_str = "";
  this.bufferedcanvas = document.createElement("canvas");
}

// Loads the FITS file using an ajax request. To call your own function after
// the FITS file is loaded, you should either provide a callback directly or have
// already set the load function.
FITS.prototype.load = function(source,fnCallback) {
  var success;
  if (typeof source=="string") this.src = source;
  if (typeof source=="object") this.src = source.name;
  if (typeof source=="string") {
    this.image = null;
    this.header_str = "";
    var _obj = this;

    BinaryAjax(_obj.src,
      function(oHTTP) {
        var i = _obj.readFITSHeader(oHTTP.binaryResponse);
        if(_obj.header.NAXIS >= 2) success = _obj.readFITSImage(oHTTP.binaryResponse,i);
        if(typeof fnCallback=="function") fnCallback(_obj);
        else if(typeof _obj.events.load=="function") _obj.events.load.call(_obj);
      })
  }

  if (typeof source=="object") {
    this.image = null;
    this.header_str = "";
    var _obj = this;

    var reader = new FileReader();
    reader.onload = function(event) {
      //the_url = event.target.result;
      var rawData = new BinaryFile(reader.result);
      var i = _obj.readFITSHeader(rawData);
      if (_obj.header.NAXIS >= 2) success = _obj.readFITSImage(rawData,i);
      if (typeof fnCallback=="function") fnCallback(_obj);
      else if (typeof _obj.events.load=="function") _obj.events.load.call(_obj);
    }
    reader.readAsBinaryString(source);
  }

  this.scale = 1.0;
  this.default_scale = 1.0;
  this.x0 = 0;
  this.y0 = 0;
  return this;
}

// Parse the ASCII header from the FITS file. It should be at the start.
FITS.prototype.readFITSHeader = function(oFile){
  var iLength = oFile.getLength();
  var iOffset = 0;
  var header = {};
  var key;
  var val;
  var inHeader = 1;

  while (iOffset < iLength && inHeader){
    var str = oFile.getStringAt(iOffset, 80);
    this.header_str += str + "\n";
    iOffset += 80;
    var eq = str.indexOf("=");
    key = trim(str.substring(0, eq));
    val = trim(str.substring(eq + 1, str.length));
    var comment_pos = val.lastIndexOf(" /");
    if (comment_pos >= 0) val = trim(val.substring(0, comment_pos));
    if(key.length > 0){
      if(val.indexOf("'")==0){
        // It is a string
        val = trim(val.substring(1, val.length - 1));
      } else {
        if(val.indexOf(".") >= 0) val = parseFloat(val); // Floating point
        else val = parseInt(val); // Integer
      }
      header[key] = val;
    }
    if(str.indexOf("END") == 0) inHeader = 0;
  }

  this.header = header;
  if(this.header.NAXIS >= 2) {
    if (typeof this.header.NAXIS1=="number") this.width = this.header.NAXIS1;
    if (typeof this.header.NAXIS2=="number") this.height = this.header.NAXIS2;
  }

  if (this.header.NAXIS > 2 && typeof this.header.NAXIS3=="number") this.depth = this.header.NAXIS3;
  else this.depth = 1;

  if (typeof this.header.BSCALE=="undefined") this.header.BSCALE = 1;
  if (typeof this.header.BZERO=="undefined") this.header.BZERO = 0;

  // Remove any space padding
  while (iOffset < iLength && oFile.getStringAt(iOffset,1) == " ") iOffset++;

  this.bufferedcanvas.setAttribute("width", this.width);
  this.bufferedcanvas.setAttribute("height", this.height);

  return iOffset;
}


// Parse the FITS image from the file
FITS.prototype.readFITSImage = function(oFile, iOffset) {
  var iLength = oFile.getLength();
  var i = 0;
  this.z = 0;
  this.image = new Array(this.width * this.height * this.depth);
  var bBigEnd = (typeof this.header.BYTEORDR == "undefined");    // FITS is defined as big endian

  // BITPIX
  // 8-bit (unsigned) integer bytes
  // 16-bit (signed) integers
  // 32-bit (signed) integers
  // 32-bit single precision floating point real numbers
  // 64-bit double precision floating point real numbers
  //
  // Should actually deal with the different cases
  var p = 0;
  var val;

  if (this.header.BITPIX == 16) {
    i = iOffset;
    while (i < iLength) {
      val = oFile.getSShortAt(i, bBigEnd);
      this.image[p++] = val * this.header.BSCALE + this.header.BZERO;
      i += 2;
    }
    return true;
  } else if (this.header.BITPIX == 32) {
    i = iOffset;
    while (i < iLength){
      val = oFile.getSLongAt(i, bBigEnd);
      this.image[p++] = val * this.header.BSCALE + this.header.BZERO;
      i += 4;
    }
    return true;
  } else if (this.header.BITPIX == -32) {
    i = iOffset;
    var x;
    while (i < iLength) {
      x = val = oFile.getLongAt(i, true); //IEEE float32 is always big-endian
      if (val != 0) val = (1.0 + ((val&0x007fffff) / 0x0800000)) * Math.pow(2, ((val&0x7f800000) >> 23) - 127);
      if (x < 0) val = -val;
      this.image[p++] = val * this.header.BSCALE + this.header.BZERO;
      i += 4;
    }
    return true;
  } else if (this.header.BITPIX == -64) {
    i = iOffset;
    var x, x1, x2;
    var buffer = new ArrayBuffer(8);
    var b32 = new Uint32Array(buffer);
    var f64 = new Float64Array(buffer);
    while (i < iLength) {
      x1 = oFile.getLongAt(i, bBigEnd);
      x2 = oFile.getLongAt(i + 4, bBigEnd);
      b32[0] = x2;
      b32[1] = x1;
      val = f64[0];
      this.image[p++] = val * this.header.BSCALE + this.header.BZERO;
      i += 8;
    }
    return true;
  } else return false;
}

// Use <canvas> to draw a 2D image
FITS.prototype.draw = function(id,type) {
  this.id = id;
  type = type || this.stretch;

  var _obj = this;
  var new_canvas = true;
  // remove click event to it
  if (typeof this.canvas != "undefined") {
    new_canvas = false;
    //if (typeof this.events.click=="function") removeEvent(this.canvas, "click", function(e){ _obj.clickListener(e) });
    //if (typeof this.events.mousemove=="function") removeEvent(this.canvas, "mousemove", function(e){ _obj.moveListener(e) });
  }


  // Now we want to build the <canvas> element that will hold our image
  var el = document.getElementById(id);
  if (el != null) {
    // Look for a <canvas> with the specified ID or fall back on a <div>
    if (typeof el=="object" && el.tagName != "CANVAS") {
      // Looks like the element is a container for our <canvas>
      el.setAttribute("id", this.id + "holder");
      var canvas = document.createElement("canvas");
      canvas.style.display="block";
      //canvas.setAttribute("width", this.width);
      //canvas.setAttribute("height", this.height);
      canvas.setAttribute("id", this.id);
      el.appendChild(canvas);
      // For excanvas we need to initialise the newly created <canvas>
      if (/*@cc_on!@*/false) el = G_vmlCanvasManager.initElement(this.canvas);
    } else {
      // Define the size of the canvas
      // Excanvas doesn't seem to attach itself to the existing
      // <canvas> so we make a new one and replace it.
      if (/*@cc_on!@*/false) {
        var canvas = document.createElement("canvas");
        canvas.style.display = "block";
        //canvas.setAttribute("width", this.width);
        //canvas.setAttribute("height", this.height);
        canvas.setAttribute("id", this.id);
        el.parentNode.replaceChild(canvas, el);
        if (/*@cc_on!@*/false) el = G_vmlCanvasManager.initElement(elcanvas);
      } else {
        //el.setAttribute("width", this.width);
        //el.setAttribute("height", this.height);
      }
    }
    this.canvas = document.getElementById(id);
  } else this.canvas = el;
  var _obj = this;

  // The object didn't exist before so we add a click event to it
  if (new_canvas === true) {
    this.ctx = this.canvas.getContext("2d");
    if(typeof this.events.click == "function") addEvent(this.canvas, "click", function(e){ _obj.clickListener(e) });
    if(typeof this.events.mousemove == "function") addEvent(this.canvas, "mousemove", function(e){ _obj.moveListener(e) });
  }

  // create a new batch of pixels with the same
  // dimensions as the image:
  this.imageData = this.ctx.createImageData(this.width, this.height);
  this.scale = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);
  this.default_scale = this.scale;
  this.x0 = (this.canvas.width - this.scale * this.width) / 2;
  this.y0 = (this.canvas.height - this.scale * this.height) / 2;

  var pos = 0;
  this.update(type, 0);
}

// Calculate the pixel values using a defined stretch type and draw onto the canvas
FITS.prototype.update = function(inp) {
  if (typeof inp == "object"){
    this.stretch = (typeof inp.stretch == "string") ? inp.stretch : this.stretch;
    if (typeof inp.index != "number" && this.z) inp.index = this.z;
    this.z = Math.max(0, Math.min(this.depth-1, Math.abs(inp.index || 0)));
    this.color = (typeof inp.color=="string") ? inp.color : this.color;
  } else {
    if (typeof inp == "string") this.stretch = inp;
  }
  if (this.image == null) return 0;

  var mean = 0;
  var median = 0;
  var image = new Array(this.width * this.height)
  var j = 0;
  var i = 0;
  var count = 0;
  var val;
  var start = this.width * this.height * this.z;
  var max = this.image[start];
  var min = this.image[start];
  var stop = start + image.length;

  for (i = start; i < stop ; i++) {
    val = this.image[i];
    mean += val;
    if (val > max) max = val;
    if (val < min) min = val;
  }
  mean /= this.image.length;

  // Calculating the median on the whole image is time consuming.
  // Instead, we'll extract three patches that are 100th the area
  var sorted = new Array();
  // One patch on the top edge (100th of full image)
  for (j = 0; j < Math.round(this.height * 0.1); j++) for (var i = Math.round(this.width * 0.45); i < Math.round(this.width * 0.55); i++) sorted[count++] = this.image[start + j * this.width + i];
  // A patch to the lower left of centre (100th of full image)
  for (j = Math.round(this.height * 0.55); j < Math.round(this.height * 0.65); j++) for (i = Math.round(this.width * 0.35); i < Math.round(this.width * 0.45); i++) sorted[count++] = this.image[start + j * this.width + i];
  // A patch to the right (100th of full image)
  for (j = Math.round(this.height * 0.45); j < Math.round(this.height * 0.55); j++) for (i = Math.round(this.width * 0.85); i < Math.round(this.width * 0.95); i++) sorted[count++] = this.image[start + j * this.width + i];
  sorted.sort(function sortNumber(a, b){ return a - b; })
  median = sorted[Math.floor(sorted.length / 2)];

  var upper, lower, range;

  // Fudge factors
  if (this.stretch == "log") {
    upper = max; //Math.log(max);
    lower = min; //Math.log(sorted[Math.floor(sorted.length / 20)]);
    //if (isNaN(lower)) lower = 1;
  } else if (this.stretch == "loglog") {
    upper = Math.log(Math.log(max));
    lower = Math.log(Math.log(sorted[Math.floor(sorted.length / 20)]));
    if (isNaN(lower)) lower = 1;
  } else if (this.stretch == "sqrtlog") {
    upper = Math.sqrt(Math.log(max));
    lower = Math.sqrt(Math.log(sorted[Math.floor(sorted.length / 20)]));
    if (isNaN(lower)) lower = 1;
  } else {// if (this.stretch == "linear") {
    upper = max;
    lower = min;
    /*    } else {
            upper = max - (max - min) * 0.2;
            lower = sorted[Math.floor(sorted.length / 10)];
            if (lower > upper) lower = min */
  }
  range = (upper - lower);

  if (this.stretch=="linear") for (j = 0, i = start; i <  stop; j++, i++) image[j] = 255 * ((this.image[i] - lower) / range);
  if (this.stretch=="sqrt") for (j = 0, i = start; i < stop; j++, i++) image[j] = 255 * Math.sqrt((this.image[i] - lower) / range);
  if (this.stretch=="cuberoot") for (j = 0, i = start; i < stop; j++, i++) image[j] = 255 * Math.pow((this.image[i] - lower) / range, 0.333);
  if (this.stretch=="log") for (j = 0, i = start; i < stop; j++, i++) image[j] = 255 * (Math.log((this.image[i]) - lower) / range * 800 + 1) / Math.log(800);
  if (this.stretch=="loglog") for (j = 0, i = start; i < stop; j++, i++) image[j] = 255 * (Math.log(Math.log(this.image[i])) - lower) / range;
  if (this.stretch=="sqrtlog") for (j = 0, i = start; i < stop; j++, i++) image[j] = 255 * (Math.sqrt(Math.log(this.image[i])) - lower) / range;
  for (i = 0; i < image.length; i++) {
    val = image[i];
    if (isNaN(val)) image[i] = 0;
    else if (val < 0) image[i] = 0;
    else if (val > 255) image[i] = 255;
    else image[i] = val;
  }

  var row = 0;
  var col = 0;
  var c = {r:0,g:0,b:0};
  var i = 0;
  var pos;
  for (row = 0; row < this.height; row++) {
    for (col = 0; col < this.width; col++) {
      pos = ((this.height - row) * this.width + col) * 4;
      c = this.colorImage(image[i], this.color);
      //if (i < 3) console.log(c, image[i])
      this.imageData.data[pos] = c.r;
      this.imageData.data[pos + 1] = c.g;
      this.imageData.data[pos + 2] = c.b;
      this.imageData.data[pos + 3] = 0xff; // alpha
      i++;
    }
  }
  var ctx=this.bufferedcanvas.getContext("2d");
  ctx.putImageData(this.imageData, 0, 0);
  this.redraw();
}


FITS.prototype.data2screen = function(d) {
  var x = Math.floor(d.x * this.scale + this.x0);
  var y = Math.floor(this.y0 - (d.y - this.height) * this.scale);
  //return [x, y];
  return {x:x, y:y};
}

FITS.prototype.screen2data = function(s) {
  var x = ((s.x - this.x0) / this.scale);
  var y = (this.height + (this.y0 - s.y) / this.scale);
  return {x:x, y:y};
}

FITS.prototype.setZoomLimits = function(zmin,zmax) {
  this.zoom_min = zmin;
  this.zoom_max = zmax;
}

//uses screen pixel (mouse) coordinates
FITS.prototype.zoom = function(zoomfactor, x, y) {
  if ((this.zoom_max!=0) && (this.scale*zoomfactor/this.default_scale>this.zoom_max)) zoomfactor = 1.0;
  if ((this.zoom_min!=0) && (this.scale*zoomfactor/this.default_scale<this.zoom_min)) zoomfactor = 1.0;
  this.scale = this.scale * zoomfactor;
  this.x0 = (this.x0 - x) * zoomfactor+x;
  this.y0 = (this.y0 - y) * zoomfactor+y;
  this.redraw();
}

//uses screen pixel (mouse) coordinates
FITS.prototype.pan = function(dx, dy) {
  this.x0 = this.x0 + dx;
  this.y0 = this.y0 + dy;
  this.redraw();
}


FITS.prototype.redraw = function() {
  this.ctx.imageSmoothingEnabled = false;
  this.ctx.fillStyle = "black";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //I can use this...
  this.ctx.drawImage(this.bufferedcanvas, this.x0, this.y0, Math.floor(this.width * this.scale), Math.floor(this.height * this.scale));
  //... or this
  //this.ctx.setTransform(this.scale, 0, 0, this.scale, this.x0, this.y0);
  //this.ctx.drawImage(this.bufferedcanvas, 0, 0);
  //this.ctx.setTransform(1, 0, 0, 1, 0, 0);

  /*    this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(this.width / 2, this.height / 2);
      this.ctx.stroke();
      this.ctx.closePath();
  */}

FITS.prototype.getCursor = function(e) {
  var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined){
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.body.scrollTop + document.documentElement.scrollTop;
  }

  var target = e.target
  while(target){
    x -= target.offsetLeft;
    y -= target.offsetTop;
    target = target.offsetParent;
  }
  this.cursor = {x:x, y:y};
}

FITS.prototype.clickListener = function(e) {
  this.getCursor(e);
  this.events.click.call(this, {x:this.cursor.x, y:this.cursor.y});
}

FITS.prototype.moveListener = function(e) {
  this.getCursor(e);
  this.events.mousemove.call(this, {x:this.cursor.x, y:this.cursor.y});
}


FITS.prototype.bind = function(ev, fn) {
  if (typeof ev!="string" || typeof fn!="function") return this;
  if (ev == "load") this.events.load = fn;
  else if (ev == "click") this.events.click = fn;
  else if (ev == "mousemove") this.events.mousemove = fn;
  return this;
}

// Colour scales defined by SAOImage
FITS.prototype.colorImage = function(v, type) {
  if (type == "blackbody" || type == "heat") return {r:((v <= 127.5) ? v*2 : 255), g:((v>63.75) ? ((v<191.25) ? (v-63.75)*2 : 255) : 0), b:((v>127.5) ? (v-127.5)*2 : 0)};
  else if (type == "A") return {r:((v<=63.75) ? 0 : ((v<=127.5) ? (v-63.75)*4 : 255)), g:((v<=63.75) ? v*4 : ((v<=127.5) ? (127.5-v)*4 : ((v<191.25) ? 0: (v-191.25)*4))), b:((v<31.875) ? 0 : ((v<127.5) ? (v-31.875)*8/3 : ((v < 191.25) ? (191.25-v)*4 : 0)))};
  else if (type == "B") return {r:((v<=63.75) ? 0 : ((v<=127.5) ? (v-63.75)*4 : 255)), g:((v<=127.5) ? 0 : ((v<=191.25) ? (v-127.5)*4 : 255)), b: ((v<63.75) ? v*4 : ((v<127.5) ? (127.5-v)*4 : ((v<191.25) ? 0 : (v-191.25)*4 ))) };
  else return {r:v, g:v, b:v};
}