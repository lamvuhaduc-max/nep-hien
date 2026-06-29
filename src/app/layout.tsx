import type { Metadata } from 'next';
import { Bodoni_Moda, Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const jost = Jost({
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
    <html lang="vi" className={`${bodoniModa.variable} ${cormorantGaramond.variable} ${jost.variable}`}>
      <body spellCheck={false}>{children}</body>
    </html>
  );
}
