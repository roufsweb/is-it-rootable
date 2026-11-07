import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-background/90 py-12 mt-16 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>IsItRootable</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              The open-source, model-suffix-sensitive database for Android enthusiasts, kernel developers, and power users.
              Distinguishing regional carrier lockdowns from unlockable international bootloaders with instant client-side search.
            </p>
            <div className="text-[11px] text-slate-500">
              Zero tracking • Zero backend latency • Built with Next.js 15 SSG & MiniSearch.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Database</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Instant Search
                </Link>
              </li>
              <li>
                <Link href="/device/samsung-galaxy-s8/" className="hover:text-cyan-400 transition-colors">
                  Samsung Galaxy S8 (SM-G950F vs SM-G950U)
                </Link>
              </li>
              <li>
                <Link href="/device/google-pixel-8/" className="hover:text-cyan-400 transition-colors">
                  Google Pixel 8 (Tensor G3)
                </Link>
              </li>
              <li>
                <Link href="/device/samsung-galaxy-s23/" className="hover:text-cyan-400 transition-colors">
                  Samsung Galaxy S23 (One UI 8 Status)
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Community */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Community</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/roufsweb/is-it-rootable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://twrp.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>TWRP Team</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://kernelsu.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>KernelSU</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            Hosted on GitHub Pages at{' '}
            <a
              href="https://roufsweb.github.io/is-it-rootable"
              className="text-cyan-400 hover:underline"
            >
              roufsweb.github.io/is-it-rootable
            </a>
          </div>
          <div>
            Data curated with model suffix precision.
          </div>
        </div>
      </div>
    </footer>
  );
}

