# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

1. Clone dự án về :

   ```bash
   git clone https://github.com/tri-0412/ticket-web-frontend.git
   cd ticket-web-frontend
   ```

2. Install dependencies


   ```bash
   npm install 
   ```


3. Start the web
   ```bash
   npm run dev --port 3000
    ```

🧑‍💼 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG DÀNH CHO ADMIN (BAN TỔ CHỨC)
1. Đăng nhập hệ thống quản trị
- Truy cập trang web quản trị (Back-office Web).

- Đăng nhập bằng tài khoản quản trị viên (admin) được cấp.

2. Quản lý sự kiện (Event Management)
- Vào mục Sự kiện / Events:

➕ Tạo sự kiện mới: Nhập tên, mô tả, thời gian, địa điểm, số lượng vé,...

📝 Chỉnh sửa thông tin sự kiện bất kỳ.

🗑️ Xóa sự kiện không còn sử dụng.

3. Quản lý khách hàng (Customer Management)
- Vào mục Khách hàng / Customers:

- Xem danh sách khách đã đăng ký, nhận vé,...

- Cập nhật hoặc xoá thông tin khách hàng nếu cần.

4. Quản lý vé (Ticket Management)
- Vào mục Vé / Tickets:

- Tạo vé mới (theo từng sự kiện).

- Gửi vé đến khách hàng (qua email hoặc thông báo trong app).

- Cập nhật trạng thái vé (đã gửi, đã sử dụng, huỷ, v.v.).

5. Quản lý nhân viên (User / Staff Management)
- Vào mục Người dùng / Users:

➕ Tạo tài khoản nhân viên mới.

📝 Cập nhật hoặc xoá tài khoản nhân viên.

👨‍💼 Phân công nhân viên cho từng sự kiện cụ thể.

- Mỗi nhân viên chỉ thấy và check-in được các sự kiện được phân công.

6. Xem thống kê & lịch sử
- Admin có thể truy cập:

📊 Báo cáo tổng quan: số lượng khách đã check-in, số lượng vé còn lại,...

📜 Lịch sử hoạt động: chi tiết các lượt check-in theo thời gian, nhân viên, sự kiện.
