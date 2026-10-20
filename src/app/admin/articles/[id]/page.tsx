import type { Metadata } from 'next';
import '@/app/bai-viet.css';
import { SoanThaoBaiViet } from '../_SoanThao';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết — Quản trị Nếp Hiên',
  robots: { index: false, follow: false },
};

export default function EditArticleAdminPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  return <SoanThaoBaiViet cheDo="sua" baiVietId={id} />;
}
