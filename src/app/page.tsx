import React from 'react';
import searchData from '@/data/search-index.json';
import { SearchItem } from '@/types/device';
import { SearchBar } from '@/components/SearchBar';
import { Terminal, ShieldCheck, Cpu, Monitor, AlertTriangle, Disc } from 'lucide-react';

export default function HomePage() {
  const devices = searchData as SearchItem[];

  // Statistics calculation
  const totalFamilies = devices.length;
  const totalVariants = devices.reduce((acc, d) => acc + d.variantsCount, 0);
  const fullRootCount = devices.filter((d) => d.overallRoot === 'FULL').length;
  const conditionalCount = devices.filter((d) => d.overallRoot === 'CONDITIONAL').length;
  const lockedCount = devices.filter((d) => d.overallRoot === 'LOCKED').length;
  const videoOutCount = devices.filter((d) => d.usb_video_out).length;
  const romCount = devices.filter((d) => d.custom_roms && d.custom_roms.length > 0).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Section */}
      <section className="relative pt-2 sm:pt-6 pb-2 text-left border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Model-Suffix Sensitive Android Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Can You <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500">Root</span> Your Android?
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted font-mono leading-relaxed max-w-2xl font-medium">
              Never get trapped by carrier lockdowns. Check exact regional model suffixes (e.g., Samsung{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">SM-G950F</span> vs locked{' '}
              <span className="text-rose-700 dark:text-rose-400 font-bold">SM-G950U</span>), custom ROM availability, and USB-C DisplayPort/DeX capability.
            </p>
          </div>

          {/* Quick Stat Matrix: High-Contrast Containers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-2.5 font-mono text-xs max-w-lg w-full">
            <div className="p-3 rounded-xl border border-border bg-surface shadow-contrast-sm">
              <div className="text-muted text-[10px] uppercase font-bold">Device Families</div>
              <div className="text-xl sm:text-2xl font-black text-foreground mt-0.5">{totalFamilies}</div>
              <div className="text-[10px] text-muted">{totalVariants} sub-variants</div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-400/50 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-contrast-sm">
              <div className="text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Full Root
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">{fullRootCount}</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-500 font-semibold">Unlocked Freedom</div>
            </div>

            <div className="p-3 rounded-xl border border-purple-400/50 bg-purple-50/60 dark:bg-purple-950/20 shadow-contrast-sm">
              <div className="text-purple-800 dark:text-purple-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Disc className="w-3 h-3" /> Custom ROMs
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-400 mt-0.5">{romCount}</div>
              <div className="text-[10px] text-purple-700 dark:text-purple-500 font-semibold">Lineage / AOSP</div>
            </div>

            <div className="p-3 rounded-xl border border-cyan-400/50 bg-cyan-50/60 dark:bg-cyan-950/20 shadow-contrast-sm">
              <div className="text-cyan-800 dark:text-cyan-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Monitor className="w-3 h-3" /> Video Out
              </div>
              <div className="text-xl sm:text-2xl font-black text-cyan-800 dark:text-cyan-400 mt-0.5">{videoOutCount}</div>
              <div className="text-[10px] text-cyan-700 dark:text-cyan-500 font-semibold">DisplayPort / DeX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Search & Filter Component */}
      <section>
        <SearchBar initialDevices={devices} />
      </section>

      {/* Model Suffix Guide & Heuristics Section */}
      <section className="pt-6 sm:pt-8 border-t border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-mono font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span>Essential Rules of Android Rooting: Model Suffix Sensitivity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-xs font-mono">
            {/* Samsung Rule */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Samsung Regional Rule</div>
              <p className="text-muted leading-relaxed font-medium">
                Samsung models ending in <span className="text-rose-700 dark:text-rose-400 font-bold">U, U1, W</span> (North America) have locked bootloaders due to carrier Knox policy. International models ending in{' '}
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">F, B, N</span> are bootloader-unlockable on pre-One UI 8.
              </p>
            </div>

            {/* Google Pixel Rule */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Google Pixel Carrier Trap</div>
              <p className="text-muted leading-relaxed font-medium">
                Factory Unlocked Google Pixels have the fastest <code className="bg-surface-elevated px-1 py-0.5 rounded text-foreground font-bold">fastboot flashing unlock</code>. However,{' '}
                <span className="text-rose-700 dark:text-rose-400 font-bold">Verizon</span> variants permanently disable the OEM Unlocking toggle in bootloader firmware.
              </p>
            </div>

            {/* Modern KernelSU & Custom ROMs */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">KernelSU & Custom ROMs</div>
              <p className="text-muted leading-relaxed font-medium">
                Modern GKI kernels allow undetectable root via <span className="text-emerald-700 dark:text-emerald-400 font-bold">KernelSU</span>. Official LineageOS and GrapheneOS builds require verified bootloader states.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
