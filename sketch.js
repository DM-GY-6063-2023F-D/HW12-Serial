// Serial variable
let mSerial;
let readyForSerialData;
let serialButton;
let sendSuccess;

// project variables
let gridSize = 20;
let player;
let maze;
let currentAngle = 0;

function readSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  if (line.charAt(0) == "{") {
    let data = JSON.parse(line).data;
    parseData(data);
  }

  readyForSerialData = true;
}

function parseData(data) {
  // get values from data
  let currentLeft = data.B0.isPressed;
  let currentRight = data.B1.isPressed;

  if (currentLeft) {
    currentAngle += 1;
  }

  if (currentRight) {
    currentAngle -= 1;
  }
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    serialButton.hide();
    readyForSerialData = true;
  }
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
      if (random() < 0.3333 && abs(sx - x) + abs(sy - y) > gridSize) {
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

  mSerial = createSerial();

  serialButton = createButton("Connect To Serial");
  serialButton.position(width / 2, height / 2);
  serialButton.mousePressed(connectToSerial);

  readyForSerialData = false;
  sendSuccess = false;
}

function draw() {
  background(220, 20, 120);

  // update board rotation
  for (let i = 0; i < maze.length; i++) {
    maze[i].rotateTo(currentAngle, 50);
  }

  // if ball goes off the board
  if (player.y > height + gridSize) {
    for (let i = 0; i < maze.length; i++) {
      maze[i].remove();
    }
    maze = null;

    player.remove();
    player = null;
    createMaze();
    createPlayer();
    currentAngle = 0;
    sendSuccess = true;
  }

  // Serial update
  if (mSerial.opened()) {
    if (readyForSerialData) {
      mSerial.clear();
      if (sendSuccess) {
        sendSuccess = false;
        mSerial.write("S");
      } else {
        readyForSerialData = false;
        mSerial.write("D");
      }
    } else if (mSerial.availableBytes() > 0) {
      readSerial();
    }
  }
}
