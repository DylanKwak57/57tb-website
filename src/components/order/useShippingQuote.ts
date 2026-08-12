'use client';

import { useEffect, useState } from 'react';
import { fetchShippingQuote, type QuoteInput, type QuoteResult } from '@/lib/shipping-quote';

/**
 * 장바구니 + 선택한 도(จังหวัด)로 배송비를 받아 온다. (2026-08-12 신설)
 *
 * 🚨 주소를 고르기 전에는 `province = null`이라 서버가 **지방 요금**을 준다(모를 때 싼 쪽을
 *    고르면 그대로 적자). 화면은 `provinceApplied`가 false면 "방콕 기준 최소 ฿N부터"로 안내한다.
 *
 * 🚨 장바구니·주소가 바뀔 때마다 다시 부른다. 이전 요청은 취소해 **늦게 도착한 옛 응답이
 *    새 금액을 덮어쓰지 않게** 한다(주소를 빠르게 바꾸면 실제로 일어난다).
 */
export function useShippingQuote(items: QuoteInput[], province: string | null): QuoteResult | null {
  const [result, setResult] = useState<QuoteResult | null>(null);
  // 배열 아이덴티티가 매 렌더 바뀌므로 내용으로 키를 만든다(무한 재요청 방지).
  const key = JSON.stringify(items.map((i) => [i.slug, i.variantId, i.quantity]));

  useEffect(() => {
    if (items.length === 0) {
      setResult(null);
      return;
    }
    const controller = new AbortController();
    void fetchShippingQuote(items, province, controller.signal).then((r) => {
      if (!controller.signal.aborted) setResult(r);
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, province]);

  return result;
}
