# PRD: Quản lý bài viết, Danh mục, Soi SEO & Trang đọc bài công khai

> **Mã tính năng**: `FEAT-BAI-VIET`
> **Domain**: [Quản lý bài viết & Nội dung mặt tiền](../../../domains/content-article-domain.md)
> **Trạng thái**: Approved
> **Cập nhật lần cuối**: 2026-10-19

---

## 1. Bối cảnh & Mục tiêu (Problem & Goals)

### 1.1. Bối cảnh
Website **Nếp Hiên (`nephien.com`)** đã có trang chủ, danh mục dự án (`/du-an`), giới thiệu (`/gioi-thieu`) và phong cách thiết kế (`/phong-cach`), nhưng đang thiếu hoàn toàn:
1. **Trang đọc bài viết / cẩm nang công khai (`/bai-viet`, `/bai-viet/[slug]`)** để chia sẻ kiến thức thiết kế nội thất, vật liệu, phong cách sống và chính sách dịch vụ, thu hút lưu lượng tìm kiếm tự nhiên (Organic SEO).
2. **Trang quản trị bài viết (`/admin/articles`)** kết nối cơ sở dữ liệu **Neon PostgreSQL** để đội ngũ Nếp Hiên tự chủ biên tập, phân loại danh mục, kiểm tra chuẩn SEO và xuất bản bài viết.

### 1.2. Mục tiêu sản phẩm (Goals)
* **G1 — Tự chủ xuất bản 100%**: Quản trị viên tạo, trình bày, tải ảnh, phân loại danh mục, xuất bản, ẩn hoặc xóa/khôi phục bài viết ngay trên giao diện `/admin/articles`.
* **G2 — Chuẩn hóa SEO On-Page & Technical SEO**: Tích hợp bảng chấm điểm **Soi SEO 12 tiêu chí** trực tiếp khi soạn thảo; tự động sinh mục lục (`muc_luc`), thẻ OpenGraph, dữ liệu có cấu trúc JSON-LD (`Article` + `BreadcrumbList`) và `/sitemap.xml`.
* **G3 — Trải nghiệm đọc chuẩn thẩm mỹ Nếp Hiên (Quiet Luxury)**: Giao diện `/bai-viet` và `/bai-viet/[slug]` đồng điệu tuyệt đối với ngôn ngữ thiết kế Creamy Minimalism (`#F4F0E8`, `#221610`, `#C0562C`, Playfair Display & Raleway).

---

## 2. Chân dung người dùng (User Personas)

1. **Biên tập viên / Quản trị viên Nếp Hiên (Admin)**:
   * Cần công cụ soạn thảo trực quan, có thanh định dạng đầy đủ (H2, H3, H4, đậm, nghiêng, danh sách, trích dẫn, bảng, chèn ảnh), tự lưu nháp khi mất kết nối và bảng Soi SEO trực quan để tối ưu bài viết trước khi bấm **Đăng bài**.
2. **Khách hàng / Gia chủ yêu kiến trúc & nội thất (Độc giả)**:
   * Tìm kiếm ý tưởng thiết kế không gian sống, đọc bài viết chuyên sâu, tra cứu nhanh các phần qua thanh Mục lục và khám phá các bài viết liên quan cùng chủ đề.

---

## 3. User Stories

| Mã | User Story | Độ ưu tiên |
| :--- | :--- | :--- |
| **US-01** | Là **Quản trị viên**, tôi muốn xem danh sách bài viết kèm thống kê nhanh (Tổng số, Đã đăng, Bản nháp, Đang ẩn, Thùng rác), lọc theo từ khóa, danh mục, trạng thái, khoảng ngày đăng và sắp xếp để tìm bài cần biên tập nhanh chóng. | P0 |
| **US-02** | Là **Quản trị viên**, tôi muốn tạo và chỉnh sửa bài viết với trình soạn thảo trực quan, tải ảnh bìa & ảnh trong bài lên hệ thống, tự động sinh `slug` và trích mục lục H2/H3. | P0 |
| **US-03** | Là **Quản trị viên**, tôi muốn theo dõi bảng **Soi SEO** chấm điểm 12 tiêu chí theo thời gian thực khi tôi gõ tiêu đề, mô tả và nội dung để tối ưu hóa bài viết lên top tìm kiếm. | P0 |
| **US-04** | Là **Quản trị viên**, tôi muốn quản lý Danh mục bài viết (thêm, sửa tên/slug/mô tả, đổi thứ tự, bật/tắt hiển thị, xóa danh mục trống) ngay trên trang quản trị. | P0 |
| **US-05** | Là **Quản trị viên**, tôi muốn xóa mềm bài viết vào Thùng rác và có thể khôi phục lại về trạng thái Bản nháp khi cần, đồng thời xem Nhật ký thao tác để biết lịch sử chỉnh sửa. | P1 |
| **US-06** | Là **Độc giả**, tôi muốn truy cập `/bai-viet` để xem các bài viết đã xuất bản, lọc theo từng danh mục, tìm kiếm bài viết và chuyển trang mượt mà. | P0 |
| **US-07** | Là **Độc giả**, tôi muốn đọc bài viết tại `/bai-viet/[slug]` với bố cục tạp chí sang trọng, có Mục lục neo bên trái (hoặc ngăn kéo dưới cùng trên điện thoại) tự sáng mục đang đọc và gợi ý bài viết liên quan. | P0 |

---

## 4. Tiêu chí nghiệm thu (Acceptance Criteria)

* **AC-01 (Quản lý danh mục)**: Tạo mới, sửa tên/mô tả/thứ tự, bật/tắt `hien` của danh mục trên `/admin/articles` (tab Danh mục) cập nhật ngay vào Neon PostgreSQL. Khi thử xóa danh mục đang có bài viết, hệ thống chặn xóa và hiển thị thông báo rõ số bài viết đang thuộc danh mục đó.
* **AC-02 (Tạo & Xuất bản bài viết)**: Khi tạo bài viết mới và bấm **Đăng ngay**, hệ thống làm sạch HTML (`lamSachHtml`), tự gắn `id` vào các thẻ `<h2>`/`<h3>`, lưu mảng `muc_luc`, gán `ngay_dang = now()`, và bài viết xuất hiện ngay tại `/bai-viet` cũng như `/bai-viet/[slug]`.
* **AC-03 (Bảo toàn `ngay_dang`)**: Khi bài viết đã đăng được chỉnh sửa nội dung hoặc chuyển sang `'an'` rồi chuyển lại sang `'dang'`, trường `ngay_dang` giữ nguyên thời điểm xuất bản lần đầu.
* **AC-04 (Xóa mềm & Khôi phục)**: Khi xóa bài viết, bài biến khỏi mặt tiền `/bai-viet` (trả `404` nếu truy cập trực tiếp `/bai-viet/[slug]`) và nằm trong bộ lọc **Thùng rác**. Khi bấm **Khôi phục**, bài quay lại danh sách với trạng thái `'nhap'`.
* **AC-05 (Ẩn theo danh mục)**: Khi tắt công tắc `hien = false` của một danh mục, toàn bộ bài viết thuộc danh mục đó lập tức ẩn khỏi `/bai-viet`, `/bai-viet/[slug]` (trả `404`) và `/sitemap.xml`.
* **AC-06 (Soi SEO 12 tiêu chí)**: Trong màn hình soạn thảo, khung **Soi SEO** tính toán tức thì tỷ lệ % sẵn sàng và trạng thái Đạt / Cần cải thiện của 12 tiêu chí (tiêu đề, mô tả, slug, ảnh bìa, độ dài bài, H2/H3, alt ảnh, liên kết nội bộ, từ khóa ở tiêu đề/mô tả/đoạn đầu/mật độ) mà không chặn thao tác lưu nháp hay đăng bài.
* **AC-07 (Bản nháp cục bộ & Cảnh báo đổi slug)**: Nội dung đang gõ được lưu tạm vào `localStorage` để khôi phục nếu tải lại trang; nếu sửa `slug` của một bài đã từng đăng (`ngay_dang IS NOT NULL`), giao diện hiển thị cảnh báo đổi URL ảnh hưởng SEO.
* **AC-08 (Trải nghiệm đọc & Mục lục)**: Trang `/bai-viet/[slug]` hiển thị mục lục khi bài có từ 2 mục H2/H3 trở lên, bấm vào mục lục cuộn mượt tới đúng tiêu đề đoạn; trên màn hình di động (`375px`) hiển thị nút nổi mở ngăn kéo Mục lục.
* **AC-09 (SEO Kỹ thuật)**: Trang `/bai-viet/[slug]` nhúng thẻ `<script type="application/ld+json">` chứa `Article` và `BreadcrumbList` (đã mã hóa `<` thành `\u003c`), và `/sitemap.xml` liệt kê đầy đủ các URL bài viết công khai.
