/**
 * 체험단 직접 초대 화면 — `/th/partner/invite?i=<코드>` · 태국어 전용 · unlisted (2026-11-26 대표님 "초대 화면 만들어")
 *
 * 설계 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/25-체험단-직접초대-화면-전이표-2026-11-26.md
 *   §3-c(설계 검수 반영 — 우선) · §4 전이표
 *
 * 🚨 휴대폰 한 장: 초대 문구 → 매장 이름 → 체험 세트 한 줄 → 브로셔 링크 → 받을 곳 확인 폼(LINE 먼저).
 * 🚨 코드 확인 · 매장 이름 · 회차는 서버(`_shared/invites.ts`)가 정한다 — 이 화면은 보여 주기만.
 * 🚨 가격 · 공급가를 쓰지 않는다. 선착순 · 심사 · 선정 문구도 쓰지 않는다.
 * ℹ️ 주소 끝 값(`?i=`)은 정적 내보내기라 브라우저에서 읽는다 → 본문은 클라이언트 부품(`InviteView`).
 */
import type { Metadata } from 'next';
import InviteView from '@/components/partner/InviteView';
import InviteTrack from '@/components/partner/InviteTrack';

export const metadata: Metadata = {
  title: 'คำเชิญจาก 57 Total Beauty',
  robots: { index: false, follow: false },
};

export default function PartnerInvitePage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 🆕 11/26 초대 메일 주소 확인 단추(`&m=cta`)로 온 경우만 기록 한 번 · LINE 왕복(`apply=1`)은 다시 안 쏨(28번 설계 §10-1) */}
      <InviteTrack allowed={['cta']} />
      <InviteView />
    </main>
  );
}
