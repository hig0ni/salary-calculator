/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 사이트로 내보내기 → Vercel/Cloudflare Pages/Netlify 무료 배포에 최적
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
