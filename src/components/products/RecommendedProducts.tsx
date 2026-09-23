'use client';

import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { getProduct } from '@/data/products';
import {
  BESTSELLER_LABEL, CARD_LINES, PAIR_LABEL, pickRecommendations, RECOMMEND_TITLE, type Recommendation,
} from '@/data/recommend';
import { assetPath, cn } from '@/lib/utils';

/**
 * 제품 상세 "Recommended" 영역 (2026-09-23 신설).
 *
 * 마운트 후 `trading-recommend`(공개 GET, slug 목록만)를 한 번 부르고, 짝 표·인기 목록으로 카드를 고른다.
 * 🚨 가격·수량은 그리지 않는다. 가격 게이트(`trading-prices`)와 무관하게 비회원에게도 보인다 — 카드엔 가격이 없다.
 * 🚨 재고를 모르거나(null) · 호출 실패 · 결과 0개 → 영역을 접는다(품절 제품을 추천하지 않는다).
 * 첫 렌더(프리렌더·hydration)와 로딩 중에는 카드 높이만큼 빈 자리를 둔다 — 결정적 마크업이라 hydration 이 어긋나지 않는다.
 */

const CARD_WIDTH = 'w-[152px] shrink-0 snap-start md:w-auto';
const SKELETON_COUNT = 4;

type State = { status: 'loading' } | { status: 'done'; items: Recommendation[] };

/**
 * 태국어 외래어(음차) — Chrome 태국어 사전에 없어 좁은 카드에서 단어 중간이 끊긴다
 * ("โปรตีนคอล|ลาเจน", "ระดับซา|ลอน" — 2026-09-23 375px 캡처). 긴 단어를 먼저 맞춘다(แฮร์มิสต์ > มิสต์).
 */
const THAI_LOANWORDS = [
  'แฮร์มิสต์', 'ทรีตเมนต์', 'คอลลาเจน', 'มัลติแคร์', 'เอสเซนส์', 'คาเฟอีน', 'โซลูชัน',
  'เคราติน', 'โปรตีน', 'เซรั่ม', 'ลีฟอิน', 'ซิลค์', 'ซาลอน', 'มิสต์',
].sort((a, b) => b.length - a.length);
/** 숫자와 태국어 단위("500 มล.")가 문구에 들어올 경우 한 조각으로 — 기본은 영어 단위(ml·g)를 쓴다(2026-09-23). */
const NUMBER_UNIT = '\\d+ (?:มล\\.|ก\\.)';
const LOANWORD_SPLIT = new RegExp(`(${NUMBER_UNIT}|${THAI_LOANWORDS.join('|')})`);
const NUMBER_UNIT_RE = new RegExp(`^${NUMBER_UNIT}$`);
const LOANWORD_SET = new Set(THAI_LOANWORDS);

/**
 * 외래어를 줄바꿈 없는 조각으로 감싼다. **글자는 하나도 더하거나 빼지 않는다** — 복사하면 원문 그대로다.
 * 조각 사이 `<wbr>`(글자 아님)은 줄바꿈 기회만 보장한다(nowrap 조각끼리 붙으면 끊을 자리가 사라질 수 있다).
 */
function keepLoanwords(text: string): ReactNode {
  const parts = text.split(LOANWORD_SPLIT).filter((part) => part !== '');
  return parts.map((part, index) => (
    <Fragment key={`${index}-${part}`}>
      {index > 0 && <wbr />}
      {LOANWORD_SET.has(part) || NUMBER_UNIT_RE.test(part) ? <span className="whitespace-nowrap">{part}</span> : part}
    </Fragment>
  ));
}

function readSlugs(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

async function fetchRecommendInputs(signal: AbortSignal): Promise<{ inStock: string[] | null; bestsellers: string[] } | null> {
  if (!ORDER_API_BASE) return null;
  const res = await fetch(`${ORDER_API_BASE}/trading-recommend`, { method: 'GET', signal });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.ok !== true) return null;
  return {
    // 배열이 아니면(=null 또는 모르는 모양) 재고를 모르는 것으로 본다 → 영역을 숨긴다.
    inStock: Array.isArray(body.inStock) ? readSlugs(body.inStock) : null,
    bestsellers: readSlugs(body.bestsellers),
  };
}

function Track({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
      {children}
    </div>
  );
}

function RecommendCard({ item, locale }: { item: Recommendation; locale: string }) {
  const product = getProduct(item.slug);
  if (!product) return null;
  const lines = CARD_LINES[item.slug] ?? [];
  const contain = product.brand === 'valentine';
  return (
    <a
      className={cn(
        CARD_WIDTH,
        'group block overflow-hidden rounded-2xl border border-brand-gold/15 bg-brand-card transition-colors hover:border-brand-gold/40',
      )}
      href={assetPath(`/${locale}/products/${item.slug}`)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          alt=""
          className={cn('h-full w-full transition-transform duration-500 group-hover:scale-105', contain ? 'object-contain p-3' : 'object-cover')}
          decoding="async"
          height="800"
          loading="lazy"
          src={assetPath(`/products/${item.slug}/thumb.webp`)}
          width="800"
        />
        {item.bestseller && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold tracking-[.08em] text-brand-black" lang="en">
            {BESTSELLER_LABEL}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-3 min-h-[2.5em] text-sm font-medium leading-tight text-brand-white" lang="en">
          {/* 제품명 = 영어(병 라벨) — 목록·상세·장바구니와 같은 기준. 태국어 음차를 제목으로 쓰지 않는다(대표님 2026-09-23). */}
          {product.nameEn.split(' ').map((word, index) => (
            <span key={`${word}-${index}`}>{index > 0 && ' '}<span className="whitespace-nowrap">{word}</span></span>
          ))}
        </p>
        {item.pair && (
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-brand-gold" lang="en">{PAIR_LABEL}</p>
        )}
        {lines.length > 0 && (
          <div className="mt-1.5 space-y-1" lang="th">
            {lines.map((line, index) => (
              <p className={cn('text-xs leading-relaxed', index === 0 ? 'text-brand-gray' : 'text-brand-champagne')} key={line}>
                {keepLoanwords(line)}
              </p>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div aria-hidden="true" className={cn(CARD_WIDTH, 'overflow-hidden rounded-2xl border border-brand-gold/10 bg-brand-card')}>
      <div className="aspect-square w-full animate-pulse bg-brand-gold/5" />
      <div className="space-y-2 p-3">
        <div className="h-3.5 w-4/5 rounded bg-brand-gold/10" />
        <div className="h-3.5 w-3/5 rounded bg-brand-gold/10" />
        <div className="h-3 w-full rounded bg-brand-gold/5" />
        <div className="h-3 w-2/3 rounded bg-brand-gold/5" />
      </div>
    </div>
  );
}

/** `maxWidth` = 영역 폭. 기본은 구매 패널(1180)과 맞추고, 판매 종료 페이지는 종료 안내(860)와 맞춘다. */
export function RecommendedProducts({
  slug, locale, className, maxWidth = 'max-w-[1180px]',
}: { slug: string; locale: string; className?: string; maxWidth?: 'max-w-[1180px]' | 'max-w-[860px]' }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!ORDER_API_BASE) return;
    const controller = new AbortController();
    fetchRecommendInputs(controller.signal)
      .then((inputs) => {
        if (controller.signal.aborted) return; // 페이지를 떠났거나 slug 가 바뀐 뒤 도착한 결과는 버린다
        const items = inputs ? pickRecommendations(slug, inputs.inStock, inputs.bestsellers) : [];
        setState({ status: 'done', items });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'done', items: [] });
      });
    return () => controller.abort();
  }, [slug]);

  // API 주소가 없는 빌드(로컬 env 미설정)는 호출 자체를 하지 않는다 — 빌드 상수라 서버·클라이언트 첫 렌더가 같다.
  if (!ORDER_API_BASE) return null;
  if (state.status === 'done' && state.items.length === 0) return null;

  return (
    // 폭 860(판매 종료 안내 배너)은 배너처럼 px-4 만 쓴다 — md:px-6 을 주면 배너와 좌우 선이 8px 어긋난다.
    <section aria-label={RECOMMEND_TITLE} className={cn('mx-auto px-4', maxWidth === 'max-w-[1180px]' && 'md:px-6', maxWidth, className)}>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">{RECOMMEND_TITLE}</h2>
      <Track>
        {state.status === 'loading'
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => <SkeletonCard key={index} />)
          : state.items.map((item) => <RecommendCard item={item} key={item.slug} locale={locale} />)}
      </Track>
    </section>
  );
}
