'use client';

import { useEffect, useState } from 'react';

/**
 * 샘플 키트 상자 안내 — 두피케어 가이드(B-1) (2026-11-02)
 *
 * 항상 표시한다. 키트 QR 로 들어오면(`?from=kit`, `PartnerLiffReturn` 이 붙여 보낸다)
 * 테두리를 강조해 "지금 손에 든 상자"가 바로 이것임을 알린다.
 * ℹ️ 위치는 옮기지 않는다 — 이미 제목 바로 아래 첫 블록이라, 하이드레이션 뒤 위로 옮기면
 *    화면이 한 번 튀어 오른다. 강조 테두리만 바꾼다.
 *
 * 색 점 = 앰플 실물 색. 검정·흰 점은 배경에 묻히지 않게 테두리를 둔다.
 */
const ITEMS = [
  { n: '①', en: 'SCALING', th: 'เจลสเกลลิ่ง', color: '#C8892B', colorTh: 'สีอำพัน', ring: false },
  { n: '②', en: 'SHAMPOO', th: 'แชมพูคาเฟอีน', color: '#1A1A1A', colorTh: 'สีดำ', ring: true },
  { n: '③', en: 'TREATMENT', th: 'ทรีทเมนต์คาเฟอีน', color: '#F4F1EA', colorTh: 'สีขาว', ring: true },
];

export default function KitBox() {
  const [fromKit, setFromKit] = useState(false);

  useEffect(() => {
    setFromKit(new URLSearchParams(window.location.search).get('from') === 'kit');
  }, []);

  return (
    <section className="px-6 pb-12">
      <div
        className={`mx-auto max-w-xl rounded-xl bg-brand-card p-5 sm:p-6 ${
          fromKit ? 'border-2 border-brand-gold' : 'border border-brand-dark'
        }`}
      >
        <h2 className="text-center text-base font-semibold sm:text-lg">ชุดทดลอง Scalp Care</h2>
        <ul className="mt-5 space-y-3">
          {ITEMS.map((it) => (
            <li key={it.en} className="flex items-center gap-3">
              <span aria-hidden className="w-6 shrink-0 text-center text-lg text-brand-gold">
                {it.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tracking-wide">{it.en}</span>
                <span className="block text-[13px] text-brand-gold">{it.th}</span>
              </span>
              {/* 폭 고정 — 색 이름 길이가 달라도 점이 한 세로줄에 선다 */}
              <span className="flex w-[4.75rem] shrink-0 items-center gap-1.5">
                <span
                  aria-hidden
                  className={`inline-block h-3.5 w-3.5 rounded-full ${it.ring ? 'border border-brand-gold' : ''}`}
                  style={{ backgroundColor: it.color }}
                />
                <span className="text-[12px] text-brand-gold">{it.colorTh}</span>
              </span>
              <span className="w-9 shrink-0 text-right text-sm font-semibold">× 4</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-brand-dark pt-4 text-center text-[13px] leading-relaxed text-brand-gold">
          <span className="inline-block">1 คน ใช้อย่างละ 1 แอมพูล ·</span>{' '}
          <span className="inline-block">ทดลองได้ 4 ครั้ง</span>
        </p>
      </div>
    </section>
  );
}
