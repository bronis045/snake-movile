const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const recordDisplay = document.getElementById('record');
const pauseBtn = document.getElementById('pauseBtn');

canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = canvas.width;

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 8 * gridSize, y: 8 * gridSize }];
let food = getRandomPosition();
let dx = gridSize;
let dy = 0;
let score = 0;
let record = localStorage.getItem('snakeRecord') || 0;
let speed = 200;
let gameInterval;
let isPaused = false;
let changingDirection = false;

recordDisplay.textContent = record;

document.addEventListener('keydown', changeDirection);
document.getElementById('up').addEventListener('click', () => setDirection(0, -gridSize));
document.getElementById('down').addEventListener('click', () => setDirection(0, gridSize));
document.getElementById('left').addEventListener('click', () => setDirection(-gridSize, 0));
document.getElementById('right').addEventListener('click', () => setDirection(gridSize, 0));
pauseBtn.addEventListener('click', togglePause);

function startGame() {
  gameInterval = setInterval(update, speed);
}

function update() {
  if (isPaused) return;

  if (isCollision()) {
    gameOver();
    return;
  }

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = getRandomPosition();
    speedUp();
  } else {
    snake.pop();
  }

  changingDirection = false;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'blue' : '#4caf50';
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
  });

  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
  ctx.fill();
}

function changeDirection(event) {
  if (changingDirection) return;
  const { key } = event;

  if (key === 'ArrowUp') setDirection(0, -gridSize);
  else if (key === 'ArrowDown') setDirection(0, gridSize);
  else if (key === 'ArrowLeft') setDirection(-gridSize, 0);
  else if (key === 'ArrowRight') setDirection(gridSize, 0);
}

function setDirection(newDx, newDy) {
  if (changingDirection) return;
  if (newDx !== 0 && dx === 0) {
    dx = newDx;
    dy = 0;
  } else if (newDy !== 0 && dy === 0) {
    dx = 0;
    dy = newDy;
  }
  changingDirection = true;
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶️ Reanudar' : '⏸️ Pausar';
}

function isCollision() {
  const head = snake[0];
  return (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  );
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * tileCount) * gridSize,
    y: Math.floor(Math.random() * tileCount) * gridSize
  };
}

function speedUp() {
  if (speed > 50) {
    speed -= 10;
    clearInterval(gameInterval);
    startGame();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  if (score > record) {
    record = score;
    localStorage.setItem('snakeRecord', record);
    recordDisplay.textContent = record;
  }
  alert(`¡Game Over! Tu puntaje es: ${score}`);
}

function restartGame() {
  snake = [{ x: 8 * gridSize, y: 8 * gridSize }];
  food = getRandomPosition();
  dx = gridSize;
  dy = 0;
  score = 0;
  speed = 200;
  scoreDisplay.textContent = score;
  startGame();
}

startGame();

