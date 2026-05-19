const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let dx = 0;
let dy = -gridSize;
let score = 0;
let gameInterval;
let gameStarted = false;

function randomFoodPosition() {
  return Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
}

function resetFood() {
  food = { x: randomFoodPosition(), y: randomFoodPosition() };
  // Ensure food doesn't spawn on the snake's body
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) resetFood();
  }
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, gridSize - 2, gridSize - 2); // -2 adds a slight grid gap
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return gameOver();
  }

  // Self collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      return gameOver();
    }
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("scoreBoard").innerText = `Score: ${score}`;
    resetFood();
  } else {
    snake.pop(); // Remove tail if no food eaten
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Food
  drawRect(food.x, food.y, "#E53935"); 

  // Draw Snake
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? "#4CAF50" : "#81C784");
  });
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("La serpiente", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Barra espaciadora para empezar", canvas.width / 2, canvas.height / 2 + 30);
}

function gameOver() {
  clearInterval(gameInterval);
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Perdiste!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Volviendo a la pantalla principal", canvas.width / 2, canvas.height / 2 + 30);
  
  setTimeout(() => {
    window.location.href = "index.html"; // Goes back to the main wheel page
  }, 2000);
}

function start() {
  snake = [{ x: 200, y: 200 }];
  dx = 0;
  dy = -gridSize;
  score = 0;
  document.getElementById("scoreBoard").innerText = `Score: ${score}`;
  resetFood();
  gameStarted = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 100);
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
  else if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
  else if (e.code === "Space") {
    e.preventDefault(); // Prevent page scroll
    if (!gameStarted) {
       start();
    }
  }
});

// Initialize canvas with a starting screen
drawStartScreen();