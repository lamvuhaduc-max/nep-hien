import type { Metadata } from 'next';
import '@/app/bai-viet.css';
import { SoanThaoBaiViet } from '../_SoanThao';

export const metadata: Metadata = {
  title: 'Viết bài mới — Quản trị Nếp Hiên',
  robots: { index: false, follow: false },
};

export default function NewArticleAdminPage() {
  return <SoanThaoBaiViet cheDo="moi" />;
}
