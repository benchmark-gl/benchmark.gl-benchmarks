var assert = require("assert");
var benchmark = require("..");
var glContext = require("gl");

describe("general", function() {
	it("should create a context", function() {
		var gl = glContext(10, 10);
		gl.drawingBufferHeight.should.equal(10);

		
	});

	it("should make something nice", function() {
		console.log(JSON.stringify(benchmark, null, "  "));

		
	});
});