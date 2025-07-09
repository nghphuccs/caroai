vẫn chưa hiện lưới khi load web const SIZE = 15;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
let lastMove = null;
let winLine = null;

function drawBoard() {
  const container = document.getElementById("board");
  container.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[y][x] === 1) {
        cell.textContent = "X";
        cell.classList.add("x");
      } else if (board[y][x] === -1) {
        cell.textContent = "O";
        cell.classList.add("o");
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

function handleClick(x, y) {
  if (board[y][x] !== 0 || winLine) return;
  board[y][x] = 1;
  lastMove = [x, y];
  if (checkWin(1)) {
    drawBoard();
    document.getElementById("reset-btn").style.display = "block";
    return;
  }
  drawBoard();
  fetch("/ai-move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board: board })
  })
  .then(res => res.json())
  .then(data => {
    const [aiX, aiY] = data.move;
    board[aiY][aiX] = -1;
    lastMove = [aiX, aiY];
    if (checkWin(-1)) {
      drawBoard();
      document.getElementById("reset-btn").style.display = "block";
      return;
    }
    drawBoard();
  });
}

function checkWin(player) {
  const inLine = (x, y, dx, dy) => {
    for (let i = 0; i < 5; i++) {
      const nx = x + dx * i, ny = y + dy * i;
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE || board[ny][nx] !== player) return null;
    }
    return Array.from({ length: 5 }, (_, i) => [x + dx * i, y + dy * i]);
  };
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      for (const [dx, dy] of [[1,0],[0,1],[1,1],[1,-1]]) {
        const line = inLine(x, y, dx, dy);
        if (line) { winLine = line; return true; }
      }
    }
  }
  return false;
}

function drawWinLine() {
  const canvas = document.getElementById("win-line");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!winLine) return;
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 3;
  const [start, end] = [winLine[0], winLine[4]];
  ctx.beginPath();
  ctx.moveTo(start[0]*40+20, start[1]*40+20);
  ctx.lineTo(end[0]*40+20, end[1]*40+20);
  ctx.stroke();
}

document.getElementById("reset-btn").onclick = () => {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  lastMove = null; winLine = null;
  document.getElementById("reset-btn").style.display = "none";
  drawBoard();
};

window.onload = function() {
  drawBoard();
};
