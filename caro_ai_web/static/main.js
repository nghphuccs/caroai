
const SIZE = 15;
const CELL_SIZE = 40;
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const size = 15;
const cellSize = 40;
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
let board = Array.from({ length: size }, () => Array(size).fill(0));
let playerTurn = true;
let lastMove = null;
let winLine = null;

drawBoard();
// Vẽ bàn cờ
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ ô lưới
  ctx.strokeStyle = '#000';
  for (let i = 0; i <= size; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, size * cellSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(size * cellSize, i * cellSize);
    ctx.stroke();
  }

  // Vẽ quân cờ
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = board[y][x];
      if (val !== 0) {
        ctx.fillStyle = val === 1 ? 'green' : 'red';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val === 1 ? 'X' : 'O', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      }
    }
  }

  // Vẽ ô viền nước vừa đánh
  if (lastMove) {
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2;
    ctx.strokeRect(lastMove[0] * cellSize, lastMove[1] * cellSize, cellSize, cellSize);
  }

  // Vẽ đường thắng
  if (winLine) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(winLine[0][0] * cellSize + cellSize / 2, winLine[0][1] * cellSize + cellSize / 2);
    ctx.lineTo(winLine[1][0] * cellSize + cellSize / 2, winLine[1][1] * cellSize + cellSize / 2);
    ctx.stroke();
  }
}

// Xử lý click
canvas.addEventListener('click', async (e) => {
  if (!playerTurn || winLine) return;

canvas.addEventListener("click", async (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  if (board[y][x] !== 0) return;

  board[y][x] = 1; // Player move
  board[y][x] = 1;
  lastMove = [x, y];
  drawBoard();

  // Gọi API AI move
  const response = await fetch("/ai-move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  const playerWin = checkWin(1);
  if (playerWin) {
    winLine = playerWin;
    alert('Player WIN!');
    drawBoard();
    return;
  }

  playerTurn = false;

  // Gửi API AI move
  const res = await fetch('/ai-move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ board })
  });

  const data = await response.json();
  const data = await res.json();
  const [aiX, aiY] = data.move;

  board[aiY][aiX] = -1;
  lastMove = [aiX, aiY];
  drawBoard();

  const aiWin = checkWin(-1);
  if (aiWin) {
    winLine = aiWin;
    alert('AI WIN!');
    drawBoard();
    return;
  }

  playerTurn = true;
});

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
// Hàm check thắng
function checkWin(player) {
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];

  for (let i = 0; i <= SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, SIZE * CELL_SIZE);
    ctx.stroke();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === player) {
        for (const [dx, dy] of directions) {
          let count = 1;
          let endX = x, endY = y;

    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(SIZE * CELL_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }
          for (let k = 1; k < 5; k++) {
            const nx = x + dx * k;
            const ny = y + dy * k;
            if (nx >= 0 && ny >= 0 && nx < size && ny < size && board[ny][nx] === player) {
              count++;
              endX = nx;
              endY = ny;
            } else {
              break;
            }
          }

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] === 1) {
        ctx.fillStyle = "red";
        ctx.fillRect(x * CELL_SIZE + 10, y * CELL_SIZE + 10, 20, 20);
      } else if (board[y][x] === -1) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x * CELL_SIZE + 20, y * CELL_SIZE + 20, 10, 0, 2 * Math.PI);
        ctx.fill();
          if (count === 5) {
            return [[x, y], [endX, endY]];
          }
        }
      }
    }
  }
  return null;
}

// Nút chơi lại
document.getElementById('reset').addEventListener('click', () => {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  playerTurn = true;
  lastMove = null;
  winLine = null;
  drawBoard();
});

drawBoard();
