'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchItem, RootStatus } from '@/types/device';
import { createMiniSearch } from '@/lib/search';
import { DeviceCard } from './DeviceCard';
import { Search, X, SlidersHorizontal, Monitor, HardDrive, Headphones, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface SearchBarProps {
  initialDevices: SearchItem[];
}

export function SearchBar({ initialDevices }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RootStatus>('ALL');
  const [filterVideoOut, setFilterVideoOut] = useState(false);
  const [filterSdCard, setFilterSdCard] = useState(false);
  const [filterHeadphone, setFilterHeadphone] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('ALL');

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize MiniSearch once
  const miniSearch = useMemo(() => {
    return createMiniSearch(initialDevices);
  }, [initialDevices]);

  // Extract unique brands for brand pills
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(initialDevices.map(d => d.brand)));
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
      searchHits.forEach(hit => hitMap.set(hit.id, hit.score));

      // Filter and sort items by search score
      items = initialDevices
        .filter(item => hitMap.has(item.id))
        .sort((a, b) => (hitMap.get(b.id) || 0) - (hitMap.get(a.id) || 0));
    }

    // 2. Filter by Brand
    if (brandFilter !== 'ALL') {
      items = items.filter(d => d.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    // 3. Filter by Root Verdict
    if (statusFilter !== 'ALL') {
      items = items.filter(d => {
        if (statusFilter === 'FULL') return d.overallRoot === 'FULL';
        if (statusFilter === 'CONDITIONAL') return d.overallRoot === 'CONDITIONAL';
        if (statusFilter === 'LOCKED') return d.overallRoot === 'LOCKED';
        return true;
      });
    }

    // 4. Feature filters
    if (filterVideoOut) {
      items = items.filter(d => d.usb_video_out);
    }
    if (filterSdCard) {
      items = items.filter(d => d.sdcard_slot);
    }
    if (filterHeadphone) {
      items = items.filter(d => d.headphone_jack);
    }

    return items;
  }, [
    query,
    statusFilter,
    brandFilter,
    filterVideoOut,
    filterSdCard,
    filterHeadphone,
    miniSearch,
    initialDevices,
  ]);

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    brandFilter !== 'ALL' ||
    filterVideoOut ||
    filterSdCard ||
    filterHeadphone;

  const resetFilters = () => {
    setStatusFilter('ALL');
    setBrandFilter('ALL');
    setFilterVideoOut(false);
    setFilterSdCard(false);
    setFilterHeadphone(false);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by phone name (e.g. "Galaxy S8", "Pixel 8"), exact model ("SM-G950U", "G950F"), or codename ("dreamlte")...'
            className="w-full pl-12 pr-24 py-3.5 md:py-4 rounded-xl bg-surface/90 border border-slate-700/80 text-white placeholder-slate-500 font-mono text-sm md:text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-xl"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-12 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="absolute right-4 hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded bg-slate-900">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800/80 bg-surface/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Verdict Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              Verdict:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`font-mono text-xs px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'FULL' ? 'ALL' : 'FULL')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
                statusFilter === 'FULL'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900/80 text-emerald-400/80 border-slate-800 hover:border-emerald-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Full Root
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'CONDITIONAL' ? 'ALL' : 'CONDITIONAL')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
                statusFilter === 'CONDITIONAL'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/80 text-amber-400/80 border-slate-800 hover:border-amber-800'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Conditional
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'LOCKED' ? 'ALL' : 'LOCKED')}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
                statusFilter === 'LOCKED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900/80 text-rose-400/80 border-slate-800 hover:border-rose-800'
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
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline self-end ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Feature Toggles & Brand Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Hardware Feature Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1">Hardware:</span>
            <button
              onClick={() => setFilterVideoOut(!filterVideoOut)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
                filterVideoOut
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3 h-3 text-cyan-400" />
              DisplayPort / DeX
            </button>
            <button
              onClick={() => setFilterSdCard(!filterSdCard)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
                filterSdCard
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3 h-3 text-emerald-400" />
              microSD Slot
            </button>
            <button
              onClick={() => setFilterHeadphone(!filterHeadphone)}
              className={`font-mono text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
                filterHeadphone
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3 h-3 text-amber-400" />
              3.5mm Jack
            </button>
          </div>

          {/* Brand select */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Brand:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500"
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
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <div>
          Showing <span className="text-cyan-400 font-semibold">{results.length}</span> device {results.length === 1 ? 'family' : 'families'}
          {query ? <span> matching &ldquo;<span className="text-white">{query}</span>&rdquo;</span> : null}
        </div>
        <div className="text-slate-500 text-[11px] hidden sm:block">
          Zero-latency client search powered by MiniSearch Trie
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">No matching devices found</h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Try searching by a broader phone name (e.g. &ldquo;Galaxy&rdquo;, &ldquo;Pixel&rdquo;, &ldquo;OnePlus&rdquo;) or exact model code.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="font-mono text-xs px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            Clear all filters & search
          </button>
        </div>
      )}
    </div>
  );
}

