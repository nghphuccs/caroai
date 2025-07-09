from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ai-move", methods=["POST"])
def ai_move():
    # Ở đây chỉ là ví dụ AI random ô trống:
    data = request.get_json()
    board = data["board"]
    SIZE = 15
    for y in range(SIZE):
        for x in range(SIZE):
            if board[y][x] == 0:
                return jsonify({"move": [x, y]})
    return jsonify({"move": None})

@app.route("/save-history", methods=["POST"])
def save_history():
    data = request.get_json()
    record = data.get("record", "")
    if record:
        with open("history.txt", "a", encoding="utf-8") as f:
            f.write(record + "\n")
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)
