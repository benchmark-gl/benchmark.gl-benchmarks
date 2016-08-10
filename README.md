# benchmark.gl-benchmarks

profiles and tests gpu performance

uses [benchmark.js](https://benchmarkjs.com/) and [stack.gl](http://stack.gl/)

## Installation
```javascript
npm install benchmark.gl-benchmarks
```

## Usage
```javascript
var benchmarks = require("benchmark.gl-benchmarks");

benchmarks.run(function(res){
	//called after each benchmark test completes
});

```
### Output Example
```json
{
  "completed": 1,
  "remaining": 0,
  "gpu": {
    "platform": "MacIntel",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
    "webglVersion": 1,
    "contextName": "experimental-webgl",
    "glVersion": "WebGL 1.0 (OpenGL ES 2.0 Chromium)",
    "shadingLanguageVersion": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)",
    "vendor": "WebKit",
    "renderer": "WebKit WebGL",
    "unMaskedVendor": "Intel Inc.",
    "unMaskedRenderer": "Intel(R) Iris(TM) Graphics 6100",
    "antialias": "Available",
    "angle": "No",
    "majorPerformanceCaveat": "No",
    "maxColorBuffers": 8,
    "redBits": 8,
    "greenBits": 8,
    "blueBits": 8,
    "alphaBits": 8,
    "depthBits": 24,
    "stencilBits": 8,
    "maxRenderBufferSize": 16384,
    "maxCombinedTextureImageUnits": 16,
    "maxCubeMapTextureSize": 16384,
    "maxFragmentUniformVectors": 1024,
    "maxTextureImageUnits": 16,
    "maxTextureSize": 16384,
    "maxVaryingVectors": 15,
    "maxVertexAttributes": 16,
    "maxVertexTextureImageUnits": 16,
    "maxVertexUniformVectors": 1024,
    "aliasedLineWidthRange": "[1, 7]",
    "aliasedPointSizeRange": "[1, 255]",
    "maxViewportDimensions": "[16384, 16384]",
    "maxAnisotropy": 16,
    "vertexShaderBestPrecision": {
      "high": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "medium": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "low": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "best": "[-2^127, 2^127] (23)"
    },
    "fragmentShaderBestPrecision": {
      "high": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "medium": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "low": "[-1.7014118346046923e+38, 1.7014118346046923e+38] (23 bit mantissa)",
      "best": "[-2^127, 2^127] (23)"
    },
    "fragmentShaderFloatIntPrecision": "highp/highp",
    "extensions": [
      "ANGLE_instanced_arrays",
      "EXT_blend_minmax",
      "EXT_disjoint_timer_query",
      "EXT_frag_depth",
      "EXT_shader_texture_lod",
      "EXT_sRGB",
      "EXT_texture_filter_anisotropic",
      "WEBKIT_EXT_texture_filter_anisotropic",
      "OES_element_index_uint",
      "OES_standard_derivatives",
      "OES_texture_float",
      "OES_texture_float_linear",
      "OES_texture_half_float",
      "OES_texture_half_float_linear",
      "OES_vertex_array_object",
      "WEBGL_compressed_texture_s3tc",
      "WEBKIT_WEBGL_compressed_texture_s3tc",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_depth_texture",
      "WEBKIT_WEBGL_depth_texture",
      "WEBGL_draw_buffers",
      "WEBGL_lose_context",
      "WEBKIT_WEBGL_lose_context"
    ]
  },
  "benchmark": [
    {
      "name": "shader",
      "options": {
        "async": false,
        "defer": false,
        "delay": 0.005,
        "initCount": 1,
        "maxTime": 2,
        "minSamples": 5,
        "minTime": 0.075
      },
      "async": false,
      "defer": false,
      "delay": 0.005,
      "initCount": 1,
      "maxTime": 2,
      "minSamples": 5,
      "minTime": 0.075,
      "id": 1,
      "stats": {
        "moe": 0.006271313431732119,
        "rme": 10.089984481747223,
        "sem": 0.0028780694959761907,
        "deviation": 0.010377027142090954,
        "mean": 0.06215384615384615,
        "sample": [
          0.054,
          0.056,
          0.068,
          0.0485,
          0.0505,
          0.0695,
          0.068,
          0.079,
          0.051,
          0.0535,
          0.0655,
          0.077,
          0.0675
        ],
        "variance": 0.00010768269230769234
      },
      "times": {
        "cycle": 0.1243076923076923,
        "elapsed": 3.444,
        "period": 0.06215384615384615,
        "timeStamp": 1470855660979
      },
      "running": false,
      "count": 2,
      "cycles": 2,
      "hz": 16.089108910891092
    }
  ],
  "platform": {
    "description": "Chrome 52.0.2743.116 on OS X 10.11.6",
    "layout": "Blink",
    "manufacturer": null,
    "name": "Chrome",
    "prerelease": null,
    "product": null,
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
    "version": "52.0.2743.116",
    "os": {
      "architecture": 32,
      "family": "OS X",
      "version": "10.11.6"
    }
  }
}
```

## Testing
```javascript
npm run test
```

## Badges
![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-developing-yellow.svg)

