
const skyBgColor = '#05004c';
const starColor = '#ffffff';
const entities = [];
const shooting = [];
let width;
let height;

let terrain;

function setup() {
  // put setup code here
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height)

  for(let i = 0; i < height; i++) {
    entities.push(new Star({
      x: random(width),
      y: random(height),
      color: starColor,
    }))
  }

  shooting.push(new ShootingStar());
  shooting.push(new ShootingStar());

  terrain = initTerrain(width, height);
}

function draw() {
  // put drawing code here
  background(skyBgColor);

  entities.forEach(s => { s.update(); s.draw() });
  shooting.forEach(s => s.update());
  
  // drawTerrain(terrain, width, height);
  document.getElementById('framerate').innerText = frameRate();
}

// Some random points

function initTerrain(width, height) {
  const points = [];
  let displacement = 140;
  const power = Math.pow(2,Math.ceil(Math.log(width)/(Math.log(2))));
  
  // set the start height and end height for the terrain
  points[0] = (height - (Math.random()*height/2))-displacement;
  points[power] = (height - (Math.random()*height/2))-displacement;
  
  // create the rest of the points
  for(var i = 1; i<power; i*=2){
    for(var j = (power/i)/2; j <power; j+=power/i){
      points[j] = ((points[j - (power/i)/2] + points[j + (power/i)/2]) / 2) + Math.floor(Math.random()*-displacement+displacement );
    }
    displacement *= 0.6;
  }

  return points;
}

function drawTerrain(points, width, height) {
  fill(0)
  stroke(0);
  beginShape();
  vertex(0, height);
  for (let i = 0; i <= width; i ++) {
    vertex(i, points[i]);
  }
  vertex(width, height);
  endShape(CLOSE);
}
