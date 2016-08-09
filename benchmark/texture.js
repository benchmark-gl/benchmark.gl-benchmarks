var createTexture = require("gl-texture2d");
var createShader = require("gl-shader");
var fillScreen = require("a-big-triangle");
var baboon = require("baboon-image");
var ndarray = require("ndarray")


module.exports.loadBaboonTexture = function(gl){
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


module.exports.loadTexture = function(gl, texture){
    //flips the textures
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


    //Create texture
    texture = createTexture(gl, texture);

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

module.exports.generateTexture = function(opts){
    opts = opts || {};

    var data = [];
    var i, j, c;
    var width = opts.width;
    var height = opts.height;
    var channels = 4;

    for (i=0; i<height; i++) {
        for (j=0; j<width; j++) {
            c = ((i & 8) ^ (j & 8))*255;
            data[(i*width+j)*channels] = c; // Red component
            data[(i*width+j)*channels+1] = c; // Green component
            data[(i*width+j)*channels+2] = c; // Blue component
            data[(i*width+j)*channels+3] = 0xff; // Alpha component
        }
    }
    return ndarray(new Uint8Array(data), [ width, height, channels ], [ channels, channels * width, 1 ], 0);
}






module.exports.renderTexture = function(gl, opts){
    opts.shader.bind();
    opts.shader.uniforms.baboonTexture = opts.texture.bind();
    fillScreen(gl);
}