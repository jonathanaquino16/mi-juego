const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Pelota
const ballRadius = 8;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3.2;
let dy = -3.2;

// Paleta
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Controles
let rightPressed = false;
let leftPressed = false;

// Más ladrillos
const brickRowCount = 6;
const brickColumnCount = 8;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Puntos y vidas
let score = 0;
let lives = 3;

// Colores suaves
const brickColors = ["#d6eaf8", "#aed6f1", "#85c1e9", "#5dade2", "#3498db", "#2e86c1"];

// Matriz de ladrillos
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Eventos
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});
document.addEventListener("mousemove", (e) => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width)
    paddleX = relativeX - paddleWidth / 2;
});

// Colisiones
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("¡Ganaste!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Dibujar pelota
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#555";
  ctx.fill();
  ctx.closePath();
}

// Dibujar paleta
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#666";
  ctx.fill();
  ctx.closePath();
}

// Dibujar ladrillos
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColors[r % brickColors.length];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Dibujar puntuación y vidas
function drawScore() {
  ctx.font = "14px monospace";
  ctx.fillStyle = "#222";
  ctx.fillText("Puntos: " + score, 8, 20);
}
function drawLives() {
  ctx.font = "14px monospace";
  ctx.fillStyle = "#222";
  ctx.fillText("Vidas: " + lives, canvas.width - 70, 20);
}

// Loop principal
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Rebotes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      lives--;
      if (!lives) {
        alert("Fin del juego");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3.2;
        dy = -3.2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Movimiento de paleta
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
  else if (leftPressed && paddleX > 0) paddleX -= 6;

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

draw();
