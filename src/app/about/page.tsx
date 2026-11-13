import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Terminal,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Monitor,
  Github,
  CheckCircle2,
  AlertTriangle,
  Heart,
  ChevronLeft,
} from 'lucide-react';

import { SITE_CONFIG, getCanonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About IsItRootable - Android Bootloader & Root Intelligence Database',
  description:
    'Learn about IsItRootable, the open-source model-suffix sensitive Android bootloader unlock and root database.',
  alternates: {
    canonical: getCanonicalUrl('about'),
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-6">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </Link>

      {/* Hero Section */}
      <section className="rounded-2xl p-6 sm:p-8 border border-border bg-surface shadow-contrast-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-contrast-sm">
              <Image
                src="/logo.svg"
                alt="IsItRootable Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                About IsIt<span className="text-cyan-500">Rootable</span>
              </h1>
              <p className="font-mono text-sm text-muted font-medium">
                The Model-Suffix Sensitive Android Root &amp; Bootloader Database
              </p>
            </div>
          </div>

          <span className="self-start sm:self-center font-mono text-xs sm:text-sm px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold">
            Open Source v1.1
          </span>
        </div>

        <p className="font-mono text-sm sm:text-base text-foreground leading-relaxed font-medium">
          IsItRootable was founded to solve a pervasive problem across the Android enthusiast and developer community: generic advice that fails to distinguish regional hardware variants. A phone marketed under a single commercial name (such as the Samsung Galaxy S24 Ultra or Google Pixel 8) has fundamentally distinct regional bootloaders, hardware e-fuses, and carrier lockouts depending on its exact model suffix.
        </p>

        {/* Official Links Banner */}
        <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/20 font-mono text-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            Official Production Deployment &amp; Repository
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <a
              href={SITE_CONFIG.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shadow-xs text-xs sm:text-sm"
            >
              <span>Live Platform: {SITE_CONFIG.url.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href="https://github.com/roufsweb/is-it-rootable"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors text-xs sm:text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Architectural Tenets */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground font-mono flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-500" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2 shadow-contrast-sm">
            <div className="font-bold text-foreground flex items-center gap-1.5 text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Model-Suffix Precision</span>
            </div>
            <p className="text-muted leading-relaxed font-medium">
              We never lump carrier devices with unlocked editions. Samsung <strong className="text-emerald-700 dark:text-emerald-400">SM-G950F</strong> (Global Exynos) is treated as a completely different platform from the permanently locked <strong className="text-rose-700 dark:text-rose-400">SM-G950U</strong> (North American Snapdragon).
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2 shadow-contrast-sm">
            <div className="font-bold text-foreground flex items-center gap-1.5 text-base">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Zero-Latency Search</span>
            </div>
            <p className="text-muted leading-relaxed font-medium">
              100% of search queries run locally in your browser using an optimized MiniSearch Trie (<strong className="text-cyan-600 dark:text-cyan-400">&lt;150KB bundle</strong>). No network round-trips, no tracking cookies, and sub-20ms response times.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2 shadow-contrast-sm">
            <div className="font-bold text-foreground flex items-center gap-1.5 text-base">
              <Monitor className="w-4 h-4 text-purple-500" />
              <span>Hardware Auditing</span>
            </div>
            <p className="text-muted leading-relaxed font-medium">
              Beyond root, we verify productivity essentials: wired DisplayPort Alt Mode video output, Samsung DeX, Motorola Ready For, MicroSD expansion slots, and 3.5mm analog headphone jacks.
            </p>
          </div>
        </div>
      </section>

      {/* Maintainer & Credits Section */}
      <section className="p-6 rounded-2xl border border-border bg-surface space-y-4 shadow-contrast-sm font-mono text-sm">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>Maintainer &amp; Authorship</span>
        </h2>

        <p className="text-muted leading-relaxed font-medium">
          IsItRootable is architected and actively maintained by{' '}
          <a
            href="https://github.com/roufsweb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Rouf (@roufsweb)
          </a>
          . All device definitions are validated against strict schema rules and vetted against official firmware drops, Google Play certified hardware logs, and open-source recovery repositories.
        </p>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <a
            href="https://github.com/roufsweb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface-elevated text-foreground hover:text-cyan-400 font-bold transition-colors text-xs sm:text-sm"
          >
            <Github className="w-4 h-4" />
            <span>Follow @roufsweb</span>
          </a>
          <a
            href="https://github.com/roufsweb/is-it-rootable/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface-elevated text-foreground hover:text-cyan-400 font-bold transition-colors text-xs sm:text-sm"
          >
            <span>Submit Device Request or Correction</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Support & Donations Section */}
      <section className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-contrast-sm font-mono text-sm">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <span>Support the Project (Buy a Coffee)</span>
        </h2>

        <p className="text-muted leading-relaxed font-medium">
          IsItRootable is free, open-source, and operated without advertisements or tracking. If this database saved you from purchasing a carrier-locked device or helped your root journey, voluntary tips are warmly appreciated! There are no promises or perks — just pure community appreciation.
        </p>

        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted uppercase font-bold">Ethereum (ERC-20) / MetaMask Wallet Address</div>
            <div className="text-foreground font-bold break-all select-all text-xs sm:text-sm">
              0x609e0AB78d5174F72fF8709564f8337DebEa5BD7
            </div>
          </div>
          <a
            href="https://etherscan.io/address/0x609e0AB78d5174F72fF8709564f8337DebEa5BD7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold transition-colors shrink-0 text-xs sm:text-sm"
          >
            <span>Etherscan</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

