/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

// ── Content Security Policy ────────────────────────────────────────────────
// Chỉ cho phép tài nguyên từ chính domain + Formspree (form gửi liên hệ).
// Dev cần 'unsafe-eval' + websocket cho Hot-Reload; production siết chặt hơn.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",          // chống clickjacking (không cho nhúng vào iframe)
  "frame-src 'none'",
  "form-action 'self' https://formspree.io",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https://formspree.io${isDev ? ' ws: wss:' : ''}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  // Bắt buộc trình duyệt luôn dùng HTTPS trong 2 năm tới
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Chống MIME-sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Chống clickjacking (fallback cho trình duyệt cũ; CSP frame-ancestors là chính)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Không rò rỉ URL đầy đủ sang trang khác
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Tắt các quyền nhạy cảm không dùng đến
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Đã gỡ remotePatterns (api.qrserver.com) vì không còn dùng — giảm bề mặt tấn công SSRF/DoS
  },
  compress: true,
  poweredByHeader: false,   // ẩn header "X-Powered-By: Next.js" (che giấu công nghệ)
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
