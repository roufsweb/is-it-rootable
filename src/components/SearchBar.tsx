'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Check
} from 'lucide-react';

interface SearchBarProps {
  initialDevices: SearchItem[];
}

type SortOption = 'NEWEST' | 'OLDEST' | 'NAME_AZ' | 'NAME_ZA' | 'ROOT_FIRST' | 'VARIANTS';

const POPULAR_BRANDS = [
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Motorola',
  'Lenovo',
  'Sony',
  'Ayn',
  'Retroid',
  'Asus',
  'POCO',
  'Nothing',
];

const SOC_FAMILIES = [
  { id: 'Snapdragon', label: 'Snapdragon', icon: '⚡' },
  { id: 'MediaTek', label: 'MediaTek', icon: '🔥' },
  { id: 'Exynos', label: 'Exynos', icon: '💎' },
  { id: 'Tensor', label: 'Tensor', icon: '🧠' },
  { id: 'Tegra', label: 'Tegra', icon: '🎮' },
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

  // Compute live counts per form factor
  const formFactorCounts = useMemo(() => {
    return {
      ALL: initialDevices.length,
      phone: initialDevices.filter((d) => d.form_factor === 'phone').length,
      tablet: initialDevices.filter((d) => d.form_factor === 'tablet').length,
      foldable: initialDevices.filter((d) => d.form_factor === 'foldable').length,
      handheld: initialDevices.filter((d) => d.form_factor === 'handheld').length,
    };
  }, [initialDevices]);

  // Extract unique brands
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(initialDevices.map((d) => d.brand)));
    return brands.sort();
  }, [initialDevices]);

  // Read URL query params on mount & handle browser back/forward (popstate)
  const syncFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    const q = params.get('q');
    const form = params.get('form') as FormFactor | 'ALL' | null;
    const status = params.get('status') as RootStatus | 'ALL' | null;
    const brand = params.get('brand');
    const soc = params.get('soc');
    const sort = params.get('sort') as SortOption | null;

    if (q !== null) setQuery(q);
    if (form && ['ALL', 'phone', 'tablet', 'foldable', 'handheld'].includes(form)) setFormFactor(form);
    if (status && ['ALL', 'FULL', 'CONDITIONAL', 'LOCKED'].includes(status)) setStatusFilter(status);
    if (brand) setBrandFilter(brand);
    if (soc) setSocFilter(soc);
    if (sort) setSortBy(sort);

    setFilterVideoOut(params.get('video') === '1');
    setFilterSdCard(params.get('sd') === '1');
    setFilterHeadphone(params.get('jack') === '1');
    setFilterRoms(params.get('rom') === '1');
  }, []);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [syncFromUrl]);

  // Sync state to URL params non-disruptively
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();

    if (query.trim()) params.set('q', query.trim());
    if (formFactor !== 'ALL') params.set('form', formFactor);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (brandFilter !== 'ALL') params.set('brand', brandFilter);
    if (socFilter !== 'ALL') params.set('soc', socFilter);
    if (sortBy !== 'NEWEST') params.set('sort', sortBy);
    if (filterVideoOut) params.set('video', '1');
    if (filterSdCard) params.set('sd', '1');
    if (filterHeadphone) params.set('jack', '1');
    if (filterRoms) params.set('rom', '1');

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

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
    miniSearch,
    initialDevices,
  ]);

  const hasActiveFilters =
    formFactor !== 'ALL' ||
    statusFilter !== 'ALL' ||
    brandFilter !== 'ALL' ||
    socFilter !== 'ALL' ||
    sortBy !== 'NEWEST' ||
    filterVideoOut ||
    filterSdCard ||
    filterHeadphone ||
    filterRoms ||
    query.trim().length > 0;

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

  const activeFilterCount =
    (formFactor !== 'ALL' ? 1 : 0) +
    (statusFilter !== 'ALL' ? 1 : 0) +
    (brandFilter !== 'ALL' ? 1 : 0) +
    (socFilter !== 'ALL' ? 1 : 0) +
    (sortBy !== 'NEWEST' ? 1 : 0) +
    (filterVideoOut ? 1 : 0) +
    (filterSdCard ? 1 : 0) +
    (filterHeadphone ? 1 : 0) +
    (filterRoms ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Form Factor Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          type="button"
          onClick={() => setFormFactor('ALL')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            formFactor === 'ALL'
              ? 'bg-cyan-500 text-background shadow-xs ring-2 ring-cyan-500/20'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Devices</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20">
            {formFactorCounts.ALL}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFormFactor(formFactor === 'phone' ? 'ALL' : 'phone')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            formFactor === 'phone'
              ? 'bg-cyan-500 text-background shadow-xs ring-2 ring-cyan-500/20'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-elevated'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phones</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20">
            {formFactorCounts.phone}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFormFactor(formFactor === 'tablet' ? 'ALL' : 'tablet')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            formFactor === 'tablet'
              ? 'bg-blue-500 text-background shadow-xs ring-2 ring-blue-500/20'
              : 'bg-surface border border-border text-muted hover:text-blue-500 hover:bg-surface-elevated'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablets &amp; Pads</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20">
            {formFactorCounts.tablet}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFormFactor(formFactor === 'foldable' ? 'ALL' : 'foldable')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            formFactor === 'foldable'
              ? 'bg-fuchsia-500 text-background shadow-xs ring-2 ring-fuchsia-500/20'
              : 'bg-surface border border-border text-muted hover:text-fuchsia-500 hover:bg-surface-elevated'
          }`}
        >
          <FoldVertical className="w-3.5 h-3.5" />
          <span>Foldables</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20">
            {formFactorCounts.foldable}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFormFactor(formFactor === 'handheld' ? 'ALL' : 'handheld')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            formFactor === 'handheld'
              ? 'bg-amber-500 text-background shadow-xs ring-2 ring-amber-500/20'
              : 'bg-surface border border-border text-muted hover:text-amber-500 hover:bg-surface-elevated'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Gaming Handhelds</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20">
            {formFactorCounts.handheld}
          </span>
        </button>
      </div>

      {/* 2. Cyberpunk Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 sm:left-4 w-5 h-5 text-cyan-500 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search name ("Tab S9", "Pixel Tablet", "Odin 2"), model ("SM-X710", "TB-320FC"), or ROM ("LineageOS")...'
            className="w-full pl-11 sm:pl-12 pr-20 sm:pr-24 py-3.5 sm:py-4 rounded-xl bg-surface border border-border text-foreground placeholder-muted font-mono text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-contrast-md"
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
          <div className="absolute right-3.5 hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 rounded bg-surface-elevated font-semibold">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* 3. Primary Filter Control Strip: Verdicts, Features, Advanced Toggle */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-3 font-mono text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Verdict Segmented Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-muted font-bold mr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
              Verdict:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-foreground text-background font-bold'
                  : 'bg-surface-elevated text-muted hover:text-foreground border border-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'FULL' ? 'ALL' : 'FULL')}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                statusFilter === 'LOCKED'
                  ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500 font-bold'
                  : 'bg-surface-elevated text-rose-700 dark:text-rose-400 border-border hover:border-rose-500/50'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              Locked
            </button>
          </div>

          {/* Quick Hardware Feature Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterVideoOut(!filterVideoOut)}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                filterVideoOut
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
              title="Native Type-C Screen Mirroring (DisplayPort Alt Mode) to TVs/monitors and Desktop Modes (Samsung DeX, Motorola Ready For)"
            >
              <Monitor className="w-3 h-3 text-cyan-500" />
              <span>Screen Mirroring / DeX</span>
            </button>
            <button
              onClick={() => setFilterRoms(!filterRoms)}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                filterRoms
                  ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
              title="Official LineageOS, TWRP, or active custom ROM support"
            >
              <Disc className="w-3 h-3 text-purple-500" />
              Custom ROMs
            </button>
            <button
              onClick={() => setFilterSdCard(!filterSdCard)}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                filterSdCard
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <HardDrive className="w-3 h-3 text-emerald-500" />
              microSD
            </button>
            <button
              onClick={() => setFilterHeadphone(!filterHeadphone)}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                filterHeadphone
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <Headphones className="w-3 h-3 text-amber-500" />
              3.5mm
            </button>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ml-auto ${
                showAdvanced || activeFilterCount > 0
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 font-bold'
                  : 'bg-surface-elevated text-muted border-border hover:text-foreground'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>More Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-500 text-background text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4. Collapsible Advanced Filters Drawer: SoC Family, Brands, Sort Options */}
        {showAdvanced && (
          <div className="pt-3 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
            {/* SoC Family Selector */}
            <div className="space-y-1.5">
              <label className="text-muted font-bold flex items-center gap-1 text-[11px]">
                <Cpu className="w-3 h-3 text-cyan-500" />
                Chipset / SoC Family:
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSocFilter('ALL')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                    socFilter === 'ALL'
                      ? 'bg-cyan-500 text-background'
                      : 'bg-surface-elevated text-muted border border-border hover:text-foreground'
                  }`}
                >
                  All SoCs
                </button>
                {SOC_FAMILIES.map((soc) => (
                  <button
                    key={soc.id}
                    type="button"
                    onClick={() => setSocFilter(socFilter === soc.id ? 'ALL' : soc.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer flex items-center gap-1 ${
                      socFilter === soc.id
                        ? 'bg-cyan-500 text-background font-bold'
                        : 'bg-surface-elevated text-muted border border-border hover:text-foreground'
                    }`}
                  >
                    <span>{soc.icon}</span>
                    <span>{soc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="space-y-1.5">
              <label className="text-muted font-bold flex items-center gap-1 text-[11px]">
                <span>Brand Manufacturer:</span>
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-foreground font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Brands ({availableBrands.length})</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order Selector */}
            <div className="space-y-1.5">
              <label className="text-muted font-bold flex items-center gap-1 text-[11px]">
                <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                Sort Results By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-foreground font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="NEWEST">Release Year (Newest First)</option>
                <option value="OLDEST">Release Year (Oldest First)</option>
                <option value="NAME_AZ">Device Name (A to Z)</option>
                <option value="NAME_ZA">Device Name (Z to A)</option>
                <option value="ROOT_FIRST">Root Freedom (Full Root First)</option>
                <option value="VARIANTS">Most Regional Variants</option>
              </select>
            </div>
          </div>
        )}

        {/* 5. Active Filters Pill Bar & Reset Action */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted font-bold">Active:</span>

              {formFactor !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
                  <span>Type: {formFactor}</span>
                  <button onClick={() => setFormFactor('ALL')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <span>Verdict: {statusFilter}</span>
                  <button onClick={() => setStatusFilter('ALL')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {brandFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                  <span>Brand: {brandFilter}</span>
                  <button onClick={() => setBrandFilter('ALL')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {socFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                  <span>SoC: {socFilter}</span>
                  <button onClick={() => setSocFilter('ALL')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterVideoOut && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
                  <span>Screen Mirroring / DeX</span>
                  <button onClick={() => setFilterVideoOut(false)} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterRoms && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                  <span>Custom ROMs</span>
                  <button onClick={() => setFilterRoms(false)} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterSdCard && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <span>microSD</span>
                  <button onClick={() => setFilterSdCard(false)} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterHeadphone && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                  <span>3.5mm Jack</span>
                  <button onClick={() => setFilterHeadphone(false)} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {query.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 text-foreground border border-border text-[11px] font-bold">
                  <span>Query: &ldquo;{query}&rdquo;</span>
                  <button onClick={() => setQuery('')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-bold text-[11px] cursor-pointer ml-auto shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. Live Result Count Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted px-1">
        <div>
          Showing <span className="text-cyan-600 dark:text-cyan-400 font-bold">{results.length}</span> of{' '}
          <span className="text-foreground font-semibold">{initialDevices.length}</span> devices
          {formFactor !== 'ALL' ? <span> ({formFactor}s)</span> : null}
          {brandFilter !== 'ALL' ? (
            <span>
              {' '}
              from <span className="text-foreground font-bold">{brandFilter}</span>
            </span>
          ) : null}
        </div>
        <div className="text-muted text-[11px] hidden sm:block">
          Instant &lt;15ms MiniSearch Trie Engine
        </div>
      </div>

      {/* 7. Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
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
              No devices match your active filters ({activeFilterCount} active). Try clearing one or more filters or broadening your search term.
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
