var context = require("./benchmark/context.js");
var frameBuffer = require("./benchmark/frameBuffer.js");
var geometry = require("./benchmark/geometry.js");
var shader = require("./benchmark/shader.js");
var texture = require("./benchmark/texture.js");
var vertexArray = require("./benchmark/vertexArray.js");
var reset = require("gl-reset")

var Benchmark = require("benchmark");


module.exports.run = function(cb){
    var suite = new Benchmark.Suite;
    var canvas = document.body.appendChild(document.createElement("canvas"));
    var gl = createHeadlessContext(width, height, shader.renderShader);

    var results = { 
        completed: 0,
        remaining: 5
    };

    // add tests
    suite.add("shader", function() {
        gl = createContext(canvas, shader.renderShader);
        var renderOpts = shader.loadShader(gl);
        gl.tick(renderOpts);
    })
    .add("geometry", function() {
        gl = createContext(canvas, geometry.renderGeometry);
        var renderOpts = geometry.loadGeometry(gl, canvas.width, canvas.height);
        gl.tick(renderOpts);
    })
    .add("vertexArray", function() {
        gl = createContext(canvas, vertexArray.renderVertexArray);
        var renderOpts = vertexArray.loadVertexArray(gl);
        gl.tick(renderOpts);
    })
    .add("texture", function() {
        gl = createContext(canvas, texture.renderTexture);
        var renderOpts = texture.loadTexture(gl);
        gl.tick(renderOpts);
    })
    .add("frameBuffer", function() {
        gl = createContext(canvas, frameBuffer.renderFrameBuffer);
        var renderOpts = frameBuffer.loadFrameBuffer(gl);
        gl.tick(renderOpts);
    })
    // add listeners
    .on("cycle", function(event) {

        canvas.remove();
        var ext = gl.getExtension("STACKGL_destroy_context");
        ext.destroy();


        canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        results.completed++;
        results.remaining--;
        cb(results);
    })
    .on("complete", function() {
        cb(results);
    })
    .run();
}


function createContext(canvas, opts, render) {
    if (typeof opts === "function") {
        render = opts;
        opts = {};
    } else {
        opts = opts || {};
    }

    var gl = (
        canvas.getContext("webgl", opts) ||
        canvas.getContext("webgl-experimental", opts) ||
        canvas.getContext("experimental-webgl", opts)
    );

    if (!gl) {
        throw new Error("Unable to initialize headless-gl");
    }

    if (render){
        gl.tick = function(renderOpts, preRender) {
            if( preRender ) {
                renderOpts = preRender(gl, renderOpts);
            }
            render(gl, renderOpts);
        }
    }

    return gl;
}
