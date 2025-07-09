from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime

# Giữ nguyên AI cũ của bạn
import ai  

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ai-move", methods=["POST"])
def ai_move():
    data = request.json
    board = data["board"]
    move = ai.find_best_move(board)  # Thuật toán minimax gốc của bạn
    return jsonify({"move": move})

# ✅ Thêm route mới để lưu lịch sử
@app.route("/save-result", methods=["POST"])
def save_result():
    data = request.get_json()
    player_name = data.get("name", "Người chơi")
    result = data.get("result", "thắng/thua AI")
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    line = f"{player_name} {result} ({time_now})\n"

    with open("history.txt", "a", encoding="utf-8") as f:
        f.write(line)

    return jsonify({"status": "ok", "saved": line})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
