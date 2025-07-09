from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import smtplib
from email.message import EmailMessage

import ai  # Thuật toán AI minimax của bạn

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/ai-move", methods=["POST"])
def ai_move():
    data = request.json
    board = data["board"]
    move = ai.find_best_move(board)
    return jsonify({"move": move})


@app.route("/save-result", methods=["POST"])
def save_result():
    data = request.get_json()
    player_name = data.get("name", "Người chơi")
    result = data.get("result", "thắng/thua AI")
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    line = f"{player_name} {result} ({time_now})\n"

    # ✅ Lưu file TXT
    with open("history.txt", "a", encoding="utf-8") as f:
        f.write(line)

  
    send_email(player_name, line)

    return jsonify({"status": "ok", "saved": line})



def send_email(player_name, result_text):
    sender = "caroaimailnhp@gmail.com" 
    password = os.environ.get("MAIL_PASSWORD") 

    receiver = "caroaimailnhp@gmail.com"  

    msg = EmailMessage()
    msg.set_content(result_text)
    msg['Subject'] = f"Kết quả Caro AI của {player_name}"
    msg['From'] = sender
    msg['To'] = receiver

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(sender, password)
        smtp.send_message(msg)

    print("đã lưu!")



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
