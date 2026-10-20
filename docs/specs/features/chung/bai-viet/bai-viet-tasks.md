# Tasks: Quản lý bài viết, Danh mục, Soi SEO & Blog công khai (`FEAT-BAI-VIET`)

> **Spec liên quan**: [`bai-viet-spec.md`](./bai-viet-spec.md) · **PRD**: [`bai-viet-prd.md`](./bai-viet-prd.md)
> **Trạng thái**: Completed
> **Cập nhật lần cuối**: 2026-10-20

---

## Nhóm 1 — Tài liệu & Cơ sở dữ liệu Neon PostgreSQL

- [x] **T-01**: Khởi tạo hệ thống tài liệu chuẩn tại `docs/` (`README.md`, `conventions/step-by-step-write-document.md`, `architecture/database-design.md`, `specs/domains/content-article-domain.md`, `specs/features/chung/bai-viet/{prd,rfc,spec,tasks}.md`).
- [x] **T-02**: Cài đặt dependencies (`postgres`, `sanitize-html`, `@types/sanitize-html`, `lucide-react`) và cấu hình `.env` kết nối Neon PostgreSQL.
- [x] **T-03**: Xây dựng `src/lib/db.ts`, chạy migration tạo các bảng `danh_muc_bai_viet`, `bai_viet`, `anh_bai_viet`, `nhat_ky_bai_viet` kèm indexes/constraints và seed dữ liệu mẫu chuẩn thương hiệu Nếp Hiên lên Neon DB *(AC-01, AC-02)*.

---

## Nhóm 2 — Thư viện xử lý Backend & API Routes

- [x] **T-04**: Xây dựng bộ làm sạch HTML `src/lib/html/lam-sach-html.ts` và bộ xử lý slug + rút mục lục `src/lib/content/muc-luc.ts` *(R3, R4, AC-02)*.
- [x] **T-05**: Xây dựng tầng dịch vụ dữ liệu `src/lib/content/bai-viet-service.ts` thực thi đầy đủ các quy tắc `R1`–`R8` (lọc công khai kép, bảo toàn `ngay_dang` bằng `COALESCE`, xóa mềm/khôi phục, chặn xóa danh mục còn bài, ghi `nhat_ky_bai_viet`) *(AC-01..AC-05)*.
- [x] **T-06**: Xây dựng các API Quản trị (`/api/v1/admin/articles`, `/api/v1/admin/articles/[id]`, `/api/v1/admin/articles/[id]/trang-thai`, `/api/v1/admin/articles/[id]/khoi-phuc`, `/api/v1/admin/articles/images`, `/api/v1/admin/article-categories`, `/api/v1/admin/article-categories/[id]`, `/api/v1/admin/article-logs`) và route phục vụ ảnh `/anh/[name]` *(AC-01..AC-05)*.
- [x] **T-07**: Xây dựng các API Mặt tiền (`/api/v1/storefront/articles`, `/api/v1/storefront/articles/[slug]`) và `/sitemap.xml` (`src/app/sitemap.ts`) *(AC-06, AC-09)*.

---

## Nhóm 3 — Giao diện Quản trị (`/admin/articles`) & Soi SEO

- [x] **T-08**: Xây dựng bộ chấm điểm SEO 12 tiêu chí `src/lib/seo-bai-viet.ts` và component `src/app/admin/articles/_SoiSeo.tsx` (kèm Google SERP Preview & tùy chỉnh ngưỡng `localStorage`) *(AC-06)*.
- [x] **T-09**: Xây dựng trang danh sách quản trị `/admin/articles` (`_QuanLyBaiViet.tsx`), tab quản lý danh mục (`_TabDanhMuc.tsx`) và tab nhật ký hoạt động *(AC-01, AC-04, AC-05)*.
- [x] **T-10**: Xây dựng màn hình soạn thảo `/admin/articles/moi` và `/admin/articles/[id]` (`_SoanThao.tsx`, `_nhap-cuc-bo.ts`) với thanh công cụ Rich-Text, tải ảnh bìa/ảnh bài viết, cảnh báo đổi slug bài đã đăng, xem trước mục lục và Soi SEO *(AC-02, AC-03, AC-06, AC-07)*.

---

## Nhóm 4 — Giao diện Mặt tiền Công khai (`/bai-viet`) & Tích hợp Header/Footer

- [x] **T-11**: Xây dựng trang danh sách bài viết công khai `/bai-viet/page.tsx` với bộ lọc danh mục, tìm kiếm, bài viết nổi bật và phân trang *(AC-06)*.
- [x] **T-12**: Xây dựng trang đọc bài viết `/bai-viet/[slug]/page.tsx` và `_ThanBai.tsx` với thanh Mục lục sticky (desktop) + ngăn kéo (mobile), bài viết liên quan, OpenGraph và JSON-LD (`Article` + `BreadcrumbList`) *(AC-08, AC-09)*.
- [x] **T-13**: Cập nhật `Header.tsx` và `Footer.tsx` tích hợp liên kết `/bai-viet` và `/admin/articles`.

---

## Nhóm 5 — Build & Kiểm thử E2E bằng Playwright

- [x] **T-14**: Chạy `npm run build` kiểm tra hoàn toàn không có lỗi TypeScript / ESLint / Next.js.
- [x] **T-15**: Chạy kiểm thử tự động E2E bằng Playwright MCP qua toàn bộ luồng Quản trị (`/admin/articles`, tạo/sửa/Soi SEO/đăng/ẩn/xóa/khôi phục bài viết, quản lý danh mục, nhật ký hoạt động) và Mặt tiền (`/bai-viet`, `/bai-viet/[slug]`, mục lục desktop + mobile 375px, JSON-LD, `/sitemap.xml`).
