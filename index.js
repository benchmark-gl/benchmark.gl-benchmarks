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
        gpu: gpuReport.collectGPUInfo(),
        completedBenchmarks: 0,
        remainingBenchmarks: 7,
        benchmarks: [],
        platform: Benchmark.platform
    };

    var settings = {
        "async": false,
        "maxTime": 0.5,
        "onStart": function(e) {
            e.currentTarget.canvas = document.createElement("canvas");
            e.currentTarget.canvas.width  = 100;
            e.currentTarget.canvas.height = 100;
        },
        "onCycle": function(e) {
            e.currentTarget.canvas.remove();
            resetGL(e.currentTarget.gl);
            var ext = e.currentTarget.gl.getExtension("WEBGL_lose_context");
            ext.loseContext();
            e.currentTarget.canvas = document.createElement("canvas");
            e.currentTarget.canvas.width  = 100;
            e.currentTarget.canvas.height = 100;
        }
    };

    // add tests
    suite.add("shader", function() {
        this.gl = createContext(this.canvas, shaderBench.renderShader);
        var renderOpts = shaderBench.loadShader(this.gl);
        this.gl.tick(renderOpts);

    }, settings)
    suite.add("shaderRayMarch", function() {
        this.gl = createContext(this.canvas, shaderBench.renderShaderRayMarch);
        var renderOpts = shaderBench.loadShaderRayMarch(this.gl);
        this.gl.tick(renderOpts);

    }, settings)
    .add("geometry", function() {
        this.gl = createContext(this.canvas, geometryBench.renderGeometry);
        var renderOpts = geometryBench.loadGeometry(this.gl, this.canvas.width, this.canvas.height);
        this.gl.tick(renderOpts);

    }, settings)
    .add("vertexArray", function() {
        this.gl = createContext(this.canvas, vertexArrayBench.renderVertexArray);
        var renderOpts = vertexArrayBench.loadVertexArray(this.gl);
        this.gl.tick(renderOpts);

    }, settings)
    .add("texture", function() {
        this.gl = createContext(this.canvas, textureBench.renderTexture);
        var renderOpts = textureBench.loadBaboonTexture(this.gl);
        this.gl.tick(renderOpts);

    }, settings)
    .add("loadTextureSizes", function() {
        this.gl = createContext(this.canvas, textureBench.renderTexture);
        var size = 8;
        while (size < 1024){
            var textureOpts = {
                width: size,
                height: size
            };

            var renderOpts = textureBench.loadTexture(this.gl, textureBench.generateTexture(textureOpts));
            this.gl.tick(renderOpts);
            size *= 2;
        }

    }, settings)
    .add("frameBuffer", function() {
        this.gl = createContext(this.canvas, frameBufferBench.renderFrameBuffer);
        var renderOpts = frameBufferBench.loadFrameBuffer(this.gl);
        this.gl.tick(renderOpts);

    }, settings)
    .on("cycle", function(e) {
        results.completedBenchmarks++;
        results.remainingBenchmarks--;
        results.benchmarks.push(e.target);
        cb(results);
    })
    .on("error", function(e) {
        console.error("error", e.target.error);
    })
    .run({
        "async": false,
        "maxTime": 2,
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
