'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * 장바구니 상태 — 정적 export(서버 없음)이므로 브라우저 localStorage가 유일한 저장소다.
 *
 * 🚨 SSR/정적 프리렌더 시점에는 localStorage를 읽을 수 없다. 초기 렌더는 항상 빈 장바구니로 두고
 *    `useEffect`에서 복원한다(hydration mismatch 방지). 복원 전 상태는 `ready === false`.
 * 🚨 가격·품목 정본은 `src/data/order.ts`다. 여기에는 가격을 저장하지 않고 slug·옵션·수량만 담아
 *    가격이 바뀌어도 옛 값이 되살아나지 않게 한다.
 */

const STORAGE_KEY = '57tb-cart-v1';
const MAX_QUANTITY = 20;

export type CartItem = { slug: string; variantId: string | null; quantity: number };

type CartContextValue = {
  items: CartItem[];
  /** localStorage 복원이 끝났는지. 복원 전에는 합계·목록을 확정된 값으로 다루지 않는다. */
  ready: boolean;
  totalQuantity: number;
  addItem: (slug: string, variantId: string | null, quantity?: number) => void;
  setQuantity: (slug: string, variantId: string | null, quantity: number) => void;
  removeItem: (slug: string, variantId: string | null) => void;
  clear: () => void;
};

const NOOP_CONTEXT: CartContextValue = {
  items: [],
  ready: false,
  totalQuantity: 0,
  addItem: () => undefined,
  setQuantity: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
};

/** Provider 밖(예: 헤더 없는 독립 페이지)에서 호출돼도 터지지 않도록 무동작 기본값을 둔다. */
const CartContext = createContext<CartContextValue>(NOOP_CONTEXT);

function sameLine(item: CartItem, slug: string, variantId: string | null) {
  return item.slug === slug && item.variantId === variantId;
}

function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value)));
}

function parseStored(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (typeof entry !== 'object' || entry === null) return [];
      const { slug, variantId, quantity } = entry as Record<string, unknown>;
      if (typeof slug !== 'string' || !slug) return [];
      if (typeof variantId !== 'string' && variantId !== null) return [];
      if (typeof quantity !== 'number') return [];
      return [{ slug, variantId: variantId ?? null, quantity: clampQuantity(quantity) }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 시크릿 모드 등 저장 실패는 조용히 넘긴다 — 화면 동작은 유지된다.
    }
  }, [items, ready]);

  const addItem = useCallback((slug: string, variantId: string | null, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => sameLine(item, slug, variantId));
      if (!existing) return [...current, { slug, variantId, quantity: clampQuantity(quantity) }];
      return current.map((item) =>
        sameLine(item, slug, variantId) ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
      );
    });
  }, []);

  const setQuantity = useCallback((slug: string, variantId: string | null, quantity: number) => {
    setItems((current) =>
      current.map((item) => (sameLine(item, slug, variantId) ? { ...item, quantity: clampQuantity(quantity) } : item)),
    );
  }, []);

  const removeItem = useCallback((slug: string, variantId: string | null) => {
    setItems((current) => current.filter((item) => !sameLine(item, slug, variantId)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

export { MAX_QUANTITY, STORAGE_KEY };
