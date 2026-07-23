/**
 * 만 나이 계산 로직 (2023.6.28 시행 "만 나이 통일법" 기준)
 * -------------------------------------------------------------
 * 만 나이 = 기준일 연도 − 출생 연도, 단 생일이 아직 지나지 않았으면 1을 뺀다.
 * 연 나이 = 기준일 연도 − 출생 연도 (병역·청소년보호법 등에서 사용)
 */

const MS_PER_DAY = 86_400_000;

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  // 2월 30일 등 잘못된 값 방지
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

const 띠목록 = [
  "쥐",
  "소",
  "호랑이",
  "토끼",
  "용",
  "뱀",
  "말",
  "양",
  "원숭이",
  "닭",
  "개",
  "돼지",
];

// 별자리 (양력 기준)
const 별자리표 = [
  [1, 20, "염소자리"],
  [2, 19, "물병자리"],
  [3, 21, "물고기자리"],
  [4, 20, "양자리"],
  [5, 21, "황소자리"],
  [6, 22, "쌍둥이자리"],
  [7, 23, "게자리"],
  [8, 23, "사자자리"],
  [9, 24, "처녀자리"],
  [10, 23, "천칭자리"],
  [11, 23, "전갈자리"],
  [12, 25, "궁수자리"],
  [12, 32, "염소자리"],
];

function 별자리(month, day) {
  for (const [m, d, name] of 별자리표) {
    if (month < m || (month === m && day <= d)) return name;
  }
  return "염소자리";
}

const 요일목록 = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * @param {string} birthStr - 생년월일 "YYYY-MM-DD"
 * @param {string} baseStr  - 기준일 "YYYY-MM-DD" (보통 오늘)
 */
export function calcAge(birthStr, baseStr) {
  const birth = parseDate(birthStr);
  const base = parseDate(baseStr);
  if (!birth || !base || base < birth) return { valid: false };

  const by = birth.getUTCFullYear();
  const bm = birth.getUTCMonth() + 1;
  const bd = birth.getUTCDate();

  // 만 나이
  let 만나이 = base.getUTCFullYear() - by;
  const 생일지남 =
    base.getUTCMonth() + 1 > bm ||
    (base.getUTCMonth() + 1 === bm && base.getUTCDate() >= bd);
  if (!생일지남) 만나이 -= 1;

  // 연 나이
  const 연나이 = base.getUTCFullYear() - by;

  // 살아온 총 일수
  const 총일수 = Math.floor((base.getTime() - birth.getTime()) / MS_PER_DAY);

  // 다음 생일까지 D-day
  let 다음생일 = new Date(Date.UTC(base.getUTCFullYear(), bm - 1, bd));
  if (다음생일 < base) {
    다음생일 = new Date(Date.UTC(base.getUTCFullYear() + 1, bm - 1, bd));
  }
  const 생일까지 = Math.round((다음생일.getTime() - base.getTime()) / MS_PER_DAY);

  return {
    valid: true,
    만나이,
    연나이,
    총일수,
    생일까지, // 0이면 오늘이 생일
    띠: 띠목록[(by - 4) % 12] + "띠",
    별자리: 별자리(bm, bd),
    태어난요일: 요일목록[birth.getUTCDay()],
  };
}

export function formatNum(n) {
  return (Math.round(n) || 0).toLocaleString("ko-KR");
}

// input[type=date] 기본값으로 쓸 오늘 날짜 "YYYY-MM-DD" (로컬 기준)
export function todayStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
