import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `개인정보처리방침 | ${SITE.name}`,
  description: `${SITE.name}의 개인정보처리방침 및 쿠키·광고 안내입니다.`,
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>개인정보처리방침</h1>
        <p className="lede">
          {SITE.name}(이하 &lsquo;사이트&rsquo;)가 이용자의 개인정보를 어떻게
          취급하는지 안내합니다.
        </p>
      </header>

      <section className="content">
        <h2>1. 개인정보의 수집</h2>
        <p>
          사이트는 회원가입 절차가 없으며, 이용자의 이름·연락처 등
          개인정보를 직접 수집하지 않습니다. 계산기에 입력하는 값(연봉, 생년월일
          등)은 이용자의 브라우저 안에서만 계산에 사용되며, 사이트 서버로 전송·
          저장되지 않습니다.
        </p>

        <h2>2. 쿠키 및 광고</h2>
        <p>
          사이트는 서비스 운영을 위해 Google AdSense 등 제3자 광고 사업자의
          광고를 게재할 수 있습니다. 이 과정에서 광고 사업자는 쿠키를 사용하여
          이용자의 이전 방문 기록 등을 바탕으로 맞춤형 광고를 제공할 수 있습니다.
        </p>
        <ul>
          <li>
            Google을 포함한 제3자 공급업체는 쿠키를 사용해 이용자의 방문 기록에
            기반한 광고를 게재합니다.
          </li>
          <li>
            이용자는{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 광고 설정
            </a>
            에서 맞춤형 광고를 해제할 수 있습니다.
          </li>
          <li>
            제3자 공급업체의 쿠키 사용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 광고 정책
            </a>
            을 참고하세요. 또한{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutads.info
            </a>
            에서 광고 쿠키를 일괄 관리할 수 있습니다.
          </li>
          <li>
            브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며, 이 경우
            일부 광고가 맞춤형으로 제공되지 않을 수 있습니다.
          </li>
        </ul>

        <h2>3. 접속 통계</h2>
        <p>
          사이트는 서비스 개선을 위해 방문 통계 분석 도구를 사용할 수 있으며, 이때
          수집되는 정보는 개인을 식별할 수 없는 형태의 집계 데이터입니다.
        </p>

        <h2>4. 개인정보의 제3자 제공</h2>
        <p>
          사이트는 이용자의 개인정보를 직접 수집하지 않으므로 제3자에게 제공하지
          않습니다. 광고·통계 목적의 쿠키 처리는 위 2·3항에 따릅니다.
        </p>

        <h2>5. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 브라우저의 쿠키 설정을 변경하여 광고 개인화를 거부할
          수 있습니다.
        </p>

        <h2>6. 문의</h2>
        <p>
          개인정보 처리에 관한 문의는 아래로 연락해 주세요.
          {SITE.contactEmail ? (
            <>
              {" "}
              <b>{SITE.contactEmail}</b>
            </>
          ) : (
            " (운영자 이메일: 설정 예정)"
          )}
        </p>

        <h2>7. 시행일 및 변경</h2>
        <p>
          본 방침은 관련 법령이나 서비스 정책 변경에 따라 개정될 수 있으며,
          중요한 변경이 있을 경우 사이트를 통해 공지합니다.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
