import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { GalleryPreview } from '@/components/sections/GalleryPreview';

import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { PromotionSection } from '@/components/sections/PromotionSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { CTASection } from '@/components/sections/CTASection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <GalleryPreview />
      <ReviewsSection />
      <PromotionSection />
      <LocationSection />
      <CTASection />
    </>
  );
}
