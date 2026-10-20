# Thiết kế Cơ sở Dữ liệu — Nếp Hiên (`nephien.com`)

**Nguồn chân lý là `src/lib/db.ts` và `src/lib/db-schema.sql` chạy trên Neon Serverless PostgreSQL.** Tài liệu này giải thích kiến trúc dữ liệu, quy ước đặt tên, sơ đồ thực thể và các ràng buộc bảo toàn dữ liệu ở tầng CSDL.

---

## 1. Chiến lược CSDL

* **Hệ quản trị:** **Neon PostgreSQL 17** (Serverless Postgres, vùng `ap-southeast-1` Singapore, kết nối qua connection pooler với `sslmode=require`).
* **Truy cập dữ liệu:** Driver `postgres` (`postgres.js`) kết nối trực tiếp qua biến môi trường `DATABASE_URL` phía Server (Next.js App Router Route Handlers & Server Components), sử dụng parameterized queries chống SQL Injection 100%.
* **Khóa chính:** `bigserial` (`bigint` tự tăng) cho toàn bộ bảng nghiệp vụ.
* **Đặt tên:** **Bảng và cột tiếng Việt không dấu, `snake_case`** (`danh_muc_bai_viet`, `bai_viet`, `anh_bai_viet`, `nhat_ky_bai_viet`) — đồng nhất với chuẩn thiết kế của hệ sinh thái Nếp Hiên (`C:\nephien\nephien`), giúp đối chiếu trực tiếp giữa tài liệu PRD/Spec và câu lệnh SQL.

---

## 2. Sơ đồ thực thể (ERD)

```mermaid
erDiagram
    DANH_MUC_BAI_VIET ||--o{ BAI_VIET : "phan_loai (ON DELETE RESTRICT)"
    TAI_KHOAN_QUAN_TRI ||--o{ NHAT_KY_BAI_VIET : "thuc_hien (ON DELETE SET NULL)"
    BAI_VIET ||--o{ NHAT_KY_BAI_VIET : "ghi_nhan_lich_su"

    TAI_KHOAN_QUAN_TRI {
        bigserial id PK
        varchar_120 tai_khoan UK
        varchar_120 ho_ten
        varchar_200 mat_khau_bam "SHA-256 salted"
        varchar_30 vai_tro "CHECK IN ('super_admin', 'admin')"
        boolean kich_hoat
        timestamptz lan_dang_nhap_cuoi
        timestamptz ngay_tao
        timestamptz ngay_cap_nhat
    }

    DANH_MUC_BAI_VIET {
        bigserial id PK
        varchar_120 ten
        varchar_140 slug UK "CHECK (slug ~ '^[a-z0-9-]+$')"
        text mo_ta
        int thu_tu
        boolean hien
        timestamptz ngay_tao
    }

    BAI_VIET {
        bigserial id PK
        varchar_200 tieu_de
        varchar_220 slug UK "CHECK (slug ~ '^[a-z0-9-]+$')"
        bigint danh_muc_id FK "NOT NULL REFERENCES danh_muc_bai_viet(id)"
        varchar_400 mo_ta_ngan
        text anh_bia
        text noi_dung_html "HTML da lam sach + gan id h2/h3"
        jsonb muc_luc "Mang [{id, chu, bac}]"
        varchar_20 trang_thai "CHECK IN ('nhap', 'dang', 'an')"
        timestamptz ngay_dang "COALESCE(ngay_dang, now()) khi dang lan dau"
        boolean tao_boi_ai
        varchar_120 tac_gia
        boolean noi_bat
        int luot_xem
        timestamptz ngay_tao
        timestamptz ngay_cap_nhat
        timestamptz xoa_luc "Soft delete (NULL = chua xoa)"
    }

    ANH_BAI_VIET {
        bigserial id PK
        varchar_160 ten_file UK
        varchar_80 mime_type
        int kich_thuoc
        bytea du_lieu "Luu nhi phan de phuc vu qua /anh/[name]"
        timestamptz ngay_tao
    }

    NHAT_KY_BAI_VIET {
        bigserial id PK
        varchar_60 hanh_dong
        bigint doi_tuong_id
        bigint nguoi_thuc_hien_id FK
        varchar_120 tai_khoan_thuc_hien
        varchar_30 vai_tro_thuc_hien
        jsonb chi_tiet
        timestamptz ngay_tao
    }
```

---

## 3. Chi tiết các bảng

### 3.1. Bảng `danh_muc_bai_viet`
Lưu trữ các chuyên mục bài viết (ví dụ: *Cẩm nang nội thất*, *Phong cách thiết kế*, *Kiến thức vật liệu*, *Chính sách & Bảo hành*).

* **Ràng buộc khóa ngoại `ON DELETE RESTRICT` từ `bai_viet.danh_muc_id`:** Không cho phép xóa danh mục đang còn bài viết (kể cả bài nháp hoặc bài trong thùng rác), tránh mất phân loại bài viết trong im lặng.
* **Cờ `hien` (`boolean`):** Khi `hien = false`, toàn bộ bài viết thuộc danh mục này tự động ẩn khỏi danh sách công khai `/bai-viet`, trang đọc bài `/bai-viet/[slug]` và `/sitemap.xml` mà không cần sửa trạng thái từng bài.

### 3.2. Bảng `bai_viet`
Bảng trung tâm lưu trữ bài viết kiến trúc & nội thất của Nếp Hiên.

* **Bảo toàn `ngay_dang`:** Ràng buộc `chk_bv_dang_co_ngay CHECK (trang_thai <> 'dang' OR ngay_dang IS NOT NULL)` đảm bảo không bao giờ tồn tại bài viết ở trạng thái `'dang'` mà thiếu ngày xuất bản. Khi sửa bài đã đăng hoặc ẩn rồi đăng lại, hệ thống dùng `COALESCE(ngay_dang, now())` để giữ nguyên ngày đăng lần đầu.
* **Tách truy vấn danh sách và chi tiết:** Các truy vấn danh sách (cả Admin và Storefront) **không bao giờ `SELECT noi_dung_html`** để giữ kích thước gói tin nhỏ và tốc độ phản hồi nhanh qua kết nối Serverless.
* **Cột `muc_luc` (`jsonb`):** Được tính toán sẵn lúc lưu bài từ các thẻ `<h2>` và `<h3>` trong `noi_dung_html`, giúp giao diện đọc bài dựng thanh Mục lục neo trái ngay lập tức mà không cần parse lại DOM ở phía client.

### 3.3. Bảng `anh_bai_viet`
Lưu trữ ảnh tải lên từ trình soạn thảo quản trị (`bytea` + metadata) và phục vụ qua route `/anh/[name]` với header `Cache-Control: public, max-age=31536000, immutable`. Thiết kế lưu trữ trong Neon PostgreSQL giúp ảnh tải lên bền vững tuyệt đối trên môi trường serverless/container mà không bị mất khi redeploy.

### 3.4. Bảng `nhat_ky_bai_viet`
Lưu vết mọi thao tác quản trị (`bai_viet.tao`, `bai_viet.sua`, `bai_viet.doi_trang_thai`, `bai_viet.xoa`, `bai_viet.khoi_phuc`, `danh_muc_bai_viet.*`) phục vụ kiểm toán và tra cứu lịch sử biên tập.

---

## 4. Chiến lược đánh chỉ mục (Indexes)

1. **`idx_bv_cong_khai` (Partial Index):**
   ```sql
   CREATE INDEX idx_bv_cong_khai
     ON bai_viet (danh_muc_id, ngay_dang DESC)
     WHERE trang_thai = 'dang' AND xoa_luc IS NULL;
   ```
   Tối ưu hóa trực tiếp cho truy vấn phổ biến nhất trên mặt tiền `/bai-viet` và `/sitemap.xml`. Chỉ những bài đang hiển thị công khai mới nằm trong index.

2. **`idx_bv_quan_tri`:**
   ```sql
   CREATE INDEX idx_bv_quan_tri
     ON bai_viet (xoa_luc, trang_thai, ngay_cap_nhat DESC);
   ```
   Phục vụ trang `/admin/articles` khi lọc theo tab trạng thái (`Tất cả`, `Bản nháp`, `Đã đăng`, `Đang ẩn`, `Thùng rác`) và sắp xếp theo thời gian cập nhật.
