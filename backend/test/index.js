const autocannon = require("autocannon");

const result = autocannon({
  url: "http://localhost:3000/api/users",
  connections: 1000,   // số kết nối đồng thời
  duration: 15,      // thời gian chạy (giây)
  headers: {
    "accept": "application/json",
  },
});

console.log({
  result
});