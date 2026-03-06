import type { Metadata } from 'next';
import { montserrat, plusJakartaSans, notoSansThai, notoSansKR } from '@/lib/fonts';
import { ThemeProvider } from '@/lib/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: '57 Total Beauty | The Largest Hair Salon in Thailand',
  description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/images/logo-icon.png' },
    ],
  },
  metadataBase: new URL('https://57tb.art'),
  openGraph: {
    title: '57 Total Beauty | The Largest Hair Salon in Thailand',
    description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments.',
    url: 'https://57tb.art',
    siteName: '57 Total Beauty',
    images: [
      {
        url: '/images/gallery/color/78659.jpg',
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
    description: 'Premier Korean hair salon in Bangkok. Expert cuts, coloring, perms, and treatments.',
    images: ['/images/gallery/color/78659.jpg'],
  },
};

const themeScript = `
(function(){
  var t=localStorage.getItem('57tb-theme');
  if(t==='dark')document.documentElement.setAttribute('data-theme','dark');
})();
`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: '57 Total Beauty',
  description:
    'The largest Korean hair salon in Thailand. Expert cuts, coloring, perms, and treatments since 2012.',
  url: 'https://57tb.art',
  logo: 'https://57tb.art/images/logo-icon.png',
  image: 'https://57tb.art/images/gallery/color/78659.jpg',
  telephone: ['+6620160257', '+6620450957'],
  email: 'dylan@57tb.art',
  foundingDate: '2012',
  priceRange: '$$',
  currenciesAccepted: 'THB',
  paymentAccepted: 'Cash, Credit Card, PromptPay',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '10:00',
    closes: '20:00',
  },
  address: [
    {
      '@type': 'PostalAddress',
      name: 'Asoke Branch',
      streetAddress: 'Soi Sukhumvit 21',
      addressLocality: 'Klongtoey Nua, Watthana',
      addressRegion: 'Bangkok',
      postalCode: '10110',
      addressCountry: 'TH',
    },
    {
      '@type': 'PostalAddress',
      name: 'Saimai Branch',
      streetAddress: 'Saimai',
      addressLocality: 'Saimai',
      addressRegion: 'Bangkok',
      postalCode: '10220',
      addressCountry: 'TH',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.74,
    longitude: 100.56,
  },
  sameAs: [
    'https://www.facebook.com/57totalbeauty',
    'https://www.instagram.com/57totalbeauty',
    'https://www.youtube.com/channel/UCrrTonDUxVMkBHo25Xp40bA',
    'https://www.tiktok.com/@57totalbeauty',
    'https://line.me/R/ti/p/@57totalbeauty',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hair Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Haircut',
          description: 'Korean-style haircut by professional stylists',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '200',
          priceCurrency: 'THB',
          minPrice: '200',
          maxPrice: '500',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Perm',
          description: 'Korean digital perm for natural curls',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '700',
          priceCurrency: 'THB',
          minPrice: '700',
          maxPrice: '1500',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hair Coloring',
          description: 'Professional hair coloring with premium products',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '500',
          priceCurrency: 'THB',
          minPrice: '500',
          maxPrice: '3200',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hair Treatment',
          description: 'LPP, damage control, and premium hair treatments',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '400',
          priceCurrency: 'THB',
          minPrice: '200',
          maxPrice: '6000',
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5L1DF2E9XB" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5L1DF2E9XB');`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${montserrat.variable} ${notoSansThai.variable} ${notoSansKR.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
