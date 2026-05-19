const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval;
let gameStarted = false;

let x, y, dx, dy, bR = 5;
let paddleW = 75, paddleH = 10, paddleX;
let leftPressed = false, rightPressed = false;
let score = 0;

const rCount = 4, cCount = 5, bW = 60, bH = 20, padding = 10, tOff = 30, lOff = (400 - (5*(60+10)-10))/2;
let bricks = [];

function initBricks() {
  for (let c = 0; c < cCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function update() {
  if (leftPressed && paddleX > 0) paddleX -= 6;
  if (rightPressed && paddleX < canvas.width - paddleW) paddleX += 6;

  x += dx; y += dy;

  if (x + dx > canvas.width - bR || x + dx < bR) dx = -dx;
  if (y + dy < bR) dy = -dy;
  else if (y + dy > canvas.height - bR) {
    if (x > paddleX && x < paddleX + paddleW) {
      dy = -dy;
    } else {
      return gameOver("Perdiste!");
    }
  }

  let won = true;
  for (let c = 0; c < cCount; c++) {
    for (let r = 0; r < rCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        won = false;
        if (x > b.x && x < b.x + bW && y > b.y && y < b.y + bH) {
          dy = -dy;
          b.status = 0;
          score += 10;
          const sb = document.getElementById("scoreBoard");
          if (sb) sb.innerText = `Score: ${score}`;
        }
      }
    }
  }

  if (won) return gameOver("¡Ganaste!");
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Bricks
  for (let c = 0; c < cCount; c++) {
    for (let r = 0; r < rCount; r++) {
      if (bricks[c][r].status === 1) {
        let bX = (c * (bW + padding)) + lOff;
        let bY = (r * (bH + padding)) + tOff;
        bricks[c][r].x = bX;
        bricks[c][r].y = bY;
        ctx.fillStyle = "#FF9800";
        ctx.fillRect(bX, bY, bW, bH);
      }
    }
  }

  // Draw Paddle and Ball
  ctx.fillStyle = "#1565C0";
  ctx.fillRect(paddleX, canvas.height - paddleH, paddleW, paddleH);
  
  ctx.beginPath();
  ctx.arc(x, y, bR, 0, Math.PI * 2);
  ctx.fillStyle = "#E53935";
  ctx.fill();
  ctx.closePath();
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Breakout", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Barra espaciadora para empezar", canvas.width / 2, canvas.height / 2 + 30);
}

function gameOver(msg) {
  clearInterval(gameInterval);
  drawStartScreen();
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2 - 10);
  if (msg === "Perdiste!" && typeof window.showCasinoPopup === 'function') {
    window.showCasinoPopup();
  }
  setTimeout(() => window.location.href = "index.html", 2000);
}

function start() {
  x = canvas.width / 2; y = canvas.height - 30;
  dx = 4; dy = -4; paddleX = (canvas.width - paddleW) / 2;
  score = 0; initBricks();
  if(document.getElementById("scoreBoard")) document.getElementById("scoreBoard").innerText = `Score: ${score}`;
  gameStarted = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 20);
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") leftPressed = true;
  else if (e.key === "ArrowRight") rightPressed = true;
  else if (e.code === "Space" && !gameStarted) { e.preventDefault(); start(); }
});
window.addEventListener("keyup", e => { if (e.key === "ArrowLeft") leftPressed = false; else if (e.key === "ArrowRight") rightPressed = false; });
drawStartScreen();