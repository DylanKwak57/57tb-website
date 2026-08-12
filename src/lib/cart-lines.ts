import { isOrderable, orderEntry } from '@/data/order';
import { getProduct, localize } from '@/data/products';
import type { CartItem } from '@/components/cart/CartProvider';

/**
 * 장바구니에 담긴 항목(slug·옵션·수량)을 화면에 쓸 줄 정보로 바꾼다.
 *
 * 🚨 가격은 장바구니에도, 빌드 산출물에도 없다 — 매번 **서버에서 받은 가격표**(`usePrices()`)로 다시 읽는다.
 *    가격을 못 받은 상태(비회원·해외·조회 실패)면 `unitPrice`가 null이라 합계를 확정값으로 다루지 않는다.
 * 장바구니 화면과 주문(결제) 화면이 같은 합계를 보여야 하므로 계산은 이 파일 하나만 쓴다.
 */

/** 가격 조회기 — `PriceProvider`가 주는 함수만 받는다(이 파일은 가격을 알지 못한다). */
export type PriceLookup = {
  unitPrice: (slug: string, variantId: string | null) => number | null;
  isEnquiryOnly: (slug: string) => boolean;
};

export type CartLine = {
  slug: string;
  variantId: string | null;
  quantity: number;
  nameEn: string;
  nameTh: string;
  variantLabel: string | null;
  unitPrice: number | null;
};

/**
 * 정본에서 사라진 slug(옛 localStorage)나 판매 중단 제품은 줄에서 빼고 표시하지 않는다.
 * 🚨 가격 문의 품목(서버 `enquiryOnly`)도 뺀다 — 가격이 없어 결제가 성립하지 않고, 서버도 주문을 거부한다.
 */
export function resolveCartLines(items: CartItem[], locale: string, prices: PriceLookup): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    if (!product || !isOrderable(item.slug)) return [];
    if (prices.isEnquiryOnly(item.slug)) return [];
    const entry = orderEntry(item.slug);
    const variant = entry?.variants?.find((option) => option.id === item.variantId) ?? null;
    return [{
      slug: item.slug,
      variantId: item.variantId,
      quantity: item.quantity,
      nameEn: product.nameEn,
      nameTh: product.nameTh,
      variantLabel: variant ? localize(variant.label, locale) : null,
      unitPrice: prices.unitPrice(item.slug, item.variantId),
    }];
  });
}

/** 값이 확정되지 않은 줄(가격 미정)이 하나라도 있으면 합계를 확정값으로 다루지 않는다. */
export function cartPriced(lines: CartLine[]) {
  return lines.length > 0 && lines.every((line) => line.unitPrice !== null);
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + (line.unitPrice ?? 0) * line.quantity, 0);
}
