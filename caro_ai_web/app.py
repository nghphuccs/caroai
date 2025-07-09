from flask import Flask, render_template, request, jsonify
import os

# Giả sử bạn có file ai.py chứa hàm find_best_move
import ai  

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ai-move", methods=["POST"])
def ai_move():
    data = request.json
    board = data["board"]
    move = ai.find_best_move(board)  # Gọi hàm AI Python
    return jsonify({"move": move})

if __name__ == "__main__":
    # Quan trọng: Render set biến môi trường PORT
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
