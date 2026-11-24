import os
import logging
from flask import Flask, jsonify, request
from routes.product_routes import product_routes
from flask_cors import CORS

from logger import TerminalLog

logging.getLogger("werkzeug").setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv("PORT", 4002))
SERVER_ID = os.environ.get("SERVER_ID", "PRODUCT-01")

app.register_blueprint(product_routes)


@app.after_request
def log_request(response):
    method = request.method
    path = request.path  # hoặc request.full_path nếu muốn kèm query string ?a=1
    status_code = response.status_code

    # Chọn style màu theo status code cho dễ nhìn
    if status_code >= 500:
        style = "error"
    elif status_code >= 400:
        style = ["bold", "yellow"]
    else:
        style = "importance"

    msg = f"[{SERVER_ID}] '{method}' {path} - status:{status_code}"
    TerminalLog.write(msg, style=style, showDate=False, showTime=True)
    return response


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "service": "product-service",
        "SERVER_ID": SERVER_ID,
        "status": "OK"
    })


if __name__ == "__main__":
    TerminalLog.write(
        f"[{SERVER_ID}] Starting server on 0.0.0.0:{PORT}",
        style=["bold", "cyan"]
    )
    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=False
    )