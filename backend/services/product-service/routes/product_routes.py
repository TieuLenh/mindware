
from flask import Blueprint, request, jsonify

product_routes = Blueprint(
    'product',
    __name__,
    url_prefix='/api/products'
)

# Dữ liệu giả lập
products = [
    {
        'id': 1,
        'name': 'Laptop',
        'price': 20000000
    },
    {
        'id': 2,
        'name': 'Keyboard',
        'price': 1000000
    }
]


# GET /api/products
@product_routes.route('/', methods=['GET'])
def get_products():

    return jsonify({
        'service': 'product-service',
        'data': products
    })


# GET /api/products/:id
@product_routes.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):

    product = next(
        (p for p in products if p['id'] == product_id),
        None
    )

    if product is None:
        return jsonify({
            'message': 'Product not found'
        }), 404

    return jsonify({
        'service': 'product-service',
        'data': product
    })


# POST /api/products
@product_routes.route('/', methods=['POST'])
def create_product():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            'message': 'Invalid JSON body'
        }), 400

    product = {
        'id': max((p['id'] for p in products), default=0) + 1,
        'name': data.get('name'),
        'price': data.get('price')
    }

    products.append(product)

    return jsonify({
        'service': 'product-service',
        'message': 'Product created',
        'data': product
    }), 201
