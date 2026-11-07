import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, Github, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:glow-cyan transition-all">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                IsItRootable
              </span>
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Android Root, Bootloader & Hardware Database
            </p>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/roufsweb/is-it-rootable"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-surface hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
