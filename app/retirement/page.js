import RetirementCalculator from "@/components/RetirementCalculator";
import AdSlot from "@/components/AdSlot";
import RelatedLinks from "@/components/RelatedLinks";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "퇴직금 계산기 2026 | 평균임금·재직일수 자동계산",
  description:
    "입사일·퇴사일과 3개월 평균 급여를 입력하면 근로기준법 기준 법정 퇴직금을 자동으로 계산합니다. 1일 평균임금과 재직기간까지 한 번에 확인하세요.",
  keywords: [
    "퇴직금 계산기",
    "퇴직금 계산",
    "평균임금 계산",
    "법정 퇴직금",
    "재직일수 계산",
    "퇴직금 지급기준",
  ],
  alternates: { canonical: "/retirement/" },
  openGraph: {
    type: "website",
    title: "퇴직금 계산기 2026 | 평균임금·재직일수 자동계산",
    description:
      "입사일·퇴사일과 3개월 평균 급여로 법정 퇴직금을 자동 계산합니다. 무료·설치 없이 바로 사용하세요.",
    url: `${SITE.url}/retirement/`,
    siteName: SITE.name,
    locale: "ko_KR",
  },
};

const FAQ = [
  {
    q: "퇴직금은 어떻게 계산하나요?",
    a: "법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)입니다. 1일 평균임금은 퇴직 전 3개월간 받은 임금 총액을 그 기간의 총 일수로 나눈 값입니다.",
  },
  {
    q: "퇴직금은 언제부터 받을 수 있나요?",
    a: "주 15시간 이상 근무하며 계속근로기간이 1년 이상이면 지급 대상입니다. 1년 미만 근무 시에는 법정 퇴직금이 발생하지 않습니다.",
  },
  {
    q: "평균임금에는 무엇이 포함되나요?",
    a: "기본급뿐 아니라 정기적으로 지급된 상여금과 연차수당도 반영됩니다. 이 계산기는 연간 상여금·연차수당의 3/12를 3개월 임금총액에 더해 산정합니다.",
  },
  {
    q: "실제 지급액과 다를 수 있나요?",
    a: "평균임금이 통상임금보다 적으면 통상임금으로 계산하고, 퇴직연금(DC형)은 회사가 매년 납입한 금액과 운용수익으로 결정됩니다. 본 계산기는 추정치이니 참고용으로만 사용하세요.",
  },
];

export default function RetirementPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="hero">
        <h1>퇴직금 계산기</h1>
        <p className="lede">
          입사일·퇴사일과 퇴직 전 3개월 평균 급여를 입력하면 근로기준법 기준
          법정 퇴직금을 바로 계산합니다. 회원가입·설치 없이 무료로 사용하세요.
        </p>
      </header>

      <AdSlot label="상단 광고" slot="" />

      <section className="card">
        <RetirementCalculator />
      </section>

      <AdSlot label="본문 광고" slot="" />

      <section className="content">
        <h2>퇴직금은 이렇게 계산돼요</h2>
        <p>
          법정 퇴직금은 아래 공식으로 계산합니다. 같은 연봉이라도 재직기간과
          퇴직 직전 급여·상여에 따라 금액이 달라집니다.
        </p>
        <ul>
          <li>
            <b>1일 평균임금</b> — 퇴직 전 3개월 임금 총액 ÷ 그 기간의 총 일수
          </li>
          <li>
            <b>임금 총액</b> — 3개월 급여 + 연간 상여금·연차수당의 3/12
          </li>
          <li>
            <b>재직일수</b> — 입사일부터 퇴사일까지의 총 일수
          </li>
          <li>
            <b>법정 퇴직금</b> — 1일 평균임금 × 30일 × (재직일수 ÷ 365)
          </li>
        </ul>

        <h2>자주 묻는 질문</h2>
        <dl className="faq">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="faq-item">
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedLinks current="/retirement/" />

      <SiteFooter />
    </main>
  );
}
