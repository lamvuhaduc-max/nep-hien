# PRD: Tiếp nhận & Quản trị Yêu cầu Tư vấn Khách hàng — Nếp Hiên (`nephien.com`)

> **Mã tính năng**: `FEAT-YEU-CAU-TU-VAN`
> **Domain**: [`customer-consultation-domain.md`](../../../domains/customer-consultation-domain.md)
> **Trạng thái**: Active
> **Cập nhật lần cuối**: 2026-10-20

---

## 1. Bối cảnh & Vấn đề (Problem Statement)

Trên website **Nếp Hiên (`nephien.com`)**, khách hàng có nhu cầu thiết kế và thi công nội thất thường để lại thông tin tại 2 điểm chạm quan trọng:
1. Khu vực **#contact-form ("Điền thông tin của bạn / Tư vấn miễn phí")** ở cuối trang chủ.
2. Trang đích **QR Ưu đãi (`/uu-dai`)** dành cho khách hàng quét mã QR nhận ưu đãi giảm 10% phí thiết kế.

Trước đây, cả hai biểu mẫu chỉ gửi dữ liệu ra dịch vụ bên thứ ba (Formspree) mà **chưa lưu vào cơ sở dữ liệu Neon PostgreSQL** và **chưa có màn hình quản trị trong Studio CMS (`/admin/articles`)**. Điều này dẫn tới:
* Đội ngũ quản trị và Kiến trúc sư (KTS) đăng nhập vào trang quản trị không nhìn thấy danh sách khách hàng đã đăng ký tư vấn.
* Không thể theo dõi trạng thái xử lý từng khách hàng (`Mới tiếp nhận`, `Đang liên hệ`, `Đã hẹn lịch KTS`, `Đã tư vấn xong`), không biết KTS nào đang phụ trách và không có nơi ghi chú nội dung trao đổi nội bộ.

---

## 2. Mục tiêu Sản phẩm (Goals & Success Metrics)

1. **100% yêu cầu tư vấn được lưu vào Neon PostgreSQL**: Mọi lượt gửi hợp lệ từ `/#contact-form` và `/uu-dai` phải xuất hiện ngay lập tức trong trang quản trị.
2. **Quản lý tập trung ngay tại `/admin/articles?tab=tu_van`**:
   * Hiển thị số lượng yêu cầu tư vấn trên thanh menu trái (`AdminSidebar`).
   * Cung cấp 5 thẻ thống kê trạng thái trực quan để lọc nhanh bằng 1 cú nhấp chuột.
   * Cho phép đổi trạng thái nhanh ngay trên bảng hoặc mở khung **Hồ sơ tư vấn** để phân công KTS phụ trách và ghi chú nội bộ.
3. **Lưu vết đầy đủ trong Nhật ký hệ thống (`/admin/articles?tab=nhat_ky`)**: Kiểm toán rõ ràng thời점 khách gửi form và lịch sử Admin/KTS cập nhật hồ sơ.

---

## 3. Chân dung Người dùng & Câu chuyện Người dùng (User Stories)

| ID | Vai trò | Câu chuyện người dùng (User Story) | Giá trị mang lại |
| :--- | :--- | :--- | :--- |
| **US-01** | **Khách hàng (Chủ nhà)** | Khi xem các dự án của Nếp Hiên ở trang chủ, tôi muốn điền Họ tên, Số điện thoại, Dịch vụ quan tâm, Diện tích và Ý tưởng vào mục **Tư vấn miễn phí (`/#contact-form`)** để được KTS gọi lại trong 24 giờ. | Gửi thông tin nhanh chóng, nhận thông báo xác nhận rõ ràng. |
| **US-02** | **Khách hàng QR (`/uu-dai`)** | Khi quét mã QR ưu đãi của Nếp Hiên, tôi muốn điền Tên chủ nhà, SĐT, Email, Mã căn và Nhu cầu (`Để ở` / `Cho thuê` / `Gửi bán lại`) để giữ mã ưu đãi `NEPHIEN-QR-2026`. | Giữ quyền lợi giảm 10% phí thiết kế và được ưu tiên xếp lịch khảo sát. |
| **US-03** | **Admin / Chuyên viên CSKH** | Khi đăng nhập vào `/admin/articles`, tôi muốn mở mục **Yêu cầu tư vấn** để xem danh sách khách hàng mới nhất, gọi điện trực tiếp qua liên kết `tel:` và chuyển trạng thái sang `Đang liên hệ` hoặc `Đã hẹn lịch KTS`. | Không bỏ sót khách hàng mới, phản hồi đúng cam kết 2–24 giờ. |
| **US-04** | **Kiến trúc sư trưởng / Super Admin** | Tôi muốn gán tên KTS phụ trách và ghi chú lại kết quả khảo sát, ngân sách dự kiến, gu thẩm mỹ của khách ngay trên hồ sơ tư vấn. | Đồng bộ thông tin xuyên suốt giữa bộ phận CSKH và đội ngũ KTS thiết kế. |

---

## 4. Tiêu chí Nghiệm thu (Acceptance Criteria — Given/When/Then)

### AC-01: Gửi biểu mẫu Tư vấn miễn phí từ Trang chủ (`/#contact-form`)
* **Given**: Khách hàng truy cập `nephien.com/#contact-form`.
* **When**: Khách hàng nhập Họ và tên (`>= 2` ký tự), Số điện thoại di động Việt Nam hợp lệ (`0901 234 567`), chọn Dịch vụ (`Thiết kế nội thất`), chọn Diện tích (`100 – 200m²`), nhập Ý tưởng và nhấn **"Gửi yêu cầu tư vấn →"**.
* **Then**:
  * Hệ thống gọi `POST /api/v1/storefront/consultations` trả về mã `201 Created`.
  * Dữ liệu được lưu vào bảng `yeu_cau_tu_van` với `nguon = 'form_trang_chu'`, `trang_thai = 'moi'`.
  * Giao diện hiển thị màn hình xác nhận **"Gửi thành công!"** kèm nút **"Gửi yêu cầu khác"**.

### AC-02: Gửi biểu mẫu Đăng ký QR Ưu đãi (`/uu-dai`)
* **Given**: Khách hàng truy cập `nephien.com/uu-dai`.
* **When**: Khách hàng nhập Tên chủ nhà, Số điện thoại, Email, Mã căn, chọn Nhu cầu (`Để ở`) và nhấn **"Nhận ưu đãi ngay →"**.
* **Then**:
  * Hệ thống lưu bản ghi vào `yeu_cau_tu_van` với `nguon = 'form_qr_uu_dai'`, `ma_uu_dai = 'NEPHIEN-QR-2026'` và `trang_thai = 'moi'`.
  * Hiển thị thông báo đăng ký thành công kèm mã `NEPHIEN-QR-2026`.

### AC-03: Quản trị danh sách, lọc và cập nhật hồ sơ tư vấn tại `/admin/articles?tab=tu_van`
* **Given**: Quản trị viên đã đăng nhập vào `/admin/articles` và chọn tab **Yêu cầu tư vấn**.
* **When**: Quản trị viên xem danh sách, bấm chọn 1 thẻ thống kê trạng thái hoặc bấm **"Chi tiết / Ghi chú"** trên 1 dòng yêu cầu tư vấn, nhập tên **Kiến trúc sư phụ trách**, nhập **Ghi chú nội bộ** và nhấn **"Lưu cập nhật tư vấn"**.
* **Then**:
  * Hệ thống gọi `PATCH /api/v1/admin/consultations/[id]` cập nhật `trang_thai`, `nguoi_phu_trach`, `ghi_chu_noi_bo` và `ngay_cap_nhat = now()`.
  * Các thẻ thống kê (`Tất cả`, `Mới tiếp nhận`, `Đang liên hệ`, `Đã hẹn lịch KTS`, `Đã tư vấn xong`) và số đếm trên Sidebar tự động cập nhật chính xác.
  * Một bản ghi `yeu_cau_tu_van.cap_nhat` được thêm vào Nhật ký hệ thống.
