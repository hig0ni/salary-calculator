# CLAUDE.md — 프로젝트 메인 규칙

이 문서는 **월급계산기** 프로젝트의 전역 규칙과 작업 가이드입니다.
Claude Code 및 기여자는 코드를 수정하기 전에 이 문서를 먼저 읽고, 관련 모듈
문서(`docs/*.md`)를 함께 참고하세요.

---

## 1. 프로젝트 개요

- **정체성**: 한국 직장인 대상 무료 계산기 모음 사이트. 회원가입·설치 없이
  즉시 사용, 광고(AdSense) 기반 수익.
- **핵심 전략**: 계산기 페이지를 늘려 **SEO 커버리지 확대** → 검색 유입 → 광고 노출.
- **현재 계산기**
  - `/` — 연봉 실수령액 계산기 → [docs/salary.md](docs/salary.md)
  - `/retirement/` — 퇴직금 계산기 → [docs/retirement.md](docs/retirement.md)
  - `/age/` — 만 나이 계산기 → [docs/age.md](docs/age.md)
- **공통 인프라**(레이아웃·내비·광고·설정·SEO) → [docs/architecture.md](docs/architecture.md)

## 2. 기술 스택

- **Next.js 15 (App Router)** + React 18, **JavaScript**(TypeScript 아님).
- **정적 내보내기**: `next.config.mjs`의 `output: "export"`, `trailingSlash: true`,
  `images.unoptimized: true`. 결과물은 `out/` 폴더 → Vercel/Cloudflare Pages/Netlify에
  정적 호스팅.
- **서버 런타임 없음.** API Route, 서버 액션, DB, 미들웨어 사용 금지(정적 export에서
  동작하지 않음). 모든 동적 계산은 **클라이언트 컴포넌트**에서 수행.
- 경로 별칭: `@/` = 프로젝트 루트 (`jsconfig.json`).

## 3. 디렉터리 구조

```
app/
  layout.js        # 루트 레이아웃 · 전역 metadata · SiteNav · AdSense 스크립트
  page.js          # 연봉 실수령액 (홈)
  retirement/page.js
  age/page.js
  globals.css      # 전역 스타일 (디자인 시스템)
  sitemap.js       # CALCULATORS 기반 자동 sitemap
  robots.js
components/
  SalaryCalculator.js / RetirementCalculator.js / AgeCalculator.js  # 클라이언트 UI
  SiteNav.js       # 공통 상단 내비게이션
  AdSlot.js        # 광고 슬롯 (미승인 시 자리표시자)
lib/
  site.js          # 사이트 전역 설정 + CALCULATORS 배열(단일 진실 공급원)
  salary.js / retirement.js / age.js   # 순수 계산 로직 (UI와 분리)
docs/              # 모듈별 문서 (이 파일에서 링크)
```

## 4. 필수 규칙 (반드시 지킬 것)

1. **계산 로직과 UI 분리**: 모든 계산은 `lib/*.js`의 **순수 함수**로 작성한다.
   컴포넌트는 입력 수집·표시만 담당한다. (테스트·재사용·검증 용이)
2. **날짜는 UTC로 파싱**: 날짜 계산은 `new Date(Date.UTC(y, m-1, d))` 방식으로
   시간대 영향을 제거한다. 로컬 `new Date("2024-01-01")`에 의존하지 말 것.
3. **"오늘" 날짜는 클라이언트에서**: 정적 빌드 시점과 접속 시점이 다르므로,
   현재 날짜가 필요하면 `useEffect` 마운트 후 상태에 세팅해 **hydration 불일치**를
   피한다. (예: `AgeCalculator`의 기준일)
4. **디자인 시스템 재사용**: 새 UI는 `globals.css`의 기존 클래스
   (`.page .card .calc .calc-inputs .field .field-row .result-hero
   .deduction-table .notice .disclaimer .content .faq`)와 CSS 변수(`--brand` 등)를
   **그대로 사용**한다. 새 컴포넌트마다 새 색/스타일을 만들지 않는다.
5. **금액·요율 상수는 파일 상단에 모으고 연도를 주석**: 요율/세율/상·하한은 매년
   바뀐다. 값과 기준 연도를 한곳(상단 상수)에 두고 로직은 재사용한다.
6. **결과는 "추정치"임을 명시**: 각 계산기 하단 `.disclaimer`에 근거 공식과
   실제값과 차이날 수 있음을 반드시 표기한다. (법적 리스크 관리)
7. **SEO 필수 요소**: 새 페이지는 `metadata`(title/description/keywords/canonical/
   openGraph) + `h1` + 설명 섹션 + FAQ + `FAQPage` JSON-LD를 모두 갖춘다.

## 5. 새 계산기 추가 절차 (체크리스트)

새 계산기 `/foo/`를 추가할 때:

1. `lib/foo.js` — 순수 계산 함수 작성 (요율 상수 + 로직).
2. `components/FooCalculator.js` — `"use client"`, 기존 CSS 클래스로 UI 작성.
3. `app/foo/page.js` — 서버 컴포넌트. `metadata` export + `h1`/설명/FAQ/JSON-LD.
   (기존 `app/retirement/page.js`를 템플릿으로 복사해 수정하는 것을 권장)
4. `lib/site.js`의 **`CALCULATORS` 배열에 항목 추가**
   → 내비게이션(SiteNav)과 `sitemap.xml`에 **자동 반영**된다. (다른 곳 수정 불필요)
5. 필요 시 `globals.css`에 스타일 **추가**(기존 규칙 확장). 기존 값 임의 변경 금지.
6. `docs/foo.md` 작성 후 이 문서 §1 목록과 아래에 링크 추가.
7. `npm run build`로 정적 생성 확인(해당 라우트가 `○ Static`인지).

## 6. 개발 · 빌드 · 배포

```bash
npm run dev     # 로컬 개발 서버 (http://localhost:3000)
npm run build   # 정적 내보내기 → out/ 생성 (배포 전 필수 확인)
```

- **배포 전 반드시** `lib/site.js`의 `url`을 실제 도메인으로 교체
  (canonical·OpenGraph·sitemap·robots가 이 값을 사용).
- **AdSense 승인 후**: `lib/site.js`의 `adsenseClientId` 입력 + 각 `AdSlot`의
  `slot` 값을 발급받은 광고단위 ID로 교체 → 자동으로 광고 로드.
- `out/` 폴더를 정적 호스팅에 업로드하거나, Git 연동 시 빌드 커맨드 `next build`,
  출력 디렉터리 `out` 으로 설정.

## 7. 요율·세율 정기 점검 (매년) — **현재 기준: 2026년**

세법·4대보험 요율은 매년 초 변경된다. 아래를 연 1회 이상 점검·갱신:

- `lib/salary.js` — `RATES`, 연금 상·하한, 소득세 구간/누진공제, 근로소득공제,
  세액공제 한도. **어디를 어떤 값으로 고칠지, 무엇을 확인해야 하는지는
  [docs/salary.md](docs/salary.md) §3 표에 상세히 정리**되어 있다.
- `lib/retirement.js` — 평균임금 산정 방식은 안정적이나 통상임금 판례 반영 여부 확인.
- 변경 시 각 페이지 `metadata`와 본문의 연도 표기(예: "2026")도 함께 갱신
  (전체 검색으로 직전 연도 문자열을 찾아 교체 — 위치 목록은 salary.md §3).
- ⚠️ 현재 건강보험·장기요양 요율은 **2025년 확정값을 유지**한 상태이니, 2026년
  공식 요율 발표 시 반드시 교체(코드 주석에 `※2026 확정요율 확인` 표시).

## 8. 아이콘 · SEO · 광고 · 배포

- **아이콘/OG/PWA 이미지**: `scripts/generate-icons.mjs`로 생성(의존성 없음).
  브랜드 색·모양 변경 방법은 [docs/icons.md](docs/icons.md).
- **SEO**: 온페이지 요소는 코드에 반영됨. 배포 후 서치콘솔·네이버 등록 등
  오프페이지 작업과 개선 전략은 [docs/seo.md](docs/seo.md).
- **광고(AdSense)·배포·무료 도메인**: 단계별 절차는
  [docs/ads-and-deploy.md](docs/ads-and-deploy.md).

## 9. 문서 인덱스

- [docs/architecture.md](docs/architecture.md) — 공통 인프라(레이아웃·SEO·내비·광고·설정)
- [docs/salary.md](docs/salary.md) — 연봉 실수령액 계산기
- [docs/retirement.md](docs/retirement.md) — 퇴직금 계산기
- [docs/age.md](docs/age.md) — 만 나이 계산기
- [docs/icons.md](docs/icons.md) — 파비콘·OG·PWA 이미지
- [docs/seo.md](docs/seo.md) — 검색 노출 개선(온·오프페이지)
- [docs/ads-and-deploy.md](docs/ads-and-deploy.md) — AdSense·배포·무료 도메인
