# Explaining table
+===============+=========================================+
|Cấu hình	    | Ý nghĩa                                 |
+===============+=========================================+
|build	        | Đường dẫn Dockerfile để build Image     |
+---------------+-----------------------------------------+
|container_name	| Đặt tên container cố định               |
+---------------+-----------------------------------------+
|ports	        | Mapping port giữa Host và Container     |
+---------------+-----------------------------------------+
|expose	        | Khai báo port phục vụ giao tiếp nội bộ  |
+---------------+-----------------------------------------+
|environment	| Truyền biến môi trường                  |
+---------------+-----------------------------------------+
|depends_on	    | Khai báo phụ thuộc khởi động            |
+---------------+-----------------------------------------+
|networks	    | Kết nối container vào mạng              |
+---------------+-----------------------------------------+
|restart	    | Chính sách tự khởi động lại             |
+---------------+-----------------------------------------+



# set env values
1. Cơ chế hoạt động của file .env trong Docker Compose
- Giai đoạn 1 — Đọc biến để điền vào file Compose (Interpolation): Khi bạn chạy docker compose up, Docker Compose tự tìm file tên .env tại thư mục làm việc hiện tại (working directory). Các giá trị này dùng để thay thế cho các biểu thức như ${POSTGRES_PASSWORD} bên trong file compose.yml.   
- Giai đoạn 2 — Đưa biến vào môi trường của container: Biến chỉ xuất hiện bên trong container khi bạn chỉ định rõ qua environment: hoặc env_file: trong service.
2. Các cách đưa giá trị vào env của container
- Dùng environment: trong service (kết hợp biến từ .env hoặc gán trực tiếp):
```yml
  app:
    environment:
      DB_PASSWORD: ${POSTGRES_PASSWORD} # Lấy từ .env hoặc biến môi trường của host
      APP_MODE: production              # Gán giá trị cố định trực tiếp
```
(Lưu ý: Nếu viết environment: ["DB_PASSWORD"] mà không có =giá_trị, Compose sẽ lấy giá trị của biến DB_PASSWORD từ môi trường trên máy host/file .env truyền vào container)

- Dùng env_file: để nạp cả file .env (hoặc file env riêng) vào container:
```yml
  app:
    env_file:
      - .env
      - ./config/app.env
```
Cách này nạp toàn bộ cặp KEY=VALUE từ file vào môi trường bên trong container mà không cần liệt kê từng dòng trong environment

- Truyền từ biến môi trường của máy host / shell hoặc cờ --env-file:
    + Nếu biến đã có sẵn trên shell/host (ví dụ export POSTGRES_PASSWORD=123 hoặc biến trong CI/CD), Compose sẽ dùng nó (thường ưu tiên cao hơn giá trị trong .env nếu trùng tên).
    + Nếu file env đặt ở đường dẫn khác hoặc tên khác (ví dụ dev.env), bạn có thể chỉ định khi chạy lệnh:Bashdocker compose --env-file ./envs/dev.env up -d

- Dùng Docker Secrets / mount file (cho dữ liệu nhạy cảm ở production):
Với mật khẩu, private key hoặc token nhạy cảm, thay vì đưa thẳng qua biến môi trường (vì biến env dễ bị lộ qua docker inspect hoặc log ứng dụng), nhiều hệ thống production mount file secret hoặc dùng cơ chế secrets của orchestrator để ứng dụng đọc từ file.3. Mẹo kiểm tra nhanh khi chạyĐể biết chính xác Compose đang "nhìn thấy" cấu hình nào và giá trị ${...} được điền ra sao trước khi khởi chạy, bạn có thể dùng:Bashdocker compose -f docker-compose.db.yml config