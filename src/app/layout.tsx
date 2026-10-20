import type { Metadata } from 'next';
import { Playfair_Display, Raleway } from 'next/font/google';
import './globals.css';

/* Italian Luxury style — Playfair Display + Raleway */
const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nếp Hiên — Nội Thất · Furniture & Interiors',
  description:
    'Nếp Hiên thiết kế và thi công nội thất cao cấp tại TP.HCM. Địa chỉ: 14 Đường 41, An Khánh, TP. Hồ Chí Minh.',
  keywords: 'nội thất, thiết kế nội thất, thi công nội thất, HCM, Nếp Hiên',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
    <html lang="vi" className={`${playfairDisplay.variable} ${raleway.variable}`}>
      <body spellCheck={false}>{children}</body>
    </html>
  );
}
