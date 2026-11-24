Dưới đây là bảng tổng hợp các lệnh Linux cơ bản theo định dạng Markdown, chia từng option thành từng dòng phụ (sub-row) kèm theo argument và chức năng tương ứng:

| Command | Option | Argument | Chức năng |
| --- | --- | --- | --- |
| **`pwd`** | *(không có)* | *(không có)* | Hiển thị đường dẫn tuyệt đối của thư mục làm việc hiện tại. |
| **`ls`** | *(mặc định)* | `[đường_dẫn]` | Liệt kê các tệp và thư mục (bỏ qua tệp ẩn). |
|  | `-l` | `[đường_dẫn]` | Hiển thị dạng danh sách chi tiết (quyền hạn, chủ sở hữu, kích thước, ngày sửa). |
|  | `-a` | `[đường_dẫn]` | Hiển thị tất cả tệp, bao gồm cả tệp ẩn (bắt đầu bằng dấu `.`). |
|  | `-h` | `[đường_dẫn]` | Hiển thị kích thước tệp ở định dạng dễ đọc (KB, MB, GB) — thường dùng kèm `-l`. |
| **`cd`** | *(không có)* | `<đường_dẫn>` | Di chuyển đến thư mục được chỉ định. |
|  | `..` | *(không có)* | Lùi về thư mục cha liền kề. |
|  | `-` | *(không có)* | Quay lại thư mục vừa đứng trước đó. |
| **`cp`** | *(mặc định)* | `<nguồn> <đích>` | Sao chép tệp từ vị trí nguồn sang vị trí đích. |
|  | `-r` | `<thư_mục_nguồn> <đích>` | Sao chép đệ quy toàn bộ thư mục và các tệp bên trong. |
|  | `-i` | `<nguồn> <đích>` | Hỏi xác nhận trước khi ghi đè lên tệp đã tồn tại ở đích. |
| **`mv`** | *(mặc định)* | `<nguồn> <đích>` | Di chuyển tệp/thư mục hoặc đổi tên (nếu cùng thư mục). |
|  | `-f` | `<nguồn> <đích>` | Ghi đè trực tiếp lên đích mà không hỏi xác nhận. |
|  | `-n` | `<nguồn> <đích>` | Không ghi đè nếu tệp ở đích đã tồn tại. |
| **`rm`** | *(mặc định)* | `<tên_tệp>` | Xóa tệp được chỉ định. |
|  | `-r` | `<tên_thư_mục>` | Xóa đệ quy thư mục và toàn bộ nội dung bên trong. |
|  | `-f` | `<tệp/thư_mục>` | Ép buộc xóa ngay lập tức, bỏ qua cảnh báo và tệp chỉ đọc. |
| **`mkdir`** | *(mặc định)* | `<tên_thư_mục>` | Tạo một thư mục mới. |
|  | `-p` | `<đường_dẫn_lồng_nhau>` | Tự động tạo luôn các thư mục cha nếu chúng chưa tồn tại. |
| **`touch`** | *(mặc định)* | `<tên_tệp>` | Tạo tệp rỗng mới hoặc cập nhật thời gian chỉnh sửa của tệp có sẵn. |
| **`cat`** | *(mặc định)* | `<tên_tệp>` | In toàn bộ nội dung tệp ra màn hình terminal. |
|  | `-n` | `<tên_tệp>` | Hiển thị nội dung tệp kèm số thứ tự ở đầu mỗi dòng. |
| **`less`** | *(mặc định)* | `<tên_tệp>` | Mở tệp lớn để đọc theo từng trang (nhấn `q` để thoát, `/` để tìm kiếm). |
| **`grep`** | *(mặc định)* | `"<chuỗi>" <tên_tệp>` | Tìm kiếm và in ra các dòng chứa chuỗi khớp chính xác. |
|  | `-i` | `"<chuỗi>" <tên_tệp>` | Tìm kiếm không phân biệt chữ hoa, chữ thường. |
|  | `-r` | `"<chuỗi>" <thư_mục>` | Tìm kiếm đệ quy trong toàn bộ tệp thuộc thư mục chỉ định. |
|  | `-n` | `"<chuỗi>" <tên_tệp>` | Hiển thị kèm số dòng chứa kết quả tìm thấy. |
| **`find`** | `-name` | `<thư_mục> -name "<mẫu>"` | Tìm tệp/thư mục theo tên (ví dụ: `"*.py"`). |
|  | `-type` | `<thư_mục> -type <f|d>` | Lọc theo loại đối tượng (`f` là tệp tin, `d` là thư mục). |
|  | `-size` | `<thư_mục> -size <kích_thước>` | Tìm tệp theo dung lượng (ví dụ: `+100M` là lớn hơn 100MB). |
| **`chmod`** | *(mặc định)* | `<quyền> <tên_tệp>` | Thay đổi quyền truy cập (đọc/ghi/thực thi) theo mã số (vd: `755`) hoặc ký tự (`+x`). |
|  | `-R` | `<quyền> <thư_mục>` | Áp dụng thay đổi quyền cho thư mục và toàn bộ tệp con bên trong. |
| **`chown`** | *(mặc định)* | `<user>:<group> <tệp>` | Thay đổi chủ sở hữu và nhóm sở hữu của tệp/thư mục. |
|  | `-R` | `<user>:<group> <thư_mục>` | Thay đổi chủ sở hữu đệ quy cho toàn bộ thư mục và nội dung bên trong. |
| **`ps`** | `aux` | *(không có)* | Liệt kê tất cả tiến trình đang chạy của mọi người dùng trên hệ thống. |
| **`top`** | *(mặc định)* | *(không có)* | Theo dõi tài nguyên hệ thống (CPU, RAM) và tiến trình theo thời gian thực. |
| **`df`** | `-h` | `[đường_dẫn]` | Kiểm tra dung lượng trống của các phân vùng ổ đĩa ở dạng dễ đọc (GB/MB). |
| **`du`** | `-sh` | `<tệp/thư_mục>` | Tính tổng dung lượng của một tệp hoặc thư mục ở dạng tóm tắt dễ đọc. |
| **`sudo`** | *(mặc định)* | `<lệnh_cần_chạy>` | Thực thi một lệnh bất kỳ dưới quyền quản trị cao nhất (`root`). |