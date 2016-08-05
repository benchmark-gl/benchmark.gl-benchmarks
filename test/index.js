var assert = require("assert");
var benchmark = require("..");
var glContext = require("gl");
var raf = require("raf-component")

describe("general", function() {
	it("should create a context", function() {
		var gl = glContext(10, 10);
		gl.drawingBufferHeight.should.equal(10);
	});

	it("should make something nice", function() {
		createHeadlessContext(
			10, 
			10, 
			function(gl){

		});
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

	if (render) raf(tick);

	return gl;

	function tick() {
		render(gl);
		raf(tick);
	}

}