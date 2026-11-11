import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { DonateButton } from './DonateButton';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between w-full">
        {/* Brand & Monogram Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-tactile-sm group-hover:border-white/25 transition-all">
            <Image
              src="/logo.svg"
              alt="IsItRootable Logo"
              width={36}
              height={36}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-mono font-black text-sm sm:text-base text-foreground tracking-tight group-hover:text-cyan-400 transition-colors">
              IsIt<span className="text-muted group-hover:text-foreground">Rootable</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-muted border border-border font-bold hidden xs:inline-block">
              v1.1
            </span>
          </div>
        </Link>

        {/* Navigation / Actions: Ultra-Clean & Overflow-Free */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop-only secondary actions */}
          <div className="hidden sm:flex items-center gap-2">
            <DonateButton />
            <Link
              href="/about/"
              className="font-mono text-xs px-3 py-1.5 h-9 flex items-center rounded-lg border border-border bg-surface-elevated/80 hover:bg-surface-elevated text-muted hover:text-foreground transition-all font-semibold"
            >
              About
            </Link>
          </div>

          {/* Theme Toggle (Compact 36x36 Glass Button) */}
          <ThemeToggle />

          {/* GitHub Icon Link (Compact 36x36 Glass Button) */}
          <a
            href="https://github.com/roufsweb/is-it-rootable"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-border bg-surface-elevated/80 hover:bg-surface-elevated text-muted hover:text-foreground transition-all cursor-pointer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
