var glMatrix = require("gl-matrix");
var createGeometry = require("gl-geometry");
var createShader = require("gl-shader");
var ndarray = require("ndarray");
var faceNormals = require("face-normals");
var unindex = require("unindex-mesh");
var bunny = require("bunny");


module.exports.loadGeometry = function(gl, width, height){
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

module.exports.renderGeometry = function(gl, opts){
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