import React from 'react';
import Link from 'next/link';
import { Terminal, Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:glow-cyan transition-all shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-foreground group-hover:text-cyan-400 transition-colors">
                IsItRootable
              </span>
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                v1.1
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted hidden sm:block">
              Android Root, Bootloader, ROMs & Hardware Database
            </p>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <ThemeToggle />

          <a
            href="https://github.com/roufsweb/is-it-rootable"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-foreground hover:text-cyan-400 transition-all shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
