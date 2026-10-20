# Spec: Đặc tả Chi tiết Yêu cầu Tư vấn Khách hàng — Nếp Hiên (`nephien.com`)

> **Mã tính năng**: `FEAT-YEU-CAU-TU-VAN`
> **RFC tham chiếu**: [`yeu-cau-tu-van-rfc.md`](./yeu-cau-tu-van-rfc.md)
> **Nguồn chân lý**: `src/lib/db-schema.sql`, `src/lib/content/bai-viet-service.ts`, `src/app/admin/articles/_TabTuVan.tsx`

---

## 1. Cấu trúc Bảng Cơ sở Dữ liệu (`yeu_cau_tu_van`)

```sql
CREATE TABLE IF NOT EXISTS yeu_cau_tu_van (
  id               bigserial PRIMARY KEY,
  ho_ten           varchar(140) NOT NULL,
  so_dien_thoai    varchar(30) NOT NULL,
  email            varchar(160) NOT NULL DEFAULT '',
  dich_vu          varchar(120) NOT NULL DEFAULT '',
  dien_tich        varchar(160) NOT NULL DEFAULT '',
  loi_nhan         text NOT NULL DEFAULT '',
  nguon            varchar(40) NOT NULL DEFAULT 'form_trang_chu',
  ma_uu_dai        varchar(60) NOT NULL DEFAULT '',
  trang_thai       varchar(30) NOT NULL DEFAULT 'moi',
  ghi_chu_noi_bo   text NOT NULL DEFAULT '',
  nguoi_phu_trach  varchar(120) NOT NULL DEFAULT '',
  ngay_tao         timestamptz NOT NULL DEFAULT now(),
  ngay_cap_nhat    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_yctv_nguon CHECK (nguon IN ('form_trang_chu', 'form_qr_uu_dai', 'khac')),
  CONSTRAINT chk_yctv_trang_thai CHECK (trang_thai IN ('moi', 'dang_lien_he', 'da_hen_lich', 'hoan_thanh', 'huy'))
);

CREATE INDEX IF NOT EXISTS idx_yctv_quan_tri
  ON yeu_cau_tu_van (trang_thai, ngay_tao DESC);
```

---

## 2. Đặc tả Hợp đồng API (API Contracts)

### 2.1. `POST /api/v1/storefront/consultations` (Công khai)
* **Mục đích**: Tiếp nhận yêu cầu tư vấn từ `ContactForm.tsx` (`/#contact-form`) và `UuDaiPage` (`/uu-dai`).
* **Request Body (`application/json` hoặc `multipart/form-data`)**:
  ```json
  {
    "hoTen": "Nguyễn Minh Khôi",
    "soDienThoai": "0901234567",
    "email": "minhkhoi@example.com",
    "dichVu": "Thiết kế nội thất",
    "dienTich": "100 – 200m²",
    "loiNhan": "Cần tư vấn thiết kế căn hộ 3PN phong cách Indochine.",
    "nguon": "form_trang_chu",
    "maUuDai": "",
    "_gotcha": ""
  }
  ```
* **Responses**:
  * `201 Created`: Trả về đối tượng `YeuCauTuVanDto` vừa lưu.
  * `400 Bad Request`: `{ "message": "Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)." }` hoặc `{ "message": "Số điện thoại không hợp lệ (VD: 0901 234 567)." }`.

### 2.2. `GET /api/v1/admin/consultations` (Quản trị — Yêu cầu đăng nhập)
* **Query Parameters**:
  * `tuKhoa` (tùy chọn): Tìm kiếm `ILIKE` trên `ho_ten`, `so_dien_thoai`, `email`, `dich_vu`, `dien_tich`, `loi_nhan`.
  * `trangThai` (tùy chọn): `'moi' | 'dang_lien_he' | 'da_hen_lich' | 'hoan_thanh' | 'huy'`.
  * `nguon` (tùy chọn): `'form_trang_chu' | 'form_qr_uu_dai' | 'khac'`.
  * `trang` (mặc định `1`), `kichThuoc` (mặc định `15`, tối đa `50`).
* **Response `200 OK`**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "hoTen": "Trần Minh Quân",
        "soDienThoai": "0909888123",
        "email": "minhquan.tran@gmail.com",
        "dichVu": "Thiết kế & Thi công trọn gói",
        "dienTich": "100 – 200m²",
        "loiNhan": "Gia đình mình chuẩn bị nhận bàn giao căn hộ Duplex 145m²...",
        "nguon": "form_trang_chu",
        "maUuDai": "",
        "trangThai": "moi",
        "ghiChuNoiBo": "Khách hàng tiềm năng cần KTS trưởng tư vấn mặt bằng công năng.",
        "nguoiPhuTrach": "KTS. Lâm Vũ",
        "ngayTao": "2026-10-20T07:15:00.000Z",
        "ngayCapNhat": "2026-10-20T07:15:00.000Z"
      }
    ],
    "tong": 2,
    "trang": 1,
    "kichThuoc": 15,
    "thongKe": {
      "tatCa": 2,
      "moi": 1,
      "dangLienHe": 0,
      "daHenLich": 1,
      "hoanThanh": 0,
      "huy": 0
    }
  }
  ```

### 2.3. `PATCH /api/v1/admin/consultations/[id]` (Quản trị — Yêu cầu đăng nhập)
* **Request Body**:
  ```json
  {
    "trangThai": "da_hen_lich",
    "nguoiPhuTrach": "KTS. Lâm Vũ",
    "ghiChuNoiBo": "Đã hẹn khảo sát hiện trạng lúc 9h30 sáng Thứ Bảy."
  }
  ```
* **Response `200 OK`**: Trả về `YeuCauTuVanDto` sau khi cập nhật.

### 2.4. `DELETE /api/v1/admin/consultations/[id]` (Quản trị — Yêu cầu đăng nhập)
* **Response `200 OK`**: `{ "ok": true }`.

---

## 3. Đặc tả Giao diện Quản trị (`_TabTuVan.tsx`)

1. **Điều hướng Sidebar (`_AdminSidebar.tsx`)**:
   * Mục **"Yêu cầu tư vấn"** (`tab = 'tu_van'`) nằm trong nhóm **Quản lý nội dung**, hiển thị huy hiệu số lượng tổng yêu cầu tư vấn (`soTuVan`).
2. **5 Thẻ Thống kê & Lọc nhanh (`nh-stat-grid`)**:
   * `Tất cả yêu cầu`, `Mới tiếp nhận` (màu điểm nhấn `#c0562c`), `Đang liên hệ` (`#1a0dab`), `Đã hẹn lịch KTS` (`#b06000`), `Đã tư vấn xong` (`#137333`).
3. **Bảng Danh sách Yêu cầu (`data-testid="consultations-table"`)**:
   * Dòng có `trangThai === 'moi'` được tô nền ấm nhẹ và gắn nhãn `MỚI` để nổi bật.
   * Số điện thoại gắn liên kết `tel:` giúp Admin/KTS bấm gọi ngay.
   * Cột **Trạng thái & Phụ trách** có `<select>` đổi trạng thái trực tiếp không cần mở modal.
   * Nút **"Chi tiết / Ghi chú"** mở khung biên tập Hồ sơ tư vấn để cập nhật `nguoiPhuTrach` và `ghiChuNoiBo`.
