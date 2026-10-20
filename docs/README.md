# Tài liệu kỹ thuật — Nếp Hiên (`nephien.com`)

> **Nguồn chân lý**: Mã nguồn tại `src/` và schema CSDL tại `src/lib/db-schema.sql` (Neon PostgreSQL).
> Hệ thống tài liệu này tuân thủ quy trình 6 bước chuẩn hóa (Domain → PRD → RFC → Spec → Tasks → Implementation).

---

## 1. Cấu trúc thư mục `docs/`

```text
docs/
├── README.md                                       # Bản đồ tài liệu toàn hệ thống
├── conventions/
│   └── step-by-step-write-document.md              # Quy ước viết tài liệu 6 bước (Domain → PRD → RFC → Spec → Tasks)
├── architecture/
│   └── database-design.md                          # Thiết kế Cơ sở Dữ liệu (Neon PostgreSQL)
├── specs/
│   ├── README.md                                   # Chỉ mục Domain & Feature Specs
│   ├── domains/
│   │   ├── content-article-domain.md               # Domain: Nội dung mặt tiền & Quản lý bài viết
│   │   └── customer-consultation-domain.md         # Domain: Tiếp nhận & Quản trị Yêu cầu Tư vấn Khách hàng
│   └── features/
│       └── chung/
│           ├── bai-viet/
│           │   ├── bai-viet-prd.md                 # PRD: Quản lý bài viết, Danh mục, Soi SEO & Blog công khai
│           │   ├── bai-viet-rfc.md                 # RFC: Thiết kế kiến trúc, bảo mật XSS, SEO & Neon DB
│           │   ├── bai-viet-spec.md                # Spec: Chi tiết schema, API contract, quy tắc R1–R10 & UI
│           │   └── bai-viet-tasks.md               # Tasks: Danh sách hạng mục triển khai & kiểm thử E2E
│           └── yeu-cau-tu-van/
│               ├── yeu-cau-tu-van-prd.md           # PRD: Tiếp nhận & Quản trị Yêu cầu Tư vấn Khách hàng
│               ├── yeu-cau-tu-van-rfc.md           # RFC: Kiến trúc thu thập Lead, chống bot & Neon DB
│               ├── yeu-cau-tu-van-spec.md          # Spec: Bảng yeu_cau_tu_van, API & màn hình _TabTuVan
│               └── yeu-cau-tu-van-tasks.md         # Tasks: Checklist triển khai & kiểm thử E2E
```

---

## 2. Truy cập nhanh theo vai trò

| Vai trò | Tài liệu cần đọc |
| :--- | :--- |
| **Product Owner / BA** | [content-article-domain.md](./specs/domains/content-article-domain.md) · [customer-consultation-domain.md](./specs/domains/customer-consultation-domain.md) · [bai-viet-prd.md](./specs/features/chung/bai-viet/bai-viet-prd.md) · [yeu-cau-tu-van-prd.md](./specs/features/chung/yeu-cau-tu-van/yeu-cau-tu-van-prd.md) |
| **Architect / Tech Lead** | [database-design.md](./architecture/database-design.md) · [bai-viet-rfc.md](./specs/features/chung/bai-viet/bai-viet-rfc.md) · [yeu-cau-tu-van-rfc.md](./specs/features/chung/yeu-cau-tu-van/yeu-cau-tu-van-rfc.md) |
| **Full-stack Developer** | [bai-viet-spec.md](./specs/features/chung/bai-viet/bai-viet-spec.md) · [yeu-cau-tu-van-spec.md](./specs/features/chung/yeu-cau-tu-van/yeu-cau-tu-van-spec.md) · [bai-viet-tasks.md](./specs/features/chung/bai-viet/bai-viet-tasks.md) · [yeu-cau-tu-van-tasks.md](./specs/features/chung/yeu-cau-tu-van/yeu-cau-tu-van-tasks.md) |
| **QA / Automation** | [bai-viet-prd.md §4 (AC)](./specs/features/chung/bai-viet/bai-viet-prd.md) · [yeu-cau-tu-van-prd.md §4 (AC)](./specs/features/chung/yeu-cau-tu-van/yeu-cau-tu-van-prd.md) |

