# command 

Lệnh	                            | Chức năng
docker compose config               | Theo dõi file cấu hình
docker compose build <container>    | Build container, không điền <container> thì build hết
docker compose up -d	            | Chạy toàn hệ thống
docker compose down	                | Dừng và xóa container, network
docker compose stop	                | Dừng container
docker compose start	            | Khởi động container đã dừng
docker compose restart	            | Khởi động lại container
docker compose ps	                | Liệt kê container
docker compose logs -f	            | Theo dõi log
docker compose logs -f gateway	    | Xem log Gateway
docker stats	                    | Theo dõi CPU, RAM
docker inspect <container>	        | Xem cấu hình container
docker exec -it <container> sh	    | Truy cập shell container