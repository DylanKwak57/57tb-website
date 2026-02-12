import type { Metadata } from 'next';
import { montserrat, notoSansThai, notoSansKR } from '@/lib/fonts';
import { ThemeProvider } from '@/lib/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: '57 Total Beauty | The Largest Hair Salon in Thailand',
  description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments by professional Korean stylists.',
  icons: { icon: '/favicon.ico' },
  metadataBase: new URL('https://57tb-website.vercel.app'),
  openGraph: {
    title: '57 Total Beauty | The Largest Hair Salon in Thailand',
    description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments by professional Korean stylists.',
    url: 'https://57tb-website.vercel.app',
    siteName: '57 Total Beauty',
    images: [
      {
        url: '/images/gallery/color/78658.jpg',
        width: 1200,
        height: 800,
        alt: '57 Total Beauty - The Largest Hair Salon in Thailand',
      },
    ],
    locale: 'th_TH',
    alternateLocale: ['en_US', 'ko_KR'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '57 Total Beauty | The Largest Hair Salon in Thailand',
    description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments by professional Korean stylists.',
    images: ['/images/gallery/color/78658.jpg'],
  },
};

const themeScript = `
(function(){
  var t=localStorage.getItem('57tb-theme');
  if(t==='light')document.documentElement.setAttribute('data-theme','light');
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${montserrat.variable} ${notoSansThai.variable} ${notoSansKR.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
