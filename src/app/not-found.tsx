import React from 'react';
import Link from 'next/link';
import { Terminal, Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Terminal Error Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>HTTP 404: TARGET_NOT_FOUND</span>
        </div>

        {/* Big Code */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-foreground">
            4<span className="text-cyan-500">0</span>4
          </h1>
          <p className="text-base sm:text-lg font-bold text-foreground">
            Device or Model Code Not Found
          </p>
          <p className="text-xs sm:text-sm font-mono text-muted max-w-sm mx-auto leading-relaxed">
            The device family or model suffix you requested does not exist in our index or has been relocated.
          </p>
        </div>

        {/* Terminal Diagnostic Box */}
        <div className="p-4 rounded-xl border border-border bg-surface text-left font-mono text-xs space-y-2 shadow-contrast-sm">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold border-b border-border pb-2">
            <Terminal className="w-4 h-4" />
            <span>Diagnostic Suggestions</span>
          </div>
          <ul className="space-y-1 text-muted text-[11px] list-disc list-inside">
            <li>Verify your exact model suffix in Settings &gt; About Phone</li>
            <li>Search without hyphens or spaces (e.g. &quot;G950F&quot; instead of &quot;SM-G950F&quot;)</li>
            <li>Search by brand or codename (e.g. &quot;cheetah&quot;, &quot;dreamlte&quot;)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Search Device Database</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-foreground font-mono text-xs font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

