var glslify = require("glslify");
var createContext = require("gl-context");
var createShell = require("gl-now");
var createBuffer = require("gl-buffer");
var createVAO = require("gl-vao");
var createTexture = require("gl-texture2d");
var createGeometry = require("gl-geometry");
var normals  = require("normals")
var reset = require("gl-reset");
var fillScreen = require("a-big-triangle");
var fill = require("ndarray-fill");

var bunny = require("bunny");
var baboon = require("baboon-image");


//TODO -- add timing
var loadContext = function(render){

    var canvas = document.body.appendChild(document.createElement("canvas"));
    var gl = createContext(canvas, render);

    reset();

}

var loadGeometry = function(){
    var shell = createShell();

    var geom, shader;

    shell.on("gl-init", function() {
        var gl = shell.gl;
        //Create shader object
        geom = createGeometry(gl)
            .attr("positions", bunny.positions)
            .attr("normals",normals.vertexNormals(bunny.cells, bunny.positions))
            .faces(bunny.cells);

        shader = glShader(gl,
                glslify("./shaders/bunny.vert"),
                glslify("./shaders/bunny.frag")
            );
    });

    shell.on("gl-render", function(t) {
        var gl = shell.gl
        //Bind the shader
        geometry.bind(shader);
        geometry.draw(gl.TRIANGLES);
    });

    shell.on("gl-error", function(e) {
        console.error("error");
        reset();
    });
}

var loadVertexArray = function(){
    var shell = createShell();

    var shader, vao;

    shell.on("gl-init", function() {
        var gl = shell.gl
        //Create shader object
        shader = createShader(gl,
            glslify("\
                attribute vec2 position;\
                attribute vec3 color;\
                varying vec3 fragColor;\
                void main() {\
                    gl_Position = vec4(position, 0, 1.0);\
                    fragColor = color;\
                }", 
                {inline: true}
            ),
            glslify("\
                precision highp float;\
                varying vec3 fragColor;\
                void main() {\
                    gl_FragColor = vec4(fragColor, 1.0);\
                }",
                {inline: true}
            )
        );
        shader.attributes.position.location = 0
        shader.attributes.color.location = 1

        //Create vertex array object
        vao = createVAO(gl, [
            { "buffer": createBuffer(gl, [-1, 0, 0, -1, 1, 1]),
                "type": gl.FLOAT,
                "size": 2
            },
            [0.8, 1, 0.5]
        ]);
    })

    shell.on("gl-render", function(t) {
        var gl = shell.gl
        //Bind the shader
        shader.bind()
        //Bind vertex array object and draw it
        vao.bind()
        vao.draw(gl.TRIANGLES, 3)
        //Unbind vertex array when finished
        vao.unbind()
    })
    shell.on("gl-error", function(e) {
        console.error("error");
        reset();
    })
}

var loadTexture = function(){
    var shell = createShell();

    var shader, texture;

    shell.on("gl-init", function() {


        var gl = shell.gl

        //Create texture
        texture = createTexture(gl, baboon);

        //Create shader
        shader = createShader(gl,
            glslify("\
                attribute vec2 position;\
                varying vec2 texCoord;\
                void main() {\
                    gl_Position = vec4(position, 0, 1);\
                    texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (position + 1.0);\
                }", 
                {inline: true}
            ),
            glslify("\
                precision highp float;\
                uniform sampler2D texture;\
                varying vec2 texCoord;\
                void main() {\
                    gl_FragColor = texture2D(texture, texCoord);\
                }",
                {inline: true}
            )
        );
        shader.attributes.position.location = 0
    })

    shell.on("gl-render", function(t) {
        //Draw it
        shader.bind()
        shader.uniforms.texture = texture.bind()
        fillScreen(shell.gl)
    })
    shell.on("gl-error", function(e) {
        console.error("error");
        reset();
    })
}

var useFrameBuffer = function(){

    var updateShader, drawShader, texture;

    shell.on("gl-init", function() {
        var gl = shell.gl;
        gl.disable(gl.DEPTH_TEST);
        state = [ createFBO(gl, [512, 512]), createFBO(gl, [512, 512]) ];

        //Create shader
        updateShader = glShader(gl,
                glslify("./shaders/fboUpdate.vert"),
                glslify("./shaders/fboUpdate.frag")
            );

        drawShader = createDrawShader(gl,
                glslify("./shaders/fboDraw.vert"),
                glslify("./shaders/fboDraw.frag")
            );

        //Allocate buffers
        state = [ createFBO(gl, [512, 512]), createFBO(gl, [512, 512]) ];

        //Initialize state buffer
        var initial_conditions = ndarray(new Uint8Array(512*512*4), [512, 512, 4])
        fill(initial_conditions, function(x,y,c) {
            if(c === 3) {
                return 255
            }
            return Math.random() > 0.9 ? 255 : 0
        })
        state[0].color[0].setPixels(initial_conditions)

        shader.attributes.position.location = 0;
    });

    shell.on("tick", function() {
        var gl = shell.gl
        var prevState = state[current]
        var curState = state[current ^= 1]

        //Switch to state fbo
        curState.bind();

        //Run update shader
        updateShader.bind();
        updateShader.uniforms.buffer = prevState.color[0].bind();
        updateShader.uniforms.dims = prevState.shape;
        fillScreen(gl)
    });

    shell.on("gl-render", function(t) {
        var gl = shell.gl
        //Render contents of buffer to screen
        drawShader.bind()
        drawShader.uniforms.buffer = state[current].color[0].bind()
        fillScreen(gl)
    });

    shell.on("gl-error", function(e) {
        console.error("error");
        reset();
    });
}

var loadBuffer = function(){

}

var readBuffer = function(){

}

var run = function(){

}

module.exports = {
    run : run,
    readBuffer : readBuffer,
    loadBuffer : loadBuffer,
    useFrameBuffer : useFrameBuffer,
    loadTexture : loadTexture,
    loadVertexArray : loadVertexArray,
    loadGeometry : loadGeometry,
    loadContext : loadContext
}

