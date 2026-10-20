import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { layBaiVietSitemap } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nephien.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/du-an`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/bai-viet`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/phong-cach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${SITE_URL}/du-an/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const baiViet = await layBaiVietSitemap();
    articlePages = baiViet.map((b) => ({
      url: `${SITE_URL}/bai-viet/${b.slug}`,
      lastModified: new Date(b.ngayCapNhat),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    articlePages = [];
  }

  return [...staticPages, ...projectPages, ...articlePages];
}
