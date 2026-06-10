import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.gallery' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://57tb.art/${locale}/gallery`,
      languages: {
        'th': 'https://57tb.art/th/gallery',
        'en': 'https://57tb.art/en/gallery',
        'ko': 'https://57tb.art/ko/gallery',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
