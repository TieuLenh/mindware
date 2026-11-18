import os
from flask import Flask, jsonify
from routes.product_routes import product_routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PORT = os.getenv('PORT', 3003)


# Register Blueprint
app.register_blueprint(product_routes)


# Health Check
@app.route('/health', methods=['GET'])
def health():

    return jsonify({
        'service': 'product-service',
        'status': 'OK'
    })


if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=False
    )
