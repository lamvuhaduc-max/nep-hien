import Image from 'next/image';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'QR Ưu Đãi — Nếp Hiên',
  robots: { index: false },
};

const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&color=1F2020&bgcolor=F5EFE0&data=https%3A%2F%2Fnephien.com%2Fuu-dai';

export default function QRPage() {
  return (
    <main className="qr-print-page">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .qr-print-page { padding: 0; }
        }
      `}</style>

      <div className="qr-print-card">
        {/* Logo */}
        <div className="qr-print-logo">
          <Image src="/logo.svg" alt="Nếp Hiên" width={240} height={70}
            style={{ height: '56px', width: 'auto' }} />
        </div>

        {/* Tiêu đề ưu đãi */}
        <div className="qr-print-offer">
          <span className="qr-print-badge">ƯU ĐÃI ĐẶC BIỆT</span>
          <h1 className="qr-print-title">Quét mã nhận ngay</h1>
          <ul className="qr-print-benefits">
            <li>✓ Tư vấn 1-1 với Kiến trúc sư</li>
            <li>✓ Khảo sát thực tế miễn phí</li>
            <li>✓ Giảm 10% phí thiết kế</li>
          </ul>
        </div>

        {/* QR Code */}
        <div className="qr-print-code">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_URL}
            alt="QR Code ưu đãi Nếp Hiên"
            width={240} height={240}
            style={{ borderRadius: 8 }}
          />
          <p className="qr-print-hint">Quét mã QR để đăng ký</p>
          <p className="qr-print-url">nephien.com/uu-dai</p>
        </div>

        {/* Thông tin liên hệ */}
        <div className="qr-print-contact">
          <p>📞 0901 234 567 &nbsp;·&nbsp; ✉ dvkh247@nephien.com</p>
          <p>📍 14 Đường 41, An Khánh, TP.HCM</p>
        </div>
      </div>

      {/* Nút in - ẩn khi in thật */}
      <div className="no-print" style={{ textAlign: 'center', marginTop: 32 }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '14px 32px', background: '#C0562C', color: '#fff',
            border: 'none', borderRadius: '3px', fontSize: '14px',
            letterSpacing: '.08em', cursor: 'pointer', fontWeight: 600,
          }}
        >
          🖨️ In QR Code
        </button>
        <p style={{ marginTop: 12, fontSize: 12, color: '#7A7470' }}>
          Dùng để in card, standee, brochure hoặc chia sẻ qua Zalo/Facebook
        </p>
      </div>
    </main>
  );
}
