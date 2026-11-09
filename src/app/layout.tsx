import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG, getCanonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s - ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'android root',
    'bootloader unlock',
    'can i root my phone',
    'how to root android',
    'how to unroot android',
    'restore stock boot image',
    'custom rom',
    'lineageos',
    'grapheneos',
    'magisk root',
    'kernelsu',
    'apatch',
    'twrp recovery',
    'samsung dex',
    'displayport alt mode',
    'custom kernel',
    'fastboot flashing unlock',
    'play integrity fix',
    'knox 0x1',
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: SITE_CONFIG.googleVerification
    ? {
        google: SITE_CONFIG.googleVerification,
      }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'IsItRootable - Instant Android Bootloader & Root Database',
    description:
      'Zero-latency model-suffix-sensitive Android rootability, ROM compatibility, and bootloader unlock verification.',
    url: getCanonicalUrl(''),
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: getCanonicalUrl('og-image.png'),
        width: 1200,
        height: 630,
        alt: 'IsItRootable - Instant Android Bootloader & Root Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IsItRootable - Instant Android Bootloader & Root Database',
    description:
      'Check bootloader unlockability, root status, and hardware features for any Android model suffix.',
    images: [getCanonicalUrl('og-image.png')],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org WebSite structured data with SearchAction for Google Sitelinks Search Box
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    alternateName: ['Is It Rootable', 'IsItRootable Database'],
    url: getCanonicalUrl(''),
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getCanonicalUrl('')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="cyber-grid min-h-screen flex flex-col justify-between bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-400">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
