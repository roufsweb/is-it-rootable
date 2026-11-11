import React from 'react';
import Link from 'next/link';
import { SearchItem } from '@/types/device';
import { StatusBadge } from './StatusBadge';
import { HardwareBadges } from './HardwareBadges';
import {
  ChevronRight,
  Cpu,
  Layers,
  Disc,
  Tablet,
  Smartphone,
  Gamepad2,
  FoldVertical,
} from 'lucide-react';

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
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border font-bold">
          <Tablet className="w-3 h-3" />
          <span>Tablet</span>
        </span>
      );
    }
    if (device.form_factor === 'foldable') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border font-bold">
          <FoldVertical className="w-3 h-3" />
          <span>Foldable</span>
        </span>
      );
    }
    if (device.form_factor === 'handheld') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border font-bold">
          <Gamepad2 className="w-3 h-3" />
          <span>Handheld</span>
        </span>
      );
    }
    return null;
  };

  return (
    <Link
      href={`/device/${device.slug}/`}
      className="group relative flex flex-col justify-between rounded-xl border border-border hover:border-border-hover p-4 sm:p-5 transition-all duration-200 bg-surface/85 hover:bg-surface-elevated/90 backdrop-blur-sm shadow-tactile-card hover:shadow-tactile-hover"
    >
      <div>
        {/* Top Header: Brand, Release Year, Form Factor & Status Badge */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted font-bold tracking-wider mb-1">
              <span>{device.brand.toUpperCase()}</span>
              <span className="opacity-40">•</span>
              <span>{device.release_year}</span>
              {formFactorBadge()}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground transition-colors truncate">
              {device.name}
            </h3>
          </div>
          <div className="shrink-0">
            <StatusBadge status={device.overallRoot} size="sm" />
          </div>
        </div>

        {/* SoC & Codenames */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-mono text-muted mb-3">
          {device.soc && (
            <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
              <Cpu className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">{device.soc}</span>
            </span>
          )}
          {device.codenames && (
            <span className="text-muted/80 text-xs">
              [{device.codenames.split(' ').slice(0, 2).join(', ')}]
            </span>
          )}
        </div>

        {/* Bento Split Metric Grid: Functional Status Alerts Only */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-surface-elevated/50 border border-border my-3">
          <div className="min-w-0">
            <div className="text-xs font-mono text-muted uppercase tracking-wider font-bold truncate">
              Bootloader &amp; Root
            </div>
            <div
              className={`text-sm sm:text-base font-black truncate mt-0.5 ${
                isFull
                  ? 'text-emerald-500'
                  : isLocked
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {isFull ? 'Full Root' : isLocked ? 'Hardware Locked' : 'Conditional Bit'}
            </div>
            <div className="text-xs font-mono text-muted truncate mt-0.5">
              {isFull ? 'KernelSU / Magisk' : isLocked ? 'Carrier e-fuse' : 'Firmware Bit check'}
            </div>
          </div>

          <div className="min-w-0 border-l border-border pl-2.5 sm:pl-3">
            <div className="text-xs font-mono text-muted uppercase tracking-wider font-bold truncate">
              DisplayPort / DeX
            </div>
            <div
              className={`text-sm sm:text-base font-black truncate mt-0.5 ${
                device.usb_video_out ? 'text-foreground' : 'text-muted'
              }`}
            >
              {device.usb_video_out
                ? device.desktop_mode
                  ? 'DeX / Desktop Mode'
                  : 'DP Alt Mode'
                : 'USB 2.0 (No DP)'}
            </div>
            <div className="text-xs font-mono text-muted truncate mt-0.5">
              {device.usb_video_out ? 'External Monitor OK' : 'Charge / Data only'}
            </div>
          </div>
        </div>

        {/* High-Contrast Highlighted Models Box */}
        <div className="mb-3 p-2.5 rounded-lg bg-surface-elevated/40 border border-border/80">
          <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1.5 font-bold">
            Exact Model Suffixes:
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {device.rawModels.slice(0, 4).map((m) => (
              <span
                key={m}
                className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded bg-background text-foreground font-bold border border-border shadow-2xs"
              >
                {m}
              </span>
            ))}
            {device.rawModels.length > 4 && (
              <span className="font-mono text-xs sm:text-sm px-2 py-1 text-muted font-bold">
                +{device.rawModels.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Custom ROM Support Badges: Monochromatic Glass */}
        {device.custom_roms && device.custom_roms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted bg-surface-elevated px-2.5 py-1 rounded border border-border">
              <Disc className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="text-foreground font-medium">{device.custom_roms[0]}</span>
            </span>
            {device.custom_roms.length > 1 && (
              <span className="text-xs font-mono text-muted font-medium">
                +{device.custom_roms.length - 1} ROMs
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: Hardware Badges & Variants */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2 mt-2">
        <HardwareBadges features={hardwareFeatures} compact />

        <div className="flex items-center gap-1 text-xs sm:text-sm font-mono text-muted group-hover:text-foreground font-bold ml-auto shrink-0">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {device.variantsCount} {device.variantsCount === 1 ? 'variant' : 'variants'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
