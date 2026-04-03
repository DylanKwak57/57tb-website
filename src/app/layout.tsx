import type { Metadata } from 'next';
import { montserrat, plusJakartaSans, notoSansThai, notoSansKR } from '@/lib/fonts';
import { ThemeProvider } from '@/lib/ThemeContext';
import { REVIEWS, FAQ_ITEMS } from '@/lib/constants';
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
  alternates: {
    canonical: 'https://57tb.art/th',
    languages: {
      'th': 'https://57tb.art/th',
      'en': 'https://57tb.art/en',
      'ko': 'https://57tb.art/ko',
    },
  },
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
  '@graph': [
    {
      '@type': 'HairSalon',
      '@id': 'https://57tb.art/#organization',
      name: '57 Total Beauty',
      alternateName: '57 โทเทิล บิวตี้',
      description:
        'The largest Korean hair salon in Thailand with over 5,000 Google reviews and 4.8-star rating. Expert cuts, coloring, perms, and treatments since 2012. Two branches in Bangkok: Asoke (Sukhumvit 21) and Saimai.',
      url: 'https://57tb.art',
      logo: 'https://57tb.art/images/logo-icon.png',
      image: 'https://57tb.art/images/gallery/color/78659.jpg',
      telephone: ['+6620160257', '+6620450957'],
      email: 'dylan@57tb.art',
      foundingDate: '2012',
      priceRange: '$$',
      currenciesAccepted: 'THB',
      paymentAccepted: 'Cash, Credit Card, PromptPay',
      areaServed: {
        '@type': 'City',
        name: 'Bangkok',
        addressCountry: 'TH',
      },
      knowsLanguage: ['th', 'en', 'ko'],
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 30,
        maxValue: 50,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '5000',
        reviewCount: '5000',
      },
      review: REVIEWS.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name.en },
        datePublished: r.date,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(r.rating),
          bestRating: '5',
        },
        reviewBody: r.text.en,
      })),
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
          streetAddress: 'A.C Market, Saimai',
          addressLocality: 'Saimai',
          addressRegion: 'Bangkok',
          postalCode: '10220',
          addressCountry: 'TH',
        },
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.7456189,
        longitude: 100.5624729,
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
              maxPrice: '600',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Digital Perm',
              description: 'Korean digital perm for natural curls and volume',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '700',
              priceCurrency: 'THB',
              minPrice: '700',
              maxPrice: '1800',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Volume Magic',
              description: 'Korean volume magic straight perm for sleek, natural-looking straight hair',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '1200',
              priceCurrency: 'THB',
              minPrice: '1200',
              maxPrice: '2400',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Hair Coloring',
              description: 'Professional hair coloring with premium Korean products (Gosen, Nigao, Shiseido Primience)',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '500',
              priceCurrency: 'THB',
              minPrice: '500',
              maxPrice: '3500',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Hair Treatment',
              description: 'LPP, Damage Control, One Shot, Premium 3-Step, and Special 5-Step hair treatments',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '200',
              priceCurrency: 'THB',
              minPrice: '200',
              maxPrice: '6000',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://57tb.art/#faq',
      mainEntity: FAQ_ITEMS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
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
