import React from 'react';
import searchData from '@/data/search-index.json';
import { SearchItem } from '@/types/device';
import { SearchBar } from '@/components/SearchBar';
import { Terminal, ShieldCheck, ShieldAlert, Cpu, Monitor, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const devices = searchData as SearchItem[];

  // Statistics calculation
  const totalFamilies = devices.length;
  const totalVariants = devices.reduce((acc, d) => acc + d.variantsCount, 0);
  const fullRootCount = devices.filter((d) => d.overallRoot === 'FULL').length;
  const conditionalCount = devices.filter((d) => d.overallRoot === 'CONDITIONAL').length;
  const lockedCount = devices.filter((d) => d.overallRoot === 'LOCKED').length;
  const videoOutCount = devices.filter((d) => d.usb_video_out).length;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative pt-6 pb-4 text-center md:text-left border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Model-Suffix Sensitive Android Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Can You <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300">Root</span> Your Android?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed max-w-2xl">
              Never get trapped by carrier lockdowns. Check exact regional model suffixes (e.g., Samsung{' '}
              <span className="text-emerald-400 font-bold">SM-G950F</span> vs locked{' '}
              <span className="text-rose-400 font-bold">SM-G950U</span>), custom kernel readiness, and USB-C DisplayPort/DeX capability.
            </p>
          </div>

          {/* Quick Stat Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5 font-mono text-xs max-w-md w-full">
            <div className="p-3 rounded-lg border border-slate-800 bg-surface/80">
              <div className="text-slate-400 text-[10px] uppercase">Device Families</div>
              <div className="text-xl font-bold text-white mt-0.5">{totalFamilies}</div>
              <div className="text-[10px] text-slate-500">{totalVariants} sub-variants</div>
            </div>

            <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20">
              <div className="text-emerald-400 text-[10px] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Full Root
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{fullRootCount}</div>
              <div className="text-[10px] text-emerald-500">Unrestricted</div>
            </div>

            <div className="p-3 rounded-lg border border-amber-900/40 bg-amber-950/20">
              <div className="text-amber-400 text-[10px] uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Conditional
              </div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{conditionalCount}</div>
              <div className="text-[10px] text-amber-500">Firmware/Token</div>
            </div>

            <div className="p-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20">
              <div className="text-cyan-400 text-[10px] uppercase flex items-center gap-1">
                <Monitor className="w-3 h-3" /> Video Out
              </div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">{videoOutCount}</div>
              <div className="text-[10px] text-cyan-500">DisplayPort / DeX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Search & Filter Component */}
      <section>
        <SearchBar initialDevices={devices} />
      </section>

      {/* Model Suffix Guide & Heuristics Section */}
      <section className="pt-8 border-t border-slate-800/80">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Essential Rule of Android Rooting: Model Suffix Sensitivity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Samsung Rule */}
            <div className="p-4 rounded-xl border border-slate-800 bg-surface/60 space-y-2">
              <div className="text-sm font-bold text-cyan-300">Samsung Regional Rule</div>
              <p className="text-slate-300 leading-relaxed">
                Samsung devices ending in <span className="text-rose-400 font-bold">U, U1, W</span> (North America) have locked bootloaders due to carrier Knox policy. International models ending in{' '}
                <span className="text-emerald-400 font-bold">F, B, N</span> are generally bootloader-unlockable on pre-One UI 8.
              </p>
            </div>

            {/* Google Pixel Rule */}
            <div className="p-4 rounded-xl border border-slate-800 bg-surface/60 space-y-2">
              <div className="text-sm font-bold text-cyan-300">Google Pixel Carrier Trap</div>
              <p className="text-slate-300 leading-relaxed">
                Factory Unlocked Google Pixels have the easiest fastboot unlocking process. However,{' '}
                <span className="text-rose-400 font-bold">Verizon / AT&T</span> carrier variants permanently disable the OEM Unlocking toggle in bootloader firmware.
              </p>
            </div>

            {/* Modern KernelSU & HyperOS */}
            <div className="p-4 rounded-xl border border-slate-800 bg-surface/60 space-y-2">
              <div className="text-sm font-bold text-cyan-300">KernelSU & Xiaomi HyperOS</div>
              <p className="text-slate-300 leading-relaxed">
                Modern GKI (Generic Kernel Image) kernels allow undetectable root via <span className="text-emerald-400 font-bold">KernelSU</span>. Xiaomi devices require a linked Mi account and 7-day waiting period.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

