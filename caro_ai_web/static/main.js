const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const SIZE = 15;
const CELL_SIZE = 40;
canvas.width = SIZE * CELL_SIZE;
canvas.height = SIZE * CELL_SIZE;

let board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let lastMove = null;
let winLine = null;
let gameOver = false;

// Tên người chơi
let playerName = '';

function askName() {
  playerName = prompt("Nhập tên người chơi:").trim();
  if (!playerName) playerName = "Người chơi Ẩn danh";
}
askName();

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
    body: JSON.stringify({ board: board })
  });
  const data = await res.json();
  const [aiX, aiY] = data.move;
  board[aiY][aiX] = -1;
  lastMove = [aiX, aiY];
  drawBoard();

  if (checkWin(-1)) {
    showWin(-1);
  }
});

function showWin(player) {
  gameOver = true;
  drawBoard();
  setTimeout(() => {
    const result = `${playerName} ${player === 1 ? "thắng" : "thua"} AI | ${new Date().toLocaleString()}`;
    alert(result);
    // Gửi về server để lưu
    fetch("/save-result", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ result })
    });
  }, 100);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  if (lastMove) {
    const [x, y] = lastMove;
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 3;
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.lineWidth = 1;
  }

  if (winLine) {
    drawWinLine(winLine.start, winLine.end);
  }
}

// Giữ checkWin() và drawWinLine() như bạn đã có.
// Reset và các phần còn lại giữ nguyên.
drawBoard();
