global.contextBench = require("./benchmark/context.js");
global.frameBufferBench = require("./benchmark/frameBuffer.js");
global.geometryBench = require("./benchmark/geometry.js");
global.shaderBench = require("./benchmark/shader.js");
global.textureBench = require("./benchmark/texture.js");
global.vertexArrayBench = require("./benchmark/vertexArray.js");
global.resetGL = require("gl-reset");
global.Benchmark = require("benchmark");
var gpuReport = require("./gpuReport.js");


module.exports.run = function(cb){
    var suite = new Benchmark.Suite;

    var results = {
        report: gpuReport.collectGPUInfo(),
        completed: 0,
        remaining: 6
    };

    var settings = {
        "async": true,
        "maxTime": 1
    };

    // add tests
    suite.add("shader", function() {
        var canvas = setup();

        var gl = createContext(canvas, shaderBench.renderShader);
        var renderOpts = shaderBench.loadShader(gl);
        gl.tick(renderOpts);

        teardown(canvas, gl);
    }, settings)
    .add("geometry", function() {
        var canvas = setup();

        var gl = createContext(canvas, geometryBench.renderGeometry);
        var renderOpts = geometryBench.loadGeometry(gl, canvas.width, canvas.height);
        gl.tick(renderOpts);

        teardown(canvas, gl);
    }, settings)
    .add("vertexArray", function() {
        var canvas = setup();

        var gl = createContext(canvas, vertexArrayBench.renderVertexArray);
        var renderOpts = vertexArrayBench.loadVertexArray(gl);
        gl.tick(renderOpts);

        teardown(canvas, gl);
    }, settings)
    .add("texture", function() {
        var canvas = setup();

        var gl = createContext(canvas, textureBench.renderTexture);
        var renderOpts = textureBench.loadBaboonTexture(gl);
        gl.tick(renderOpts);

        teardown(canvas, gl);
    }, settings)
    .add("textureSizes", function() {
        var canvas = setup();

        gl = createContext(canvas, textureBench.renderTexture);

        size = 8;
        while (size < 512){
            var textureOpts = {
                width: size,
                height: size
            };

            var renderOpts = textureBench.loadTexture(gl, textureBench.generateTexture(textureOpts));
            gl.tick(renderOpts);
            size *= 2;
        }

        teardown(canvas, gl);
    }, settings)
    .add("frameBuffer", function() {
        var canvas = setup();

        var gl = createContext(canvas, frameBufferBench.renderFrameBuffer);
        var renderOpts = frameBufferBench.loadFrameBuffer(gl);
        gl.tick(renderOpts);

        teardown(canvas, gl);
    }, settings)
    // add listeners
    .on("cycle", function(event) {
        console.log(event);
        results.completed++;
        results.remaining--;
        cb(results);
    })
    .on("complete", function(e) {
        console.log(e);
        cb(results);
    })
    .on("error", function(e) {
        console.error("error", e.target.error);
    })
    .run({ 
        "async": true,
        "maxTime": 1 
    });
}

function setup(){
    var canvas = document.body.appendChild(document.createElement("canvas"));
    canvas.width  = 100;
    canvas.height = 100;

    return canvas;
}

function teardown(canvas, gl){
    canvas.remove();
    resetGL(gl);
    var ext = gl.getExtension("WEBGL_lose_context");
    ext.loseContext();
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
