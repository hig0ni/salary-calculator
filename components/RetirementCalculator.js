"use client";

import { useMemo, useState } from "react";
import { calcRetirement, formatWon } from "@/lib/retirement";

export default function RetirementCalculator() {
  const [입사일, set입사일] = useState("2021-03-02");
  const [퇴사일, set퇴사일] = useState("2026-03-02");
  const [월급여만원, set월급여만원] = useState("300"); // 만원 단위
  const [연간상여만원, set연간상여만원] = useState("0");
  const [연차수당만원, set연차수당만원] = useState("0");

  const result = useMemo(() => {
    return calcRetirement({
      입사일,
      퇴사일,
      월급여: (parseInt(월급여만원, 10) || 0) * 10000,
      연간상여금: (parseInt(연간상여만원, 10) || 0) * 10000,
      연차수당: (parseInt(연차수당만원, 10) || 0) * 10000,
    });
  }, [입사일, 퇴사일, 월급여만원, 연간상여만원, 연차수당만원]);

  return (
    <div className="calc">
      <div className="calc-inputs">
        <div className="field-row">
          <label className="field">
            <span>입사일</span>
            <input
              type="date"
              value={입사일}
              onChange={(e) => set입사일(e.target.value)}
            />
          </label>
          <label className="field">
            <span>퇴사일(마지막 근무 다음 날)</span>
            <input
              type="date"
              value={퇴사일}
              onChange={(e) => set퇴사일(e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>퇴직 전 3개월 월평균 급여(세전)</span>
          <div className="input-affix">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={월급여만원}
              onChange={(e) => set월급여만원(e.target.value)}
              aria-label="월평균 급여 (만원)"
            />
            <em>만원</em>
          </div>
        </label>

        <div className="field-row">
          <label className="field">
            <span>연간 상여금(선택)</span>
            <div className="input-affix">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={연간상여만원}
                onChange={(e) => set연간상여만원(e.target.value)}
              />
              <em>만원</em>
            </div>
          </label>
          <label className="field">
            <span>연간 연차수당(선택)</span>
            <div className="input-affix">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={연차수당만원}
                onChange={(e) => set연차수당만원(e.target.value)}
              />
              <em>만원</em>
            </div>
          </label>
        </div>
      </div>

      {result.valid ? (
        <>
          <div className="result-hero">
            <span className="result-label">예상 퇴직금</span>
            <strong className="result-amount">
              {formatWon(result.퇴직금)}원
            </strong>
            <span className="result-sub">
              재직 {result.기간.년}년 {result.기간.개월}개월 {result.기간.일}일
              · 총 {formatWon(result.재직일수)}일
            </span>
          </div>

          {!result.지급대상 && (
            <p className="notice">
              ⚠️ 계속근로기간이 1년 미만이면 근로기준법상 법정 퇴직금
              지급대상이 아닙니다. (아래 금액은 참고용 환산값)
            </p>
          )}

          <table className="deduction-table">
            <tbody>
              <tr>
                <td>1일 평균임금</td>
                <td>{formatWon(result.일평균임금)}원</td>
              </tr>
              <tr>
                <td>퇴직 전 3개월 임금총액</td>
                <td>{formatWon(result.임금총액)}원</td>
              </tr>
              <tr>
                <td>산정 기간 일수</td>
                <td>{formatWon(result.기간일수)}일</td>
              </tr>
              <tr className="total">
                <td>예상 퇴직금</td>
                <td>{formatWon(result.퇴직금)}원</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="notice">
          입사일과 퇴사일을 올바르게 입력해 주세요. (퇴사일이 입사일보다
          뒤여야 합니다.)
        </p>
      )}

      <p className="disclaimer">
        ※ 법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)로 계산한{" "}
        <b>추정치</b>입니다. 평균임금이 통상임금보다 적으면 통상임금을 적용하며,
        회사 규정·퇴직연금(DC형) 등에 따라 실제 금액과 차이가 날 수 있습니다.
      </p>
    </div>
  );
}
