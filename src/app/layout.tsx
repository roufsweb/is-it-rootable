import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://roufsweb.github.io/is-it-rootable'),
  title: 'IsItRootable - Instant Android Bootloader, Root & DeX Compatibility Database',
  description:
    'Check if your Android phone can be rooted or bootloader unlocked. Distinguishing regional model suffixes (SM-G950F vs SM-G950U), custom kernels, and USB-C DisplayPort/DeX support.',
  keywords: [
    'android root',
    'bootloader unlock',
    'magisk',
    'kernelsu',
    'apatch',
    'twrp',
    'samsung dex',
    'displayport alt mode',
    'custom kernel',
    'lineageos',
    'xda',
  ],
  authors: [{ name: 'IsItRootable Contributors' }],
  openGraph: {
    title: 'IsItRootable - Instant Android Bootloader & Root Database',
    description:
      'Zero-latency model-suffix-sensitive Android rootability and bootloader unlock verification.',
    url: 'https://roufsweb.github.io/is-it-rootable/',
    siteName: 'IsItRootable',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IsItRootable - Instant Android Bootloader & Root Database',
    description:
      'Check bootloader unlockability, root status, and hardware features for any Android model suffix.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="cyber-grid min-h-screen flex flex-col justify-between bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

