# SEO 가이드 (검색 노출 개선)

"사람들에게 더 잘 노출"하기 위한 온페이지(코드) 구성과, 배포 후 사람이 직접 해야
하는 오프페이지 작업을 정리한다.

> 상위 규칙: [../CLAUDE.md](../CLAUDE.md)

---

## 1. 이미 적용된 온페이지 SEO (코드에 반영됨)

| 항목 | 위치 | 설명 |
|---|---|---|
| 페이지별 메타데이터 | 각 `app/*/page.js`의 `metadata` | title/description/keywords/canonical/openGraph |
| 정규 URL(canonical) | `metadata.alternates.canonical` | 중복 색인 방지 |
| FAQ 구조화 데이터 | 각 페이지 `FAQPage` JSON-LD | 검색결과 FAQ 리치 결과 대상 |
| 사이트 구조화 데이터 | `app/layout.js` `WebSite`+`Organization` | 브랜드/사이트 인식 |
| OG/트위터 카드 이미지 | `app/opengraph-image.png` (+`.alt.txt`) | SNS 공유 썸네일 |
| 파비콘/앱 아이콘 | `app/icon.svg`, `favicon.ico`, `apple-icon.png` | 브랜딩 → [icons.md](icons.md) |
| PWA 매니페스트 | `app/manifest.js` | 모바일 설치/신뢰 신호 |
| 내부 링크 | `components/RelatedLinks.js` (전 페이지) + `SiteNav` | 크롤링·체류시간 |
| sitemap / robots | `app/sitemap.js`, `app/robots.js` | 색인 유도 |
| 소유확인 메타 | `app/layout.js` `verification` (값은 `lib/site.js`) | 서치콘솔·네이버 |
| 정적·경량 | `output: export`, 최소 JS | 로딩 속도(Core Web Vitals) |
| 시맨틱 마크업 | `h1`/`h2`/`section`/`dl` | 구조 명확화 |
| 언어 지정 | `<html lang="ko">`, `locale: ko_KR` | 한국어 타깃 |

## 2. 배포 후 반드시 할 오프페이지 작업 (사람이 직접)

> 도메인이 확정되고 배포된 뒤 진행. `lib/site.js`의 `url`이 실제 도메인이어야 함.

1. **Google Search Console 등록** — https://search.google.com/search-console
   - URL 접두어로 사이트 추가 → HTML 태그 방식 확인 → `content` 값을
     `lib/site.js`의 `googleVerification`에 입력 후 재배포.
   - `Sitemaps` 메뉴에 `sitemap.xml` 제출.
   - `URL 검사`로 각 페이지 색인 요청.
2. **네이버 서치어드바이저 등록** — https://searchadvisor.naver.com
   - 사이트 등록 → HTML 태그 확인 → `content` 값을 `naverVerification`에 입력 후 재배포.
   - 사이트맵 제출 + `수집 요청`. (국내 검색은 네이버 비중이 큼)
3. **Bing 웹마스터도구**(선택) — 구글 서치콘솔에서 사이트 가져오기로 간편 등록.
4. **애널리틱스 연결**(선택이지만 권장) — GA4 또는 네이버 애널리틱스로 유입 확인.

## 3. 콘텐츠·키워드 전략 (지속)

- **롱테일 키워드**를 페이지 본문·FAQ에 자연스럽게 포함:
  "연봉 5000 실수령액", "연봉 3600 실수령액", "퇴직금 세금", "만 나이 빠른년생" 등.
- 각 계산기 하단 설명 섹션을 **더 길고 유용하게**(예: 연봉 구간별 실수령액 표) →
  체류시간·키워드 커버리지 상승.
- **신규 계산기 추가 = 신규 유입 관문**. 검색량 있는 주제부터:
  연차수당, 시급/주휴수당, 실업급여, 중도퇴사 연말정산, 4대보험료, 부가세, 대출이자,
  DC/DB 퇴직연금 등. (추가 절차는 CLAUDE.md §5)
- 제목·H1에 **핵심 키워드 + 연도**를 유지("… 계산기 2026").

## 4. 신뢰도·백링크 (검색 순위에 큰 영향)

- 블로그/커뮤니티/카페에 계산기 링크 공유 → 자연 유입 + 백링크.
- 오픈 디렉터리·유용한 도구 모음 사이트에 등록.
- 콘텐츠가 정확·유용해야 재방문·공유가 생김(요율 최신화가 곧 SEO).

## 5. 정기 점검 체크리스트

- [ ] 매년 초 요율/세율 최신화 ([salary.md](salary.md) §3) + 연도 표기 갱신
- [ ] 서치콘솔/서치어드바이저에서 색인 상태·검색어(쿼리) 확인
- [ ] 유입 많은 키워드에 맞춰 본문 보강
- [ ] 깨진 링크/404 점검, 새 페이지 sitemap 반영 여부 확인
- [ ] Core Web Vitals(속도) 리포트 확인
