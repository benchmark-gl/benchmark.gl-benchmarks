var context = require("./benchmark/context.js");
var frameBuffer = require("./benchmark/frameBuffer.js");
var geometry = require("./benchmark/geometry.js");
var shader = require("./benchmark/shader.js");
var texture = require("./benchmark/texture.js");
var vertexArray = require("./benchmark/vertexArray.js");

var run = function(cb){

}

module.exports = {
    run : run,
    loadTexture : texture.loadTexture,
    renderTexture : texture.renderTexture,
    loadVertexArray : vertexArray.loadVertexArray,
    renderVertexArray : vertexArray.renderVertexArray,
    loadGeometry : geometry.loadGeometry,
    renderGeometry : geometry.renderGeometry,
    loadShader : shader.loadShader,
    renderShader : shader.renderShader,
    loadContext : context.loadContext,
    loadFrameBuffer: frameBuffer.loadFrameBuffer,
    tickFrameBuffer: frameBuffer.tickFrameBuffer,
    renderFrameBuffer: frameBuffer.renderFrameBuffer
};

