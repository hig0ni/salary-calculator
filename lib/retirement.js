/**
 * 퇴직금 계산 로직
 * -------------------------------------------------------------
 * 근로기준법상 법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
 *
 * 1일 평균임금 = 퇴직 전 3개월간 지급된 임금 총액 ÷ 그 기간의 총 일수
 *   - 임금 총액에는 3개월 급여 외에 연간 상여금·연차수당의 3/12를 더해 산정합니다.
 *
 * ⚠️ 평균임금이 통상임금보다 적으면 통상임금을 평균임금으로 봅니다(근로기준법 제2조).
 *    이 계산기는 입력한 3개월 급여를 기준으로 한 추정치이며, 실제 지급액은
 *    회사 규정·통상임금 여부에 따라 달라질 수 있어 참고용입니다.
 */

const MS_PER_DAY = 86_400_000;

// "YYYY-MM-DD" → UTC 기준 Date (시간대 영향 제거)
function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// 재직일수(일)를 년·개월·일로 표기
function breakdownPeriod(입사, 퇴사) {
  let y = 퇴사.getUTCFullYear() - 입사.getUTCFullYear();
  let m = 퇴사.getUTCMonth() - 입사.getUTCMonth();
  let d = 퇴사.getUTCDate() - 입사.getUTCDate();
  if (d < 0) {
    m -= 1;
    // 이전 달의 마지막 날 수를 더함
    const prevMonthDays = new Date(
      Date.UTC(퇴사.getUTCFullYear(), 퇴사.getUTCMonth(), 0)
    ).getUTCDate();
    d += prevMonthDays;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { 년: y, 개월: m, 일: d };
}

/**
 * @param {Object} p
 * @param {string} p.입사일 - "YYYY-MM-DD"
 * @param {string} p.퇴사일 - "YYYY-MM-DD" (마지막 근무일 다음 날 = 퇴직일)
 * @param {number} p.월급여 - 퇴직 전 3개월 "월평균" 세전 급여(원)
 * @param {number} [p.연간상여금] - 1년간 지급 상여금 총액(원)
 * @param {number} [p.연차수당] - 1년간 연차수당 총액(원)
 */
export function calcRetirement({
  입사일,
  퇴사일,
  월급여,
  연간상여금 = 0,
  연차수당 = 0,
}) {
  const 입사 = parseDate(입사일);
  const 퇴사 = parseDate(퇴사일);
  월급여 = Math.max(0, Math.floor(월급여 || 0));
  연간상여금 = Math.max(0, Math.floor(연간상여금 || 0));
  연차수당 = Math.max(0, Math.floor(연차수당 || 0));

  if (!입사 || !퇴사 || 퇴사 <= 입사) {
    return { valid: false };
  }

  const 재직일수 = daysBetween(입사, 퇴사);
  const 기간 = breakdownPeriod(입사, 퇴사);

  // 퇴직 전 3개월의 총 일수 (달력 기준, 보통 89~92일)
  const 삼개월전 = new Date(
    Date.UTC(퇴사.getUTCFullYear(), 퇴사.getUTCMonth() - 3, 퇴사.getUTCDate())
  );
  const 기간일수 = daysBetween(삼개월전, 퇴사);

  // 3개월 임금 총액 = 3개월 급여 + 상여금·연차수당의 3/12
  const 삼개월급여 = 월급여 * 3;
  const 상여가산 = Math.round((연간상여금 * 3) / 12);
  const 연차가산 = Math.round((연차수당 * 3) / 12);
  const 임금총액 = 삼개월급여 + 상여가산 + 연차가산;

  const 일평균임금 = 기간일수 > 0 ? 임금총액 / 기간일수 : 0;

  // 법정 퇴직금
  const 퇴직금 = Math.round((일평균임금 * 30 * 재직일수) / 365);

  return {
    valid: true,
    재직일수,
    기간, // { 년, 개월, 일 }
    지급대상: 재직일수 >= 365, // 계속근로 1년 미만은 법정 퇴직금 지급대상 아님
    일평균임금: Math.round(일평균임금),
    임금총액,
    기간일수,
    상여가산,
    연차가산,
    퇴직금,
  };
}

export function formatWon(n) {
  return (Math.round(n) || 0).toLocaleString("ko-KR");
}
