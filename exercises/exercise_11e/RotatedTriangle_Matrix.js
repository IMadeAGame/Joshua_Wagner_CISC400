// RotatedTriangle_Matrix.js (c) matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'uniform mat4 u_xformMatrix2;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * (u_xformMatrix2 * a_Position);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// The rotation angle
var ANGLE = 45.0;

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

  // Create a rotation matrix
  var radian = Math.PI * ANGLE / 180.0; // Convert to radians
  var cosB = Math.cos(radian), sinB = Math.sin(radian);

  xTrans = 0.5;
  yTrans = 0.5;
  zTrans = 0.0;
  // Note: WebGL is column major order
  var rotateMatrix = new Float32Array([
     cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
      0.0,  0.0, 1.0, 0.0,
      0.0,  0.0, 0.0, 1.0
  ]);

  var translateMatrix = new Float32Array([
     1.0, 0.0, 0.0, 0,
     0.0, 1.0, 0.0, 0.0,
     0.0,  0.0, 1.0, 0.0,
     xTrans,  yTrans, zTrans, 1.0
 ]);

 var xformMatrix = translateMatrix; //Multiply(rotateMatrix, translateMatrix) Didn't work
 var xformMatrix2 = rotateMatrix;
 console.log(xformMatrix);

  // Pass the rotation matrix to the vertex shader
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  var u_xformMatrix2 = gl.getUniformLocation(gl.program, 'u_xformMatrix2');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
  gl.uniformMatrix4fv(u_xformMatrix2, false, xformMatrix2);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/*function Multiply(a,b) {
  var res = new Float32Array(16);
  for (var i = 0; i < 4; i++)
  {
    for (var j = 0; j < 4; j++)
    {
      res[j + i] = 0;
      for(var k = 0; k < 4; k++)
      {
        res[j + i] += a[i+k] * b[j+k*4];
      }
    }
  }
  return res;
}*/

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
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

