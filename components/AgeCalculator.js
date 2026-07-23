"use client";

import { useEffect, useMemo, useState } from "react";
import { calcAge, formatNum, todayStr } from "@/lib/age";

export default function AgeCalculator() {
  const [생년월일, set생년월일] = useState("1990-01-01");
  // 기준일 기본값 = 오늘. SSR/정적빌드 시점과 실제 접속일이 다르므로
  // 마운트 후 오늘 날짜로 세팅해 hydration 불일치를 피합니다.
  const [기준일, set기준일] = useState("");

  useEffect(() => {
    set기준일(todayStr());
  }, []);

  const result = useMemo(() => {
    if (!기준일) return { valid: false };
    return calcAge(생년월일, 기준일);
  }, [생년월일, 기준일]);

  return (
    <div className="calc">
      <div className="calc-inputs">
        <div className="field-row">
          <label className="field">
            <span>생년월일</span>
            <input
              type="date"
              value={생년월일}
              onChange={(e) => set생년월일(e.target.value)}
            />
          </label>
          <label className="field">
            <span>기준일</span>
            <input
              type="date"
              value={기준일}
              onChange={(e) => set기준일(e.target.value)}
            />
          </label>
        </div>
      </div>

      {result.valid ? (
        <>
          <div className="result-hero">
            <span className="result-label">만 나이</span>
            <strong className="result-amount">만 {result.만나이}세</strong>
            <span className="result-sub">
              {result.생일까지 === 0
                ? "🎉 오늘이 생일입니다!"
                : `다음 생일까지 D-${result.생일까지}`}{" "}
              · 연 나이 {result.연나이}세
            </span>
          </div>

          <table className="deduction-table">
            <tbody>
              <tr>
                <td>만 나이</td>
                <td>만 {result.만나이}세</td>
              </tr>
              <tr>
                <td>연 나이(현재 연도 − 출생 연도)</td>
                <td>{result.연나이}세</td>
              </tr>
              <tr>
                <td>태어난 지</td>
                <td>{formatNum(result.총일수)}일째</td>
              </tr>
              <tr>
                <td>다음 생일까지</td>
                <td>
                  {result.생일까지 === 0 ? "오늘 🎂" : `D-${result.생일까지}`}
                </td>
              </tr>
              <tr>
                <td>띠 · 별자리</td>
                <td>
                  {result.띠} · {result.별자리}
                </td>
              </tr>
              <tr>
                <td>태어난 요일</td>
                <td>{result.태어난요일}요일</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="notice">생년월일과 기준일을 올바르게 입력해 주세요.</p>
      )}

      <p className="disclaimer">
        ※ 2023년 6월 28일부터 시행된 <b>만 나이 통일법</b>에 따라 법령·계약·
        문서상 나이는 별도 규정이 없으면 만 나이를 씁니다. 병역·청소년보호법 등
        일부는 &lsquo;연 나이&rsquo;를 사용합니다.
      </p>
    </div>
  );
}
