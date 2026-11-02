/**
 * 파트너 가이드 입구 — 제품군별 사용법 고르기 · 태국어 전용 · unlisted (2026-11-02 대표님 승인 구성)
 *
 * 🚨 가격·공급가·우리 시술가를 쓰지 않는다 — 가이드는 키트·브로셔를 받은 원장 누구나 본다.
 * 🚨 태국어 문구는 승인 명세 그대로다 — 바꾸거나 새 문장을 더하지 말 것.
 * ℹ️ robots noindex 는 파트너 layout 이 이미 건다.
 *
 * 제품군 카드: 가이드가 있는 것만 링크. 준비 중인 것은 흐리게 + `เร็ว ๆ นี้` 배지.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import GuideCta from '@/components/partner/GuideCta';

export const metadata: Metadata = {
  title: 'วิธีใช้ผลิตภัณฑ์ Bellista | 57 Total Beauty',
};

type Group = { en: string; th?: string; sub?: string; href?: string };

const GROUPS: Group[] = [
  {
    en: 'SCALP CARE',
    th: 'โปรแกรมดูแลหนังศีรษะสำหรับซาลอน',
    sub: 'T1 · T3 · T4 · โฮมแคร์',
    href: '/th/partner/guide/scalp',
  },
  { en: 'PROTEIN CARE', sub: 'Mist · Serum · Leave-in' },
  { en: 'KERATIN DOWN PERM' },
];

function GroupBody({ g }: { g: Group }) {
  return (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-semibold tracking-[0.15em] sm:text-lg">{g.en}</span>
        {g.href ? (
          <span aria-hidden className="text-brand-gold">
            →
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-brand-gold px-3 py-0.5 text-[11px] text-brand-gold">
            เร็ว ๆ นี้
          </span>
        )}
      </span>
      {g.th && <span className="mt-2 block text-sm text-brand-white">{g.th}</span>}
      {g.sub && <span className="mt-1.5 block text-[13px] text-brand-gold">{g.sub}</span>}
    </>
  );
}

export default function PartnerGuidePage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">BELLISTA · HOW TO USE</p>
        <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">วิธีใช้ผลิตภัณฑ์</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-gold sm:text-base">
          เลือกกลุ่มผลิตภัณฑ์ที่ต้องการดู
        </p>
      </section>

      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          {GROUPS.map((g) =>
            g.href ? (
              <Link
                key={g.en}
                href={g.href}
                className="block rounded-xl border border-brand-gold bg-brand-card p-5 transition hover:opacity-85"
              >
                <GroupBody g={g} />
              </Link>
            ) : (
              <div key={g.en} aria-disabled className="block rounded-xl border border-brand-dark bg-brand-card p-5 opacity-50">
                <GroupBody g={g} />
              </div>
            ),
          )}
        </div>
      </section>

      <GuideCta />
    </main>
  );
}
