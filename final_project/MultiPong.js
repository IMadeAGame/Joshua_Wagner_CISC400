// MultiAttributeSize_Interleaved.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_FragColor;\n' + // varying variable
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
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

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) { 
    console.log('Failed to get the storage locations of u_ModelMatrix');
    return;
  }

  var modelMatrix = new Matrix4();

  // Start drawing
  var tick = function() {
    animate();
    draw(gl, n, u_ModelMatrix, modelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

function animate(){
  if (up)
  {
    yTrans += 0.02;
  }
  else if(down) 
  {
    yTrans -= 0.02;
  }

  if (up2)
  {
    yTrans2 += 0.02;
  }
  else if(down2) 
  {
    yTrans2 -= 0.02;
  }
}

up = false;
down = false;
up2 = false;
down2 = false;
yTrans = 0;
yTrans2 = 0;

document.onkeydown = (e) => {
  e = e || window.event;
  if (e.keyCode === 38) {
    up = true;
  } else if (e.keyCode === 40) {
    down = true;
  }

  if (e.keyCode === 87) {
    up2 = true;
  } else if (e.keyCode === 83) {
    down2 = true;
  }
}

document.onkeyup = (e) => {
  e = e || window.event;
  if (e.keyCode === 38) {
    up = false;
  } else if (e.keyCode === 40) {
    down = false;
  }

  if (e.keyCode === 87) {
    up2 = false;
  } else if (e.keyCode === 83) {
    down2 = false;
  }
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    // Coordinate and size of points
     -0.9,  0.5, 1.0,  0.0,  1.0,  // the 1st paddle
     -0.9,  0.0, 1.0,  0.0,  1.0,
     -0.95, 0.0, 0.5,  0.0,  1.0,
     -0.95, 0.5, 0.5,  0.0,  1.0,
     -0.9,  0.5, 1.0,  0.0,  1.0,
     -0.95, 0.0, 0.5,  0.0,  1.0,

     0.9,  0.5, 1.0,  1.0,  0.0,  // the 2nd paddle
     0.9,  0.0, 1.0,  1.0,  0.0,
     0.95, 0.0, 0.5,  1.0,  0.0,
     0.95, 0.5, 0.5,  1.0,  0.0,
     0.9,  0.5, 1.0,  1.0,  0.0,
     0.95, 0.0, 0.5,  1.0,  0.0,

    -0.06,  0.1, 0.25,  0.25,  0.25,  // the ball spawner
     0.06,  0.1, 0.25,  0.25,  0.25,
    -0.06, -0.1, 0.25,  0.25,  0.25,
    -0.06, -0.1, 0.25,  0.25,  0.25,
     0.06, -0.1, 0.25,  0.25,  0.25,
     0.06,  0.1, 0.25,  0.25,  0.25
  ]);

  var circleVertices = new Float32Array(1800);

  var n = 378; // The number of vertices

  var len = 1800;
  var radius = 0.05;

  for(var i = 0; i < len; i+=5) {
    rad = i * (Math.PI/180);
    x = Math.sin(rad) * radius/1.5;
    y = Math.cos(rad) * radius;
    circleVertices[i] = x;
    circleVertices[i + 1] = y;
    circleVertices[i + 2] = 1.0;
    circleVertices[i + 3] = 0.0;
    circleVertices[i + 4] = 1.0;
  }

  var verticesSizes = new Float32Array(1890);

  for(var i = 0; i < 1890; i++) {
    if(i < 90){
      verticesSizes[i] = vertices[i];
    }
    else{
      verticesSizes[i] = circleVertices[i];
    }
  }

  // Create a buffer object
  var vertexSizeBuffer = gl.createBuffer();  
  if (!vertexSizeBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  console.log(verticesSizes);
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

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

function draw(gl, n, u_ModelMatrix, modelMatrix) {
  // Set the rotation matrix
  yTrans2 = Math.min(Math.max(yTrans2, -1), .5);
  modelMatrix.setTranslate(0, yTrans2, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);     // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, 6); // Draw the first paddle

  // Set the rotation matrix
  yTrans = Math.min(Math.max(yTrans, -1), .5);
  modelMatrix.setTranslate(0, yTrans, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 6, 6); // Draw the second paddle

  modelMatrix.setTranslate(0, 0, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 12, 6); // Draw the ballspawner

  modelMatrix.setTranslate(0, 0, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_FAN, 18, 360); // Draw the ball
}
