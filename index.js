var glslify = require("glslify");
var glMatrix = require("gl-matrix");
var createContext = require("gl-context");
var createShader = require("gl-shader");
var createShell = require("gl-now");
var createBuffer = require("gl-buffer");
var createVAO = require("gl-vao");
var createFBO = require("gl-fbo");
var createTexture = require("gl-texture2d");
var createGeometry = require("gl-geometry");
var generateNormals  = require("normals")
var reset = require("gl-reset");
var fillScreen = require("a-big-triangle");
var ndarray = require("ndarray");
var faceNormals = require("face-normals");
var unindex = require("unindex-mesh");
var fill = require("ndarray-fill");

var clear = require("gl-clear")({
    color: [0xF0 / 255, 0xF1 / 255, 0xF2 / 255, 1],
    depth: true,
    stencil: false
});

var bunny = require("bunny");
var baboon = require("baboon-image");



var loadContext = function(render){

    var canvas = document.body.appendChild(document.createElement("canvas"));
    var gl = createContext(canvas, render);

    reset();

}


var loadShader = function(gl){
    var shader = createShader(gl,
        "attribute vec3 position;\
        attribute vec3 color;\
        uniform mat4 matrix;\
        varying vec3 fcolor;\
        void main() {\
          gl_Position = matrix * vec4(position, 1.0);\
          fcolor = color;\
        }",
        "precision highp float;\
        uniform vec3 tp;\
        varying vec3 fcolor;\
        void main() {\
          gl_FragColor = vec4(fcolor + tp, 1.0);\
        }"
    );
    shader.attributes.position.location = 0;
    shader.attributes.color.location = 1;

    //Create vertex buffer;
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, 0, 0,
        0, -1, 0,
        1, 1, 0
    ]), gl.STATIC_DRAW);
    var options = {
        buffer: buffer,
        shader: shader
    };
    return Object.assign({}, options); 
}

var renderShader = function(gl, opts){
    var shader = opts.shader;
    var buffer = opts.buffer;

    shader.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    shader.attributes.position.pointer();
    shader.attributes.color = [1, 0, 1];

    //Set uniforms
    shader.uniforms.tp = [Math.cos(0.001 * Date.now()), Math.sin(0.001 * Date.now()), 0];
    shader.uniforms.matrix = glMatrix.mat4.create();

    //Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


var loadGeometry = function(gl, width, height){
    var positions = unindex(bunny.positions, bunny.cells)
    var normals = faceNormals(positions)
    positions = ndarray(positions, [positions.length]);
    normals = ndarray(normals, [normals.length]);

    var projection = glMatrix.mat4.fromValues(1 ,0 ,0 ,0,
                                            0, 1, 0, 0,
                                            0, 0, 1, 0,
                                            0, 0, 1, 0);

    var view = glMatrix.mat4.fromValues(1 ,0 ,0 ,0,
                                        0, 1, 0, 0,
                                        0, 0, 1, 0,
                                        0, 0, 0, 1);

    var translateVec = glMatrix.vec3.fromValues(0,5,-30);
    glMatrix.mat4.translate(view,view,translateVec);
    glMatrix.mat4.rotateZ(view,view, -Math.PI);

    var geometry = createGeometry(gl);

    geometry.attr("normal", normals);
    geometry.attr("position", positions);

    var shader = createShader(gl,
        "precision mediump float;\
        attribute vec3 position;\
        attribute vec3 normal;\
        varying vec3 vnormal;\
        uniform mat4 uProjection;\
        uniform mat4 uView;\
        void main() {\
          vnormal = (uView * vec4(normal, 1.0)).xyz / 2.0 + 0.5;\
          gl_Position = (\
              uProjection\
            * uView\
            * vec4(position, 1.0)\
          );\
        }",
        "precision mediump float;\
        varying vec3 vnormal;\
        void main() {\
          gl_FragColor = vec4(vnormal, 1.0);\
        }"
        );
    var options = {
        width: width,
        height: height,
        shader: shader,
        geometry: geometry,
        projection: projection,
        view: view
    }
    return Object.assign({}, options); 
}

var renderGeometry = function(gl, opts){
    var width = opts.width;
    var height = opts.height;
    var geom = opts.geometry;
    var shader = opts.shader;
    var projection = opts.projection;
    var view = opts.view;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, width, height);
    clear(gl);

    geom.bind(shader);
    shader.attributes.position.location = 0;
    shader.uniforms.uView = view;
    shader.uniforms.uProjection = glMatrix.mat4.perspective(projection
      , Math.PI / 4
      , width / height
      , 0.001
      , 1000
    );

    geom.draw();
    geom.unbind();
}


var loadVertexArray = function(gl){

    //Create shader object
    var shader = createShader(gl,
        "\
        attribute vec2 position;\
        attribute vec3 color;\
        varying vec3 fragColor;\
        void main() {\
            gl_Position = vec4(position, 0, 1.0);\
            fragColor = color;\
        }",
        "\
        precision highp float;\
        varying vec3 fragColor;\
        void main() {\
            gl_FragColor = vec4(fragColor, 1.0);\
        }"
    );
    shader.attributes.position.location = 0
    shader.attributes.color.location = 1

    //Create vertex array object
    var vao = createVAO(gl, [
        { "buffer": createBuffer(gl, [-1, 0, 0, -1, 1, 1]),
            "type": gl.FLOAT,
            "size": 2
        },
        [0.8, 1, 0.5]
    ]);

    var options = {
        shader: shader,
        vao: vao
    };
    return Object.assign({}, options); 
}

var renderVertexArray = function(gl, opts){
    var shader = opts.shader;
    var vao = opts.vao; 

    //Bind the shader
    shader.bind()
    //Bind vertex array object and draw it
    vao.bind()
    vao.draw(gl.TRIANGLES, 3)
    //Unbind vertex array when finished
    vao.unbind()
}

var loadTexture = function(gl){
    //flips the textures
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


    //Create texture
    texture = createTexture(gl, baboon);

    //Create shader
    shader = createShader(gl,
        "\
        attribute vec2 position;\
        varying vec2 texCoord;\
        void main() {\
            gl_Position = vec4(position, 0, 1);\
            texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (position + 1.0);\
        }"
        ,
        "\
        precision highp float;\
        uniform sampler2D baboonTexture;\
        varying vec2 texCoord;\
        void main() {\
            gl_FragColor = texture2D(baboonTexture, texCoord);\
        }"
    );
    shader.attributes.position.location = 0;

    var options = {
        shader: shader,
        texture: texture
    };
    return Object.assign({}, options); 
}

var renderTexture = function(gl, opts){
    var shader = opts.shader;
    var texture = opts.texture;

    shader.bind();
    shader.uniforms.baboonTexture = texture.bind();
    fillScreen(gl);
}

var loadFrameBuffer = function(gl){
    gl.disable(gl.DEPTH_TEST);


    var currentFrame = 0;
    //Create shader
    var updateShader = createShader(gl,
            "attribute vec2 position;\
            varying vec2 uv;\
            void main() {\
              gl_Position = vec4(position,0.0,1.0);\
              uv = 0.5 * (position+1.0);\
            }",
            "precision mediump float;\
            uniform sampler2D buffer;\
            uniform vec2 dims;\
            varying vec2 uv;\
            void main() {\
              float n = 0.0;\
              for(int dx=-1; dx<=1; ++dx)\
              for(int dy=-1; dy<=1; ++dy) {\
                n += texture2D(buffer, uv+vec2(dx,dy)/dims).r;\
              }\
              float s = texture2D(buffer, uv).r;\
              if(n > 3.0+s || n < 3.0) {\
                gl_FragColor = vec4(0,0,0,1);\
              } else {\
                gl_FragColor = vec4(1,1,1,1);\
              }\
            }"
        );

    var drawShader = createShader(gl,
            "attribute vec2 position;\
            varying vec2 uv;\
            void main() {\
              gl_Position = vec4(position,0.0,1.0);\
              uv = 0.5 * (position+1.0);\
            }",
            "precision mediump float;\
            uniform sampler2D buffer;\
            varying vec2 uv;\
            void main() {\
              gl_FragColor = texture2D(buffer, uv);\
            }"
        );

    //Allocate buffers
    var state = [ createFBO(gl, [512, 512]), createFBO(gl, [512, 512]) ];

    //Initialize state buffer
    var initial_conditions = ndarray(new Uint8Array(512*512*4), [512, 512, 4])
    fill(initial_conditions, function(x,y,c) {
        if(c === 3) {
            return 255
        }
        return Math.random() > 0.9 ? 255 : 0
    })
    state[0].color[0].setPixels(initial_conditions)

    drawShader.attributes.position.location = 0;

    var options = {
        drawShader: drawShader,
        updateShader: updateShader,
        state: state,
        currentFrame: currentFrame
    };
    return Object.assign({}, options); 
}

var tickFrameBuffer = function(gl, opts){
    var prevState = opts.state[opts.currentFrame]
    var curState = opts.state[opts.currentFrame ^= 1]

    //Switch to state fbo
    curState.bind();

    //Run update shader
    opts.updateShader.bind();
    opts.updateShader.uniforms.buffer = prevState.color[0].bind();
    opts.updateShader.uniforms.dims = prevState.shape;
    fillScreen(gl)

    return opts; 
}

var renderFrameBuffer = function(gl, opts){
    //Render contents of buffer to screen
    opts.drawShader.bind()
    opts.drawShader.uniforms.buffer = opts.state[opts.currentFrame].color[0].bind()
    fillScreen(gl)
}


var run = function(){

}

module.exports = {
    run : run,
    loadTexture : loadTexture,
    renderTexture : renderTexture,
    loadVertexArray : loadVertexArray,
    renderVertexArray : renderVertexArray,
    loadGeometry : loadGeometry,
    renderGeometry : renderGeometry,
    loadShader : loadShader,
    renderShader : renderShader,
    loadContext : loadContext,
    loadFrameBuffer: loadFrameBuffer,
    tickFrameBuffer: tickFrameBuffer,
    renderFrameBuffer: renderFrameBuffer
};

