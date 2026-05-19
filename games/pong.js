const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval;
let gameStarted = false;
let upPressed = false, downPressed = false;

const paddleW = 10, paddleH = 70;
let pY = 165, aiY = 165;
let bX = 200, bY = 200, bDX = 5, bDY = 3, bR = 6;
let pScore = 0, aiScore = 0;

function resetBall() {
  bX = canvas.width / 2;
  bY = canvas.height / 2;
  bDX = -bDX;
  bDY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  if (upPressed && pY > 0) pY -= 6;
  if (downPressed && pY < canvas.height - paddleH) pY += 6;

  // AI movement
  if (aiY + paddleH / 2 < bY - 10) aiY += 4;
  else if (aiY + paddleH / 2 > bY + 10) aiY -= 4;
  
  aiY = Math.max(0, Math.min(canvas.height - paddleH, aiY));

  bX += bDX;
  bY += bDY;

  // Top and bottom collision
  if (bY - bR < 0 || bY + bR > canvas.height) bDY = -bDY;

  // Paddle collision
  if (bX - bR < paddleW && bY > pY && bY < pY + paddleH) bDX = Math.abs(bDX);
  if (bX + bR > canvas.width - paddleW && bY > aiY && bY < aiY + paddleH) bDX = -Math.abs(bDX);

  // Score point
  if (bX < 0) { aiScore++; updateScore(); resetBall(); }
  if (bX > canvas.width) { pScore++; updateScore(); resetBall(); }

  if (pScore >= 5) return gameOver("¡Ganaste!");
  if (aiScore >= 5) return gameOver("Perdiste!");

  draw();
}

function updateScore() {
  const scoreBoard = document.getElementById("scoreBoard");
  if (scoreBoard) scoreBoard.innerText = `Jugador: ${pScore} - Máquina: ${aiScore}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  // Draw paddles
  ctx.fillRect(0, pY, paddleW, paddleH);
  ctx.fillRect(canvas.width - paddleW, aiY, paddleW, paddleH);
  // Draw ball
  ctx.beginPath();
  ctx.arc(bX, bY, bR, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Pong Clásico", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Barra espaciadora para empezar", canvas.width / 2, canvas.height / 2 + 30);
}

function gameOver(msg) {
  clearInterval(gameInterval);
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Volviendo a la pantalla principal", canvas.width / 2, canvas.height / 2 + 30);
  setTimeout(() => window.location.href = "index.html", 2000);
}

function start() {
  pScore = 0; aiScore = 0;
  updateScore();
  resetBall();
  gameStarted = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 20);
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") upPressed = true;
  else if (e.key === "ArrowDown") downPressed = true;
  else if (e.code === "Space" && !gameStarted) { e.preventDefault(); start(); }
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") upPressed = false;
  else if (e.key === "ArrowDown") downPressed = false;
});

drawStartScreen();