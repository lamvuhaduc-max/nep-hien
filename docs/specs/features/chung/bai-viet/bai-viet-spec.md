# Technical Specification: Quản lý bài viết, Danh mục, Soi SEO & Blog công khai

> **Mã tính năng**: `FEAT-BAI-VIET`
> **Domain**: [`content-article-domain.md`](../../../domains/content-article-domain.md)
> **PRD**: [`bai-viet-prd.md`](./bai-viet-prd.md) · **RFC**: [`bai-viet-rfc.md`](./bai-viet-rfc.md)
> **Cập nhật lần cuối**: 2026-10-19

---

## 1. Thiết kế Cơ sở Dữ liệu (DDL SQL trên Neon PostgreSQL)

```sql
-- 1. Bảng danh mục bài viết
CREATE TABLE IF NOT EXISTS danh_muc_bai_viet (
  id         bigserial PRIMARY KEY,
  ten        varchar(120) NOT NULL,
  slug       varchar(140) NOT NULL UNIQUE,
  mo_ta      text,
  thu_tu     int NOT NULL DEFAULT 0,
  hien       boolean NOT NULL DEFAULT true,
  ngay_tao   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_dmbv_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 2. Bảng bài viết
CREATE TABLE IF NOT EXISTS bai_viet (
  id              bigserial PRIMARY KEY,
  tieu_de         varchar(200) NOT NULL,
  slug            varchar(220) NOT NULL UNIQUE,
  danh_muc_id     bigint NOT NULL REFERENCES danh_muc_bai_viet(id) ON DELETE RESTRICT,
  mo_ta_ngan      varchar(400),
  anh_bia         text,
  noi_dung_html   text NOT NULL DEFAULT '',
  muc_luc         jsonb NOT NULL DEFAULT '[]'::jsonb,
  trang_thai      varchar(20) NOT NULL DEFAULT 'nhap',
  ngay_dang       timestamptz,
  tao_boi_ai      boolean NOT NULL DEFAULT false,
  tac_gia         varchar(120) NOT NULL DEFAULT 'Ban Biên Tập Nếp Hiên',
  noi_bat         boolean NOT NULL DEFAULT false,
  luot_xem        int NOT NULL DEFAULT 0,
  ngay_tao        timestamptz NOT NULL DEFAULT now(),
  ngay_cap_nhat   timestamptz NOT NULL DEFAULT now(),
  xoa_luc         timestamptz,
  CONSTRAINT chk_bv_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT chk_bv_trang_thai CHECK (trang_thai IN ('nhap', 'dang', 'an')),
  CONSTRAINT chk_bv_dang_co_ngay CHECK (trang_thai <> 'dang' OR ngay_dang IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_bv_cong_khai
  ON bai_viet (danh_muc_id, ngay_dang DESC)
  WHERE trang_thai = 'dang' AND xoa_luc IS NULL;

CREATE INDEX IF NOT EXISTS idx_bv_quan_tri
  ON bai_viet (xoa_luc, trang_thai, ngay_cap_nhat DESC);

-- 3. Bảng lưu trữ ảnh bài viết tải lên
CREATE TABLE IF NOT EXISTS anh_bai_viet (
  id          bigserial PRIMARY KEY,
  ten_file    varchar(160) NOT NULL UNIQUE,
  mime_type   varchar(80) NOT NULL,
  kich_thuoc  int NOT NULL,
  du_lieu     bytea NOT NULL,
  ngay_tao    timestamptz NOT NULL DEFAULT now()
);

-- 4. Bảng nhật ký thao tác bài viết & danh mục
CREATE TABLE IF NOT EXISTS nhat_ky_bai_viet (
  id            bigserial PRIMARY KEY,
  hanh_dong     varchar(60) NOT NULL,
  doi_tuong_id  bigint,
  chi_tiet      jsonb NOT NULL DEFAULT '{}'::jsonb,
  ngay_tao      timestamptz NOT NULL DEFAULT now()
);
```

---

## 2. Đặc tả API Endpoints

### 2.1. Nhóm API Quản trị (`/api/v1/admin/*`)

| Method | Endpoint | Mô tả & Xử lý |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/articles` | Lấy danh sách bài viết (không gồm `noi_dung_html`). Hỗ trợ query: `tuKhoa`, `danhMucId`, `trangThai` (`nhap`\|`dang`\|`an`), `daXoa` (`true`\|`false`), `tuNgay`, `denNgay`, `sapXep` (`cap_nhat`\|`ngay_dang`\|`tieu_de`), `trang`, `kichThuoc`. Trả kèm `thongKe` số lượng theo từng tab trạng thái. |
| `GET` | `/api/v1/admin/articles/[id]` | Lấy chi tiết 1 bài viết (gồm đầy đủ `noi_dung_html` và `muc_luc`). |
| `POST` | `/api/v1/admin/articles` | Tạo bài viết mới. Chạy `lamSachHtml` → `rutMucLuc` → `slugKhongTrung`. Nếu `trangThai = 'dang'` thì gán `ngay_dang = now()`. Trả `{ baiViet, canhBao: { theBiLoai, thuocTinhBiLoai } }`. |
| `PATCH` | `/api/v1/admin/articles/[id]` | Cập nhật bài viết. Khi đổi sang `'dang'` dùng `COALESCE(ngay_dang, now())`. Ghi nhật ký `bai_viet.sua`. |
| `PATCH` | `/api/v1/admin/articles/[id]/trang-thai` | Đổi nhanh trạng thái `'nhap' \| 'dang' \| 'an'`. Ghi nhật ký `bai_viet.doi_trang_thai`. |
| `DELETE` | `/api/v1/admin/articles/[id]` | Xóa mềm bài viết (`xoa_luc = now()`). Ghi nhật ký `bai_viet.xoa`. |
| `POST` | `/api/v1/admin/articles/[id]/khoi-phuc` | Khôi phục bài viết từ thùng rác (`xoa_luc = NULL, trang_thai = 'nhap'`). Ghi nhật ký `bai_viet.khoi_phuc`. |
| `POST` | `/api/v1/admin/articles/images` | Nhận `multipart/form-data` trường `file` (PNG/JPG/WEBP/GIF ≤ 5MB), kiểm tra magic bytes, lưu vào `anh_bai_viet` và trả `{ url: '/anh/...' }`. |
| `GET` | `/api/v1/admin/article-categories` | Lấy danh sách toàn bộ danh mục kèm số lượng bài viết (`soBaiViet`) của từng danh mục. |
| `POST` | `/api/v1/admin/article-categories` | Tạo danh mục mới, tự sinh `slug` nếu bỏ trống. |
| `PATCH` | `/api/v1/admin/article-categories/[id]` | Cập nhật `ten`, `slug`, `mo_ta`, `thu_tu`, `hien`. |
| `POST` | `/api/v1/admin/auth/login` | Xác thực tài khoản từ bảng `tai_khoan_quan_tri` (hỗ trợ cả `super_admin` và `admin`), cập nhật `lan_dang_nhap_cuoi = now()`, ghi nhật ký `he_thong.dang_nhap` và cấp cookie `HttpOnly` `nh_admin_session`. |
| `POST` | `/api/v1/admin/auth/logout` | Ghi nhật ký `he_thong.dang_xuat` và xóa cookie phiên. |
| `GET` / `PATCH` | `/api/v1/admin/auth/me` | Lấy thông tin tài khoản đang đăng nhập (`id, taiKhoan, hoTen, vaiTro`) hoặc tự đổi mật khẩu cá nhân (`tai_khoan.doi_mat_khau`). |
| `GET` / `POST` | `/api/v1/admin/accounts` | Danh sách tài khoản quản trị; tạo tài khoản mới (`super_admin` hoặc `admin`) — yêu cầu quyền `super_admin`. |
| `PATCH` / `DELETE` | `/api/v1/admin/accounts/[id]` | Sửa họ tên, đổi vai trò (`super_admin` ↔ `admin`), khóa/mở khóa (`kich_hoat`), cấp lại mật khẩu hoặc xóa tài khoản — yêu cầu quyền `super_admin` và bảo vệ không tự khóa/xóa chính mình hoặc `super_admin` cuối cùng. |
| `GET` | `/api/v1/admin/article-logs` | Lấy nhật ký hoạt động toàn hệ thống, hỗ trợ lọc theo phân hệ (`bai_viet`, `danh_muc_bai_viet`, `tai_khoan`, `he_thong`) và từ khóa. |
| `DELETE` | `/api/v1/admin/article-categories/[id]` | Kiểm tra số bài viết thuộc danh mục; nếu `> 0` trả `409 Conflict` kèm thông báo; nếu `= 0` xóa bản ghi. |

### 2.2. Nhóm API & Route Mặt tiền Công khai

| Method | Endpoint | Mô tả & Xử lý |
| :--- | :--- | :--- |
| `GET` | `/api/v1/storefront/articles` | Danh sách bài viết công khai (`trang_thai = 'dang' AND xoa_luc IS NULL AND dm.hien = true`). Hỗ trợ lọc `danhMuc` (slug danh mục), `tuKhoa`, `trang`, `kichThuoc`. Trả kèm `danhMuc` đang hiển thị. |
| `GET` | `/api/v1/storefront/articles/[slug]` | Chi tiết bài viết công khai theo `slug` + danh sách tối đa 4 bài viết liên quan (`lienQuan`) cùng danh mục. Trả `404` nếu vi phạm quy tắc **R1/R2**. |
| `GET` | `/anh/[name]` | Trả dữ liệu nhị phân của ảnh từ bảng `anh_bai_viet` với `Content-Type` chuẩn và `Cache-Control: public, max-age=31536000, immutable`. |
| `GET` | `/sitemap.xml` | Tự động xuất XML Sitemap gồm các trang tĩnh, các dự án và toàn bộ bài viết công khai (`/bai-viet/[slug]`). |

---

## 3. Chi tiết xử lý Backend

### 3.1. Bộ làm sạch HTML (`src/lib/html/lam-sach-html.ts`)
* **Danh sách thẻ cho phép**: `h2, h3, h4, p, br, hr, strong, b, em, i, u, s, ul, ol, li, blockquote, a, span, div, table, thead, tbody, tr, th, td, img, figure, figcaption`.
* **Quy tắc thẻ `<a>`**: Chỉ nhận `href` thuộc scheme `http`, `https`, `mailto`, `tel` hoặc đường dẫn tương đối `/...` và neo `#...`. Nếu `target="_blank"`, bắt buộc tự gắn `rel="noopener noreferrer"`.
* **Quy tắc thẻ `<img>`**: Chỉ nhận `src` bắt đầu bằng `/anh/` hoặc `/images/` (không nhận `data:`, `javascript:`, hay URL ngoài để khớp CSP `img-src 'self'`).
* **Đếm cảnh báo**: Đếm số thẻ và thuộc tính bị loại bỏ để trả về trong `canhBao: { theBiLoai, thuocTinhBiLoai }` hiển thị cho quản trị viên sau khi lưu.

### 3.2. Bộ trích xuất mục lục (`src/lib/content/muc-luc.ts`)
* Quét tuần tự các thẻ `<h2>` và `<h3>` trong chuỗi HTML đã làm sạch.
* Giải mã thực thể HTML và loại bỏ thẻ con bên trong để lấy chuỗi văn bản thuần `chu`.
* Sinh `id = taoSlug(chu) || 'muc'`; nếu trùng trong cùng bài viết thì nối `-2`, `-3`...
* Gắn thuộc tính `id="${id}"` trực tiếp vào thẻ `<h2 id="...">` / `<h3 id="...">` và trả về `{ html, mucLuc }`.

---

## 4. Chi tiết Giao diện Frontend

### 4.1. Phân hệ Quản trị (`/admin/articles`)
* **`/admin`**: Tự động điều hướng sang `/admin/articles`.
* **`/admin/articles`** (`_QuanLyBaiViet.tsx`):
  * Thẻ thống kê nhanh: Tổng bài viết, Đã đăng, Bản nháp, Đang ẩn, Thùng rác.
  * Chuyển đổi giữa 3 phân khu: **Danh sách bài viết**, **Quản lý danh mục** (`_TabDanhMuc.tsx`), và **Nhật ký hoạt động**.
  * Bộ lọc đa chiều: Tìm theo tiêu đề/slug, lọc theo Danh mục, lọc theo Trạng thái (`Tất cả`, `Đã đăng`, `Bản nháp`, `Đang ẩn`, `Thùng rác`), lọc từ ngày – đến ngày, sắp xếp (`Mới cập nhật`, `Ngày đăng`, `Tiêu đề A–Z`).
  * Thao tác nhanh trên từng dòng: Xem bài công khai, Chỉnh sửa, Đổi nhanh trạng thái (`Đăng` / `Ẩn` / `Chuyển nháp`), Xóa vào thùng rác hoặc Khôi phục.
* **`/admin/articles/moi` & `/admin/articles/[id]`** (`_SoanThao.tsx`):
  * Cột trái (Biên tập):
    * Nhập Tiêu đề, Đường dẫn tĩnh (`slug`) có nút **Tạo lại từ tiêu đề** và cảnh báo vàng khi sửa `slug` của bài đã từng xuất bản.
    * Chọn Danh mục, Tác giả, đánh dấu **Bài viết nổi bật**, nhập Mô tả ngắn (Meta Description) có bộ đếm ký tự.
    * Thanh công cụ trình soạn thảo Rich-Text: `H2`, `H3`, `H4`, `Đậm`, `Nghiêng`, `Gạch chân`, `Danh sách chấm`, `Danh sách số`, `Trích dẫn`, `Chèn bảng 3×3`, `Chèn liên kết`, `Tải ảnh lên bài viết`, `Chèn ảnh thư viện Nếp Hiên`, chuyển đổi chế độ **Soạn thảo trực quan** / **Mã HTML** / **Xem trước**.
    * Tự động lưu nháp cục bộ (`localStorage`) và thanh khôi phục nếu có bản nháp chưa lưu.
  * Cột phải (Xuất bản & Soi SEO):
    * Trạng thái hiện tại, ngày đăng lần đầu, các nút hành động (**Lưu nháp**, **Đăng bài**, **Cập nhật**, **Tạm ẩn**, **Xóa vào thùng rác**).
    * Ảnh bìa bài viết (tải file mới lên Neon DB hoặc chọn nhanh từ bộ ảnh dự án Nếp Hiên).
    * Xem trước Mục lục tự động (`H2`/`H3`).
    * Khung **Soi SEO (`_SoiSeo.tsx`)**: Xem trước thẻ kết quả Google (Google SERP Preview), nhập Từ khóa chính, thanh tiến độ % sẵn sàng và danh sách 12 tiêu chí SEO kèm gợi ý khắc phục và hộp thoại tùy chỉnh ngưỡng chấm điểm.

### 4.2. Phân hệ Mặt tiền Công khai (`/bai-viet`, `/bai-viet/[slug]`)
* **`/bai-viet`**:
  * Hero tiêu đề tạp chí *"Cẩm Nang & Triết Lý Không Gian"* mang phong cách Nếp Hiên.
  * Bài viết nổi bật (Featured Article) hiển thị lớn ở đầu trang.
  * Thanh chip lọc theo Danh mục (`Tất cả` + các danh mục `hien = true`) và ô tìm kiếm nhanh.
  * Lưới thẻ bài viết (ảnh bìa tỉ lệ 16:10, nhãn danh mục, ngày đăng, thời gian đọc ước tính, tiêu đề, mô tả ngắn) và phân trang.
* **`/bai-viet/[slug]`**:
  * Breadcrumb điều hướng (`Trang chủ / Bài viết / Danh mục / Tiêu đề`).
  * Header bài viết với nhãn danh mục, tiêu đề `<h1>`, mô tả ngắn, tác giả, ngày đăng và thời gian đọc.
  * Bố cục 2 cột trên màn hình lớn:
    * Cột trái neo cố định (`position: sticky`): **Mục lục bài viết** tự động đánh dấu mục đang đọc (IntersectionObserver scroll-spy).
    * Cột chính: Nội dung bài viết định dạng typography cao cấp (`bai-viet.css`).
  * Trên thiết bị di động (`< 1024px`): Nút nổi **Mục lục** ở góc dưới mở ngăn kéo (bottom sheet) chọn mục nhanh.
  * Cuối bài: Khối **Bài viết cùng chuyên mục** (tối đa 4 bài) và khối kêu gọi tư vấn thiết kế Nếp Hiên.
