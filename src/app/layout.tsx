import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nếp Hiên — Nội Thất · Furniture & Interiors',
  description:
    'Nếp Hiên thiết kế và thi công nội thất cao cấp tại TP.HCM. Địa chỉ: 14 Đường 41, An Khánh, TP. Hồ Chí Minh.',
  keywords: 'nội thất, thiết kế nội thất, thi công nội thất, HCM, Nếp Hiên',
  openGraph: {
    title: 'Nếp Hiên — Nội Thất · Furniture & Interiors',
    description: 'Kiến tạo không gian sống đẹp hơn, ý nghĩa hơn.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
