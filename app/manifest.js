import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// PWA/모바일 웹앱 매니페스트 — Next가 <link rel="manifest">를 자동 삽입.
// 아이콘은 public/ 의 파일을 참조(정적 export 시 out 루트로 복사됨).
export default function manifest() {
  return {
    name: `${SITE.name} — 연봉·퇴직금·만 나이 계산기`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
