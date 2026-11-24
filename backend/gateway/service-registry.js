
const services = {
    users: {
        prefix: '/api/users',
        instances: [
            {
                id: 'USER-01',
                url: 'http://user-1:4001',
                alive: true
            },
            {
                id: 'USER-02',
                url: 'http://user-2:4001',
                alive: true
            },
            {
                id: 'USER-03',
                url: 'http://user-3:4001',
                alive: true
            },
        ],
        currentIndex: 0
    },

    products: {
        prefix: '/api/products',
        instances: [
            {
                id: 'PRODUCT-01',
                url: 'http://product-1:4002',
                alive: true
            },
            {
                id: 'PRODUCT-02',
                url: 'http://product-2:4002',
                alive: true
            }
        ],
        currentIndex: 0
    },
};

module.exports = services;
