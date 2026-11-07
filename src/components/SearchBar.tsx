'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchItem, RootStatus } from '@/types/device';
import { createMiniSearch } from '@/lib/search';
import { DeviceCard } from './DeviceCard';
import {
  Search,
  X,
  SlidersHorizontal,
  Monitor,
  HardDrive,
  Headphones,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Disc,
} from 'lucide-react';

interface SearchBarProps {
  initialDevices: SearchItem[];
}

export function SearchBar({ initialDevices }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RootStatus>('ALL');
  const [filterVideoOut, setFilterVideoOut] = useState(false);
  const [filterSdCard, setFilterSdCard] = useState(false);
  const [filterHeadphone, setFilterHeadphone] = useState(false);
  const [filterRoms, setFilterRoms] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('ALL');

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize MiniSearch once
  const miniSearch = useMemo(() => {
    return createMiniSearch(initialDevices);
  }, [initialDevices]);

  // Extract unique brands for brand select
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(initialDevices.map((d) => d.brand)));
    return brands.sort();
  }, [initialDevices]);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute filtered & ranked results
  const results = useMemo(() => {
    let items: SearchItem[] = initialDevices;

    // 1. Text Search with MiniSearch
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      const searchHits = miniSearch.search(trimmed);
      const hitMap = new Map<string, number>();
      searchHits.forEach((hit) => hitMap.set(hit.id, hit.score));

      // Filter and sort items by search score
      items = initialDevices
        .filter((item) => hitMap.has(item.id))
        .sort((a, b) => (hitMap.get(b.id) || 0) - (hitMap.get(a.id) || 0));
    }

    // 2. Filter by Brand
    if (brandFilter !== 'ALL') {
      items = items.filter((d) => d.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    // 3. Filter by Root Verdict
    if (statusFilter !== 'ALL') {
      items = items.filter((d) => {
        if (statusFilter === 'FULL') return d.overallRoot === 'FULL';
        if (statusFilter === 'CONDITIONAL') return d.overallRoot === 'CONDITIONAL';
        if (statusFilter === 'LOCKED') return d.overallRoot === 'LOCKED';
        return true;
      });
    }

    // 4. Feature filters
    if (filterVideoOut) {
      items = items.filter((d) => d.usb_video_out);
    }
    if (filterSdCard) {
      items = items.filter((d) => d.sdcard_slot);
    }
    if (filterHeadphone) {
      items = items.filter((d) => d.headphone_jack);
    }
    if (filterRoms) {
      items = items.filter((d) => d.custom_roms && d.custom_roms.length > 0);
    }

    return items;
  }, [
    query,
    statusFilter,
    brandFilter,
    filterVideoOut,
    filterSdCard,
    filterHeadphone,
    filterRoms,
    miniSearch,
    initialDevices,
  ]);

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    brandFilter !== 'ALL' ||
    filterVideoOut ||
    filterSdCard ||
    filterHeadphone ||
    filterRoms;

  const resetFilters = () => {
    setStatusFilter('ALL');
    setBrandFilter('ALL');
    setFilterVideoOut(false);
    setFilterSdCard(false);
    setFilterHeadphone(false);
    setFilterRoms(false);
    setQuery('');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* High-Contrast Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 sm:left-4 w-5 h-5 text-cyan-500 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search name ("Pixel 9", "Galaxy S24"), model ("SM-G950U", "G950F"), or ROM ("LineageOS")...'
            className="w-full pl-11 sm:pl-12 pr-20 sm:pr-24 py-3.5 sm:py-4 rounded-xl bg-surface border border-border text-foreground placeholder-muted font-mono text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-contrast-md"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-10 sm:right-12 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="absolute right-3.5 hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 rounded bg-surface-elevated font-semibold">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar with full mobile responsive touch controls */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-contrast-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Status Verdict Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-mono text-muted mr-1 flex items-center gap-1 font-bold shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
              Verdict:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`font-mono text-xs px-2.5 py-1 rounded transition-colors shrink-0 ${
                statusFilter === 'ALL'
                  ? 'bg-foreground text-background font-bold'
                  : 'bg-surface-elevated text-muted hover:text-foreground border border-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'FULL' ? 'ALL' : 'FULL')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 shrink-0 ${
                statusFilter === 'FULL'
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold'
                  : 'bg-surface-elevated text-emerald-700 dark:text-emerald-400 border-border hover:border-emerald-500/50'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Full Root
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'CONDITIONAL' ? 'ALL' : 'CONDITIONAL')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 shrink-0 ${
                statusFilter === 'CONDITIONAL'
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500 font-bold'
                  : 'bg-surface-elevated text-amber-700 dark:text-amber-400 border-border hover:border-amber-500/50'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Conditional
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'LOCKED' ? 'ALL' : 'LOCKED')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 shrink-0 ${
                statusFilter === 'LOCKED'
                  ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500 font-bold'
                  : 'bg-surface-elevated text-rose-700 dark:text-rose-400 border-border hover:border-rose-500/50'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              Locked
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline font-bold self-end sm:self-center"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Feature Toggles & Brand Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-border">
          {/* Hardware & ROM Feature Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-mono text-muted mr-1 font-bold shrink-0">Features:</span>
            <button
              onClick={() => setFilterRoms(!filterRoms)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 shrink-0 ${
                filterRoms
                  ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <Disc className="w-3 h-3 text-purple-500" />
              Custom ROMs
            </button>
            <button
              onClick={() => setFilterVideoOut(!filterVideoOut)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 shrink-0 ${
                filterVideoOut
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <Monitor className="w-3 h-3 text-cyan-500" />
              DisplayPort / DeX
            </button>
            <button
              onClick={() => setFilterSdCard(!filterSdCard)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 shrink-0 ${
                filterSdCard
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <HardDrive className="w-3 h-3 text-emerald-500" />
              microSD Slot
            </button>
            <button
              onClick={() => setFilterHeadphone(!filterHeadphone)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 shrink-0 ${
                filterHeadphone
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <Headphones className="w-3 h-3 text-amber-500" />
              3.5mm Jack
            </button>
          </div>

          {/* Brand select */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0 self-end sm:self-center">
            <span className="text-muted font-bold">Brand:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-surface-elevated border border-border rounded-md px-2 py-1 text-foreground font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Count Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted px-1">
        <div>
          Showing <span className="text-cyan-600 dark:text-cyan-400 font-bold">{results.length}</span> device {results.length === 1 ? 'family' : 'families'}
          {query ? <span> matching &ldquo;<span className="text-foreground font-bold">{query}</span>&rdquo;</span> : null}
        </div>
        <div className="text-muted text-[11px] hidden sm:block">
          Zero-latency MiniSearch Trie index
        </div>
      </div>

      {/* Results Grid: responsive from 1 column on mobile to 2 on tablet, 3 on desktop */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {results.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center space-y-4 bg-surface/50">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-elevated flex items-center justify-center text-muted">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">No matching devices found</h4>
            <p className="text-xs text-muted font-mono mt-1">
              Try searching by phone name (e.g. &ldquo;Galaxy&rdquo;, &ldquo;Pixel&rdquo;, &ldquo;OnePlus&rdquo;) or exact model code.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="font-mono text-xs px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold transition-colors"
          >
            Clear all filters & search
          </button>
        </div>
      )}
    </div>
  );
}
