var createFBO = require("gl-fbo");
var createShader = require("gl-shader");
var fillScreen = require("a-big-triangle");
var ndarray = require("ndarray");
var fill = require("ndarray-fill");

module.exports.loadFrameBuffer = function(gl){
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

module.exports.tickFrameBuffer = function(gl, opts){
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

module.exports.renderFrameBuffer = function(gl, opts){
    //Render contents of buffer to screen
    opts.drawShader.bind()
    opts.drawShader.uniforms.buffer = opts.state[opts.currentFrame].color[0].bind()
    fillScreen(gl)
}