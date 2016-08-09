var createShader = require("gl-shader");
var createVAO = require("gl-vao");
var createBuffer = require("gl-buffer");

module.exports.loadVertexArray = function(gl){
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

module.exports.renderVertexArray = function(gl, opts){
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