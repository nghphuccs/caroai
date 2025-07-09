from flask import Flask, request, jsonify, render_template
import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ai-move", methods=["POST"])
def ai_move():
    data = request.get_json()
    board = data["board"]
    # Gọi thuật toán minimax gốc của bạn
    move = get_best_move(board)  # <-- Giữ nguyên logic AI cũ!
    return jsonify({"move": move})

@app.route("/save-result", methods=["POST"])
def save_result():
    data = request.get_json()
    result = data["result"]
    with open("history.txt", "a", encoding="utf-8") as f:
        f.write(result + "\n")
    return jsonify({"status": "ok"})

# === Thuật toán minimax AI ===
def get_best_move(board):
    # Thuật toán gốc minimax của bạn ở đây
    # Trả về tuple [x, y]
    # Dummy:
    for y in range(len(board)):
        for x in range(len(board[0])):
            if board[y][x] == 0:
                return [x, y]
    return [0, 0]

if __name__ == "__main__":
    app.run(debug=True)
