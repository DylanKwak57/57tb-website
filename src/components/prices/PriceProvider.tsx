'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { forgetIdToken, getIdTokenSilently, LIFF_ID, startLineLogin } from '@/lib/liff';
import { requestStockAlert } from '@/lib/stock-alert';
import { fetchPrices, lookupInStock, lookupUnitPrice, type PricePhase, type PriceTable, type StockTable } from '@/lib/prices';

export {
  CHECKOUT_CLOSED_LABEL, SOLD_OUT_LABEL, STOCK_ALERT_LABEL, STOCK_ALERT_DONE_LABEL,
  PRICE_BLOCKED_LABEL, PRICE_ENQUIRY_LABEL, PRICE_LOGIN_LABEL, PRICE_UNKNOWN, priceText,
} from '@/lib/prices';

/**
 * 가격 상태 — 앱 전체에서 한 번만 받아 온다 (2026-08-12 신설).
 *
 * 🚨 가격은 빌드 산출물에 없다. 브랜드사(세리) 조건이 **비회원·해외 접속자 비노출**이라
 *    정적 파일에 값을 적어 두면 그대로 공개된다. 값은 `trading-prices`가 유일한 공급원이다.
 * 🚨 화면은 네 가지 상태를 구분해야 한다:
 *      loading  — 아직 모른다. 금액 자리는 `—`로 두고 없는 값을 지어내지 않는다.
 *      ok       — 가격 표시
 *      no_auth  — LINE 로그인하면 풀린다 → 로그인 버튼
 *      blocked  — 해외 접속·판매 중단·조회 불가 → LINE 문의 안내(장바구니·주문 잠금)
 * 🚨 로그인으로 손님을 자동으로 밀어내지 않는다 — 버튼을 눌렀을 때만 LINE으로 보낸다.
 */

type PriceContextValue = {
  phase: PricePhase;
  /** 서버가 준 가격표. `ok`가 아니면 비어 있다. */
  table: PriceTable;
  /** 주문 1건당 배송비. 모르면 null. */
  shippingFee: number | null;
  /** 주문·결제 요청에 실어 보낼 LIFF ID token. 없으면 빈 문자열. */
  idToken: string;
  /** LINE 로그인 버튼을 띄울 수 있는가(LIFF 설정이 있는가). */
  canSignIn: boolean;
  /** 결제 오픈 여부. 가격은 보이지만 아직 주문을 못 받는 구간이 있다. */
  checkoutOpen: boolean;
  signIn: () => void;
  unitPrice: (slug: string, variantId: string | null) => number | null;
  /**
   * 재고 여부. **모르면 null** — 화면은 배지를 그리지 않고 담기도 막지 않는다.
   * 이 값은 앱 진입 시점 기준이라 페이지를 오래 열어두면 낡는다.
   * 주문 직전 최신 판정은 `trading-shipping-quote`의 `soldOut`이 맡는다.
   */
  inStock: (slug: string, variantId: string | null) => boolean | null;
  /** 이 손님이 재입고 알림을 걸어둔 품목인가 (2026-08-18). */
  hasStockAlert: (slug: string, variantId: string | null) => boolean;
  /** 재입고 알림 신청. 성공하면 화면 상태도 즉시 갱신한다(재조회 없이). */
  requestAlert: (slug: string, variantId: string | null, productName: string) => Promise<boolean>;
  /** 가격을 걸지 않고 문의만 받는 품목인가. */
  isEnquiryOnly: (slug: string) => boolean;
  /** 가격이 실제로 필요한 화면이 마운트되면 그때 한 번 조회한다(`usePrices`가 자동 호출). */
  activate: () => void;
};

const NOOP: PriceContextValue = {
  phase: 'loading',
  table: {},
  shippingFee: null,
  idToken: '',
  canSignIn: false,
  checkoutOpen: false,
  signIn: () => undefined,
  unitPrice: () => null,
  inStock: () => null,
  hasStockAlert: () => false,
  requestAlert: async () => false,
  isEnquiryOnly: () => false,
  activate: () => undefined,
};

/** Provider 밖에서 호출돼도 터지지 않도록 무동작 기본값을 둔다(가격은 보이지 않는다 = 안전한 쪽). */
const PriceContext = createContext<PriceContextValue>(NOOP);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<PricePhase>('loading');
  const [table, setTable] = useState<PriceTable>({});
  const [stock, setStock] = useState<StockTable | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [enquiryOnly, setEnquiryOnly] = useState<string[]>([]);
  const [idToken, setIdToken] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const started = useRef(false);

  const load = useCallback(async () => {
    setPhase('loading');
    // 이미 로그인돼 있으면 조용히 토큰을 받는다. 아니면 빈 값으로 물어보고 `no_auth`를 받는다.
    let token = (await getIdTokenSilently()) ?? '';
    let result = await fetchPrices(token);

    // 보관해 둔 토큰이 만료됐을 수 있다 → 한 번만 새로 받아 다시 물어본다.
    if (result.phase === 'no_auth' && token) {
      forgetIdToken();
      const fresh = (await getIdTokenSilently({ fresh: true })) ?? '';
      if (fresh && fresh !== token) {
        token = fresh;
        result = await fetchPrices(fresh);
      } else {
        token = '';
      }
    }

    setIdToken(token);
    setEnquiryOnly(result.enquiryOnly);
    if (result.phase === 'ok') {
      setTable(result.table);
      setStock(result.stock);
      setAlerts(result.stockAlerts);
      setShippingFee(result.shippingFee);
      setCheckoutOpen(result.checkoutOpen);
    } else {
      setTable({});
      setStock(null);
      setAlerts([]);
      setShippingFee(null);
      setCheckoutOpen(false);
    }
    setPhase(result.phase);
  }, []);

  /**
   * 🚨 가격이 필요한 화면에서만 조회한다 — 홈·갤러리·시술 페이지까지 매번 부르면
   *    서버가 접속 국가 조회(외부 API)와 LINE 토큰 검증을 그만큼 반복한다.
   */
  const activate = useCallback(() => {
    if (started.current) return;
    started.current = true;
    load();
  }, [load]);

  const signIn = useCallback(() => {
    // 실패해도 화면은 그대로 둔다 — 손님이 다시 누를 수 있다.
    startLineLogin().catch(() => undefined);
  }, []);

  const value = useMemo<PriceContextValue>(() => {
    const enquirySet = new Set(enquiryOnly);
    return {
      phase,
      table,
      shippingFee,
      idToken,
      canSignIn: LIFF_ID !== null,
      checkoutOpen,
      signIn,
      unitPrice: (slug, variantId) => (enquirySet.has(slug) ? null : lookupUnitPrice(table, slug, variantId)),
      inStock: (slug, variantId) => lookupInStock(stock, slug, variantId),
      hasStockAlert: (slug, variantId) => alerts.includes(variantId ? `${slug}:${variantId}` : slug),
      requestAlert: async (slug, variantId, productName) => {
        const r = await requestStockAlert({ idToken, slug, variantId, productName });
        if (r.status !== 'ok') return false;
        setAlerts((prev) => {
          const key = variantId ? `${slug}:${variantId}` : slug;
          return prev.includes(key) ? prev : [...prev, key];
        });
        return true;
      },
      isEnquiryOnly: (slug) => enquirySet.has(slug),
      activate,
    };
  }, [phase, table, stock, alerts, shippingFee, idToken, enquiryOnly, checkoutOpen, signIn, activate]);

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

/** 가격을 쓰는 화면에서 부른다. 부르는 순간 조회가 시작된다(첫 호출 1회만). */
export function usePrices() {
  const context = useContext(PriceContext);
  const { activate } = context;
  useEffect(() => {
    activate();
  }, [activate]);
  return context;
}
