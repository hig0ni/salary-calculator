// 사이트 전역 설정 — 배포 전 이 값들만 바꾸면 됩니다.
export const SITE = {
  name: "월급계산기",
  title: "연봉 실수령액 계산기 2026 | 4대보험·세금 자동계산",
  description:
    "연봉을 입력하면 국민연금·건강보험·고용보험·소득세를 자동으로 빼고 월 실수령액을 계산해 드립니다. 로그인·설치 없이 무료로 바로 사용하세요.",
  url: "https://korea-salary-calculator.vercel.app", // 실제 배포 도메인
  // Google AdSense 게시자 ID (예: ca-pub-1234567890123456). 승인 후 교체.
  adsenseClientId: "",

  // ── 검색엔진 소유확인 코드 (발급 후 붙여넣기) ──
  // Google Search Console → 설정 → 소유권 확인 → HTML 태그의 content 값
  googleVerification: "qTfd1MWMpSQp_EKPq2cPOEU6XK7PGJyaf57Fvoa5J6s",
  // 네이버 서치어드바이저 → 사이트 등록 → HTML 태그의 content 값
  naverVerification: "49311c35038009c0c4f4f28bcbc2e562ebfd21e2",

  // 개인정보처리방침에 표기할 운영자 연락 이메일 (공개됨). 비우면 안내 문구로 대체.
  contactEmail: "",
};

// 사이트에 포함된 계산기 목록 — 상단 내비게이션과 sitemap이 함께 사용합니다.
// 새 계산기를 추가하면 이 배열에만 넣으면 메뉴·sitemap에 자동 반영됩니다.
export const CALCULATORS = [
  { path: "/", label: "연봉 실수령액", short: "연봉" },
  { path: "/retirement/", label: "퇴직금", short: "퇴직금" },
  { path: "/age/", label: "만 나이", short: "만 나이" },
];
