const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval, gameStarted = false;
let birdX = 50, birdY = 200, birdVel = 0, gravity = 0.5, birdSize = 20;
let pipes = [];
let frameCount = 0;
let score = 0;

function update() {
  birdVel += gravity;
  birdY += birdVel;
  frameCount++;

  if (frameCount % 80 === 0) {
    let gapY = Math.random() * (canvas.height - 150) + 50;
    pipes.push({ x: canvas.width, y: gapY, passed: false });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 4;
    
    // Collision bounds
    if (birdX + birdSize > p.x && birdX < p.x + 40) {
      if (birdY < p.y - 60 || birdY + birdSize > p.y + 60) return gameOver(false);
    }
    
    // Pass logic
    if (p.x < birdX && !p.passed) {
      score += 10;
      const sb = document.getElementById("scoreBoard");
      if(sb) sb.innerText = `Dinero: $${score}`;
      p.passed = true;
    }
  }

  if (birdY > canvas.height || birdY < 0) {
    return gameOver(false);
  }
  
  if (score >= 100) {
    return gameOver(true);
  }
  
  pipes = pipes.filter(p => p.x > -40);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Bird
  ctx.fillStyle = "#FFD600";
  ctx.fillRect(birdX, birdY, birdSize, birdSize);

  // Pipes
  ctx.fillStyle = "#4CAF50";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, 40, p.y - 60);
    ctx.fillRect(p.x, p.y + 60, 40, canvas.height - p.y - 60);
  }
}

function drawStartScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Flappy Box", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Barra espaciadora para saltar", canvas.width / 2, canvas.height / 2 + 30);
}

function gameOver(won = false) {
  clearInterval(gameInterval);
  drawStartScreen();
  if (won) {
    const winModal = document.getElementById('win-modal');
    if (winModal) {
      winModal.classList.add('visible');
      const claimBtn = document.getElementById('claim-prize-btn');
      if (claimBtn) {
        claimBtn.onclick = () => window.location.href = "prize.html";
      }
    } else {
      setTimeout(() => window.location.href = "prize.html", 1500);
    }
  } else {
    ctx.fillText("Perdiste!", canvas.width / 2, canvas.height / 2 - 10);
    if (typeof window.showCasinoPopupRandom === 'function') {
      window.showCasinoPopupRandom(0.5);
    }
    setTimeout(() => window.location.href = "../index.html", 2000);
  }
}

function start() {
  birdY = 200; birdVel = 0; score = 0; frameCount = 0; pipes = [];
  if(document.getElementById("scoreBoard")) document.getElementById("scoreBoard").innerText = `Dinero: $${score}`;
  gameStarted = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 20);
}

window.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.code === "Space") {
    e.preventDefault();
    if (!gameStarted) start(); else birdVel = -8;
  }
});
drawStartScreen();