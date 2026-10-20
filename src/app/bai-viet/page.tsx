import type { Metadata } from 'next';
import Link from 'next/link';
import '@/app/bai-viet.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { layDanhSachBaiVietCongKhai } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bài Viết & Cẩm Nang Kiến Trúc Nội Thất — Nếp Hiên',
  description:
    'Khám phá những bài viết chuyên sâu về triết lý không gian sống, vật liệu tự nhiên, cẩm nang thiết kế nội thất đương đại và quy trình thi công tại Nếp Hiên.',
  openGraph: {
    title: 'Bài Viết & Cẩm Nang Kiến Trúc Nội Thất — Nếp Hiên',
    description:
      'Góc nhìn chuyên sâu về kiến trúc, nội thất Quiet Luxury và nghệ thuật chế tác không gian sống bền vững từ Nếp Hiên Studio.',
    type: 'website',
  },
};

function dinhDangNgay(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default async function BaiVietListPage({
  searchParams,
}: {
  searchParams?: { danhMuc?: string; tuKhoa?: string; trang?: string };
}) {
  const danhMucDangChon = searchParams?.danhMuc?.trim() || undefined;
  const tuKhoa = searchParams?.tuKhoa?.trim() || undefined;
  const trang = Math.max(1, Number(searchParams?.trang) || 1);

  const duLieu = await layDanhSachBaiVietCongKhai({
    danhMuc: danhMucDangChon,
    tuKhoa,
    trang,
    kichThuoc: 9,
  });

  const tongTrang = Math.max(1, Math.ceil(duLieu.tong / duLieu.kichThuoc));
  const hienThiBaiNoiBat =
    trang === 1 && !tuKhoa && !danhMucDangChon && duLieu.baiNoiBat !== null;
  const baiNoiBat = hienThiBaiNoiBat ? duLieu.baiNoiBat : null;

  function taoLinkLoc(thamSoMoi: { danhMuc?: string; tuKhoa?: string; trang?: number }) {
    const sp = new URLSearchParams();
    if (thamSoMoi.danhMuc) sp.set('danhMuc', thamSoMoi.danhMuc);
    if (thamSoMoi.tuKhoa) sp.set('tuKhoa', thamSoMoi.tuKhoa);
    if (thamSoMoi.trang && thamSoMoi.trang > 1) sp.set('trang', String(thamSoMoi.trang));
    const q = sp.toString();
    return q ? `/bai-viet?${q}` : '/bai-viet';
  }

  return (
    <div className="bv-page">
      <Header />

      {/* HERO */}
      <section className="bv-hero">
        <div className="bv-container">
          <div className="bv-eyebrow">Tạp chí &amp; Cẩm nang Nếp Hiên</div>
          <h1 className="bv-hero-title">
            Chiều sâu của <em>vật liệu</em> &amp; sự tĩnh tại trong nếp nhà Việt
          </h1>
          <p className="bv-hero-desc">
            Nơi đội ngũ kiến trúc sư và nhà thiết kế nội thất Nếp Hiên chia sẻ góc nhìn chuyên môn
            về ánh sáng, vi khí hậu nhiệt đới, chất cảm vật liệu tự nhiên và quy trình kiến tạo tổ
            ấm vượt thời gian.
          </p>
        </div>
      </section>

      <main className="bv-container">
        {/* BÀI VIẾT NỔI BẬT */}
        {baiNoiBat && (
          <Link href={`/bai-viet/${baiNoiBat.slug}`} className="bv-featured">
            <div className="bv-featured-img-wrap">
              <img
                src={baiNoiBat.anhBia || '/images/p4/image_2.jpg'}
                alt={baiNoiBat.tieuDe}
                className="bv-featured-img"
              />
              <span className="bv-featured-badge">Bài viết tâm điểm</span>
            </div>
            <div className="bv-featured-body">
              <div className="bv-meta-row">
                <span className="bv-cat-pill">{baiNoiBat.tenDanhMuc}</span>
                <span>•</span>
                <span>{dinhDangNgay(baiNoiBat.ngayDang)}</span>
                <span>•</span>
                <span>{baiNoiBat.tacGia}</span>
              </div>
              <h2 className="bv-featured-title">{baiNoiBat.tieuDe}</h2>
              {baiNoiBat.moTaNgan && (
                <p className="bv-featured-excerpt">{baiNoiBat.moTaNgan}</p>
              )}
              <span className="bv-read-more">Đọc trọn bài viết →</span>
            </div>
          </Link>
        )}

        {/* THANH LỌC DANH MỤC & TÌM KIẾM */}
        <div className="bv-toolbar">
          <nav className="bv-chips" aria-label="Danh mục bài viết">
            <Link
              href={taoLinkLoc({ tuKhoa })}
              className={`bv-chip ${!danhMucDangChon ? 'is-active' : ''}`}
            >
              Tất cả chuyên mục
            </Link>
            {duLieu.danhMuc.map((dm) => (
              <Link
                key={dm.id}
                href={taoLinkLoc({ danhMuc: dm.slug, tuKhoa })}
                className={`bv-chip ${danhMucDangChon === dm.slug ? 'is-active' : ''}`}
              >
                {dm.ten}
                {typeof dm.soBaiViet === 'number' && (
                  <span style={{ opacity: 0.65 }}>({dm.soBaiViet})</span>
                )}
              </Link>
            ))}
          </nav>

          <form action="/bai-viet" method="GET" className="bv-search-form">
            {danhMucDangChon && (
              <input type="hidden" name="danhMuc" value={danhMucDangChon} />
            )}
            <input
              type="search"
              name="tuKhoa"
              defaultValue={tuKhoa ?? ''}
              placeholder="Tìm chủ đề bài viết..."
              className="bv-search-input"
            />
            <button type="submit" className="bv-search-btn">
              Tìm
            </button>
          </form>
        </div>

        {/* DANH SÁCH BÀI VIẾT */}
        {duLieu.items.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                marginBottom: '0.75rem',
              }}
            >
              Chưa có bài viết phù hợp
            </h2>
            <p style={{ color: 'var(--ink-2)', marginBottom: '1.5rem' }}>
              Hãy thử chọn chuyên mục khác hoặc xem toàn bộ bài viết của Nếp Hiên.
            </p>
            <Link href="/bai-viet" className="bv-chip is-active">
              Xem tất cả bài viết
            </Link>
          </div>
        ) : (
          <div className="bv-grid">
            {duLieu.items.map((bv) => (
              <article key={bv.id} className="bv-card">
                <Link href={`/bai-viet/${bv.slug}`} className="bv-card-thumb">
                  <img
                    src={bv.anhBia || '/images/p4/image_2.jpg'}
                    alt={bv.tieuDe}
                    loading="lazy"
                  />
                </Link>
                <div className="bv-card-body">
                  <div className="bv-meta-row">
                    <Link
                      href={taoLinkLoc({ danhMuc: bv.slugDanhMuc })}
                      className="bv-cat-pill"
                    >
                      {bv.tenDanhMuc}
                    </Link>
                    <span>•</span>
                    <span>{dinhDangNgay(bv.ngayDang)}</span>
                  </div>

                  <Link href={`/bai-viet/${bv.slug}`}>
                    <h2 className="bv-card-title">{bv.tieuDe}</h2>
                  </Link>

                  {bv.moTaNgan && <p className="bv-card-desc">{bv.moTaNgan}</p>}

                  <div className="bv-card-footer">
                    <span>{bv.tacGia}</span>
                    <Link href={`/bai-viet/${bv.slug}`} className="bv-read-more">
                      Đọc bài →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PHÂN TRANG */}
        {tongTrang > 1 && (
          <nav
            aria-label="Phân trang bài viết"
            style={{
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {Array.from({ length: tongTrang }, (_, idx) => idx + 1).map((soTrang) => (
              <Link
                key={soTrang}
                href={taoLinkLoc({
                  danhMuc: danhMucDangChon,
                  tuKhoa,
                  trang: soTrang,
                })}
                className={`bv-chip ${soTrang === trang ? 'is-active' : ''}`}
              >
                Trang {soTrang}
              </Link>
            ))}
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
