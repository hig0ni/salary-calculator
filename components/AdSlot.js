"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * 광고 슬롯. AdSense 미승인 상태(adsenseClientId 비어있음)에서는
 * 자리표시자 박스를 보여줘 레이아웃을 미리 확인할 수 있습니다.
 *
 * 승인 후: lib/site.js 에 adsenseClientId 를 넣고,
 * 아래 slot 값을 AdSense에서 발급받은 광고단위 ID로 교체하세요.
 */
export default function AdSlot({ slot = "", label = "광고" }) {
  const enabled = Boolean(SITE.adsenseClientId && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      /* noop */
    }
  }, [enabled]);

  if (!enabled) {
    return (
      <div className="ad-placeholder" aria-hidden="true">
        {label} 자리 (AdSense 승인 후 표시)
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={SITE.adsenseClientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
