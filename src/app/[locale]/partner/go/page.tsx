/**
 * 초대 메일 LINE 상담 단추가 거치는 얇은 화면 — `/th/partner/go?to=line&i=<코드>` · unlisted (2026-11-26)
 *
 * 설계 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/28-초대메일-추적-설계-2026-11-26.md §10-1
 * 🚨 기록(누름)을 쏜 뒤 곧바로 LINE 파트너 계정으로 넘긴다 — 기록 실패 · 지연과 무관. `to` 는 `line` 하나만.
 * ℹ️ 정적 내보내기라 주소 끝 값은 브라우저에서 읽는다 → 본문은 클라이언트 부품(`GoView`).
 */
import type { Metadata } from 'next';
import GoView from '@/components/partner/GoView';

export const metadata: Metadata = {
  title: '57TB Partner',
  robots: { index: false, follow: false },
};

export default function PartnerGoPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <GoView />
    </main>
  );
}
