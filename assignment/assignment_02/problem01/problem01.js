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
var counter = 1;
var dir = 1;

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
  var transX = Math.PI/180;
  var transY = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var modelMatrix = new Matrix4();
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  var tick = function() {
    anim = animate(transY); // Update the rotation angle
    transX = anim[0];
    transY = anim[1];
    draw(gl, n, transX, transY-prevY, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

var g_last = Date.now();

function animate(transY) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    prevY = transY;
    g_last = now;
    angle += (TRANSLATE_STEP * elapsed) * dir;
    angle %= 360;
    console.log(angle);
    // Update the current rotation angle (adjusted by the elapsed time)
    var newtransy = Math.sin(( Math.PI/180 ) * angle);
    var newtransx = (Math.PI/180) * TRANSLATE_STEP * dir;
    return [newtransx, newtransy];
}

function initVertexBuffers(gl) {
  var len = 360;
  var radius = 0.05;
  var vertices = new Float32Array(720);
  for(var i = 0; i < len; i+=2) {
    rad = i * (Math.PI/180);
    x = Math.sin(rad) * radius/2;
    y = Math.cos(rad) * radius;
    vertices[i] = x;
    vertices[i + 1] = y;
  }
  var n = 360; // The number of vertices

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
  console.log(transX + ", " + transY);
  // Set the translate matrix
  if (counter >= 1.95)
  {
    dir = -1;
  }
  else if (counter <= 0.05)
  {
    dir = 1;
  }
  counter += transX;
  modelMatrix.translate(transX,transY,0.0);
  console.log(dir);
  gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}
