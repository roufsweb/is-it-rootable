import React from 'react';
import Link from 'next/link';
import { Variant } from '@/types/device';
import { StatusBadge } from './StatusBadge';
import { Cpu, Terminal, ExternalLink, Shield, Key, Disc } from 'lucide-react';

interface VariantTableProps {
  variants: Variant[];
  brand: string;
  name: string;
}

export function VariantTable({ variants, brand, name }: VariantTableProps) {
  return (
    <div className="space-y-6">
      {variants.map((variant, index) => {
        const isLocked = variant.root_status === 'LOCKED' || variant.bootloader_unlockable === 'NO';
        const isFull = variant.root_status === 'FULL';

        return (
          <div
            key={`${variant.codename}-${index}`}
            className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-contrast-sm ${
              isLocked
                ? 'border-rose-400 dark:border-rose-900/60 bg-surface'
                : isFull
                ? 'border-emerald-400 dark:border-emerald-900/60 bg-surface'
                : 'border-amber-400 dark:border-amber-900/60 bg-surface'
            }`}
          >
            {/* Variant header banner */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b ${
                isLocked
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                  : isFull
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded bg-surface-elevated text-cyan-600 dark:text-cyan-300 font-bold border border-border">
                    {variant.codename}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {variant.region}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted flex-wrap">
                  <Cpu className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>SoC: <strong className="text-foreground">{variant.soc}</strong></span>
                  {variant.cpu_architecture && (
                    <>
                      <span className="opacity-40">•</span>
                      <span>Arch: <strong className="text-foreground">{variant.cpu_architecture}</strong></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-mono text-muted uppercase tracking-wider font-semibold">Root Verdict</div>
                </div>
                <StatusBadge status={variant.root_status} type="root" size="md" />
              </div>
            </div>

            {/* Variant body grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Models & Bootloader */}
              <div className="space-y-4">
                {/* Specific Models */}
                <div>
                  <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5 font-bold">
                    <Key className="w-4 h-4 text-cyan-500" />
                    Exact Model Sub-Codes (Click to inspect)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {variant.models.map((model) => (
                      <Link
                        key={model}
                        href={`/model/${encodeURIComponent(model.toLowerCase().replace(/[^a-z0-9]/g, '-'))}/`}
                        className="group inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-surface-elevated text-foreground font-bold border border-border hover:border-cyan-500 hover:text-cyan-500 transition-colors shadow-2xs"
                      >
                        <span>{model}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bootloader Status */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted flex items-center gap-1.5 font-bold">
                      <Shield className="w-4 h-4 text-cyan-500" />
                      Bootloader Unlockable
                    </h4>
                    <StatusBadge status={variant.bootloader_unlockable} type="bootloader" size="sm" />
                  </div>
                  <p className="text-xs sm:text-sm text-foreground font-mono bg-surface-elevated p-3 sm:p-3.5 rounded-lg border border-border leading-relaxed font-medium">
                    {variant.unlock_method}
                  </p>
                </div>
              </div>

              {/* Right Column: Root Methods, Recovery & ROMs */}
              <div className="space-y-4">
                {/* Root Methods */}
                <div>
                  <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5 font-bold">
                    <Terminal className="w-4 h-4 text-cyan-500" />
                    Supported Root Methods
                  </h4>
                  {variant.root_methods && variant.root_methods.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {variant.root_methods.map((method) => (
                        <span
                          key={method}
                          className="font-mono text-xs sm:text-sm px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 font-semibold"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-mono text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-bold italic">
                      None (Locked bootloader / Knox hardware lockdown)
                    </span>
                  )}
                </div>

                {/* Custom ROMs Ecosystem */}
                {variant.custom_roms && variant.custom_roms.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5 font-bold">
                      <Disc className="w-4 h-4 text-purple-500" />
                      Custom ROM Ecosystem
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {variant.custom_roms.map((rom) => (
                        <span
                          key={rom}
                          className="font-mono text-xs sm:text-sm px-3 py-1 rounded bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 font-semibold"
                        >
                          {rom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recovery & Custom Kernel */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                    <div className="text-xs font-mono text-muted uppercase tracking-wider font-semibold mb-1">Custom Recovery</div>
                    <div className="font-mono text-xs sm:text-sm text-foreground font-bold">
                      {variant.custom_recovery || 'None'}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                    <div className="text-xs font-mono text-muted uppercase tracking-wider font-semibold mb-1">Kernel Support</div>
                    <div className="font-mono text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 font-bold">
                      {variant.custom_kernel_support || 'NONE'}
                    </div>
                  </div>
                </div>

                {/* CPU Architecture & Cores Breakdown */}
                {variant.cpu_cores && (
                  <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                    <div className="text-xs font-mono text-muted uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
                      <span>CPU Microarchitecture</span>
                      {variant.cpu_architecture && (
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">{variant.cpu_architecture}</span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-foreground font-medium leading-relaxed">
                      {variant.cpu_cores}
                    </div>
                  </div>
                )}

                {/* Useful Links */}
                {variant.links && Object.keys(variant.links).length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-muted uppercase tracking-wider font-semibold mb-1.5">References & Guides</div>
                    <div className="flex flex-wrap gap-3">
                      {variant.links.xda && (
                        <a
                          href={variant.links.xda}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                        >
                          <span>XDA Forum</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {variant.links.lineageos && (
                        <a
                          href={variant.links.lineageos}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                        >
                          <span>LineageOS Wiki</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {variant.links.twrp && (
                        <a
                          href={variant.links.twrp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                        >
                          <span>TWRP Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {variant.links.github && (
                        <a
                          href={variant.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                        >
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
