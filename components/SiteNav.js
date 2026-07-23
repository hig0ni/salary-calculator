"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CALCULATORS, SITE } from "@/lib/site";

/**
 * 모든 페이지 상단에 노출되는 계산기 내비게이션.
 * 내부 링크로 페이지들을 서로 연결해 SEO(크롤링/색인)에도 도움이 됩니다.
 */
export default function SiteNav() {
  const pathname = usePathname();

  const isActive = (path) => {
    // trailingSlash 설정 때문에 경로 끝 슬래시를 정규화해서 비교
    const norm = (p) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);
    return norm(pathname) === norm(path);
  };

  return (
    <nav className="site-nav" aria-label="계산기 메뉴">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand">
          {SITE.name}
        </Link>
        <ul className="nav-links">
          {CALCULATORS.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                className={isActive(path) ? "nav-link active" : "nav-link"}
                aria-current={isActive(path) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
