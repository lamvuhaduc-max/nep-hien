# Tasks: Triển khai & Kiểm thử Tiếp nhận Yêu cầu Tư vấn — Nếp Hiên (`nephien.com`)

> **Mã tính năng**: `FEAT-YEU-CAU-TU-VAN`
> **Spec tham chiếu**: [`yeu-cau-tu-van-spec.md`](./yeu-cau-tu-van-spec.md)
> **Trạng thái**: Completed (100%)

---

## 1. Danh sách Hạng mục Công việc (Implementation Checklist)

- [x] **TASK-TV-01 — Cơ sở dữ liệu & Tầng nghiệp vụ (`src/lib/db-schema.sql`, `src/lib/content/bai-viet-service.ts`)**:
  - [x] Định nghĩa bảng `yeu_cau_tu_van` và chỉ mục `idx_yctv_quan_tri` trong `src/lib/db-schema.sql`.
  - [x] Cài đặt hàm khởi tạo tự động `damBaoBangYeuCauTuVan()` kèm 2 bản ghi mẫu thực tế khi bảng trống lần đầu.
  - [x] Cài đặt các hàm dịch vụ: `taoYeuCauTuVanCongKhai`, `layThongKeYeuCauTuVanAdmin`, `layDanhSachYeuCauTuVanAdmin`, `capNhatYeuCauTuVanAdmin`, `xoaYeuCauTuVanAdmin`.
- [x] **TASK-TV-02 — API Mặt tiền & Quản trị (`src/app/api/v1/...`)**:
  - [x] `POST /api/v1/storefront/consultations` (`src/app/api/v1/storefront/consultations/route.ts`).
  - [x] `GET /api/v1/admin/consultations` (`src/app/api/v1/admin/consultations/route.ts`).
  - [x] `PATCH` & `DELETE /api/v1/admin/consultations/[id]` (`src/app/api/v1/admin/consultations/[id]/route.ts`).
- [x] **TASK-TV-03 — Kết nối Biểu mẫu Công khai (`src/components/ContactForm.tsx`, `src/app/uu-dai/page.tsx`)**:
  - [x] Cập nhật `ContactForm.tsx` (`/#contact-form`) gửi dữ liệu về `/api/v1/storefront/consultations`.
  - [x] Cập nhật `UuDaiPage` (`/uu-dai`) gửi dữ liệu kèm mã ưu đãi `NEPHIEN-QR-2026` về `/api/v1/storefront/consultations`.
- [x] **TASK-TV-04 — Giao diện Quản trị Yêu cầu Tư vấn (`_TabTuVan.tsx`, `_AdminSidebar.tsx`, `_QuanLyBaiViet.tsx`)**:
  - [x] Xây dựng component `_TabTuVan.tsx` với 5 thẻ thống kê, bộ lọc từ khóa/nguồn/trạng thái, bảng danh sách và khung cập nhật Hồ sơ tư vấn (KTS phụ trách + ghi chú nội bộ).
  - [x] Tích hợp mục **Yêu cầu tư vấn** vào `_AdminSidebar.tsx` và `_QuanLyBaiViet.tsx`, bổ sung bộ lọc nhóm `yeu_cau_tu_van` trong Nhật ký hệ thống.
- [x] **TASK-TV-05 — Tài liệu Kỹ thuật (`docs/`) & Kiểm thử E2E**:
  - [x] Hoàn thiện bộ tài liệu `customer-consultation-domain.md`, `yeu-cau-tu-van-prd.md`, `yeu-cau-tu-van-rfc.md`, `yeu-cau-tu-van-spec.md`, `yeu-cau-tu-van-tasks.md`.
  - [x] Cập nhật `docs/architecture/database-design.md`, `docs/specs/README.md` và `docs/README.md`.
  - [x] Kiểm thử E2E thực tế trên `http://localhost:3000`: Điền form tại `/#contact-form` → kiểm tra hiển thị và cập nhật trạng thái tại `/admin/articles?tab=tu_van`.
