import React from 'react';
import Link from 'next/link';
import { SearchItem } from '@/types/device';
import { StatusBadge } from './StatusBadge';
import { HardwareBadges } from './HardwareBadges';
import { ChevronRight, Cpu, Layers, Disc, Tablet, Smartphone, Gamepad2, FoldVertical } from 'lucide-react';

interface DeviceCardProps {
  device: SearchItem;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const hardwareFeatures = {
    usb_video_out: device.usb_video_out,
    desktop_mode: device.desktop_mode,
    sdcard_slot: device.sdcard_slot,
    headphone_jack: device.headphone_jack,
  };

  const isFull = device.overallRoot === 'FULL';
  const isLocked = device.overallRoot === 'LOCKED';

  const formFactorBadge = () => {
    if (device.form_factor === 'tablet') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold">
          <Tablet className="w-2.5 h-2.5" />
          <span>Tablet</span>
        </span>
      );
    }
    if (device.form_factor === 'foldable') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 font-bold">
          <FoldVertical className="w-2.5 h-2.5" />
          <span>Foldable</span>
        </span>
      );
    }
    if (device.form_factor === 'handheld') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
          <Gamepad2 className="w-2.5 h-2.5" />
          <span>Handheld</span>
        </span>
      );
    }
    return null;
  };

  return (
    <Link
      href={`/device/${device.slug}/`}
      className={`group relative block rounded-xl border p-4 sm:p-5 transition-all duration-200 bg-surface hover:bg-surface-elevated shadow-sm hover:shadow-contrast-md ${
        isFull
          ? 'border-emerald-500/30 hover:border-emerald-500/60'
          : isLocked
          ? 'border-rose-500/30 hover:border-rose-500/60'
          : 'border-amber-500/30 hover:border-amber-500/60'
      }`}
    >
      <div className="flex flex-col h-full justify-between gap-3.5">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-2.5 mb-2">
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold tracking-wider mb-0.5">
                <span>{device.brand.toUpperCase()}</span>
                <span className="opacity-60">•</span>
                <span className="text-muted">{device.release_year}</span>
                {formFactorBadge()}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                {device.name}
              </h3>
            </div>
            <div className="shrink-0">
              <StatusBadge status={device.overallRoot} size="sm" />
            </div>
          </div>

          {/* SoC & Codenames */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-muted mb-3">
            {device.soc && (
              <span className="inline-flex items-center gap-1 text-foreground font-medium">
                <Cpu className="w-3 h-3 text-cyan-500 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{device.soc}</span>
              </span>
            )}
            {device.codenames && (
              <span className="text-muted/80 text-[11px]">
                [{device.codenames.split(' ').slice(0, 2).join(', ')}]
              </span>
            )}
          </div>

          {/* High-Contrast Highlighted Models Box */}
          <div className="mb-3 p-2 rounded-lg bg-surface-elevated border border-border/80">
            <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1 font-semibold">
              Exact Model Suffixes:
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {device.rawModels.slice(0, 4).map((m) => (
                <span
                  key={m}
                  className="font-mono text-xs px-2 py-0.5 rounded bg-background text-foreground font-bold border border-border shadow-2xs"
                >
                  {m}
                </span>
              ))}
              {device.rawModels.length > 4 && (
                <span className="font-mono text-xs px-1.5 py-0.5 text-muted font-semibold">
                  +{device.rawModels.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Custom ROM Support Badges */}
          {device.custom_roms && device.custom_roms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800/50">
                <Disc className="w-3 h-3 text-purple-500" />
                <span>{device.custom_roms[0]}</span>
              </span>
              {device.custom_roms.length > 1 && (
                <span className="text-[10px] font-mono text-muted">
                  +{device.custom_roms.length - 1} ROMs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Hardware Badges & Variants */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <HardwareBadges features={hardwareFeatures} compact />

          <div className="flex items-center gap-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 group-hover:underline font-semibold ml-auto shrink-0">
            <Layers className="w-3.5 h-3.5" />
            <span>{device.variantsCount} {device.variantsCount === 1 ? 'variant' : 'variants'}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
