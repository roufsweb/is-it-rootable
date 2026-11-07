import React from 'react';
import Link from 'next/link';
import { Variant } from '@/types/device';
import { StatusBadge } from './StatusBadge';
import { Cpu, Terminal, ExternalLink, Shield, HardDrive, Key } from 'lucide-react';

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
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isLocked
                ? 'border-rose-900/40 bg-surface/50'
                : isFull
                ? 'border-emerald-900/40 bg-surface/70'
                : 'border-amber-900/40 bg-surface/60'
            }`}
          >
            {/* Variant header banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 border-b border-slate-800/80 bg-slate-950/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium">
                    {variant.codename}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {variant.region}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>SoC: {variant.soc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Root Verdict</div>
                </div>
                <StatusBadge status={variant.root_status} type="root" size="md" />
              </div>
            </div>

            {/* Variant body grid */}
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Models & Bootloader */}
              <div className="space-y-4">
                {/* Specific Models */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Exact Model Sub-Codes (Click for SEO Breakdown)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {variant.models.map((model) => (
                      <Link
                        key={model}
                        href={`/model/${encodeURIComponent(model.toLowerCase())}/`}
                        className="group inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded bg-slate-900/90 text-cyan-300 border border-slate-800 hover:border-cyan-500 hover:bg-cyan-950/30 transition-colors"
                      >
                        <span>{model}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bootloader Status */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      Bootloader Unlockable
                    </h4>
                    <StatusBadge status={variant.bootloader_unlockable} type="bootloader" size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    {variant.unlock_method}
                  </p>
                </div>
              </div>

              {/* Right Column: Root Methods, Recovery & Kernels */}
              <div className="space-y-4">
                {/* Root Methods */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Supported Root Methods
                  </h4>
                  {variant.root_methods && variant.root_methods.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {variant.root_methods.map((method) => (
                        <span
                          key={method}
                          className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/50"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-rose-400 italic">
                      None (Locked bootloader / Knox hardware lockdown)
                    </span>
                  )}
                </div>

                {/* Recovery & Custom Kernel */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Custom Recovery</div>
                    <div className="font-mono text-xs text-white font-medium">
                      {variant.custom_recovery || 'None'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Kernel Support</div>
                    <div className="font-mono text-xs text-cyan-300 font-medium">
                      {variant.custom_kernel_support || 'NONE'}
                    </div>
                  </div>
                </div>

                {/* Useful Links */}
                {variant.links && Object.keys(variant.links).length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">References & Guides</div>
                    <div className="flex flex-wrap gap-2">
                      {variant.links.xda && (
                        <a
                          href={variant.links.xda}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                        >
                          <span>XDA Forum</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {variant.links.twrp && (
                        <a
                          href={variant.links.twrp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
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
                          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
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
