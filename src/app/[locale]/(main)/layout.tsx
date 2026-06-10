import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-gold focus:text-brand-black focus:rounded-full focus:font-semibold"
      >
        Skip to main content
      </a>
      <Header locale={locale} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
