const express = require('express');
const logger = require('./logger.js')

const app = express();
app.use(express.json());

const { pool, pingDB } = require('./db')

const PORT = process.env.PORT || 4001;
const SERVER_ID = process.env.SERVER_ID || 'USER-01';

async function getUsers() {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
}

const ALLOWED_COLUMNS = {
    email: "email",
    fullName: "full_name",
    full_name: "full_name",
};

async function createUser(user) {
    const columns = [];
    const placeholders = [];
    const values = [];

    for (const [key, val] of Object.entries(user || {})) {
        const dbCol = ALLOWED_COLUMNS[key];
        if (!dbCol || val === undefined) continue;

        columns.push(`\`${dbCol}\``);
        placeholders.push("?");
        values.push(val);
    }

    if (columns.length === 0) {
        throw new Error("Không có trường hợp lệ để thêm người dùng.");
    }

    const sql = `INSERT INTO users (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
    const [result] = await pool.execute(sql, values);

    return {
        id: result.insertId,
        affectedRows: result.affectedRows,
    };
}



// Health Check
app.get('/health', (req, res) => {
    const result = {
        status: 'OK',
        server: SERVER_ID
    }
    res.json(result);
});


// API
app.get("/api/users", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json({
            serverId: SERVER_ID,
            data: users,
            timstamp: new Date().toDateString()
        });
    } catch (err) {
        logger.error(`[${SERVER_ID}] GET /api/users failed: ${err}`);
        res.status(500).json({
            serverId: SERVER_ID,
            message: "Failed to fetch users",
        });
    }
});

// API nhận dữ liệu
app.post('/api/data', (req, res) => {
    res.json({
        server: SERVER_ID,
        received: req.body
    });
});

app.post('/api/users', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body) {
        res.json({ message: 'ERROR!' })
    }

    try{
        let createState = createUser(body);
        res.json({
            message: 'OK'
        });
    }
    catch{

    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER_ID=${SERVER_ID} PORT=${PORT}`);
});
