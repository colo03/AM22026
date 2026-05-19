const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval, gameStarted = false;
let pX = 175, pY = 360, pW = 60, pH = 15;
let leftPressed = false, rightPressed = false;
let items = [];
let score = 0;
let dropSpeed = 3;
let spawnRate = 60;
let frameCount = 0;

function update() {
  if (leftPressed && pX > 0) pX -= 7;
  if (rightPressed && pX < canvas.width - pW) pX += 7;
  
  frameCount++;
  if (frameCount % spawnRate === 0) {
    items.push({ x: Math.random() * (canvas.width - 20), y: 0, s: 20 });
  }

  for (let i = 0; i < items.length; i++) {
    let it = items[i];
    it.y += dropSpeed;

    // Catch condition
    if (it.y + it.s >= pY && it.y <= pY + pH && it.x + it.s >= pX && it.x <= pX + pW) {
      score += 10;
      if(document.getElementById("scoreBoard")) document.getElementById("scoreBoard").innerText = `Score: ${score}`;
      items.splice(i, 1);
      i--;
      if (score % 50 === 0) { dropSpeed += 0.5; spawnRate = Math.max(20, spawnRate - 5); }
    } else if (it.y > canvas.height) {
      return gameOver();
    }
  }
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7B1FA2";
  ctx.fillRect(pX, pY, pW, pH); // Basket

  ctx.fillStyle = "#E53935";
  for (let it of items) ctx.fillRect(it.x, it.y, it.s, it.s);
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Atrápalo", canvas.width / 2, canvas.height / 2 - 10);
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
  pX = (canvas.width - pW) / 2;
  score = 0; items = []; dropSpeed = 3; spawnRate = 60; frameCount = 0;
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

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") leftPressed = false; else if (e.key === "ArrowRight") rightPressed = false;
});
drawStartScreen();