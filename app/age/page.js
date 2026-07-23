import AgeCalculator from "@/components/AgeCalculator";
import AdSlot from "@/components/AdSlot";
import RelatedLinks from "@/components/RelatedLinks";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "만 나이 계산기 2026 | 생년월일로 만 나이·연 나이 계산",
  description:
    "생년월일을 입력하면 만 나이 통일법 기준 만 나이와 연 나이, 다음 생일 D-day, 띠·별자리까지 바로 계산합니다. 무료·설치 없이 사용하세요.",
  keywords: [
    "만 나이 계산기",
    "만 나이 계산",
    "연 나이 계산",
    "만나이 통일법",
    "생년월일 나이 계산",
    "띠 계산",
  ],
  alternates: { canonical: "/age/" },
  openGraph: {
    type: "website",
    title: "만 나이 계산기 2026 | 생년월일로 만 나이·연 나이 계산",
    description:
      "생년월일로 만 나이·연 나이, 다음 생일 D-day, 띠·별자리를 자동 계산합니다. 무료로 바로 사용하세요.",
    url: `${SITE.url}/age/`,
    siteName: SITE.name,
    locale: "ko_KR",
  },
};

const FAQ = [
  {
    q: "만 나이는 어떻게 계산하나요?",
    a: "만 나이 = 기준일 연도 − 출생 연도이며, 그해 생일이 아직 지나지 않았으면 1을 뺍니다. 생일이 지났으면 그대로입니다.",
  },
  {
    q: "만 나이 통일법이 무엇인가요?",
    a: "2023년 6월 28일부터 시행된 법으로, 법령·계약·문서에서 나이를 표시할 때 별도 규정이 없으면 만 나이로 통일해 사용하도록 정한 제도입니다.",
  },
  {
    q: "만 나이와 연 나이는 어떻게 다른가요?",
    a: "만 나이는 생일을 기준으로 한 살씩 늘어나고, 연 나이는 생일과 관계없이 현재 연도에서 출생 연도를 뺀 값입니다. 병역법·청소년보호법 등 일부는 연 나이를 씁니다.",
  },
  {
    q: "세는 나이(한국식 나이)는 이제 안 쓰나요?",
    a: "일상에서 쓰던 세는 나이는 법적 효력이 없습니다. 공식 문서·서비스에서는 만 나이를 기준으로 합니다.",
  },
];

export default function AgePage() {
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
        <h1>만 나이 계산기</h1>
        <p className="lede">
          생년월일을 입력하면 만 나이 통일법 기준 만 나이와 연 나이, 다음 생일
          D-day, 띠·별자리까지 바로 확인할 수 있습니다.
        </p>
      </header>

      <AdSlot label="상단 광고" slot="" />

      <section className="card">
        <AgeCalculator />
      </section>

      <AdSlot label="본문 광고" slot="" />

      <section className="content">
        <h2>만 나이는 이렇게 계산돼요</h2>
        <p>
          만 나이는 태어난 날을 0세로 시작해, 생일이 돌아올 때마다 한 살씩
          늘어납니다. 같은 해에 태어나도 생일이 지났는지에 따라 나이가
          달라집니다.
        </p>
        <ul>
          <li>
            <b>만 나이</b> — 기준일 연도 − 출생 연도 (생일 안 지났으면 −1)
          </li>
          <li>
            <b>연 나이</b> — 현재 연도 − 출생 연도 (병역·청소년보호법 등에서 사용)
          </li>
          <li>
            <b>다음 생일 D-day</b> — 기준일부터 다음 생일까지 남은 일수
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

      <RelatedLinks current="/age/" />

      <SiteFooter />
    </main>
  );
}
