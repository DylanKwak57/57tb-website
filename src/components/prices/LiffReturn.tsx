'use client';

import { useEffect } from 'react';
import { initLiff, liffReturnPath } from '@/lib/liff';

/**
 * LINE 로그인 후 **보던 페이지로 되돌린다.** (2026-08-12 신설)
 *
 * 🚨 복귀 경로가 두 번 꺾인다:
 *    1. LIFF Endpoint가 사이트 루트라, LINE은 `https://57tb.art/?code=…&state=…&liff.state=…`로 돌려보낸다.
 *    2. `vercel.json`의 `/ → /th` **서버 리다이렉트(308)**를 타고 `/th?code=…`로 도착한다(쿼리 보존됨).
 *    ⇒ 그래서 루트가 아니라 모든 로케일이 공유하는 레이아웃에서 받는다.
 *
 * 🚨🚨 **이동 전에 반드시 `initLiff()`를 기다린다.**
 *    URL의 `code`는 LIFF SDK가 **토큰으로 교환**해야 하는 일회용 값이다.
 *    먼저 이동하면 code가 사라져 토큰이 만들어지지 않고, 손님은 "로그인했는데 가격이 안 보이는"
 *    상태가 된다 — 2026-08-12에 실제로 이 버그를 냈고, URL 이동 경로를 추적해 확인했다.
 *
 * 🚨 이동은 `router.replace`가 아니라 **전체 리로드**로 한다.
 *    클라이언트 라우팅은 레이아웃을 유지해 `PriceProvider`가 재마운트되지 않는다.
 *    그러면 방금 받은 토큰으로 가격을 다시 조회하지 않아, 이동해도 여전히 로그인 전 화면이 남는다.
 */
export function LiffReturn() {
  useEffect(() => {
    const back = liffReturnPath(window.location.search);
    if (!back) return;
    // 이미 목적지면 움직이지 않는다(리다이렉트 루프 방지).
    if (back === window.location.pathname) return;

    let alive = true;
    void (async () => {
      // LIFF 설정이 없거나 초기화가 실패해도 이동은 한다 — 손님을 `/th`에 가둬 두지 않는다.
      try {
        await initLiff();
      } catch {
        /* 무시 */
      }
      if (!alive) return;
      window.location.replace(back);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return null;
}
