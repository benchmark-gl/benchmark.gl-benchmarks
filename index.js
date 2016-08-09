global.context = require("./benchmark/context.js");
global.frameBuffer = require("./benchmark/frameBuffer.js");
global.geometry = require("./benchmark/geometry.js");
global.shader = require("./benchmark/shader.js");
global.textureBench = require("./benchmark/texture.js");
global.vertexArray = require("./benchmark/vertexArray.js");
global.reset = require("gl-reset")
global.Benchmark = require("benchmark");


module.exports.run = function(cb){
    var suite = new Benchmark.Suite;

    var results = {
        completed: 0,
        remaining: 6
    };

    // add tests
    suite.add("shader", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        var gl = createContext(canvas, shader.renderShader);
        var renderOpts = shader.loadShader(gl);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
    .add("geometry", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        var gl = createContext(canvas, geometry.renderGeometry);
        var renderOpts = geometry.loadGeometry(gl, canvas.width, canvas.height);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
    .add("vertexArray", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        var gl = createContext(canvas, vertexArray.renderVertexArray);
        var renderOpts = vertexArray.loadVertexArray(gl);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
    .add("texture", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        var gl = createContext(canvas, textureBench.renderTexture);
        var renderOpts = textureBench.loadBaboonTexture(gl);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
    .add("textureSizes", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        gl = createContext(canvas, textureBench.renderTexture);


        var maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        console.log("maxSize", maxSize);


        var renderOpts = textureBench.loadTexture(gl);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
    .add("frameBuffer", function() {
        var canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width  = 100;
        canvas.height = 100;

        var gl = createContext(canvas, frameBuffer.renderFrameBuffer);
        var renderOpts = frameBuffer.loadFrameBuffer(gl);
        gl.tick(renderOpts);

        canvas.remove();
        reset(gl);
        var ext = gl.getExtension("WEBGL_lose_context");
        ext.loseContext();
    },
    {
        "async": true,
        "maxTime": 1

    })
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
