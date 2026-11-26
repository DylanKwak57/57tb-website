'use client';

import { useEffect } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { EMAIL_MARK_KEY, PARTNER_LINE, fireTrack, goPlan } from '@/components/partner/inviteTrackCore';

/**
 * 메일 LINE 상담 단추가 거치는 얇은 화면 — `/th/partner/go?to=line&i=<코드>` (11/26 · 28번 설계 §10-1).
 * 기록을 쏜 뒤 **기다리지 않고** 곧바로 LINE 파트너 계정으로 넘긴다(기록 실패 · 지연과 무관).
 * `to` 가 `line` 이 아니면 기록 없이 파트너 첫 화면으로(임의 주소로 넘기지 않음).
 * 자바스크립트가 꺼진 경우를 위해 같은 LINE 링크를 글자로도 둔다(문구 = 기존 `สอบถามเพิ่มเติมทาง LINE`).
 */
export default function GoView() {
  useEffect(() => {
    let dest = PARTNER_LINE;
    try {
      const seg = window.location.pathname.split('/')[1] ?? '';
      const plan = goPlan(window.location.search, seg);
      dest = plan.dest;
      if (plan.track) {
        try {
          fireTrack(ORDER_API_BASE, plan.track);
          try { sessionStorage.setItem(EMAIL_MARK_KEY, plan.track.code); } catch { /* 무시 */ }
        } catch { /* 기록은 넘김을 막지 않는다 */ }
      }
    } catch {
      dest = '/th/partner';
    }
    window.location.replace(dest);
  }, []);

  return (
    <div className="mx-auto max-w-md px-6 pt-24 text-center">
      <a href={PARTNER_LINE} className="text-[13px] text-brand-gold underline underline-offset-4">
        สอบถามเพิ่มเติมทาง LINE
      </a>
    </div>
  );
}
