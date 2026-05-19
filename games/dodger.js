const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval, gameStarted = false;
let pX = 185, pY = 350, pS = 30;
let leftPressed = false, rightPressed = false;
let blocks = [];
let score = 0;
let frameCount = 0;

function update() {
  if (leftPressed && pX > 0) pX -= 6;
  if (rightPressed && pX < canvas.width - pS) pX += 6;
  
  frameCount++;
  if (frameCount % 20 === 0) {
    blocks.push({ x: Math.random() * (canvas.width - 25), y: 0, w: 25, h: 25 });
  }

  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    b.y += 5 + (score / 150); // Gets faster as score increases

    // Collision condition
    if (b.y + b.h >= pY && b.y <= pY + pS && b.x + b.w >= pX && b.x <= pX + pS) {
      return gameOver();
    }
  }
  
  blocks = blocks.filter(b => b.y < canvas.height);
  score++;
  if (frameCount % 10 === 0 && document.getElementById("scoreBoard")) {
    document.getElementById("scoreBoard").innerText = `Score: ${score}`;
  }
  
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Player
  ctx.fillStyle = "#00897B";
  ctx.fillRect(pX, pY, pS, pS);

  // Blocks
  ctx.fillStyle = "#5D4037";
  for (let b of blocks) ctx.fillRect(b.x, b.y, b.w, b.h);
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Dodger", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Barra espaciadora para empezar", canvas.width / 2, canvas.height / 2 + 30);
}

function gameOver() {
  clearInterval(gameInterval);
  drawStartScreen();
  ctx.fillText("Perdiste!", canvas.width / 2, canvas.height / 2 - 10);
  if (typeof window.showCasinoPopup === 'function') {
    window.showCasinoPopup();
  }
  setTimeout(() => window.location.href = "index.html", 2000);
}

function start() {
  pX = (canvas.width - pS) / 2;
  score = 0; blocks = []; frameCount = 0;
  if (document.getElementById("scoreBoard")) document.getElementById("scoreBoard").innerText = `Score: ${score}`;
  gameStarted = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 20);
}

window.addEventListener("keydown", e => { if (e.key === "ArrowLeft") leftPressed = true; else if (e.key === "ArrowRight") rightPressed = true; else if (e.code === "Space" && !gameStarted) { e.preventDefault(); start(); } });
window.addEventListener("keyup", e => { if (e.key === "ArrowLeft") leftPressed = false; else if (e.key === "ArrowRight") rightPressed = false; });
drawStartScreen();