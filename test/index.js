var context = require("../benchmark/context.js");
var frameBuffer = require("../benchmark/frameBuffer.js");
var geometry = require("../benchmark/geometry.js");
var shader = require("../benchmark/shader.js");
var texture = require("../benchmark/texture.js");
var vertexArray = require("../benchmark/vertexArray.js");

var glContext = require("gl");
var fs = require("fs");

describe("general", function() {

	it("should create a context", function() {
		var width = 10;
		var height = 100;
		var gl = createHeadlessContext(
			width, 
			height, 
			function(gl){
		});
		gl.should.exist;

		bufferToFile(gl, width, height, __dirname + "/output/context");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});
	
	it("shader", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, shader.renderShader);
		var renderOpts = shader.loadShader(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/shader");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});
	
	it("geometry", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, geometry.renderGeometry);
		var renderOpts = geometry.loadGeometry(gl, width, height);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/geometry");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});	

	it("vertexArray", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, vertexArray.renderVertexArray);
		var renderOpts = vertexArray.loadVertexArray(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/vertexArray");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});

	it("texture", function() {
		var width = 300;
		var height = 300;

		var gl = createHeadlessContext(width, height, texture.renderTexture);
		var renderOpts = texture.loadBaboonTexture(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/texture");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});

	it("generated texture", function() {
		var width = 300;
		var height = 300;
		var textureOpts = {
			width: 16,
			height: 16
		};
		var gl = createHeadlessContext(width, height, texture.renderTexture);
		var renderOpts = texture.loadTexture(gl, texture.generateTexture(textureOpts));

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/genTexture");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});

	it("frameBuffer", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, frameBuffer.renderFrameBuffer);
		var renderOpts = frameBuffer.loadFrameBuffer(gl);

		gl.tick(renderOpts, frameBuffer.tickFrameBuffer);

		bufferToFile(gl, width, height, __dirname + "/output/frameBuffer");
		var ext = gl.getExtension("STACKGL_destroy_context");
		ext.destroy();
	});
});




function createHeadlessContext(width, height, opts, render) {
	if (typeof opts === "function") {
		render = opts;
		opts = {};
	} else {
		opts = opts || {};
	}

	var gl = glContext(width, height, opts);

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

function bufferToFile (gl, width, height, filename) {
	var file = fs.createWriteStream(filename);

	// Write output
	var pixels = new Uint8Array(width * height * 4);
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	file.write(["P3\n# gl.ppm\n", width, " ", height, "\n255\n"].join(""));
	for (var i = 0; i < pixels.length; i += 4) {
		file.write(pixels[i] + " " + pixels[i + 1] + " " + pixels[i + 2] + " ");
	}
}