import Vector from './vector';

const W = 600, H = 600;
const MODEL_MIN_X = -2, MODEL_MAX_X = 2;
const MODEL_MIN_Y = -2, MODEL_MAX_Y = 2;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const points = [];
const triangles = [];
const colors = [
  'red', 'green', 'blue', 'white',
  'orange', 'purple', 'cyan', 'gray', 'yellow'
];

function makeTriangle(a, b, c, dimension, side) {
  const side1 = b.subtract(a),
        side2 = c.subtract(a);

  const orientationVector = side1.cross(side2);
  
  if (Math.sign(orientationVector[dimension]) == Math.sign(side)) {
    return [a, b, c];
  }
  return [a, c, b]; 
}

function initGeometry() {

  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        points.push(new Vector(x, y, z));
      }
    }
  }

  for (let dimension = 0; dimension <= 2; ++dimension) {
    for (let side = -1; side <= 1; side += 2) {
      let sidePoints = points.filter((point) => {
        return point[dimension] == side;
      });
      let a = sidePoints[0],
          b = sidePoints[1],
          c = sidePoints[2],
          d = sidePoints[3];

      if (dimension == 1) {
        triangles.push(makeTriangle(a, b, c, dimension, side));
        triangles.push(makeTriangle(d, b, c, dimension, side));
      } else {
        triangles.push(makeTriangle(a, b, c, dimension, -side));
        triangles.push(makeTriangle(d, b, c, dimension, -side));
      }
    } 
  }
}

function perspectiveProjection(point) {
  const x = point[0],
        y = point[1],
        z = point[2];

  return [
    x / (z + 4),
    y / (z + 4),
    z
  ];
}

function project(point) {

  const perspectivePoint = perspectiveProjection(point);
  const x = perspectivePoint[0],
        y = perspectivePoint[1],
        z = perspectivePoint[2];

  return new Vector( 
    W * (x - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X),
    H * (1 - (y - MODEL_MIN_Y) / (MODEL_MAX_Y - MODEL_MIN_Y)),
    z
  );
}

function renderPoint(point) {
  const projectedPoint = project(point); 
  const x = projectedPoint[0],
        y = projectedPoint[1];

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 1, y + 1);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

function renderTriangle(triangle, color) {
  let projectedTriangle = triangle.map(project);

  let a = projectedTriangle[0],
      b = projectedTriangle[1],
      c = projectedTriangle[2];

  const side1 = b.subtract(a),
        side2 = c.subtract(a);

  if (!side1.ccw(side2)) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.lineTo(a[0], a[1]);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
  }
}


let theta = 0,
    dtheta = 0.01;

function render() {
  ctx.fillStyle = 'black';
  ctx.clearRect(0, 0, W, H);

  theta += dtheta;
  /*
  points.forEach((point) => {
    let rotatedPoint = rotateY(point, theta);
    rotatedPoint = rotateX(rotatedPoint, 0.44 + theta);
    renderPoint(rotatedPoint);
  });
  */

  triangles.forEach((triangle, idx) => {
    let rotatedTriangle = triangle.map((point) => {
      point = point.rotateY(theta);
      point = point.rotateX(0.44 + theta);
      return point;
    })
    let color = colors[idx / 2];
    renderTriangle(rotatedTriangle, color);
  });

  requestAnimationFrame(render);
}

initGeometry();

render();
