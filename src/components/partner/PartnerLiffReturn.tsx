'use client';

import { useEffect } from 'react';
import { liffReturnPath } from '@/lib/liff';
import { initPartnerLiff } from '@/lib/liff-partner';

/**
 * 파트너 LIFF 로그인 후 **원래 회차 페이지로 되돌린다.** (2026-08-28 신설)
 *
 * 🚨 왜 손님용 `LiffReturn` 을 쓸 수 없나 —
 *    그건 `(main)` 레이아웃에 있고 **손님용 LIFF(`NEXT_PUBLIC_LIFF_ID`)** 를 init 한다.
 *    파트너 LIFF 안에서 그게 돌면 **앱 불일치로 인증이 다시 시작돼 무한 반복**된다.
 *    (2026-08-28 실장애: Endpoint 가 사이트 루트라 인증 후 `/` → 308 → `/th` → `(main)` 으로 떨어졌다.)
 *
 * ⇒ 파트너 LIFF Endpoint 는 **`https://57tb.art/th/partner/`** 로 두고,
 *   복귀는 `(main)` 을 거치지 않는 **이 컴포넌트**가 받는다.
 *
 * 🚨 이동 전에 `initPartnerLiff()` 를 기다린다 — URL 의 `code` 는 SDK 가 토큰으로 교환해야 하는
 *    일회용 값이다. 먼저 이동하면 토큰이 안 만들어져 "인증했는데 폼이 안 보이는" 상태가 된다.
 */
export function PartnerLiffReturn() {
  useEffect(() => {
    const back = liffReturnPath(window.location.search);
    if (!back) return;
    if (back === window.location.pathname) return;
    // 파트너 밖으로는 보내지 않는다 — 엉뚱한 경로가 실려 와도 여기서 끊는다.
    if (!back.startsWith('/th/partner')) return;

    let alive = true;
    void (async () => {
      try {
        await initPartnerLiff();
      } catch {
        /* 실패해도 이동은 한다 — 원장을 중간 페이지에 가둬 두지 않는다 */
      }
      if (!alive) return;
      window.location.replace(back);
    })();
    return () => { alive = false; };
  }, []);

  return null;
}
