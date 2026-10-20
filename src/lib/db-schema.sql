-- Schema Quản lý bài viết, Tài khoản Quản trị & Nội dung mặt tiền — Nếp Hiên (nephien.com)
-- Hệ quản trị: Neon Serverless PostgreSQL

-- 1. Bảng tài khoản quản trị (super_admin & admin)
CREATE TABLE IF NOT EXISTS tai_khoan_quan_tri (
  id                  bigserial PRIMARY KEY,
  tai_khoan           varchar(120) NOT NULL UNIQUE,
  ho_ten              varchar(120) NOT NULL,
  mat_khau_bam        varchar(200) NOT NULL,
  vai_tro             varchar(30) NOT NULL DEFAULT 'admin',
  kich_hoat           boolean NOT NULL DEFAULT true,
  lan_dang_nhap_cuoi  timestamptz,
  ngay_tao            timestamptz NOT NULL DEFAULT now(),
  ngay_cap_nhat       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_tkqt_vai_tro CHECK (vai_tro IN ('super_admin', 'admin'))
);

-- 2. Bảng danh mục bài viết
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

-- 3. Bảng bài viết
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

-- 4. Bảng ảnh bài viết
CREATE TABLE IF NOT EXISTS anh_bai_viet (
  id          bigserial PRIMARY KEY,
  ten_file    varchar(160) NOT NULL UNIQUE,
  mime_type   varchar(80) NOT NULL,
  kich_thuoc  int NOT NULL,
  du_lieu     bytea NOT NULL,
  ngay_tao    timestamptz NOT NULL DEFAULT now()
);

-- 5. Bảng nhật ký hoạt động (bài viết, danh mục, tài khoản, đăng nhập, yêu cầu tư vấn)
CREATE TABLE IF NOT EXISTS nhat_ky_bai_viet (
  id                   bigserial PRIMARY KEY,
  hanh_dong            varchar(60) NOT NULL,
  doi_tuong_id         bigint,
  nguoi_thuc_hien_id   bigint REFERENCES tai_khoan_quan_tri(id) ON DELETE SET NULL,
  tai_khoan_thuc_hien  varchar(120),
  vai_tro_thuc_hien    varchar(30),
  chi_tiet             jsonb NOT NULL DEFAULT '{}'::jsonb,
  ngay_tao             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nkbv_ngay_tao ON nhat_ky_bai_viet (ngay_tao DESC);

-- 6. Bảng yêu cầu tư vấn khách hàng (từ form trang chủ /#contact-form & trang QR ưu đãi /uu-dai)
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

