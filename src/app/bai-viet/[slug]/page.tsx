import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/app/bai-viet.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { layChiTietBaiVietCongKhai } from '@/lib/content/bai-viet-service';
import { ThanBaiViet } from './_ThanBai';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nephien.com';

function dinhDangNgay(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function uocTinhPhutDoc(html: string): number {
  const chu = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!chu) return 1;
  return Math.max(1, Math.round(chu.split(' ').length / 220));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const ketQua = await layChiTietBaiVietCongKhai(params.slug);
  if (!ketQua) {
    return {
      title: 'Không tìm thấy bài viết — Nếp Hiên',
      robots: { index: false, follow: false },
    };
  }

  const { baiViet } = ketQua;
  const url = `${SITE_URL}/bai-viet/${baiViet.slug}`;
  const moTa =
    baiViet.moTaNgan ||
    `${baiViet.tieuDe} — Chuyên mục ${baiViet.tenDanhMuc} tại Nếp Hiên Studio.`;
  const anhOg = baiViet.anhBia
    ? baiViet.anhBia.startsWith('http')
      ? baiViet.anhBia
      : `${SITE_URL}${baiViet.anhBia}`
    : `${SITE_URL}/images/p4/image_2.jpg`;

  return {
    title: `${baiViet.tieuDe} | Nếp Hiên`,
    description: moTa,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: baiViet.tieuDe,
      description: moTa,
      url,
      siteName: 'Nếp Hiên — Thiết kế & Thi công Nội thất',
      type: 'article',
      publishedTime: baiViet.ngayDang ?? undefined,
      modifiedTime: baiViet.ngayCapNhat,
      authors: [baiViet.tacGia],
      images: [{ url: anhOg, width: 1200, height: 630, alt: baiViet.tieuDe }],
    },
    twitter: {
      card: 'summary_large_image',
      title: baiViet.tieuDe,
      description: moTa,
      images: [anhOg],
    },
  };
}

export default async function BaiVietDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const ketQua = await layChiTietBaiVietCongKhai(params.slug);
  if (!ketQua) {
    notFound();
  }

  const { baiViet, lienQuan } = ketQua;
  const phutDoc = uocTinhPhutDoc(baiViet.noiDungHtml);
  const urlBaiViet = `${SITE_URL}/bai-viet/${baiViet.slug}`;
  const anhDayDu = baiViet.anhBia
    ? baiViet.anhBia.startsWith('http')
      ? baiViet.anhBia
      : `${SITE_URL}${baiViet.anhBia}`
    : `${SITE_URL}/images/p4/image_2.jpg`;

  // JSON-LD: Article + BreadcrumbList (mã hóa < thành \u003c chống XSS)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: baiViet.tieuDe,
      description: baiViet.moTaNgan || baiViet.tieuDe,
      image: [anhDayDu],
      datePublished: baiViet.ngayDang || baiViet.ngayTao,
      dateModified: baiViet.ngayCapNhat,
      author: {
        '@type': 'Person',
        name: baiViet.tacGia,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Nếp Hiên Studio',
        url: SITE_URL,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': urlBaiViet,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Bài viết',
          item: `${SITE_URL}/bai-viet`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: baiViet.tenDanhMuc,
          item: `${SITE_URL}/bai-viet?danhMuc=${baiViet.slugDanhMuc}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: baiViet.tieuDe,
          item: urlBaiViet,
        },
      ],
    },
  ];

  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <div className="bv-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <Header />

      {/* HERO CHI TIẾT BÀI VIẾT */}
      <header className="bv-detail-hero">
        <div className="bv-container">
          <nav className="bv-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/bai-viet">Bài viết</Link>
            <span>/</span>
            <Link href={`/bai-viet?danhMuc=${baiViet.slugDanhMuc}`}>
              {baiViet.tenDanhMuc}
            </Link>
          </nav>

          <h1 className="bv-detail-title">{baiViet.tieuDe}</h1>

          {baiViet.moTaNgan && <p className="bv-detail-lead">{baiViet.moTaNgan}</p>}

          <div className="bv-detail-author-bar">
            <span>
              Biên tập bởi <strong style={{ color: 'var(--brass-lt)' }}>{baiViet.tacGia}</strong>
            </span>
            <span>•</span>
            <span>Xuất bản: {dinhDangNgay(baiViet.ngayDang || baiViet.ngayTao)}</span>
            <span>•</span>
            <span>~{phutDoc} phút đọc</span>
          </div>
        </div>
      </header>

      {/* ẢNH BÌA */}
      {baiViet.anhBia && (
        <div className="bv-cover-frame">
          <img
            src={baiViet.anhBia}
            alt={baiViet.tieuDe}
            className="bv-cover-img"
          />
        </div>
      )}

      {/* THÂN BÀI + MỤC LỤC */}
      <ThanBaiViet noiDungHtml={baiViet.noiDungHtml} mucLuc={baiViet.mucLuc} />

      {/* BÀI VIẾT CÙNG CHUYÊN MỤC */}
      {lienQuan.length > 0 && (
        <section className="bv-container" style={{ marginTop: '4.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <div className="bv-eyebrow" style={{ color: 'var(--terra)', marginBottom: 8 }}>
                Cùng chuyên mục {baiViet.tenDanhMuc}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  fontWeight: 500,
                }}
              >
                Bài viết liên quan
              </h2>
            </div>
            <Link href={`/bai-viet?danhMuc=${baiViet.slugDanhMuc}`} className="bv-read-more">
              Xem tất cả →
            </Link>
          </div>

          <div className="bv-grid">
            {lienQuan.map((bv) => (
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
                    <span className="bv-cat-pill">{bv.tenDanhMuc}</span>
                    <span>•</span>
                    <span>{dinhDangNgay(bv.ngayDang)}</span>
                  </div>
                  <Link href={`/bai-viet/${bv.slug}`}>
                    <h3 className="bv-card-title">{bv.tieuDe}</h3>
                  </Link>
                  {bv.moTaNgan && <p className="bv-card-desc">{bv.moTaNgan}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* KHỐI KÊU GỌI TƯ VẤN THIẾT KẾ */}
      <section className="bv-container" style={{ marginTop: '4.5rem', marginBottom: '5.5rem' }}>
        <div
          style={{
            background: '#221610',
            color: '#f5efe0',
            padding: 'clamp(2.25rem, 4vw, 3.75rem)',
            border: '1px solid rgba(245, 239, 224, 0.16)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '58ch' }}>
            <div className="bv-eyebrow">Đồng hành cùng Nếp Hiên Studio</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 2.6vw, 2.3rem)',
                fontWeight: 500,
                color: '#f5efe0',
                marginBottom: '0.75rem',
              }}
            >
              Khởi đầu câu chuyện không gian sống của riêng bạn
            </h2>
            <p style={{ color: 'rgba(245, 239, 224, 0.86)', lineHeight: 1.75 }}>
              Đội ngũ kiến trúc sư Nếp Hiên sẵn sàng lắng nghe nhu cầu công năng, khảo sát vi khí
              hậu và đề xuất giải pháp thiết kế — thi công trọn gói chuẩn mực.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/#contact-form"
              style={{
                padding: '0.9rem 1.8rem',
                background: '#c0562c',
                color: '#fff',
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Đặt lịch tư vấn 1:1
            </Link>
            <Link
              href="/du-an"
              style={{
                padding: '0.9rem 1.8rem',
                border: '1px solid #c9a96e',
                color: '#c9a96e',
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Xem các dự án
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
