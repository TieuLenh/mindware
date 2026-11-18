# Giai đoạn 1 – Multiple Node.js Servers
- Tạo nhiều Node.js backend độc lập.
- Mỗi server chạy trên một port.
- Xây dựng các API giống nhau.
- Phân biệt từng server bằng Server ID.
- Kiểm tra giao tiếp HTTP giữa các server.

# Giai đoạn 2 – API Gateway
- Xây dựng một Gateway duy nhất.
- Routing request đến các backend.
- Reverse Proxy.
- Centralized Authentication.
- Middleware xử lý request và response.

# Giai đoạn 3 – Load Balancer
- Round Robin.
- Random.
- Weighted Round Robin.
- Health Check.
- Failover khi một backend bị lỗi.

# Giai đoạn 4 – Database và Distributed Data
- Tích hợp PostgreSQL hoặc MongoDB.
- Connection Pool.
- Redis Cache.
- Tìm hiểu vấn đề đồng bộ dữ liệu.

# Giai đoạn 5 – Microservices
- Tách User Service, Product Service, Order Service.
- Mỗi service có trách nhiệm riêng.
- Giao tiếp đồng bộ qua HTTP.
- Giao tiếp bất đồng bộ qua Message Broker (RabbitMQ).

# Giai đoạn 6 – Container và Deployment
- Docker.
- Docker Compose.
- Nhiều container cho cùng một service.
- Nginx Load Balancer.
- Kubernetes và Service Discovery.