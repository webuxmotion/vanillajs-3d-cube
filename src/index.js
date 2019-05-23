const W = 600, H = 600;
const MODEL_MIN_X = -2, MODEL_MAX_X = 2;
const MODEL_MIN_Y = -2, MODEL_MAX_Y = 2;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [];

function initGeometry() {

  const step = 0.5;

  for (let x = -1; x <= 1; x += step) {
    for (let y = -1; y <= 1; y += step) {
      for (let z = -1; z <= 1; z += step) {
        points.push([x, y, z]);
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
    y / (z + 4)
  ];
}

function project(point) {

  const perspectivePoint = perspectiveProjection(point);
  const x = perspectivePoint[0],
        y = perspectivePoint[1];

  return [
    W * (x - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X),
    H * (1 - (y - MODEL_MIN_Y) / (MODEL_MAX_Y - MODEL_MIN_Y))
  ];
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

function rotateY(point, theta) {

  const x = point[0],
        y = point[1],
        z = point[2];

  return [
    Math.cos(theta) * x - Math.sin(theta) * z,
    y,
    Math.sin(theta) * x + Math.cos(theta) * z
  ];
}

function rotateX(point, theta) {

  const x = point[0],
        y = point[1],
        z = point[2];

  return [
    x,
    Math.cos(theta) * y - Math.sin(theta) * z,
    Math.sin(theta) * y + Math.cos(theta) * z
  ];
}

let theta = 0,
    dtheta = 0.01;

function render() {
  ctx.fillStyle = 'black';
  ctx.clearRect(0, 0, W, H);

  theta += dtheta;

  points.forEach((point) => {
    //let rotatedPoint = rotateY(point, theta);
    let rotatedPoint = rotateX(point, 0.44 + theta);
    renderPoint(rotatedPoint);
  });

  requestAnimationFrame(render);
}

initGeometry();

render();
