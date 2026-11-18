
const express = require('express');
const httpProxy = require('http-proxy');

const services = require('./service-registry');
const { getNextInstance } = require('./load-balancer');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = process.env.PORT || 3000;

// Tìm service theo URL prefix
function findService(path) {
    return Object.values(services).find(service => {
        return path === service.prefix ||
               path.startsWith(service.prefix + '/');
    });
}

// Health Check cho tất cả instance
async function healthCheck() {
    await Promise.all(
        Object.values(services).flatMap(service =>
            service.instances.map(async instance => {
                try {
                    const response = await fetch(
                        `${instance.url}/health`,
                        { signal: AbortSignal.timeout(2000) }
                    );
                    instance.alive = response.ok;
                } catch {
                    instance.alive = false;
                }
            })
        )
    );
}

// Gateway Health
app.get('/gateway/health', (req, res) => {
    res.json({
        status: 'OK',
        services
    });
});

// API Router
app.use((req, res) => {
    const service = findService(req.path);
    if (!service) {
        return res.status(404).json({
            message: 'Service not found'
        });
    }
    const instance = getNextInstance(service);
    if (!instance) {
        return res.status(503).json({
            message: 'Service unavailable',
            service: service.prefix
        });
    }
    console.log(
        `[GATEWAY] ${req.method} ${req.url} -> ${instance.id}`
    );
    proxy.web(req, res, {
        target: instance.url
    });
});

// Proxy Error
proxy.on('error', (error, req, res) => {
    console.error('[PROXY ERROR]', error.message);
    if (!res.headersSent) {
        res.writeHead(502, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: 'Bad Gateway'
        }));
    }
});

// Start Gateway
async function start() {
    await healthCheck();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Gateway is running on: http://localhost:${PORT}`);
    });
    setInterval(healthCheck, 5000);
}

start();
