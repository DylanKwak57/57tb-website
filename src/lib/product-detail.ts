import type { Product, ProductLocale } from '@/data/products';
import imageData from '@/data/products-images.json';
export { formulaReducer, type FormulaAction, type FormulaState } from './formula-state';

type LegacyAssets = { chunks: number; height: number; width: number };
type LocaleChunk = { file: string; width: number; height: number; sectionId: string; altTh: string };
type LocaleAssets = { locales: Partial<Record<ProductLocale, { chunks: LocaleChunk[] }>> };
type AssetMap = Record<string, LegacyAssets | LocaleAssets>;

export type ResolvedDetailChunk = { src: string; width: number; height?: number; sectionId?: string; alt: string };
export type ResolvedDetailAssets = { locale: ProductLocale; chunks: ResolvedDetailChunk[] };

function isLocaleAssets(value: LegacyAssets | LocaleAssets): value is LocaleAssets {
  return 'locales' in value;
}

export function resolveDetailAssets(product: Product, requestedLocale: string): ResolvedDetailAssets {
  const meta = (imageData as AssetMap)[product.slug];
  const locale = (requestedLocale === 'en' || requestedLocale === 'ko' || requestedLocale === 'th' ? requestedLocale : 'th') as ProductLocale;
  if (meta && isLocaleAssets(meta)) {
    const actualLocale = meta.locales[locale] ? locale : product.defaultLocale ?? 'th';
    const chunks = meta.locales[actualLocale]?.chunks ?? [];
    return { locale: actualLocale, chunks: chunks.map((chunk) => ({ src: `/products/${product.slug}/${actualLocale}/${chunk.file}`, width: chunk.width, height: chunk.height, sectionId: chunk.sectionId, alt: chunk.altTh })) };
  }
  const legacy = meta as LegacyAssets | undefined;
  return { locale, chunks: Array.from({ length: legacy?.chunks ?? 0 }, (_, index) => ({ src: `/products/${product.slug}/c${String(index).padStart(2, '0')}.webp`, width: legacy?.width ?? 1290, alt: `${product.nameEn} ${index + 1}` })) };
}
