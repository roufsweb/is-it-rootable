'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchItem, RootStatus, FormFactor } from '@/types/device';
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
  Smartphone,
  Tablet,
  FoldVertical,
  Gamepad2,
  Cpu,
  Layers,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Zap,
  Flame,
  Gem,
  Brain,
} from 'lucide-react';

interface SearchBarProps {
  initialDevices: SearchItem[];
}

type SortOption = 'NEWEST' | 'OLDEST' | 'NAME_AZ' | 'NAME_ZA' | 'ROOT_FIRST' | 'VARIANTS';

const SOC_FAMILIES = [
  { id: 'Snapdragon', label: 'Snapdragon', icon: Zap },
  { id: 'MediaTek', label: 'MediaTek', icon: Flame },
  { id: 'Exynos', label: 'Exynos', icon: Gem },
  { id: 'Tensor', label: 'Tensor', icon: Brain },
  { id: 'Tegra', label: 'Tegra', icon: Gamepad2 },
];

export function SearchBar({ initialDevices }: SearchBarProps) {
  // Primary Filter States
  const [query, setQuery] = useState('');
  const [formFactor, setFormFactor] = useState<'ALL' | FormFactor>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RootStatus>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [socFilter, setSocFilter] = useState<string>('ALL');

  // Feature Toggles
  const [filterVideoOut, setFilterVideoOut] = useState(false);
  const [filterSdCard, setFilterSdCard] = useState(false);
  const [filterHeadphone, setFilterHeadphone] = useState(false);
  const [filterRoms, setFilterRoms] = useState(false);

  // Sorting & Advanced Drawer
  const [sortBy, setSortBy] = useState<SortOption>('NEWEST');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Compute live global counts for filter pills (Bento pill indicators)
  const stats = useMemo(() => {
    return {
      all: initialDevices.length,
      fullRoot: initialDevices.filter((d) => d.overallRoot === 'FULL').length,
      conditional: initialDevices.filter((d) => d.overallRoot === 'CONDITIONAL').length,
      locked: initialDevices.filter((d) => d.overallRoot === 'LOCKED').length,
      videoOut: initialDevices.filter((d) => d.usb_video_out).length,
      roms: initialDevices.filter((d) => d.custom_roms && d.custom_roms.length > 0).length,
      phone: initialDevices.filter((d) => d.form_factor === 'phone').length,
      tablet: initialDevices.filter((d) => d.form_factor === 'tablet').length,
      foldable: initialDevices.filter((d) => d.form_factor === 'foldable').length,
      handheld: initialDevices.filter((d) => d.form_factor === 'handheld').length,
    };
  }, [initialDevices]);

  // List of unique brands sorted alphabetically
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(initialDevices.map((d) => d.brand))).filter(Boolean);
    return brands.sort((a, b) => a.localeCompare(b));
  }, [initialDevices]);

  // Read URL search params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const f = params.get('type') as FormFactor;
    const s = params.get('verdict') as RootStatus;
    const b = params.get('brand');
    const soc = params.get('soc');
    const sort = params.get('sort') as SortOption;

    if (q) setQuery(q);
    if (f && ['phone', 'tablet', 'foldable', 'handheld'].includes(f)) setFormFactor(f);
    if (s && ['FULL', 'CONDITIONAL', 'LOCKED'].includes(s)) setStatusFilter(s);
    if (b) setBrandFilter(b);
    if (soc) setSocFilter(soc);
    if (sort) setSortBy(sort);
    if (params.get('dp') === '1') setFilterVideoOut(true);
    if (params.get('sd') === '1') setFilterSdCard(true);
    if (params.get('audio') === '1') setFilterHeadphone(true);
    if (params.get('rom') === '1') setFilterRoms(true);
  }, []);

  // Sync state to URL params without full page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (formFactor !== 'ALL') params.set('type', formFactor);
    if (statusFilter !== 'ALL') params.set('verdict', statusFilter);
    if (brandFilter !== 'ALL') params.set('brand', brandFilter);
    if (socFilter !== 'ALL') params.set('soc', socFilter);
    if (sortBy !== 'NEWEST') params.set('sort', sortBy);
    if (filterVideoOut) params.set('dp', '1');
    if (filterSdCard) params.set('sd', '1');
    if (filterHeadphone) params.set('audio', '1');
    if (filterRoms) params.set('rom', '1');

    const str = params.toString();
    const newUrl = str ? `?${str}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [
    query,
    formFactor,
    statusFilter,
    brandFilter,
    socFilter,
    sortBy,
    filterVideoOut,
    filterSdCard,
    filterHeadphone,
    filterRoms,
  ]);

  // MiniSearch Index initialization
  const miniSearch = useMemo(() => {
    return createMiniSearch(initialDevices);
  }, [initialDevices]);

  // Keyboard shortcut '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          setQuery('');
          inputRef.current?.blur();
        }
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

      items = initialDevices
        .filter((item) => hitMap.has(item.id))
        .sort((a, b) => (hitMap.get(b.id) || 0) - (hitMap.get(a.id) || 0));
    }

    // 2. Filter by Form Factor
    if (formFactor !== 'ALL') {
      items = items.filter((d) => d.form_factor === formFactor);
    }

    // 3. Filter by Brand
    if (brandFilter !== 'ALL') {
      items = items.filter((d) => d.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    // 4. Filter by SoC Family
    if (socFilter !== 'ALL') {
      items = items.filter((d) => d.soc_family === socFilter);
    }

    // 5. Filter by Root Verdict
    if (statusFilter !== 'ALL') {
      items = items.filter((d) => d.overallRoot === statusFilter);
    }

    // 6. Feature filters
    if (filterVideoOut) items = items.filter((d) => d.usb_video_out);
    if (filterSdCard) items = items.filter((d) => d.sdcard_slot);
    if (filterHeadphone) items = items.filter((d) => d.headphone_jack);
    if (filterRoms) items = items.filter((d) => d.custom_roms && d.custom_roms.length > 0);

    // 7. Sort Order
    if (!trimmed) {
      items = [...items].sort((a, b) => {
        switch (sortBy) {
          case 'NEWEST':
            return b.release_year - a.release_year || a.name.localeCompare(b.name);
          case 'OLDEST':
            return a.release_year - b.release_year || a.name.localeCompare(b.name);
          case 'NAME_AZ':
            return a.name.localeCompare(b.name);
          case 'NAME_ZA':
            return b.name.localeCompare(a.name);
          case 'ROOT_FIRST': {
            const score = (r: RootStatus) => (r === 'FULL' ? 3 : r === 'CONDITIONAL' ? 2 : 1);
            return score(b.overallRoot) - score(a.overallRoot) || b.release_year - a.release_year;
          }
          case 'VARIANTS':
            return b.variantsCount - a.variantsCount;
          default:
            return 0;
        }
      });
    }

    return items;
  }, [
    initialDevices,
    query,
    miniSearch,
    formFactor,
    brandFilter,
    socFilter,
    statusFilter,
    filterVideoOut,
    filterSdCard,
    filterHeadphone,
    filterRoms,
    sortBy,
  ]);

  const resetFilters = () => {
    setQuery('');
    setFormFactor('ALL');
    setStatusFilter('ALL');
    setBrandFilter('ALL');
    setSocFilter('ALL');
    setSortBy('NEWEST');
    setFilterVideoOut(false);
    setFilterSdCard(false);
    setFilterHeadphone(false);
    setFilterRoms(false);
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    formFactor !== 'ALL' ||
    statusFilter !== 'ALL' ||
    brandFilter !== 'ALL' ||
    socFilter !== 'ALL' ||
    sortBy !== 'NEWEST' ||
    filterVideoOut ||
    filterSdCard ||
    filterHeadphone ||
    filterRoms;

  return (
    <div id="search-section" className="space-y-4 sm:space-y-5 w-full min-w-0 max-w-full overflow-hidden sm:overflow-visible">
      {/* 1. Full-Width Search Input (Monochromatic Glassmorphism) */}
      <div className="relative w-full min-w-0">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3.5 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search 350+ devices by model ("SM-S928B", "cheetah"), name ("Tab S9", "Pixel 9"), or ROM...'
            className="w-full pl-10 sm:pl-12 pr-16 sm:pr-24 py-3 sm:py-3.5 rounded-xl bg-surface/90 border border-border text-foreground placeholder-muted font-mono text-xs sm:text-sm focus:outline-none focus:border-border-hover focus:ring-1 focus:ring-white/10 transition-all shadow-tactile-sm"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-10 sm:right-12 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="absolute right-3 hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 rounded bg-surface-elevated font-semibold">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Category Filter Pills Bar (Inspired by studyabroad.rouf.top) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs w-full max-w-full">
        {/* All Devices Pill */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('ALL');
            setFilterVideoOut(false);
            setFilterRoms(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            statusFilter === 'ALL' && !filterVideoOut && !filterRoms
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <span>All Devices</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.all}
          </span>
        </button>

        {/* Full Root Pill with Emerald Dot */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'FULL' ? 'ALL' : 'FULL')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            statusFilter === 'FULL'
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Full Root</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.fullRoot}
          </span>
        </button>

        {/* Conditional Pill with Amber Dot */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'CONDITIONAL' ? 'ALL' : 'CONDITIONAL')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            statusFilter === 'CONDITIONAL'
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Conditional</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.conditional}
          </span>
        </button>

        {/* Locked Pill with Rose Dot */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'LOCKED' ? 'ALL' : 'LOCKED')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            statusFilter === 'LOCKED'
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>Locked</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.locked}
          </span>
        </button>

        {/* DisplayPort & DeX Pill */}
        <button
          type="button"
          onClick={() => setFilterVideoOut(!filterVideoOut)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            filterVideoOut
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <Monitor className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>DisplayPort / DeX</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.videoOut}
          </span>
        </button>

        {/* Custom ROMs Pill */}
        <button
          type="button"
          onClick={() => setFilterRoms(!filterRoms)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            filterRoms
              ? 'bg-foreground text-background shadow-tactile-sm'
              : 'bg-surface/80 border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <Disc className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>Custom ROMs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 dark:bg-white/20 font-extrabold">
            {stats.roms}
          </span>
        </button>
      </div>

      {/* 3. Secondary Bento Filter Toolbar (Grid on Tablet/Mobile) */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-tactile-card space-y-3 font-mono text-xs w-full min-w-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-end">
          {/* Dropdown 1: SORT */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-muted" />
              <span>Sort</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-2 text-foreground font-semibold text-xs focus:outline-none focus:border-border-hover cursor-pointer"
            >
              <option value="NEWEST">Release (Newest)</option>
              <option value="OLDEST">Release (Oldest)</option>
              <option value="NAME_AZ">Device Name (A-Z)</option>
              <option value="NAME_ZA">Device Name (Z-A)</option>
              <option value="ROOT_FIRST">Root Freedom First</option>
              <option value="VARIANTS">Most Variants</option>
            </select>
          </div>

          {/* Dropdown 2: BRAND */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1">
              <span>Brand</span>
            </label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-2 text-foreground font-semibold text-xs focus:outline-none focus:border-border-hover cursor-pointer"
            >
              <option value="ALL">All Brands ({availableBrands.length})</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 3: FORM FACTOR */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-muted" />
              <span>Form Factor</span>
            </label>
            <select
              value={formFactor}
              onChange={(e) => setFormFactor(e.target.value as 'ALL' | FormFactor)}
              className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-2 text-foreground font-semibold text-xs focus:outline-none focus:border-border-hover cursor-pointer"
            >
              <option value="ALL">All Types ({stats.all})</option>
              <option value="phone">Phones ({stats.phone})</option>
              <option value="tablet">Tablets &amp; Pads ({stats.tablet})</option>
              <option value="foldable">Foldables ({stats.foldable})</option>
              <option value="handheld">Gaming Handhelds ({stats.handheld})</option>
            </select>
          </div>

          {/* Dropdown 4: CHIPSET / SOC */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-muted" />
              <span>SoC Platform</span>
            </label>
            <select
              value={socFilter}
              onChange={(e) => setSocFilter(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-2 text-foreground font-semibold text-xs focus:outline-none focus:border-border-hover cursor-pointer"
            >
              <option value="ALL">All Chipsets</option>
              {SOC_FAMILIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hardware Feature Checkbox Row & Reset Toolbar */}
        <div className="pt-2.5 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterSdCard(!filterSdCard)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                filterSdCard
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'bg-surface-elevated/70 text-muted border-border hover:text-foreground'
              }`}
            >
              <HardDrive className="w-3 h-3 text-muted shrink-0" />
              <span>microSD Slot</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterHeadphone(!filterHeadphone)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                filterHeadphone
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'bg-surface-elevated/70 text-muted border-border hover:text-foreground'
              }`}
            >
              <Headphones className="w-3 h-3 text-muted shrink-0" />
              <span>3.5mm Jack</span>
            </button>
          </div>

          {/* Results Badge & Reset Action */}
          <div className="flex items-center gap-2.5 ml-auto">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-foreground font-bold">
              {results.length} of {initialDevices.length} Devices
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-border text-muted hover:text-foreground font-bold text-[11px] border border-border transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
          {results.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center space-y-4 bg-surface/50 font-mono">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-elevated flex items-center justify-center text-muted">
            <Search className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">No matching devices found</h4>
            <p className="text-xs text-muted mt-1 max-w-md mx-auto">
              No devices match your active filters. Try resetting filters or searching by a different model suffix.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
