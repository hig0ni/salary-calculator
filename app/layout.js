import Script from "next/script";
import { SITE } from "@/lib/site";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "연봉 실수령액",
    "실수령액 계산기",
    "월급 계산기",
    "연봉 계산기",
    "4대보험 계산기",
    "세후 월급",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  applicationName: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    google: SITE.googleVerification || undefined,
    other: SITE.naverVerification
      ? { "naver-site-verification": SITE.naverVerification }
      : undefined,
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

// 사이트 전역 구조화 데이터 (WebSite + Organization)
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "ko-KR",
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/icon-512.png`,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <SiteNav />
        {children}

        {/* Google AdSense — 승인 후 lib/site.js 의 adsenseClientId 를 채우면 자동 로드 */}
        {SITE.adsenseClientId ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  );
}
