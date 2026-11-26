'use client';

import { useEffect } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { EMAIL_MARK_KEY, fireTrack, readTrack, type TrackKind } from '@/components/partner/inviteTrackCore';

/**
 * 초대 메일에서 도착한 화면이 기록을 **한 번** 쏜다(11/26 · 28번 설계 §10-1). 화면에는 아무것도 그리지 않는다.
 * 주소에 `i`(형식 맞음) + `allowed` 의 `m` 이 있을 때만 · 없으면 아무 일도 안 한다(공개 화면 · 옛 링크 그대로).
 * 쏜 뒤 같은 탭에 "메일로 들어옴" 표시를 남긴다 → 초대 화면 접수의 유입 표시(`src=email`).
 */
export default function InviteTrack({ allowed }: { allowed: readonly TrackKind[] }) {
  useEffect(() => {
    try {
      const hit = readTrack(window.location.search, allowed);
      if (!hit) return;
      fireTrack(ORDER_API_BASE, hit);
      try { sessionStorage.setItem(EMAIL_MARK_KEY, hit.code); } catch { /* 표시는 없어도 된다 */ }
    } catch { /* 기록은 화면에 영향을 주지 않는다 */ }
    // 화면이 열릴 때 한 번만.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
