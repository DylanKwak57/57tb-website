'use client';

import { useReducer, useRef } from 'react';
import type { FormulaOption, PairingRule } from '@/data/products';
import { formulaReducer } from '@/lib/formula-state';

type SelectionAction =
  | { type: 'select-step1'; value: 'h1' | 'd1' }
  | { type: 'select-step2'; value: 'c2' | 'l2' };

type FormulaFinderProps = {
  step1Options: FormulaOption[];
  step2Options: FormulaOption[];
  pairingRules: PairingRule[];
};

export function ValentineFormulaFinder({
  step1Options,
  step2Options,
  pairingRules,
}: FormulaFinderProps) {
  const [state, dispatch] = useReducer(formulaReducer, {});
  const titleRef = useRef<HTMLHeadingElement>(null);
  const selected = state.step1 && state.step2
    ? pairingRules.find((rule) => rule.step1Id === state.step1 && rule.step2Id === state.step2)
    : undefined;

  function select(action: SelectionAction) {
    dispatch(action);
  }

  function reset() {
    dispatch({ type: 'reset' });
    titleRef.current?.focus();
  }

  function options(
    title: string,
    selection: 'step1' | 'step2',
    values: FormulaOption[],
  ) {
    const selectedId = state[selection];
    return (
      <fieldset className="min-w-0 md:flex md:h-full md:flex-col" data-testid={`formula-${selection}-fieldset`}>
        <legend className="mb-3 font-heading text-lg font-bold text-brand-white">{title}</legend>
        <div className="grid gap-2 sm:grid-cols-2 md:flex-1 md:items-stretch" data-testid={`formula-${selection}-options`}>
          {values.map((option) => {
            const isSelected = selectedId === option.id;
            const action: SelectionAction = selection === 'step1'
              ? { type: 'select-step1', value: option.id as 'h1' | 'd1' }
              : { type: 'select-step2', value: option.id as 'c2' | 'l2' };
            return (
              <label
                key={option.id}
                className={`flex min-h-28 cursor-pointer gap-3 border p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-gold md:h-full ${isSelected ? 'border-brand-gold bg-brand-dark/35' : 'border-brand-gold/25 bg-brand-card'}`}
                data-testid={`formula-option-${option.id}`}
              >
                <input
                  checked={isSelected}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#5C5248]"
                  name={selection}
                  onChange={() => select(action)}
                  type="radio"
                  value={option.id}
                />
                <span>
                  <strong className="font-serif text-xl tracking-wide text-brand-gold">{option.code}</strong>
                  <span className="mt-1 block text-sm font-medium text-brand-white">{option.title.th}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-brand-gray-light">{option.description.th}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <section aria-labelledby="formula-finder" className="mx-auto max-w-[1180px] px-4 py-4 md:px-6 md:py-8" lang="th">
      <div className="border-y border-brand-gold/30 bg-brand-card p-5 md:p-12">
        <div className="grid gap-5 border-b border-brand-gold/25 pb-7 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-champagne">Formula Finder</p>
            <h2 id="formula-finder" ref={titleRef} tabIndex={-1} className="mt-3 font-heading text-3xl font-bold leading-tight text-brand-white outline-none md:text-4xl">เลือกขั้นตอนที่ 1 และ 2<br />เพื่อแสดงสิ่งที่เลือก</h2>
          </div>
          <p className="self-end text-sm leading-relaxed text-brand-gray-light">เลือก Step 1 ตามข้อมูลบนฉลากของสภาพเส้นผม แล้วเลือก Step 2 ตามเนื้อสัมผัสของนิวทรัลไลเซอร์ ระบบจะแสดงเฉพาะตัวเลือกที่เลือก ไม่ใช่คำแนะนำหรือการจับคู่ที่ควรเลือก</p>
        </div>
        <div className="mt-8 grid items-stretch gap-8 md:grid-cols-2 md:gap-10">
          {options('1 · เลือก Step 1 ตามสภาพเส้นผม', 'step1', step1Options)}
          {options('2 · เลือก Step 2 ตามเนื้อสัมผัส', 'step2', step2Options)}
        </div>
        <a className="mt-4 inline-flex min-h-11 items-center text-sm text-brand-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" href="#formula-help">ไม่แน่ใจเกี่ยวกับสภาพเส้นผม?</a>
        <div aria-live="polite" className="mt-8 grid gap-2 border-y-2 border-brand-gold bg-brand-dark/20 px-5 py-5 md:grid-cols-[180px_1fr] md:gap-6">
          <b className="font-serif text-2xl text-brand-white">{selected ? `${selected.step1Id.toUpperCase()} + ${selected.step2Id.toUpperCase()}` : 'เลือกทั้ง 2 ขั้นตอน'}</b>
          <p className="text-sm leading-relaxed text-brand-gray-light">{selected ? 'แสดง Step 1 และ Step 2 ที่คุณเลือกตามข้อมูลบนฉลาก' : 'เมื่อเลือกครบ ระบบจะแสดง Step 1 และ Step 2 ที่เลือกไว้ที่นี่'}</p>
        </div>
        <button className="mt-4 inline-flex min-h-11 items-center text-sm text-brand-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" onClick={reset} type="button">ล้างการเลือก</button>
        <p id="formula-help" className="mt-3 text-xs leading-relaxed text-brand-gray-light">หากไม่แน่ใจเกี่ยวกับสภาพเส้นผม โปรดตรวจสอบฉลากและขั้นตอนก่อนใช้</p>
      </div>
    </section>
  );
}
