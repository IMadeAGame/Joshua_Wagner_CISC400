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
var TRANSLATE_STEP = .05;
var angle = 180;
var prevY;
var counterX = 1;
var counterY = 1;

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
  var transX = 0;
  var transY = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var modelMatrix = new Matrix4();
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  var tick = function() {
    trans = animate();  // Update the rotation angle
    transX = trans[0];
    transY = trans[1];
    draw(gl, n, transX, transY, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

var g_last = Date.now();

function animate() {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newtransy = (Math.round(Math.random())/10) * (Math.round(Math.random()) ? 1 : -1);
    var newtransx = (Math.round(Math.random())/10) * (Math.round(Math.random()) ? 1 : -1);
    if (counterX + newtransx >= 1.9 || counterX + newtransx <= .1)
    {
      newtransx *= -1;
      console.log(counterX);
    }
    counterX += newtransx;

    if (counterY + newtransy >= 1.9 || counterY + newtransy <= .1)
    {
      newtransy *= -1;
      console.log(counterY);
    }
    counterY+= newtransy;
    return [newtransx, newtransy];
}

function initVertexBuffers(gl) {
  var len = 360;
  var radius = 0.1;
  var vertices = new Float32Array(720);
  for(var i = 0; i < len; i+=2) {
    rad = i * (Math.PI/180);
    x = Math.sin(rad) * radius;
    y = Math.cos(rad) * radius;
    vertices[i] = x;
    vertices[i + 1] = y;
  }
  var n = 720; // The number of vertices

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


function draw(gl, n, transX, transY, modelMatrix, u_xformMatrix) {
  // Set the translate matrix
  modelMatrix.translate(transX,transY,0.0);
  gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}
