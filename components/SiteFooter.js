import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * 모든 페이지 하단 공통 푸터.
 * 면책 문구 + 개인정보처리방침 링크. (AdSense 정책상 정책 페이지 링크 노출 권장)
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{SITE.name} · 본 사이트의 계산 결과는 참고용이며 법적 효력이 없습니다.</p>
      <p className="footer-links">
        <Link href="/privacy/">개인정보처리방침</Link>
      </p>
    </footer>
  );
}
