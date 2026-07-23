import Link from "next/link";
import { CALCULATORS } from "@/lib/site";

/**
 * 다른 계산기로 연결하는 내부 링크 섹션.
 * - 현재 페이지(current)는 제외하고 나머지를 카드로 노출.
 * - 사이트 내부 링크를 늘려 크롤링·색인·체류시간(SEO)에 도움을 준다.
 *
 * @param {string} current - 현재 페이지 경로 (예: "/", "/age/")
 */
export default function RelatedLinks({ current }) {
  const others = CALCULATORS.filter((c) => c.path !== current);
  if (others.length === 0) return null;

  return (
    <section className="related" aria-label="다른 계산기">
      <h2>다른 계산기도 사용해 보세요</h2>
      <div className="related-grid">
        {others.map(({ path, label }) => (
          <Link key={path} href={path} className="related-card">
            <span className="related-card-title">{label} 계산기</span>
            <span className="related-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
