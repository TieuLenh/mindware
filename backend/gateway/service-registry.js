
const services = {
    users: {
        prefix: '/api/users',
        instances: [
            {
                id: 'USER-01',
                url: 'http://localhost:3001',
                alive: true
            },
            {
                id: 'USER-02',
                url: 'http://localhost:3002',
                alive: true
            }
        ],

        currentIndex: 0
    },

    products: {
        prefix: '/api/products',
        instances: [
            {
                id: 'PRODUCT-01',
                url: 'http://127.0.0.1:5050',
                alive: true
            }
        ],
        currentIndex: 0
    },
};

module.exports = services;
