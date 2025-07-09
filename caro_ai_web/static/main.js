const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 15;
const CELL_SIZE = 40;
canvas.width = SIZE * CELL_SIZE;
canvas.height = SIZE * CELL_SIZE;

let board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let gameOver = false;
let lastMove = null;
let winLine = null;

const replayButton = document.getElementById("replay-btn");
replayButton.addEventListener("click", () => {
  board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  gameOver = false;
  lastMove = null;
  winLine = null;
  replayButton.style.display = "none";
  drawBoard();
});

canvas.addEventListener("click", async (e) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  if (board[y][x] !== 0) return;

  board[y][x] = 1;
  lastMove = [x, y];
  drawBoard();

  if (checkWin(1)) {
    showWin(1);
    return;
  }

  const res = await fetch("/ai-move", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ board })
  });
  const data = await res.json();
  const [aiX, aiY] = data.move;
  if (aiX == null) return;

  board[aiY][aiX] = -1;
  lastMove = [aiX, aiY];
  drawBoard();

  if (checkWin(-1)) {
    showWin(-1);
  }
});

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ lưới
  ctx.strokeStyle = "#000";
  for (let i = 0; i <= SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, SIZE * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(SIZE * CELL_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }

  // Vẽ quân cờ
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] !== 0) {
        const cx = x * CELL_SIZE + CELL_SIZE / 2;
        const cy = y * CELL_SIZE + CELL_SIZE / 2;
        ctx.beginPath();
        ctx.fillStyle = board[y][x] === 1 ? "green" : "red";
        ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  // Viền nước cờ cuối
  if (lastMove) {
    const [x, y] = lastMove;
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 3;
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.lineWidth = 1;
  }

  // Gạch thắng
  if (winLine) {
    drawWinLine(winLine.start, winLine.end);
  }

  // Chữ ký
  ctx.fillStyle = "#333";
  ctx.font = "14px Arial";
  ctx.fillText("© Nguyễn Hoàng Phúc KHMT2311040", 5, canvas.height - 5);
}

function checkWin(player) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (checkDirection(x, y, 1, 0, player)) {
        winLine = { start: [x, y], end: [x + 4, y] };
        return true;
      }
      if (checkDirection(x, y, 0, 1, player)) {
        winLine = { start: [x, y], end: [x, y + 4] };
        return true;
      }
      if (checkDirection(x, y, 1, 1, player)) {
        winLine = { start: [x, y], end: [x + 4, y + 4] };
        return true;
      }
      if (checkDirection(x, y, 1, -1, player)) {
        winLine = { start: [x, y], end: [x + 4, y - 4] };
        return true;
      }
    }
  }
  return false;
}

function checkDirection(x, y, dx, dy, player) {
  for (let i = 0; i < 5; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || board[ny][nx] !== player) {
      return false;
    }
  }
  return true;
}

function drawWinLine(start, end) {
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 4;
  ctx.moveTo(start[0] * CELL_SIZE + CELL_SIZE / 2, start[1] * CELL_SIZE + CELL_SIZE / 2);
  ctx.lineTo(end[0] * CELL_SIZE + CELL_SIZE / 2, end[1] * CELL_SIZE + CELL_SIZE / 2);
  ctx.stroke();
}

function showWin(player) {
  gameOver = true;
  drawBoard();
  setTimeout(() => {
    const name = prompt("Nhập tên của bạn:");
    if (!name) return;
    const result = player === 1 ? `${name} thắng AI` : `AI thắng ${name}`;
    const timestamp = new Date().toLocaleString('vi-VN');
    const record = `${result} (${timestamp})`;

    const li = document.createElement("li");
    li.textContent = record;
    document.getElementById("history").appendChild(li);

    fetch("/save-history", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ record })
    });

    replayButton.style.display = "block";
  }, 100);
}

// Bắt đầu
drawBoard();
