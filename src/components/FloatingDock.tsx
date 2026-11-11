'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, ShieldCheck, Monitor, Info } from 'lucide-react';

interface FloatingDockProps {
  onOpenWizard?: () => void;
}

export function FloatingDock({ onOpenWizard }: FloatingDockProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const scrollToSearch = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById('search-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }
  };

  return (
    <nav
      aria-label="Quick Actions Dock"
      className="floating-glass-dock pointer-events-none select-none"
    >
      <div className="pointer-events-auto inline-flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-surface/90 dark:bg-[#111114]/92 backdrop-blur-2xl border border-border dark:border-white/10 shadow-dock text-foreground font-mono text-xs">
        {/* Home / Search Action */}
        <Link
          href="/"
          onClick={scrollToSearch}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
            isHome
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
          title="Search Database"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
        </Link>

        {/* Wizard Trigger Action */}
        {onOpenWizard && (
          <button
            type="button"
            onClick={onOpenWizard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-foreground hover:bg-surface-elevated border border-border transition-all cursor-pointer font-bold"
            title="Launch Root Compatibility Wizard"
          >
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Wizard</span>
          </button>
        )}

        {/* Quick Filter: Full Root */}
        <Link
          href="/?verdict=FULL"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-elevated transition-all cursor-pointer font-medium"
          title="Explore Full Root Devices"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden md:inline">Rootable</span>
        </Link>

        {/* Quick Filter: DeX / DP Alt Mode */}
        <Link
          href="/?dp=1"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-elevated transition-all cursor-pointer font-medium"
          title="Explore DisplayPort / DeX Devices"
        >
          <Monitor className="w-3.5 h-3.5 text-muted" />
          <span className="hidden md:inline">DeX / DP</span>
        </Link>

        {/* Divider */}
        <span className="w-px h-4 bg-border mx-0.5" />

        {/* About Link */}
        <Link
          href="/about/"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
            pathname === '/about/'
              ? 'bg-foreground text-background font-bold shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
          title="About IsItRootable"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">About</span>
        </Link>
      </div>
    </nav>
  );
}
