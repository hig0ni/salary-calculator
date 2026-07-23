import SalaryCalculator from "@/components/SalaryCalculator";
import AdSlot from "@/components/AdSlot";
import RelatedLinks from "@/components/RelatedLinks";
import SiteFooter from "@/components/SiteFooter";

const FAQ = [
  {
    q: "실수령액이란 무엇인가요?",
    a: "세전 연봉에서 국민연금·건강보험·장기요양보험·고용보험(4대보험)과 소득세·지방소득세를 뺀, 실제로 통장에 들어오는 금액입니다.",
  },
  {
    q: "4대보험 요율은 어떻게 되나요?",
    a: "근로자 부담 기준으로 국민연금 4.5%, 건강보험 3.545%, 장기요양보험은 건강보험료의 12.95%, 고용보험 0.9%입니다. (2026년 기준, 매년 변동될 수 있습니다.)",
  },
  {
    q: "비과세액은 왜 입력하나요?",
    a: "식대(월 20만원까지) 등 비과세 급여는 4대보험료와 소득세 부과 대상에서 빠집니다. 비과세액이 크면 실수령액이 늘어납니다.",
  },
  {
    q: "실제 급여명세서와 금액이 다른 이유는?",
    a: "소득세는 회사가 국세청 간이세액표로 원천징수하며, 회사별 수당·상여·공제 항목에 따라 달라집니다. 본 계산기는 누진세율 기반 추정치라 참고용으로만 사용하세요.",
  },
];

export default function Home() {
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
        <h1>연봉 실수령액 계산기</h1>
        <p className="lede">
          세전 연봉을 입력하면 4대보험과 세금을 빼고 매달 통장에 들어오는
          금액을 바로 계산합니다. 회원가입·설치 없이 무료로 사용하세요.
        </p>
      </header>

      <AdSlot label="상단 광고" slot="" />

      <section className="card">
        <SalaryCalculator />
      </section>

      <AdSlot label="본문 광고" slot="" />

      <section className="content">
        <h2>실수령액은 이렇게 계산돼요</h2>
        <p>
          세전 연봉을 12로 나눈 월급에서 아래 항목이 빠집니다. 세전 연봉이
          같아도 부양가족 수와 비과세 급여에 따라 실수령액이 달라집니다.
        </p>
        <ul>
          <li>
            <b>국민연금</b> — 과세 월급의 4.5% (기준소득월액 상·하한 적용)
          </li>
          <li>
            <b>건강보험</b> — 과세 월급의 3.545%
          </li>
          <li>
            <b>장기요양보험</b> — 건강보험료의 12.95%
          </li>
          <li>
            <b>고용보험</b> — 과세 월급의 0.9%
          </li>
          <li>
            <b>소득세·지방소득세</b> — 근로소득 누진세율로 추정 (지방세는
            소득세의 10%)
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

      <RelatedLinks current="/" />

      <SiteFooter />
    </main>
  );
}
