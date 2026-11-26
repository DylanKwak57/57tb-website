'use client';

import { useEffect, useState } from 'react';
import { CODE_RE } from '@/components/partner/inviteCode';
import { locales } from '@/i18n/routing';

/**
 * `← ย้อนกลับ` — 브라우저 뒤로 가기(초대 화면에서 같은 탭으로 들어온 경우 그 화면으로 돌아간다).
 * 이전 화면이 없으면(주소로 바로 연 경우):
 *   - 주소에 `?i=<초대 코드>`(형식 맞음)가 있으면 그 매장의 초대 화면 `/<locale>/partner/invite?i=<코드>`
 *     (초대 메일에서 브로셔로 바로 들어온 경우 — 대표님 11/26)
 *   - 없거나 형식이 틀리면 파트너 소개 화면으로.
 * 정적 내보내기라 주소 끝 값은 브라우저에서 읽는다. 코드 형식만 받는다(임의 주소는 받지 않음).
 */
export default function BackLink({ fallback = '/th/partner' }: { fallback?: string }) {
  const [href, setHref] = useState(fallback);

  useEffect(() => {
    try {
      const code = (new URLSearchParams(window.location.search).get('i') ?? '').trim();
      if (!CODE_RE.test(code)) return;
      const seg = window.location.pathname.split('/')[1] ?? '';
      const locale = (locales as readonly string[]).includes(seg) ? seg : 'th';
      setHref(`/${locale}/partner/invite?i=${code}`);
    } catch { /* 못 읽으면 기본 주소 그대로 */ }
  }, []);

  return (
    <a
      href={href}
      onClick={(e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      }}
      className="inline-block py-2 text-[13px] text-brand-gold underline-offset-4 hover:underline"
    >
      ← ย้อนกลับ
    </a>
  );
}
