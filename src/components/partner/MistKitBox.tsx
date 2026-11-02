'use client';

import { useEffect, useState } from 'react';

/**
 * 미스트 체험 키트 안내 — 프로틴 가이드 맨 위 (2026-11-02 대표님 "넣어 줘")
 *
 * 왜: 미스트 체험단 키트는 미스트 50ml 3향뿐인데, 가이드는 Leave-in → Serum → Mist 순서라
 *     키트를 받은 원장이 손에 없는 리브인부터 보게 된다. 손에 든 미스트를 먼저 보여 준다.
 * `?from=mist` 로 들어오면 테두리를 강조한다(두피케어 KitBox 와 같은 방식). 위치는 옮기지 않는다.
 *
 * 문구: 상자 제목·링크 문구만 신규(에이님 검수 대기). 나머지는 브로셔 3번·디자이너 가이드(에이님 검수 완료) 원문.
 * 🚫 앰플·병 색 표시는 넣지 않는다 — 이름·향으로만 구분(대표님 11/2).
 */
const SCENTS = [
  { en: 'Keratin', scent: 'Fruity Floral' },
  { en: 'Silk', scent: 'Fresh Floral' },
  { en: 'Collagen', scent: 'Citrus Wave' },
];

const HOW = [
  'ให้ลูกค้าลองดมกลิ่น Mist ทั้ง 3 กลิ่นก่อน',
  'เมื่อบริการทั้งหมดเสร็จสิ้น — ฉีดพ่นให้ทั่วผม ห่างจากผมประมาณ 10-20 ซม.',
  'สินค้าที่ใช้กับผมของลูกค้าวันนี้ มีจำหน่ายที่ร้านค่ะ',
];

export default function MistKitBox() {
  const [fromMist, setFromMist] = useState(false);
  useEffect(() => {
    setFromMist(new URLSearchParams(window.location.search).get('from') === 'mist');
  }, []);

  return (
    <section className="px-6 pb-12">
      <div
        className={`mx-auto max-w-xl rounded-xl bg-brand-card p-5 sm:p-6 ${
          fromMist ? 'border-2 border-brand-gold' : 'border border-brand-dark'
        }`}
      >
        <h2 className="text-center text-base font-semibold sm:text-lg">ชุดทดลอง Mist</h2>
        <p className="mt-1 text-center text-[13px] text-brand-gold">50ml · 3 กลิ่น</p>
        <ul className="mt-5 space-y-2.5">
          {SCENTS.map((s) => (
            <li key={s.en} className="flex items-baseline justify-between gap-3 border-b border-brand-dark pb-2.5 last:border-0 last:pb-0">
              <span className="text-sm font-semibold tracking-wide">{s.en}</span>
              <span className="text-[13px] text-brand-gold">{s.scent}</span>
            </li>
          ))}
        </ul>
        <ol className="mt-5 space-y-2 border-t border-brand-dark pt-4">
          {HOW.map((h, i) => (
            <li key={h} className="flex gap-2.5 text-[13px] leading-relaxed">
              <span className="font-semibold text-brand-gold">{i + 1}</span>
              {/* 띄어쓰기 자리에서만 줄이 바뀌게 — 태국어 낱말 중간 끊김 방지(ห่างจาก/ผม 실측 11/2) */}
              <span>
                {h.split(' ').map((w, j) => (
                  <span key={j}>
                    {j > 0 && ' '}
                    <span className="inline-block">{w}</span>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-center">
          <a href="#mist" className="text-[13px] text-brand-gold underline underline-offset-4">
            ดูรายละเอียด Mist ↓
          </a>
        </p>
      </div>
    </section>
  );
}
