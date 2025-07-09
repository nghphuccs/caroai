const SIZE = 15;
const CELL_SIZE = 40;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

drawBoard();

canvas.addEventListener("click", async (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  if (board[y][x] !== 0) return;

  board[y][x] = 1; // Player move
  drawBoard();

  // Gọi API AI move
  const response = await fetch("/ai-move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board })
  });

  const data = await response.json();
  const [aiX, aiY] = data.move;
  board[aiY][aiX] = -1;
  drawBoard();
});

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      if (board[y][x] === 1) {
        ctx.fillStyle = "red";
        ctx.fillRect(x * CELL_SIZE + 10, y * CELL_SIZE + 10, 20, 20);
      } else if (board[y][x] === -1) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x * CELL_SIZE + 20, y * CELL_SIZE + 20, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}
