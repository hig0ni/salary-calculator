"use client";

import { useMemo, useState } from "react";
import { calcSalary, formatWon } from "@/lib/salary";

export default function SalaryCalculator() {
  const [연봉만원, set연봉만원] = useState("3600"); // 만원 단위 입력
  const [부양가족수, set부양가족수] = useState("1");
  const [비과세월액, set비과세월액] = useState("200000"); // 식대 등 (기본 20만)

  const result = useMemo(() => {
    const 연봉 = (parseInt(연봉만원, 10) || 0) * 10000;
    return calcSalary(연봉, parseInt(부양가족수, 10), parseInt(비과세월액, 10));
  }, [연봉만원, 부양가족수, 비과세월액]);

  const rows = [
    ["국민연금", result.공제.국민연금],
    ["건강보험", result.공제.건강보험],
    ["장기요양", result.공제.장기요양],
    ["고용보험", result.공제.고용보험],
    ["소득세", result.공제.소득세],
    ["지방소득세", result.공제.지방소득세],
  ];

  return (
    <div className="calc">
      <div className="calc-inputs">
        <label className="field">
          <span>세전 연봉</span>
          <div className="input-affix">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={연봉만원}
              onChange={(e) => set연봉만원(e.target.value)}
              aria-label="세전 연봉 (만원)"
            />
            <em>만원</em>
          </div>
        </label>

        <div className="field-row">
          <label className="field">
            <span>부양가족 수(본인 포함)</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={부양가족수}
              onChange={(e) => set부양가족수(e.target.value)}
            />
          </label>

          <label className="field">
            <span>월 비과세액(식대 등)</span>
            <div className="input-affix">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                step="10000"
                value={비과세월액}
                onChange={(e) => set비과세월액(e.target.value)}
              />
              <em>원</em>
            </div>
          </label>
        </div>
      </div>

      <div className="result-hero">
        <span className="result-label">예상 월 실수령액</span>
        <strong className="result-amount">{formatWon(result.월실수령액)}원</strong>
        <span className="result-sub">
          연 실수령 약 {formatWon(result.연실수령액)}원 · 세전 월급{" "}
          {formatWon(result.월급)}원
        </span>
      </div>

      <table className="deduction-table">
        <thead>
          <tr>
            <th>공제 항목</th>
            <th>월 공제액</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, val]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{formatWon(val)}원</td>
            </tr>
          ))}
          <tr className="total">
            <td>공제 합계</td>
            <td>{formatWon(result.공제합계)}원</td>
          </tr>
        </tbody>
      </table>

      <p className="disclaimer">
        ※ 본 결과는 2026년 요율 기준 <b>추정치</b>입니다. 소득세는 국세청
        간이세액표가 아닌 누진세율로 계산해 실제 원천징수액·연말정산 결과와
        차이가 날 수 있습니다.
      </p>
    </div>
  );
}
