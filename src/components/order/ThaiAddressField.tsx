'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 태국 주소 입력 — 손님이 동 이름이나 우편번호를 치면 지역을 자동으로 채운다.
 *
 * 태국 주소는 `상세주소 + 동(แขวง/ตำบล) + 구(เขต/อำเภอ) + 주(จังหวัด) + 우편번호` 5조각이라,
 * 손님에게 다 타이핑하게 하면 오타·누락이 잦고 배송 사고로 이어진다.
 * 그래서 **검색 한 칸 + 상세주소 한 칸**만 받는다(태국 쇼핑몰 표준 방식).
 *
 * 🚨 주소 데이터(185KB)는 필요할 때만 동적 import한다 — 첫 화면 번들에 넣지 않는다.
 * 🚨 방콕과 지방은 표기가 다르다: 방콕 `แขวง/เขต`, 지방 `ต./อ./จ.` — 택배가 이 표기를 본다.
 */

type AddressHit = { district: string; amphoe: string; province: string; zipcode: number };

const BANGKOK = 'กรุงเทพมหานคร';
const MAX_SUGGESTIONS = 8;

/** 태국 표준 표기로 조합한다. 방콕은 แขวง/เขต, 그 외는 ต./อ./จ. 약어를 쓴다. */
export function formatThaiAddress(detail: string, hit: AddressHit) {
  const isBangkok = hit.province === BANGKOK;
  const parts = isBangkok
    ? [`แขวง${hit.district}`, `เขต${hit.amphoe}`, hit.province]
    : [`ต.${hit.district}`, `อ.${hit.amphoe}`, `จ.${hit.province}`];
  return [detail.trim(), ...parts, String(hit.zipcode)].filter(Boolean).join(' ');
}

/** 후보 한 줄을 손님이 읽을 형태로. */
function hitLabel(hit: AddressHit) {
  const isBangkok = hit.province === BANGKOK;
  return isBangkok
    ? `แขวง${hit.district} · เขต${hit.amphoe} · ${hit.province} · ${hit.zipcode}`
    : `ต.${hit.district} · อ.${hit.amphoe} · จ.${hit.province} · ${hit.zipcode}`;
}

export function ThaiAddressField({
  detail,
  onDetailChange,
  selected,
  onSelect,
  fieldClass,
  hideDetail,
}: {
  detail: string;
  onDetailChange: (value: string) => void;
  selected: AddressHit | null;
  onSelect: (hit: AddressHit | null) => void;
  fieldClass: string;
  /**
   * 상세주소 입력을 감춘다. 🚨 파트너 신청 폼은 **칸을 쪼개서**(번지·소이·도로…) 받는다 —
   * 한 칸으로 두면 번지만 적고 끝낸다(2026-08-28 실측: 에이가 `299/11` 만 입력).
   */
  hideDetail?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<AddressHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // 바깥을 누르면 후보 목록을 닫는다.
  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    let active = true;
    setLoading(true);
    // 타이핑마다 검색하지 않고 잠깐 기다린다(입력 지연 방지).
    const timer = setTimeout(async () => {
      try {
        const db = await import('thai-address-database');
        // 숫자면 우편번호, 아니면 동 이름으로 찾는다.
        const found = /^\d+$/.test(term)
          ? db.searchAddressByZipcode(term)
          : db.searchAddressByDistrict(term);
        if (!active) return;
        setHits((found as AddressHit[]).slice(0, MAX_SUGGESTIONS));
        setOpen(true);
      } catch {
        if (active) setHits([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className={hideDetail ? '' : 'mt-4'} ref={boxRef}>
      {!hideDetail && (
        <>
          <label className="text-xs text-brand-gray" htmlFor="order-address-detail">
            ที่อยู่จัดส่ง
          </label>
          <input
            autoComplete="street-address"
            className={fieldClass}
            id="order-address-detail"
            maxLength={200}
            onChange={(event) => onDetailChange(event.target.value)}
            placeholder="บ้านเลขที่ หมู่ ซอย ถนน อาคาร ชั้น ห้อง"
            value={detail}
          />
        </>
      )}

      {/* 지역은 검색으로 고른다 — 동 이름 또는 우편번호 */}
      <div className={hideDetail ? 'relative' : 'relative mt-3'}>
        {selected ? (
          <div className="flex items-start justify-between gap-3 border border-brand-gold/40 bg-brand-black/40 px-4 py-3">
            <span className="text-sm leading-relaxed text-brand-white">{hitLabel(selected)}</span>
            <button
              className="shrink-0 text-xs text-brand-gold underline underline-offset-4"
              onClick={() => {
                onSelect(null);
                setQuery('');
              }}
              type="button"
            >
              เปลี่ยน
            </button>
          </div>
        ) : (
          <>
            <input
              aria-label="ค้นหาตำบล/แขวง หรือรหัสไปรษณีย์"
              className={fieldClass.replace('mt-2', 'mt-0')}
              inputMode="text"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => hits.length > 0 && setOpen(true)}
              placeholder="ค้นหาตำบล/แขวง หรือรหัสไปรษณีย์"
              value={query}
            />
            {open && (hits.length > 0 || loading) && (
              <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto border border-brand-gold/40 bg-brand-black shadow-lg">
                {loading && hits.length === 0 && (
                  <li className="px-4 py-3 text-xs text-brand-gray">กำลังค้นหา…</li>
                )}
                {hits.map((hit) => (
                  <li key={`${hit.district}-${hit.amphoe}-${hit.province}-${hit.zipcode}`}>
                    <button
                      className="block w-full px-4 py-3 text-left text-sm text-brand-white transition-colors hover:bg-brand-card"
                      onClick={() => {
                        onSelect(hit);
                        setOpen(false);
                      }}
                      type="button"
                    >
                      {hitLabel(hit)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
        พิมพ์ชื่อตำบล/แขวง หรือรหัสไปรษณีย์ 5 หลัก แล้วเลือกจากรายการ
      </p>
    </div>
  );
}
