var createContext = require("gl-context");

module.exports.loadContext = function(render){
    var canvas = document.body.appendChild(document.createElement("canvas"));
    var gl = createContext(canvas, render);

}