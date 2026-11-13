import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, ExternalLink, Heart, Github, Globe, Coffee } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/90 py-12 mt-16 text-xs font-mono text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Terminal className="w-4 h-4 text-cyan-500" />
              <span>IsItRootable</span>
            </div>
            <p className="text-muted leading-relaxed text-xs">
              The open-source, model-suffix-sensitive database for Android enthusiasts, kernel developers, and power users.
              Distinguishing regional carrier lockdowns from unlockable international bootloaders with instant client-side search.
            </p>

            {/* Official Production URL & Source Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <a
                href={SITE_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold hover:bg-cyan-500/20 transition-colors"
                title="Live Platform"
              >
                <Globe className="w-3 h-3 text-cyan-500" />
                <span>Live Site: {SITE_CONFIG.url.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Link
                href="/about/"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-border text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors"
              >
                <span>About</span>
              </Link>
            </div>

            <div className="text-[11px] text-muted">
              Zero tracking • Zero backend latency • Built with Next.js 15 SSG &amp; MiniSearch.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold uppercase tracking-wider text-[11px]">Database</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Instant Search
                </Link>
              </li>
              <li>
                <Link href="/about/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  About &amp; Methodology
                </Link>
              </li>
              <li>
                <Link href="/device/samsung-galaxy-s24-ultra/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Galaxy S24 Ultra (SM-S928B vs SM-S928U)
                </Link>
              </li>
              <li>
                <Link href="/device/google-pixel-9-pro/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Google Pixel 9 Pro (Tensor G4)
                </Link>
              </li>
              <li>
                <Link href="/device/xiaomi-14-ultra/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Xiaomi 14 Ultra (HyperOS Unlock)
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Community */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold uppercase tracking-wider text-[11px]">Community</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/roufsweb/is-it-rootable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Live Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/roufsweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Maintainer: @roufsweb</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://etherscan.io/address/0x609e0AB78d5174F72fF8709564f8337DebEa5BD7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-amber-500 transition-colors"
                >
                  <Coffee className="w-3 h-3 text-amber-500" />
                  <span>Tip (Ethereum): 0x609e...5BD7</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[11px]">
          <div>
            Hosted with high-performance static architecture at{' '}
            <a
              href={SITE_CONFIG.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
            >
              {SITE_CONFIG.url}
            </a>
          </div>
          <div>
            Model-suffix sensitive Android database. MIT Licensed.
          </div>
        </div>
      </div>
    </footer>
  );
}
