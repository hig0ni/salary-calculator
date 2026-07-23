# 아이콘 / 이미지 (favicon · OG · PWA)

브랜드 아이콘과 공유 이미지의 구성·생성·수정 방법.

> 상위 규칙: [../CLAUDE.md](../CLAUDE.md)

---

## 1. 파일 목록과 역할

| 파일 | 용도 | 생성 방식 |
|---|---|---|
| `app/icon.svg` | 기본 파비콘(모던 브라우저) | 손으로 작성한 SVG (원본) |
| `app/favicon.ico` | 파비콘 폴백(구형/일부 환경) 16·32·48px | 스크립트 생성 |
| `app/apple-icon.png` | iOS 홈 화면 아이콘 180px | 스크립트 생성 |
| `app/opengraph-image.png` | SNS 공유 카드 1200×630 | 스크립트 생성 |
| `app/opengraph-image.alt.txt` | OG 이미지 대체 텍스트 | 손으로 작성 |
| `public/icon-192.png` | PWA/안드로이드 192px | 스크립트 생성 |
| `public/icon-512.png` | PWA/안드로이드 512px, 로고(구조화데이터) | 스크립트 생성 |

- Next.js **파일 컨벤션**이라 위 파일을 두면 `<link rel="icon">`,
  `apple-touch-icon`, `og:image`, `manifest` 링크가 **자동 주입**된다.
  (별도 `<head>` 작성 불필요)
- `app/manifest.js`가 `public/icon-192·512.png`를 참조한다.

## 2. 디자인

- 모티프: **계산기**(디스플레이 바 + 2×2 버튼), 세 계산기를 아우르는 범용 상징.
- 색: 브랜드 그라디언트 **인디고 `#4F46E5` → 틸 `#0EA5A3`** (135°).
  `globals.css`의 `--brand`/`--accent`, `.site-brand` 로고 도트와 동일 톤.
- OG 이미지: 그라디언트 배경 + 중앙 로고 + 은은한 점 격자 + 로고 뒤 소프트 글로우.

## 3. 생성·수정 방법

생성기: **`scripts/generate-icons.mjs`** (외부 의존성 없음 · Node 내장 `zlib`만 사용).

```bash
node scripts/generate-icons.mjs
```

- **브랜드 색 변경**: 스크립트 상단 `BRAND` 상수(`c1`, `c2`) 수정 → 재실행.
  (반드시 `globals.css`의 `--brand`/`--accent` 값과 맞출 것)
- **모양 변경**: `sampleIcon()`의 흰색 요소 배열(`els`)에서 사각형 좌표(32-그리드
  기준)를 조정. 배경 라운드값은 `rrDist(..., 7)`의 `7`.
- **OG 레이아웃 변경**: `renderOG()`에서 로고 크기(`logo`)·배경 그라디언트·점 격자
  조정.
- `app/icon.svg`(원본 SVG)는 스크립트가 만들지 않으므로, 모양을 바꾸면 SVG도
  **같이 수동 수정**해 일관성을 유지한다.

## 4. 기술 메모

- PNG 인코딩: `IHDR`(RGBA 8bit) + `zlib.deflateSync` + `IEND`, CRC32 직접 구현.
- ICO: `ICONDIR` + 각 크기 PNG를 임베드(모던 브라우저는 PNG-in-ICO 허용).
- 안티에일리어싱: 아이콘은 4x 슈퍼샘플, OG는 대각 그라디언트로 부드럽게.
- 모두 **정적 파일**로 커밋되므로 배포 호스트에서 재생성 불필요(리눅스 빌드 무관).
