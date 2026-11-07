import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://roufsweb.github.io/is-it-rootable'),
  title: {
    default: 'IsItRootable - Instant Android Bootloader, Root & DeX Compatibility Database',
    template: '%s - IsItRootable',
  },
  description:
    'Instant, model-suffix-sensitive Android bootloader unlock and root database. Check whether your exact model (SM-G950F vs SM-G950U), custom ROMs, KernelSU, and USB-C DisplayPort/DeX are supported.',
  keywords: [
    'android root',
    'bootloader unlock',
    'can i root my phone',
    'how to root android',
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
  ],
  authors: [{ name: 'IsItRootable Contributors' }],
  creator: 'IsItRootable',
  publisher: 'IsItRootable',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    url: 'https://roufsweb.github.io/is-it-rootable/',
    siteName: 'IsItRootable',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://roufsweb.github.io/is-it-rootable/og-image.png',
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
    images: ['https://roufsweb.github.io/is-it-rootable/og-image.png'],
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
    name: 'IsItRootable',
    alternateName: ['Is It Rootable', 'IsItRootable Database'],
    url: 'https://roufsweb.github.io/is-it-rootable/',
    description:
      'The authoritative model-suffix-sensitive database for Android bootloader unlockability, root guides, custom ROMs, and hardware capabilities.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://roufsweb.github.io/is-it-rootable/?q={search_term_string}',
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
