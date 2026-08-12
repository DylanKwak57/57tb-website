'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liffReturnPath } from '@/lib/liff';

/**
 * LINE 로그인 후 **보던 페이지로 되돌린다.** (2026-08-12 신설)
 *
 * 🚨 왜 여기(레이아웃)인가 — 복귀 경로가 두 번 꺾이기 때문이다:
 *    1. LIFF Endpoint가 사이트 루트라, LINE은 `https://57tb.art/?liff.state=…`로 돌려보낸다.
 *    2. 그런데 `vercel.json`에 `/ → /th` **서버 리다이렉트(308)**가 있어 루트 페이지 코드는
 *       실행조차 되지 않는다. 다행히 308이 쿼리를 보존해 `/th?liff.state=…`로 도착한다(실측).
 *    ⇒ 그래서 루트가 아니라 **모든 로케일 페이지가 공유하는 레이아웃**에서 받는다.
 *
 * 🚨 `app/page.tsx`에도 같은 처리가 있다 — 지금은 308 때문에 거의 안 타지만,
 *    리다이렉트 설정이 바뀌면 그쪽이 1차 방어선이 된다. 둘 다 두는 게 맞다.
 */
export function LiffReturn() {
  const router = useRouter();

  useEffect(() => {
    const back = liffReturnPath(window.location.search);
    if (!back) return;
    // 이미 목적지에 있으면 움직이지 않는다(리다이렉트 루프 방지).
    if (back === window.location.pathname + window.location.search) return;
    if (back === window.location.pathname) return;
    router.replace(back);
  }, [router]);

  return null;
}
