import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// 인스타그램 프로필 링크(link in bio) 페이지 — unlisted.
// join-57과 같은 규칙: Header NAV_ITEMS·sitemap.xml 등록 금지, 검색 제외(robots noindex) 유지.
// 진입: 인스타그램 프로필 링크 `https://57tb.art/links` (vercel.json 이 /th/links 로 보낸다)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'links' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: true },
  };
}

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
