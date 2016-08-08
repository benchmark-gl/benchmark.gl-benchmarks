var benchmark = require("..");
var glContext = require("gl");
var fs = require("fs");
var raf = require("raf-component")

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
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
	});
	
	it("shader", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, benchmark.renderShader);
		var renderOpts = benchmark.loadShader(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/shader");
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
	});
	
	it("geometry", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, benchmark.renderGeometry);
		var renderOpts = benchmark.loadGeometry(gl, width, height);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/geometry");
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
	});	

	it("vertexArray", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, benchmark.renderVertexArray);
		var renderOpts = benchmark.loadVertexArray(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/vertexArray");
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
	});

	it("texture", function() {
		var width = 300;
		var height = 300;

		var gl = createHeadlessContext(width, height, benchmark.renderTexture);
		var renderOpts = benchmark.loadTexture(gl);

		gl.tick(renderOpts);

		bufferToFile(gl, width, height, __dirname + "/output/texture");
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
	});

	it("frameBuffer", function() {
		var width = 100;
		var height = 100;

		var gl = createHeadlessContext(width, height, benchmark.renderFrameBuffer);
		var renderOpts = benchmark.loadFrameBuffer(gl);

		gl.tick(renderOpts, benchmark.tickFrameBuffer);

		bufferToFile(gl, width, height, __dirname + "/output/frameBuffer");
		var ext = gl.getExtension('STACKGL_destroy_context')
		ext.destroy()
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
	var file = fs.createWriteStream(filename)

	// Write output
	var pixels = new Uint8Array(width * height * 4)
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
	file.write(['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''))
	for (var i = 0; i < pixels.length; i += 4) {
		file.write(pixels[i] + ' ' + pixels[i + 1] + ' ' + pixels[i + 2] + ' ')
	}
}