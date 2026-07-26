import { basePrice, isOrderable, orderEntry } from '@/data/order';
import { getProduct, localize } from '@/data/products';
import type { CartItem } from '@/components/cart/CartProvider';

/**
 * 장바구니에 담긴 항목(slug·옵션·수량)을 화면에 쓸 줄 정보로 바꾼다.
 *
 * 🚨 가격은 장바구니에 저장하지 않고 매번 `src/data/order.ts`에서 다시 읽는다 — 가격을 고치면 담아둔 것도 즉시 따라간다.
 * 장바구니 화면과 주문(결제) 화면이 같은 합계를 보여야 하므로 계산은 이 파일 하나만 쓴다.
 */

export type CartLine = {
  slug: string;
  variantId: string | null;
  quantity: number;
  nameEn: string;
  nameTh: string;
  variantLabel: string | null;
  unitPrice: number | null;
};

export function money(value: number) {
  return `฿${value.toLocaleString('en-US')}`;
}

/** 정본에서 사라진 slug(옛 localStorage)나 판매 중단 제품은 줄에서 빼고 표시하지 않는다. */
export function resolveCartLines(items: CartItem[], locale: string): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    if (!product || !isOrderable(item.slug)) return [];
    const entry = orderEntry(item.slug);
    const variant = entry?.variants?.find((option) => option.id === item.variantId) ?? null;
    return [{
      slug: item.slug,
      variantId: item.variantId,
      quantity: item.quantity,
      nameEn: product.nameEn,
      nameTh: product.nameTh,
      variantLabel: variant ? localize(variant.label, locale) : null,
      unitPrice: variant ? variant.price : basePrice(item.slug),
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
