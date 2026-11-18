
const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;
const SERVER_ID = process.env.SERVER_ID || 'BE-01';

// Health Check
app.get('/health', (req, res) => {
    const result = {
        status: 'OK',
        server: SERVER_ID
    }
    res.json(result);
});

// API
app.get('/api/users', (req, res) => {
    res.json({
        message: 'Hello from Backend',
        server: SERVER_ID,
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// API nhận dữ liệu
app.post('/api/data', (req, res) => {
    res.json({
        server: SERVER_ID,
        received: req.body
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER_ID=${SERVER_ID} PORT=${PORT} is running`);
});
