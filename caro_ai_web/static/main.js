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

// Nút chơi lại
const replayButton = document.getElementById("replay-btn");
replayButton.style.display = "none";
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

  board[y][x] = 1; // người chơi
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

function drawBoard() {
  const container = document.getElementById("board");
  container.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";  // <-- Luôn thêm class 'cell'
      
      if (board[y][x] === 1) {
        cell.textContent = "X";
        cell.classList.add("x");
      } else if (board[y][x] === -1) {
        cell.textContent = "O";
        cell.classList.add("o");
      } else {
        cell.textContent = "";  // <-- Đảm bảo ô trống không lỗi
      }

      if (lastMove && lastMove[0] === x && lastMove[1] === y) {
        cell.classList.add("last-move");
      }

      cell.onclick = () => handleClick(x, y);
      container.appendChild(cell);
    }
  }
  drawWinLine();
}


function checkWin(player) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (checkDirection(x, y, 1, 0, player)) {
        winLine = { start: [x, y], end: [x+4, y] };
        return true;
      }
      if (checkDirection(x, y, 0, 1, player)) {
        winLine = { start: [x, y], end: [x, y+4] };
        return true;
      }
      if (checkDirection(x, y, 1, 1, player)) {
        winLine = { start: [x, y], end: [x+4, y+4] };
        return true;
      }
      if (checkDirection(x, y, 1, -1, player)) {
        winLine = { start: [x, y], end: [x+4, y-4] };
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
  ctx.moveTo(start[0] * CELL_SIZE + CELL_SIZE/2, start[1] * CELL_SIZE + CELL_SIZE/2);
  ctx.lineTo(end[0] * CELL_SIZE + CELL_SIZE/2, end[1] * CELL_SIZE + CELL_SIZE/2);
  ctx.stroke();
}

function showWin(player) {
  gameOver = true;
  drawBoard();
  setTimeout(() => {
    alert((player === 1 ? "Bạn" : "AI") + " thắng!");
    replayButton.style.display = "block";
  }, 100);
}
