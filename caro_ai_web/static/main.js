const SIZE = 15;
const boardElement = document.getElementById('board');
const resetBtn = document.getElementById('reset-btn');
const winLineCanvas = document.getElementById('win-line');
const ctx = winLineCanvas.getContext('2d');
winLineCanvas.width = SIZE * 40;
winLineCanvas.height = SIZE * 40;

let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
let gameOver = false;
let lastMove = null;

function renderBoard() {
  boardElement.innerHTML = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (board[y][x] === 1) {
        cell.textContent = 'X';
        cell.classList.add('player');
      } else if (board[y][x] === -1) {
        cell.textContent = 'O';
        cell.classList.add('ai');
      }

      if (lastMove && lastMove.x === x && lastMove.y === y) {
        cell.classList.add('last-move');
      }

      cell.addEventListener('click', () => playerMove(x, y));
      boardElement.appendChild(cell);
    }
  }
}

function playerMove(x, y) {
  if (gameOver || board[y][x] !== 0) return;
  board[y][x] = 1;
  lastMove = { x, y };
  renderBoard();
  if (checkWin(1)) {
    drawWinLine(winLine);
    gameOver = true;
    resetBtn.style.display = 'block';
    alert('Bạn thắng!');
    return;
  }
  aiTurn();
}

async function aiTurn() {
  const res = await fetch('/ai-move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board })
  });
  const data = await res.json();
  const move = data.move;
  if (move) {
    board[move[1]][move[0]] = -1;
    lastMove = { x: move[0], y: move[1] };
    renderBoard();
    if (checkWin(-1)) {
      drawWinLine(winLine);
      gameOver = true;
      resetBtn.style.display = 'block';
      alert('AI thắng!');
    }
  }
}

function checkWin(player) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (checkDirection(x, y, 1, 0, player)) { winLine = [[x, y], [x + 4, y]]; return true; }
      if (checkDirection(x, y, 0, 1, player)) { winLine = [[x, y], [x, y + 4]]; return true; }
      if (checkDirection(x, y, 1, 1, player)) { winLine = [[x, y], [x + 4, y + 4]]; return true; }
      if (checkDirection(x, y, 1, -1, player)) { winLine = [[x, y], [x + 4, y - 4]]; return true; }
    }
  }
  return false;
}

function checkDirection(x, y, dx, dy, player) {
  for (let i = 0; i < 5; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || board[ny][nx] !== player) return false;
  }
  return true;
}

function drawWinLine(line) {
  const [[x1, y1], [x2, y2]] = line;
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1 * 40 + 20, y1 * 40 + 20);
  ctx.lineTo(x2 * 40 + 20, y2 * 40 + 20);
  ctx.stroke();
}

resetBtn.addEventListener('click', () => {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  gameOver = false;
  lastMove = null;
  ctx.clearRect(0, 0, winLineCanvas.width, winLineCanvas.height);
  renderBoard();
  resetBtn.style.display = 'none';
});

renderBoard();
