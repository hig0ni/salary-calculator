# 연봉 실수령액 계산기 (광고형 유틸 사이트 스타터)

로그인·회원가입 없이 쓰는 도구형 사이트로, 검색 유입 → 광고(AdSense) 수익을 노리는 스타터입니다.
Next.js(App Router) + **정적 내보내기**라 서버 없이 무료 호스팅에 올릴 수 있습니다.

## 실행

```bash
cd salary-calculator
npm install
npm run dev      # http://localhost:3000
```

## 빌드 (정적 사이트 생성)

```bash
npm run build
```

`out/` 폴더에 정적 파일이 생성됩니다. 이 폴더를 그대로 배포하면 됩니다.

## 무료 배포

- **Vercel**: 이 폴더를 GitHub에 올리고 Vercel에서 import (자동 감지)
- **Cloudflare Pages / Netlify**: 빌드 명령 `npm run build`, 출력 디렉터리 `out`

## 배포 전 체크리스트

1. `lib/site.js` — 사이트 이름, 실제 도메인(`url`) 교체
2. 도메인 연결 후 콘텐츠(FAQ·설명글)가 충분한 상태에서 **Google AdSense 신청**
3. 승인되면 `lib/site.js` 의 `adsenseClientId` 에 게시자 ID(`ca-pub-...`) 입력
4. `app/page.js` 의 `<AdSlot slot="..." />` 에 AdSense 광고단위 ID 입력
5. Google Search Console 에 사이트 등록 → `sitemap.xml` 제출

## 파일 구조

```
lib/salary.js          계산 로직 (요율/세율 상수 — 매년 갱신)
lib/site.js            사이트 설정 (이름·도메인·AdSense ID)
components/            계산기 UI, 광고 슬롯
app/page.js            메인 페이지 (계산기 + SEO 콘텐츠 + FAQ 구조화데이터)
app/layout.js          메타태그, AdSense 스크립트 로드
```

## 확장 아이디어

같은 디자인·레이아웃을 복제해 계산기를 늘리면 SEO 커버리지가 넓어집니다.
- 퇴직금 계산기, 대출 이자 계산기, 만 나이 계산기, 평수 변환기 등
- 각 계산기를 `app/<이름>/page.js` 로 추가하면 개별 URL로 색인됩니다.

## ⚠️ 주의

- 소득세는 국세청 간이세액표가 아닌 **누진세율 기반 추정치**입니다. 참고용으로만 사용하세요.
- 4대보험 요율/세율은 매년 바뀌므로 `lib/salary.js` 상단 상수를 갱신하세요.
