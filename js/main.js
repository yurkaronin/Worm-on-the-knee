const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");
const levelElement = document.getElementById("level");
const gameoverElement = document.getElementById("gameover");
const gameoverMessage = gameoverElement.querySelector("h1");

let snake;
let food;
let interval;
let speed = 0;
let level = 1;
let timeElapsed = 0;

function setup() {
  snake = new Snake();
  food = new Food();
  food.pickLocation();

  interval = setInterval(update, 250);

  updateSpeedAndLevel();
  updateScore();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  food.draw();
  snake.update();
  snake.draw();

  if (snake.eat(food)) {
    food.pickLocation();
    updateScore();
  }

  if (snake.checkCollision()) {
    gameOver("Пиздец, твой червяк помер!");
  } else if (level >= 12) {
    gameOver("Ты прошёл это дерьмо!");
  } else {
    checkLevelUp();
  }

  timeElapsed += 250;
}

function updateScore() {
  scoreElement.textContent = snake.total;
}

function updateSpeedAndLevel() {
  speedElement.textContent = speed.toFixed(2);
  levelElement.textContent = level;
}

function checkLevelUp() {
  if (level < 12 && timeElapsed >= 10000 * level) {
    level++;
    speed += 0.33;
    clearInterval(interval);
    interval = setInterval(update, 250 / (1 + speed));
    updateSpeedAndLevel();
  }
}

function gameOver(message) {
  clearInterval(interval);
  gameoverMessage.textContent = message;
  gameoverElement.classList.remove("hidden");
}

function restart() {
  gameoverElement.classList.add("hidden");
  timeElapsed = 0;
  speed = 0;
  level = 1;
  setup();
}

window.addEventListener("keydown", (event) => {
  const direction = event.key.replace("Arrow", "");
  snake.changeDirection(direction);
});

class Snake {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
  }

  draw() {
    ctx.fillStyle = 'green';

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  }

  update() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    if (this.total >= 1) {
      this.tail[this.total - 1] = { x: this.x, y: this.y };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  changeDirection(direction) {
    switch (direction) {
      case 'Up':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case 'Down':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case 'Left':
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case 'Right':
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  }

  eat(food) {
    if (this.x === food.x && this.y === food.y) {
      this.total++;
      return true;
    }
    return false;
  }

  checkCollision() {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.total = 0;
        this.tail = [];
        return true;
      }
    }
    if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
      return true;
    }

    return false;
  }
}

class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  pickLocation() {
    this.x = Math.floor(Math.random() * columns) * scale;
    this.y = Math.floor(Math.random() * rows) * scale;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, scale, scale);
  }
}

setup();
