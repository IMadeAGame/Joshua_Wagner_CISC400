// MultiAttributeSize_Interleaved.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_FragColor;\n' + // varying variable
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_FragColor = a_Color;\n' +  // Pass the data to the fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = v_FragColor;\n' +
  '}\n';

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

  // Set vertex coordinates and point sizes
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ViewMatrix || !u_ModelMatrix) { 
    console.log('Failed to get the storage locations of u_ViewMatrix or u_ModelMatrix');
    return;
  }

  var viewMatrix = new Matrix4();
  var modelMatrix = new Matrix4();

  var tick = function() {
    animate();  // Update the rotation angle
    draw(gl, n, viewMatrix, u_ViewMatrix, u_ModelMatrix, modelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}
var totalRot = [0,0,0];
var totalTrans = [0,0,0];
function animate() {
  // Update the current rotation angle (adjusted by the elapsed time)
  for (i = 0; i < 3; i++)
  {
    var num = (Math.round(Math.random())/50) * (Math.round(Math.random()) ? 1 : -1);
    totalTrans[i] = Math.min(Math.max(totalTrans[i] + num, -0.4), 0.4);

    num = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1) + totalRot[i];
    totalRot[i] = num%360;
  }
}

function initVertexBuffers(gl) {
  var verticesSizes = new Float32Array([
    // Coordinate and size of points
     -0.25,  0.25, 0.0, 1.0,  0.0,  0.0,  // The front face
     -0.25, -0.25, 0.0, 1.0,  0.0,  0.0,
      0.25, -0.25, 0.0, 1.0,  0.0,  0.0,
     -0.25,  0.25, 0.0, 1.0,  0.0,  0.0,  
      0.25,  0.25, 0.0, 1.0,  0.0,  0.0,
      0.25, -0.25, 0.0, 1.0,  0.0,  0.0,

      0.25,  0.25,  0.0, 1.0,  1.0,  0.0,  // The right face
      0.25, -0.25,  0.0, 1.0,  1.0,  0.0,
      0.25, -0.25, -0.5, 1.0,  1.0,  0.0,
      0.25,  0.25,  0.0, 1.0,  1.0,  0.0,  
      0.25,  0.25, -0.5, 1.0,  1.0,  0.0,
      0.25, -0.25, -0.5, 1.0,  1.0,  0.0,

     -0.25,  0.25, -0.5, 0.0,  0.0,  1.0,  // The back face
     -0.25, -0.25, -0.5, 0.0,  0.0,  1.0,
      0.25, -0.25, -0.5, 0.0,  0.0,  1.0,
     -0.25,  0.25, -0.5, 0.0,  0.0,  1.0,  
      0.25,  0.25, -0.5, 0.0,  0.0,  1.0,
      0.25, -0.25, -0.5, 0.0,  0.0,  1.0,

      -0.25,  0.25,  0.0, 0.0,  1.0,  0.0,  // The left face
      -0.25, -0.25,  0.0, 0.0,  1.0,  0.0,
      -0.25, -0.25, -0.5, 0.0,  1.0,  0.0,
      -0.25,  0.25,  0.0, 0.0,  1.0,  0.0,  
      -0.25,  0.25, -0.5, 0.0,  1.0,  0.0,
      -0.25, -0.25, -0.5, 0.0,  1.0,  0.0,
    
      -0.25, 0.25,  0.0, 1.0,  0.0,  1.0,  // The top face
      -0.25, 0.25, -0.5, 1.0,  0.0,  1.0,
       0.25, 0.25,  0.0, 1.0,  0.0,  1.0,
       0.25, 0.25,  0.0, 1.0,  0.0,  1.0,  
       0.25, 0.25, -0.5, 1.0,  0.0,  1.0,
      -0.25, 0.25, -0.5, 1.0,  0.0,  1.0,

      -0.25, -0.25,  0.0, 0.0,  1.0,  1.0,  // The bottom face
      -0.25, -0.25, -0.5, 0.0,  1.0,  1.0,
       0.25, -0.25,  0.0, 0.0,  1.0,  1.0,
       0.25, -0.25,  0.0, 0.0,  1.0,  1.0,  
       0.25, -0.25, -0.5, 0.0,  1.0,  1.0,
      -0.25, -0.25, -0.5, 0.0,  1.0,  1.0,
  ]);

  var n = 36; // The number of vertices

  // Create a buffer object
  var vertexSizeBuffer = gl.createBuffer();  
  if (!vertexSizeBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // Eye position
function draw(gl, n, viewMatrix, u_ViewMatrix, u_ModelMatrix, modelMatrix) {
  gl.enable(gl.DEPTH_TEST);
  // Set the matrix to be used for to set the camera view
  viewMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, -0.5, 5.0);
  viewMatrix.lookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // Set the rotation matrix
  modelMatrix.setTranslate(0, 0, 0);
  modelMatrix.rotate(totalRot[0], 1, 0, 0);
  modelMatrix.rotate(totalRot[1], 0, 1, 0);
  modelMatrix.rotate(totalRot[2], 0, 0, 1);
  modelMatrix.translate(totalTrans[0], totalTrans[1], totalTrans[2]);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}