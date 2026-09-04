'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { isOrderable, orderEntry } from '@/data/order';
import { getProduct } from '@/data/products';

/**
 * 딥링크로 장바구니에 담기 — `/{locale}/cart?add=<slug>[:<variantId>][:<qty>],<slug2>…`
 *
 * 🚨 왜 필요한가: 추천 페이지(My Hair Fit)가 **다른 origin**이라 그쪽에서 localStorage에 직접 쓸 수 없다.
 *    장바구니 상태는 이 도메인의 localStorage에만 있으므로, 넘어오는 경로는 이 URL 파라미터뿐이다.
 * 🚨 `CartProvider.ready === true`(localStorage 복원 완료) **뒤에** 담는다 —
 *    복원 전에 담으면 복원 결과가 그대로 덮어써 담은 항목이 사라진다.
 * 🚨 담은 뒤에는 URL에서 `add`를 지운다(뒤로가기·새로고침 중복 방지) + 처리한 원문을
 *    sessionStorage에 남겨 같은 링크를 같은 세션에서 두 번 처리하지 않는다.
 * 🚨 가격·품목 판정은 서버가 한다 — `ENQUIRY_ONLY`(가격 문의 품목)는 가격표를 받은 뒤에야 알 수 있어
 *    `pricesReady`가 true가 될 때까지 기다린다(장바구니가 "비었음"으로 깜빡이지 않게 `pending`을 준다).
 */

const PARAM = 'add';
const SESSION_KEY = '57tb-cart-add-v1';
/** 딥링크로 한 번에 담을 수 있는 수량 상한. 손님이 URL을 고쳐 크게 담는 것을 막는다. */
const MAX_ADD_QUANTITY = 9;
/** 세션에 기억할 처리 이력 개수(무한정 쌓지 않는다). */
const MAX_HISTORY = 20;

export type CartAddEntry = { slug: string; variantId: string | null; quantity: number };

function clampQuantity(raw: string | undefined): number {
  if (!raw) return 1;
  const value = Number(raw);
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_ADD_QUANTITY, Math.max(1, Math.floor(value)));
}

/**
 * `slug[:variantId][:qty]` 목록을 담을 항목으로 바꾼다.
 * - 정본에 없는 slug·판매 중단 제품·가격 문의 품목은 버린다(주문이 성립하지 않는다).
 * - 용량 옵션이 있는 제품에 옵션이 없거나 알 수 없는 값이면 **첫 옵션**(미스트 = 50)으로 둔다.
 * - 옵션이 없는 제품에 붙은 옵션 값은 무시하고 수량으로 읽는다.
 */
export function parseAddParam(raw: string, isEnquiryOnly: (slug: string) => boolean): CartAddEntry[] {
  return raw.split(',').flatMap((chunk): CartAddEntry[] => {
    const parts = chunk.trim().split(':').map((part) => part.trim());
    const slug = parts[0];
    if (!slug) return [];
    if (!getProduct(slug) || !isOrderable(slug) || isEnquiryOnly(slug)) return [];

    const tokens = parts.slice(1).filter((part) => part !== '');
    const variants = orderEntry(slug)?.variants ?? null;

    if (!variants || variants.length === 0) {
      return [{ slug, variantId: null, quantity: clampQuantity(tokens[0]) }];
    }
    if (tokens[0] && variants.some((variant) => variant.id === tokens[0])) {
      return [{ slug, variantId: tokens[0], quantity: clampQuantity(tokens[1]) }];
    }
    return [{ slug, variantId: variants[0].id, quantity: clampQuantity(tokens[0]) }];
  });
}

function readParam(): string | null {
  const value = new URLSearchParams(window.location.search).get(PARAM);
  return value && value.trim() ? value : null;
}

function stripParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete(PARAM);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function readHistory(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function rememberHistory(raw: string) {
  try {
    const next = [...readHistory().filter((value) => value !== raw), raw].slice(-MAX_HISTORY);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    // 시크릿 모드 등 저장 실패는 조용히 넘긴다 — URL에서 파라미터를 지우는 것으로 중복은 막힌다.
  }
}

/**
 * @param pricesReady 가격표 조회가 끝났는가(`phase !== 'loading'`). 가격 문의 품목을 걸러내려면 필요하다.
 * @returns pending = 담는 중(빈 장바구니 화면을 보이지 말 것) · added = 이번에 실제로 담았다(안내 한 줄)
 */
export function useCartAddParam(pricesReady: boolean, isEnquiryOnly: (slug: string) => boolean) {
  const { ready, addItem } = useCart();
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const handled = useRef(false);

  // 파라미터 유무만 먼저 본다 — 담기 전에 "장바구니가 비었습니다"가 깜빡이지 않도록.
  useEffect(() => {
    const raw = readParam();
    if (raw && !readHistory().includes(raw)) setPending(true);
  }, []);

  useEffect(() => {
    if (handled.current || !ready || !pricesReady) return;
    const raw = readParam();
    if (!raw) {
      handled.current = true;
      setPending(false);
      return;
    }
    handled.current = true;
    const alreadyDone = readHistory().includes(raw);
    const entries = alreadyDone ? [] : parseAddParam(raw, isEnquiryOnly);
    entries.forEach((entry) => addItem(entry.slug, entry.variantId, entry.quantity));
    if (!alreadyDone) rememberHistory(raw);
    stripParam();
    setPending(false);
    setAdded(entries.length > 0);
  }, [ready, pricesReady, addItem, isEnquiryOnly]);

  return { pending, added };
}

export { MAX_ADD_QUANTITY };
