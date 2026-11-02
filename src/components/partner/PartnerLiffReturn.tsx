'use client';

import { useEffect } from 'react';
import { liffReturnPath } from '@/lib/liff';
import { initPartnerLiff, PARTNER_LIFF_ENDPOINT_PATH } from '@/lib/liff-partner';

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
/** 샘플 키트 상자 QR 의 도착지 (2026-11-02). QR 주소는 인쇄용으로 확정돼 바꿀 수 없다. */
const KIT_CAMPAIGN = 'sample-kit';
const KIT_DEST = '/th/partner/guide/scalp?from=kit';

/**
 * 키트 QR(`liff.line.me/<ID>?campaign=sample-kit`)로 들어왔는가.
 *   (a) 이미 로그인 상태 → `/th/partner?campaign=sample-kit` (또는 끝에 `/`)
 *   (b) 로그인을 거침   → `/th/partner?liff.state=%3Fcampaign%3Dsample-kit&code=…`
 *       🚨 `liff.state` 가 `?` 로 시작해 `liffReturnPath()` 는 null 을 준다 → 기존 복귀 로직이 아무것도 안 한다.
 * 🚨 파트너 소개 페이지(Endpoint) 자체에서만 본다 — 가이드·회차 페이지에 같은 값이 실려 와도 무시한다.
 */
function isSampleKitArrival(pathname: string, search: string): boolean {
  const path = pathname.replace(/\/index\.html$|\.html$/, '').replace(/\/+$/, '');
  if (path !== PARTNER_LIFF_ENDPOINT_PATH) return false;
  const params = new URLSearchParams(search);
  if (params.get('campaign') === KIT_CAMPAIGN) return true;
  const raw = params.get('liff.state');
  if (!raw) return false;
  // 여러 번 인코딩돼 올 수 있다(`%253F…`) — 더 풀 것이 없을 때까지 푼다.
  let value = raw;
  for (let i = 0; i < 5 && /%[0-9A-F]{2}/i.test(value); i += 1) {
    try {
      const next = decodeURIComponent(value);
      if (next === value) break;
      value = next;
    } catch {
      break;
    }
  }
  const qi = value.indexOf('?');
  const query = qi >= 0 ? value.slice(qi + 1) : value;
  return new URLSearchParams(query).get('campaign') === KIT_CAMPAIGN;
}

export function PartnerLiffReturn() {
  useEffect(() => {
    // 🔑 키트 QR 은 기존 회차 복귀보다 먼저 본다 — (b) 경우 기존 로직은 null 이라 어차피 지나간다.
    if (isSampleKitArrival(window.location.pathname, window.location.search)) {
      let alive = true;
      void (async () => {
        try {
          // 🚨 이동 전에 code 교환을 끝낸다(아래 주석과 같은 이유) — 먼저 이동하면 로그인이 깨진다.
          await initPartnerLiff();
        } catch {
          /* 실패해도 이동한다 — 가이드는 로그인 없이도 읽힌다 */
        }
        if (!alive) return;
        window.location.replace(KIT_DEST);
      })();
      return () => { alive = false; };
    }

    const raw = liffReturnPath(window.location.search);
    if (!raw) return;

    // 🚨 `liff.state` 는 **Endpoint 기준 상대경로**다.
    //    Endpoint 가 `https://57tb.art/th/partner/` 이므로 LINE 은 `/mist` 를 준다 — `/th/partner/mist` 가 아니다.
    //    (2026-08-28 실장애: 절대경로로 알고 `startsWith('/th/partner')` 로 걸렀더니 이동 자체를 안 해
    //     원장이 소개 페이지에 떨어졌다 → "폼이 안 보인다")
    const back = raw.startsWith(PARTNER_LIFF_ENDPOINT_PATH)
      ? raw
      : `${PARTNER_LIFF_ENDPOINT_PATH}${raw}`;
    if (back === window.location.pathname) return;
    // 파트너 밖으로는 보내지 않는다 — 엉뚱한 경로가 실려 와도 여기서 끊는다.
    if (!back.startsWith(PARTNER_LIFF_ENDPOINT_PATH)) return;

    let alive = true;
    void (async () => {
      try {
        await initPartnerLiff();
      } catch {
        /* 실패해도 이동은 한다 — 원장을 중간 페이지에 가둬 두지 않는다 */
      }
      if (!alive) return;
      // 🚨 폼까지 내려주는 신호는 여기서 심지 않는다 — `back === pathname` 이면 이 줄에 도달조차 못 한다.
      //    신호는 LIFF 주소에 실린 `?apply=1` 이 `back` 에 그대로 따라오고, 폼이 그걸 읽는다.
      window.location.replace(back);
    })();
    return () => { alive = false; };
  }, []);

  return null;
}
