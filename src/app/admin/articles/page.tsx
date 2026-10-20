import type { Metadata } from 'next';
import '@/app/bai-viet.css';
import { QuanLyBaiViet } from './_QuanLyBaiViet';

export const metadata: Metadata = {
  title: 'Quản trị Bài viết & Chuyên mục — Nếp Hiên Studio',
  robots: { index: false, follow: false },
};

export default function AdminArticlesPage() {
  return <QuanLyBaiViet />;
}
