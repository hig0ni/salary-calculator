# 공통 인프라 (architecture)

여러 계산기 페이지가 공유하는 레이아웃·설정·내비게이션·광고·SEO 구성을 설명합니다.
개별 계산기는 각 모듈 문서를 참고하세요.

> 상위 규칙: [../CLAUDE.md](../CLAUDE.md)

---

## 1. 사이트 전역 설정 — `lib/site.js`

모든 페이지가 참조하는 **단일 진실 공급원(single source of truth)**.

```js
export const SITE = {
  name, title, description,
  url,                 // 실제 도메인 (배포 전 교체 필수)
  adsenseClientId,     // AdSense 승인 후 입력
  googleVerification,  // 구글 서치콘솔 소유확인 content 값
  naverVerification,   // 네이버 서치어드바이저 소유확인 content 값
};

export const CALCULATORS = [
  { path: "/",            label: "연봉 실수령액", short: "연봉" },
  { path: "/retirement/", label: "퇴직금",       short: "퇴직금" },
  { path: "/age/",        label: "만 나이",      short: "만 나이" },
];
```

- **`CALCULATORS` 배열이 핵심**: 상단 내비게이션(`SiteNav`)과 `sitemap.js`가
  이 배열을 읽는다. 새 계산기를 넣으면 메뉴·사이트맵에 **자동 반영**된다.
- `path`는 `trailingSlash: true`에 맞춰 **끝 슬래시 포함**(홈은 `/`).

## 2. 루트 레이아웃 — `app/layout.js`

- 전역 `metadata`(홈 기준 title/description/keywords/openGraph/robots)와
  `viewport`(themeColor 등)를 정의.
  - **하위 페이지가 `metadata`를 export하면 해당 값이 우선**되어 페이지별 SEO가
    적용된다. 홈(`app/page.js`)은 별도 export가 없어 레이아웃 값을 그대로 쓴다.
- `<body>` 최상단에 `<SiteNav />`를 렌더 → 모든 페이지 공통 내비게이션.
- `SITE.adsenseClientId`가 채워지면 AdSense 스크립트를 `afterInteractive`로 로드.
- `<html lang="ko">` 고정.

## 3. 공통 내비게이션 — `components/SiteNav.js`

- `"use client"` — `usePathname()`으로 현재 경로를 판별해 활성 링크를 강조.
- `CALCULATORS`를 순회해 `next/link`로 렌더 → **내부 링크**가 페이지들을 서로
  연결해 크롤링·색인에 유리.
- 경로 비교 시 끝 슬래시를 정규화(`norm`)해 `trailingSlash` 환경에서도 활성 표시가
  정확하다.
- 스타일: `globals.css`의 `.site-nav .site-nav-inner .site-brand .nav-links
  .nav-link(.active)`. sticky 상단 고정, 모바일에서 가로 스크롤.

## 4. 광고 슬롯 — `components/AdSlot.js`

- `props`: `slot`(광고단위 ID), `label`(자리표시자 문구).
- `SITE.adsenseClientId && slot`이 모두 있어야 실제 `<ins class="adsbygoogle">`를
  렌더하고 `adsbygoogle.push({})` 호출. 그 전에는 점선 **자리표시자 박스**만 표시
  → 레이아웃을 미리 확인 가능.
- 배치 관례: 각 페이지에서 계산기 카드 **위(상단 광고)**·**아래(본문 광고)** 2곳.

## 5. SEO 구성

### 5.1 페이지별 메타데이터
각 `app/*/page.js`가 `export const metadata`로 title/description/keywords/
`alternates.canonical`/`openGraph`를 정의. canonical·openGraph의 URL은 `SITE.url`을
기반으로 한다.

### 5.2 구조화 데이터 (JSON-LD)
각 계산기 페이지는 `FAQ` 배열로 `FAQPage` JSON-LD를 만들어
`<script type="application/ld+json">`으로 삽입 → 구글 리치 결과(FAQ) 노출 대상.
**화면의 FAQ 텍스트와 JSON-LD 내용은 반드시 일치**시킨다(같은 `FAQ` 배열 사용).

### 5.2b 사이트 전역 구조화 데이터 — `app/layout.js`
`WebSite` + `Organization` JSON-LD를 `@graph`로 삽입(전 페이지 공통). 브랜드/사이트
인식용. 페이지별 `FAQPage`와 별개.

### 5.2c 소유확인 · PWA · 아이콘
- 소유확인: `metadata.verification`(값은 `SITE.googleVerification`/`naverVerification`).
- PWA: `app/manifest.js` → `<link rel="manifest">` 자동. 아이콘은 `public/icon-192·512.png`.
- 파비콘/OG: `app/icon.svg`·`favicon.ico`·`apple-icon.png`·`opengraph-image.png`
  (파일 컨벤션 자동 링크). 생성은 [icons.md](icons.md).

### 5.2d 내부 링크 — `components/RelatedLinks.js`
현재 페이지를 제외한 다른 계산기를 카드로 노출(전 페이지 하단). `SiteNav`와 함께
내부 링크를 늘려 크롤링·색인·체류시간에 기여. → [seo.md](seo.md)

### 5.3 사이트맵 — `app/sitemap.js`
`CALCULATORS`를 순회해 `SITE.url` 기반 절대 URL 목록을 생성.
홈 `priority: 1`, 나머지 `0.8`. `dynamic = "force-static"`로 빌드시 `sitemap.xml` 생성.

### 5.4 robots — `app/robots.js`
전체 허용(`allow: "/"`) + `sitemap` 위치 안내. `SITE.url` 사용.

## 6. 디자인 시스템 — `app/globals.css`

- **CSS 변수 팔레트**(`:root`) + `prefers-color-scheme: dark` 다크모드 자동 대응.
  색을 하드코딩하지 말고 `--bg --card --text --muted --line --brand --brand-soft
  --accent --radius`를 사용.
- **공통 컴포넌트 클래스** (계산기마다 재사용):
  - 레이아웃: `.page`(최대 640px 중앙 정렬), `.card`, `.content`
  - 헤더: `.hero h1`, `.lede`
  - 입력: `.calc-inputs`, `.field`, `.field-row`, `.input-affix`(단위 접미사),
    `input[type=number|date]`
  - 결과: `.result-hero`(강조 박스), `.result-amount`, `.result-sub`,
    `.deduction-table`(항목별 표, `.total` 강조행)
  - 안내: `.notice`(강조 알림 박스), `.disclaimer`(작은 주의문)
  - SEO 콘텐츠: `.content h2/ul/li`, `.faq .faq-item dt/dd`
  - 광고: `.ad-placeholder`
  - 내비: `.site-nav` 계열 (§3)
- 숫자는 `font-variant-numeric: tabular-nums`로 자릿수 정렬.

## 7. 정적 export 제약 (주의)

- 서버 전용 기능(API Route, 서버 액션, `cookies()`, 동적 렌더링) **사용 불가**.
- 데이터·시간 등 런타임 값이 필요하면 **클라이언트 컴포넌트**에서 처리.
- 이미지 최적화 비활성(`images.unoptimized`) — `next/image` 사용 시 유의.
- 라우트는 폴더 기반이며 `trailingSlash: true`로 `/foo/` 형태 URL 생성.
