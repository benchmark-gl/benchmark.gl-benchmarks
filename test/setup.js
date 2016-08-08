'use strict';

var jsdom = require("jsdom").jsdom;

var exposedProperties = ["window", "navigator", "document"];

global.document = jsdom("");
global.window = document.defaultView;
global.navigator = window.navigator; 

Object.keys(document.defaultView).forEach(function(property){
	if (typeof global[property] === "undefined") {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});


global.WebGLBuffer = function(_, ctx){
  this._ = _
  this._ctx = ctx
  this._binding = 0
  this._size = 0
  this._pendingDelete = false
  this._references = []
  this._refCount = 0
  this._elements = new Uint8Array(0)
}



//TODO mock properly
global.HTMLCanvasElement = function(_, ctx){
  this._ = _
  this._ctx = ctx
  this._binding = 0
  this._size = 0
  this._pendingDelete = false
  this._references = []
  this._refCount = 0
  this._elements = new Uint8Array(0)
} 
global.HTMLImageElement = function(_, ctx){
  this._ = _
  this._ctx = ctx
  this._binding = 0
  this._size = 0
  this._pendingDelete = false
  this._references = []
  this._refCount = 0
  this._elements = new Uint8Array(0)
} 
global.HTMLVideoElement = function(_, ctx){
  this._ = _
  this._ctx = ctx
  this._binding = 0
  this._size = 0
  this._pendingDelete = false
  this._references = []
  this._refCount = 0
  this._elements = new Uint8Array(0)
} 
global.ImageData = function(_, ctx){
  this._ = _
  this._ctx = ctx
  this._binding = 0
  this._size = 0
  this._pendingDelete = false
  this._references = []
  this._refCount = 0
  this._elements = new Uint8Array(0)
} 