import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

/* #1 luxury interior pairing 2025 — Cormorant Garamond + DM Sans */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

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
    <html lang="vi" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <body spellCheck={false}>{children}</body>
    </html>
  );
}
