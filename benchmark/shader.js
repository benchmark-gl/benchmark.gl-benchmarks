var createShader = require("gl-shader");
var raymarchShader = require("../shader/raymarchShader.js");
var glMatrix = require("gl-matrix");
var createBuffer = require("gl-buffer");

module.exports.loadShader = function(gl){
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

    return {
        buffer: buffer,
        shader: shader
    };; 
}

module.exports.renderShader = function(gl, opts){
    var shader = opts.shader;
    var buffer = opts.buffer;

    shader.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    shader.attributes.position.pointer();
    shader.attributes.color = [1, 0, 1];

    shader.uniforms.tp = [Math.cos(0.001 * Date.now()), Math.sin(0.001 * Date.now()), 0];
    shader.uniforms.matrix = glMatrix.mat4.create();

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

module.exports.loadShaderRayMarch = function(gl){
    var shader = createShader(
        gl,
        raymarchShader.vert,
        raymarchShader.frag
    );
    shader.attributes.position.location = 0;

    //Create vertex buffer;
    buffer = createBuffer(gl, [-1, -1, -1, 4, 4, -1]);

    return {
        buffer: buffer,
        shader: shader
    }; 
}

module.exports.renderShaderRayMarch = function(gl, opts){
    var shader = opts.shader;
    var buffer = opts.buffer;

    shader.bind();
    buffer.bind();

    shader.attributes.position.pointer();

    shader.uniforms.uResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];

    //Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}