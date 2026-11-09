'use client';

import React from 'react';
import { Bookmark, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav
      aria-label="Table of Contents"
      className="p-3 sm:p-3.5 rounded-xl border border-border bg-surface/80 shadow-contrast-sm font-mono text-xs"
    >
      <div className="flex items-center gap-2 text-muted font-bold mb-2">
        <Bookmark className="w-3.5 h-3.5 text-cyan-500" />
        <span className="uppercase tracking-wider text-[10px]">Jump to Section</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-elevated hover:bg-cyan-500/10 text-muted hover:text-cyan-600 dark:hover:text-cyan-400 border border-border hover:border-cyan-500/30 transition-all font-semibold cursor-pointer"
          >
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

