// WiFi parameter
let SERVER_ADDRESS = "http://10.10.81.101/data";
let mSerial;

// WiFi variable
let readyForWifi;

// Serial variable
let readyForSerial;
let serialButton;
let sendEnd;

// project variables
let gridSize = 20;
let player;
let maze;
let currentAngle = 0;

function handleWiFiResponse(res) {
  parseData(res.data);
  readyForWifi = true;
}

function readSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  if (line.charAt(0) == "{") {
    let data = JSON.parse(line).data;
    parseData(data);
  }

  readyForSerial = true;
}

function parseData(data) {
  // get values from data
  let potDelta = data.A0.delta;
  let currentLeft = data.B0.isPressed;
  let currentRight = data.B1.isPressed;

  // use data to update project variables
  if (potDelta != 0) {
    currentAngle += potDelta;
  }

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
    readyForSerial = true;
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

  mSerial = createSerial();

  serialButton = createButton("Connect To Serial");
  serialButton.position(width / 2, height / 2);
  serialButton.mousePressed(connectToSerial);

  readyForWifi = false;
  readyForSerial = false;

  sendEnd = false;
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

    sendEnd = true;
  }

  // WiFi update
  if (readyForWifi) {
    readyForWifi = false;
    loadJSON(SERVER_ADDRESS, handleWiFiResponse);
  }

  // Serial update
  if (mSerial.opened()) {
    if (readyForSerial) {
      mSerial.clear();
      if (sendEnd) {
        sendEnd = false;
        mSerial.write("E");
      } else {
        readyForSerial = false;
        mSerial.write("T");
      }
    } else if (mSerial.availableBytes() > 0) {
      readSerial();
    }
  }
}
