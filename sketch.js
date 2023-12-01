// WiFi parameter
let SERVER_ADDRESS = "http://10.10.81.101/data";

// WiFi variable
let readyToLoad;

// project variables
let gridSize = 20;
let player;
let maze;
let currentAngle = 0;

let prevLeft = 0;
let prevRight = 0;

function parseData(res) {
  // get data from WiFi response
  let data = res.data;
  let potDelta = data.A0.delta;
  let currentLeft = data.d2.value;
  let currentRight = data.d3.value;

  // use data to update project variables
  if (potDelta != 0) {
    currentAngle += potDelta;
  }

  if (prevLeft != currentLeft && currentLeft) {
    currentAngle += 1;
  }
  prevLeft = currentLeft

  if (prevRight != currentRight && currentRight) {
    currentAngle -= 1;
  }
  prevRight = currentRight;

  // WiFi update
  readyToLoad = true;
}

function createPlayer() {
  player = new Sprite(width / 2, height / 2, gridSize - 2);
  player.color = color(255, 255, 0);
}

function createMaze() {
  maze = [];
  let sx = width / 2;
  let sy = height / 2;

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      if (random() < 0.3333) {
        let sprite = new Sprite(sx, sy, gridSize, gridSize, "k");
        sprite.offset.x = x - width / 2;
        sprite.offset.y = y - height / 2;
        sprite.color = 0;
        maze.push(sprite);
      }
    }
  }
}

function setup() {
  randomSeed(1010);
  new Canvas(windowHeight, windowHeight);
  world.gravity.y = 5;
  createMaze();
  createPlayer();
  readyToLoad = true;
}

function draw() {
  background(220, 20, 120);
  for (let i = 0; i < maze.length; i++) {
    maze[i].rotateTo(currentAngle, 3);
  }

  if (player.x > width || player.x < 0 || player.y > height || player.y < 0) {
    for (let i = 0; i < maze.length; i++) {
      maze[i].remove();
    }
    maze = null;

    player.remove();
    player = null;
    createMaze();
    createPlayer();
    currentAngle = 0;
  }

  // WiFi update
  if (readyToLoad) {
    readyToLoad = false;
    loadJSON(SERVER_ADDRESS, parseData);
  }
}
