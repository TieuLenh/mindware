const express = require('express');
const path = require('path')
const httpProxy = require('http-proxy');

const services = require('./service-registry');
const { getNextInstance } = require('./load-balancer');

const logger = require('./logger.js')

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = process.env.PORT || 3000;


// Danh sách origin FE được phép gọi (hoặc đọc từ biến môi trường CORS_ORIGINS)
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173, http://127.0.0.1:5173, http://192.168.1.102:5173/")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

    // Nếu FE có gửi cookie / Authorization header / credentials
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"] || "Content-Type,Authorization"
    );

    // Trả sớm cho preflight request (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});





// Tìm service theo URL prefix
function findService(path) {
    return Object.values(services).find(service => {
        return path === service.prefix ||
            path.startsWith(service.prefix + '/');
    });
}

// Health Check cho tất cả instance
async function checkSingleInstance(instance) {
    const start = Date.now();
    const baseUrl = instance.url.replace(/\/+$/, '');

    try {
        const response = await fetch(
            `${baseUrl}/health`,
            { signal: AbortSignal.timeout(2000) }
        );

        if (response.body) {
            await response.body.cancel();
        }

        const elapsed = Date.now() - start;
        if (!response.ok) {
            logger.write(
                `Health check non-OK for ${instance.id} (${elapsed}ms): HTTP ${response.status}`,
                ['yellow']
            );
        }

        return response.ok;
    } catch (error) {
        const elapsed = Date.now() - start;
        logger.write(
            `Health check failed for ${instance.id} (${baseUrl}) after ${elapsed}ms: ${error.name} - ${error.message}`,
            ['yellow']
        );
        return false;
    }
}

async function healthCheck() {
    const tasks = Object.values(services).flatMap(service =>
        service.instances.map(async instance => {
            const preAlive = instance.alive;
            const ok = await checkSingleInstance(instance);

            if (ok) {
                instance.failCount = 0;
                instance.alive = true;
            } else {
                instance.failCount = (instance.failCount || 0) + 1;
                // Chỉ đánh dấu dead sau 2 lần thất bại liên tiếp để tránh rớt oan nhất thời
                if (instance.failCount >= 2) {
                    instance.alive = false;
                }
            }

            if (preAlive !== instance.alive && instance.alive !== undefined) {
                logger.write(
                    `Server ${instance.id} is ${instance.alive ? 'running' : 'dead'}!`,
                    instance.alive ? ['green', 'bold'] : ['red', 'bold']
                );
            }
        })
    );

    await Promise.allSettled(tasks);
}

async function startHealthLoop() {
    while (true) {
        await healthCheck();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Gateway Health
app.get('/gateway/health', (req, res) => {
    res.json({
        status: 'OK',
        services,
        timestamp: new Date().toLocaleString()
    });
});

// API Router
app.use((req, res, next) => {
    const isApi = req.path === '/api' || req.path.startsWith('/api/');
    if (!isApi) return next();

    const service = findService(req.path);
    if (!service) {
        logger.error(`API[${req.path}] is not matching with any registed service!`)
        return res.status(404).json({
            message: 'Service not found'
        });
    }
    const instance = getNextInstance(service);
    if (!instance) {
        logger.error(`SERVICE[${service}] is not supporting for ${req.path}!`)
        return res.status(503).json({
            message: 'Service unavailable',
            service: service.prefix
        });
    }
    logger.write(
        `[GATEWAY] ${req.method} ${req.path} -> ${instance.id}`, 'importance'
    );
    proxy.web(req, res, {
        target: instance.url
    });
});


app.use('/health', (req, res)=>{
    res.json(
        {
            status: 'ok',
        }
    )
})

app.use('/', (req, res) => {
    return res.sendFile(path.join(path.join(__dirname, 'public'), 'index.html'));
})

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
    startHealthLoop();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Gateway is running on: http://localhost:${PORT}`);
    });
}

start();
