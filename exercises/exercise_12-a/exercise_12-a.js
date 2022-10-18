// HelloQuad.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';
var TRANSLATE_STEP = .1;
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  var trans = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var modelMatrix = new Matrix4();
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  var tick = function() {
    trans = animate(trans);  // Update the rotation angle
    draw(gl, n, trans, modelMatrix, u_ModelMatrix);   // Draw the triangle
    console.log(trans);
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

var g_last = Date.now();

function animate(trans) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newtrans = trans + (TRANSLATE_STEP * elapsed) / 1000.0;
    return newtrans;
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -1, 0.25,   -1, -0.25,   -0.5, 0.25,　-0.5, -0.25
  ]);
  var n = 4; // The number of vertices
  var size = 1.5; // Size multiplier
  var u_size = gl.getUniformLocation(gl.program, 'Size');
  gl.uniform1f(u_size, size);

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}


function draw(gl, n, trans, modelMatrix, u_xformMatrix) {
  // Set the translate matrix
  modelMatrix.translate(trans,0.0,0.0);
 
  gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
