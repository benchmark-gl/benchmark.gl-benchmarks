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
        completedBenchmarks: 0,
        remainingBenchmarks: 13,
        gpu: gpuReport.collectGPUInfo(),
        benchmarks: [],
        platform: Benchmark.platform
    };

    var settings = {
        async: false,
        maxTime: 1,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
        },
        onCycle: function(e) {
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
            e.currentTarget.canvas = setup();
        }
    };

    //Shader
    suite.add("shader-init", function() {
        this.gl = createContext(this.canvas, shaderBench.renderShader);
        var renderOpts = shaderBench.loadShader(this.gl);
        this.gl.tick(renderOpts);

    }, settings);
    suite.add("shader-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, shaderBench.renderShader);
            e.currentTarget.renderOpts = shaderBench.loadShader(e.currentTarget.gl);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    // Shader-RayMarch
    suite.add("shaderRayMarch-init", function() {
        this.gl = createContext(this.canvas, shaderBench.renderShaderRayMarch);
        var renderOpts = shaderBench.loadShaderRayMarch(this.gl);
        this.gl.tick(renderOpts);

    }, settings);
    suite.add("shaderRayMarch-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, shaderBench.renderShaderRayMarch);
            e.currentTarget.renderOpts = shaderBench.loadShaderRayMarch(e.currentTarget.gl);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    //Geometry
    suite.add("geometry-init", function() {
        this.gl = createContext(this.canvas, geometryBench.renderGeometry);
        var renderOpts = geometryBench.loadGeometry(this.gl, this.canvas.width, this.canvas.height);
        this.gl.tick(renderOpts);

    }, settings);
    suite.add("geometry-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, geometryBench.renderGeometry);
            e.currentTarget.renderOpts = geometryBench.loadGeometry(
                e.currentTarget.gl, 
                e.currentTarget.canvas.width, 
                e.currentTarget.canvas.height);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    //Vertex Array
    suite.add("vertexArray-init", function() {
        this.gl = createContext(this.canvas, vertexArrayBench.renderVertexArray);
        var renderOpts = vertexArrayBench.loadVertexArray(this.gl);
        this.gl.tick(renderOpts);

    }, settings);
    suite.add("vertexArray-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, vertexArrayBench.renderVertexArray);
            e.currentTarget.renderOpts = vertexArrayBench.loadVertexArray(e.currentTarget.gl);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    //Texture
    suite.add("texture-init", function() {
        this.gl = createContext(this.canvas, textureBench.renderTexture);
        var renderOpts = textureBench.loadBaboonTexture(this.gl);
        this.gl.tick(renderOpts);

    }, settings);
    suite.add("texture-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, textureBench.renderTexture);
            e.currentTarget.renderOpts = textureBench.loadBaboonTexture(e.currentTarget.gl);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    //FrameBuffer
    suite.add("frameBuffer-init", function() {
        this.gl = createContext(this.canvas, frameBufferBench.renderFrameBuffer);
        var renderOpts = frameBufferBench.loadFrameBuffer(this.gl);
        this.gl.tick(renderOpts);
    }, settings);
    suite.add("frameBuffer-render", function() {
        this.gl.tick(this.renderOpts);
    }, {
        async: false,
        maxTime: 2,
        onStart: function(e) {
            e.currentTarget.canvas = setup();
            e.currentTarget.gl = createContext(e.currentTarget.canvas, frameBufferBench.renderFrameBuffer);
            e.currentTarget.renderOpts = frameBufferBench.loadFrameBuffer(e.currentTarget.gl);
        },
        onComplete: function(e){
            teardown(e.currentTarget.canvas, e.currentTarget.gl);
        }
    });

    // textureSizes
    suite.add("loadTextureSizes", function() {
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
    }, settings);

    suite.on("cycle", function(e) {
        results.completedBenchmarks++;
        results.remainingBenchmarks--;
        var result = {
            name: e.target.name,
            stats: e.target.stats,
            times: e.target.times,
            hz: e.target.hz,
            cycles: e.target.cycles,
            count: e.target.count
        }
        results.benchmarks.push(result);
        cb(results);
    });
    suite.on("error", function(e) {
        console.error("error", e.target.error);
    });
    suite.run({
        async: true,
        maxTime: 2,
        delay: 0.5,
    });
}

function setup(opts){
    opts = opts || {};
    var canvas = document.createElement("canvas");
    canvas.width  = opts.width || 1;
    canvas.height = opts.height || 1;
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
        throw new Error("Unable to initialize gl");
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
