# 광고(AdSense) · 배포 · 무료 도메인 가이드

구글 광고 연동, 무료 배포, 무료 도메인까지 순서대로 정리한다.

> 상위 규칙: [../CLAUDE.md](../CLAUDE.md)

---

## A. 진행 순서 요약

```
1) 배포(무료 호스팅)로 사이트를 먼저 인터넷에 올린다
2) (선택) 무료/유료 도메인 연결
3) lib/site.js 의 url 을 실제 도메인으로 교체 → 재배포
4) 검색엔진 등록(서치콘솔/네이버)  ← docs/seo.md
5) AdSense 신청 → 승인 → 코드 입력 → 광고 노출
```

> AdSense는 **실제 도메인 + 어느 정도의 콘텐츠/트래픽**이 있어야 승인이 잘 된다.
> 그래서 배포·도메인·SEO를 먼저 하고 광고는 마지막에 붙인다.

---

## B. 구글 광고(AdSense) 단계별

코드는 **이미 준비되어 있음** — 값만 넣으면 된다.
- `lib/site.js` → `adsenseClientId`
- 각 페이지의 `<AdSlot slot="광고단위ID" />` (`components/AdSlot.js`)
- 승인 전에는 점선 자리표시자만 보이고, 값이 채워지면 자동으로 실제 광고 로드.

**단계**
1. **가입/신청**: https://adsense.google.com → 구글 계정으로 가입, 사이트 URL 입력.
2. **소유확인 코드 삽입**: AdSense가 주는 스니펫의 `ca-pub-XXXXXXXXXXXXXXXX` 값을
   `lib/site.js`의 `adsenseClientId`에 입력 → **재배포**.
   (레이아웃이 이 값이 있을 때만 AdSense 스크립트를 자동 로드한다.)
3. **심사 대기**: 보통 며칠~2주. 이 기간 동안 콘텐츠·정책 위반 여부를 검토.
   - 승인 팁: 각 계산기 설명·FAQ 충실히(이미 있음), 개인정보처리방침 페이지 추가 권장.
4. **승인 후 광고 단위 생성**: AdSense → 광고 → 광고 단위 → "디스플레이 광고" 생성 →
   발급된 **광고 단위 ID(slot)** 복사.
5. **slot 입력**: 각 페이지의 `<AdSlot slot="" />`에 발급받은 slot 값을 넣는다.
   - 예) `app/page.js`: `<AdSlot label="상단 광고" slot="1234567890" />`
   - 상단/본문 슬롯마다 각각 다른 광고 단위를 만들어 넣으면 됨.
6. **재배포** → 실제 광고 노출. AdSense 대시보드에서 수익 확인.

**주의**
- 자기 광고 클릭 금지(계정 정지 사유).
- `ads.txt` 필요 시 AdSense 안내대로 `public/ads.txt` 추가(정적 export가 그대로 서빙).
- 개인정보처리방침·쿠키 고지 페이지가 있으면 승인·정책에 유리.

---

## C. 무료 배포 (정적 사이트)

이 프로젝트는 `output: "export"`라 **어떤 정적 호스팅에도** 무료로 올릴 수 있다.
빌드 결과물은 `out/` 폴더. 아래 중 하나 선택(모두 무료 플랜 제공).

### 방법 1) Vercel (가장 쉬움, Next.js 제작사)
1. 코드를 GitHub 저장소에 올린다.
2. https://vercel.com → GitHub 로그인 → New Project → 저장소 선택.
3. 프레임워크가 Next.js로 자동 인식됨 → **Deploy** 클릭.
4. `xxx.vercel.app` 무료 주소로 즉시 배포. push 할 때마다 자동 재배포.

### 방법 2) Cloudflare Pages
1. GitHub 저장소 연결.
2. Build command: `next build`, Output directory: `out`.
3. `xxx.pages.dev` 무료 주소. (무료 대역폭 넉넉)

### 방법 3) Netlify
1. GitHub 저장소 연결 또는 `out/` 폴더를 드래그&드롭.
2. Build command: `next build`, Publish directory: `out`.
3. `xxx.netlify.app` 무료 주소.

### 방법 4) GitHub Pages (완전 무료, 저장소만 있으면 됨)
- `out/` 폴더를 `gh-pages`로 배포. 서브경로(`/저장소명/`)로 열릴 수 있어
  `next.config.mjs`에 `basePath` 설정이 필요할 수 있음(커스텀 도메인 쓰면 불필요).

> 로컬에서 `npm run build` 후 `out/`만 올려도 되고, GitHub 연동 시 호스트가
> 자동 빌드한다. **아이콘/OG 이미지는 정적 파일로 커밋되어 있어** 리눅스 빌드에서도
> 문제없다.

---

## D. 무료 도메인

`xxx.vercel.app` 같은 기본 주소로도 광고·운영이 가능하지만, 커스텀 도메인이
브랜딩·신뢰도·SEO에 유리하다.

### 무료 옵션
- **호스팅 기본 서브도메인**: `vercel.app` / `pages.dev` / `netlify.app` — 무료·안정적.
  (가장 현실적인 "무료 도메인")
- **완전 무료 도메인 서비스**: 예전의 Freenom(.tk/.ml 등)은 현재 신뢰성이 낮아
  **비권장**. 광고 승인·SEO에 불리할 수 있음.

### 저렴한 유료(권장)
- `.com`/`.net` 등을 연 1~2만원대에 구매(Cloudflare Registrar는 원가 수준, 가비아,
  Namecheap 등). 국내 서비스면 `.kr`도 고려.

### 커스텀 도메인 연결 순서 (호스트 공통)
1. 도메인 구매/보유.
2. 호스트 대시보드 → 프로젝트 → **Domains/커스텀 도메인 추가**.
3. 도메인 DNS에 안내된 **CNAME/A 레코드** 추가(호스트가 값 제공).
4. HTTPS 인증서는 대부분 자동 발급.
5. **`lib/site.js`의 `url`을 새 도메인으로 교체 → 재배포**
   (canonical·OG·sitemap·robots가 이 값을 사용).
6. 서치콘솔/네이버에 새 도메인으로 재등록([seo.md](seo.md)).

---

## E. 최종 배포 전 체크리스트

- [ ] `lib/site.js` `url` = 실제 도메인
- [ ] `npm run build` 성공, `out/` 확인
- [ ] (승인 후) `adsenseClientId` + 각 `AdSlot slot` 입력
- [ ] 서치콘솔/네이버 소유확인 값 입력 및 사이트맵 제출
- [ ] 개인정보처리방침 페이지(권장) 추가
- [ ] 요율/연도 최신 상태 확인 ([salary.md](salary.md))
