import React from 'react';
import { HardwareFeatures } from '@/types/device';
import { Monitor, Headphones, HardDrive } from 'lucide-react';

interface HardwareBadgesProps {
  features: HardwareFeatures;
  compact?: boolean;
}

export function HardwareBadges({ features, compact = false }: HardwareBadgesProps) {
  const getDisplayModeLabel = () => {
    if (!features.desktop_mode) return 'Type-C Mirror';
    const mode = features.desktop_mode.toLowerCase();
    if (mode.includes('dex')) return 'Samsung DeX';
    if (mode.includes('ready for') || mode.includes('smart connect')) return 'Ready For';
    if (mode.includes('workstation') || mode.includes('hyperos')) return 'HyperOS PC';
    if (mode.includes('studio') || mode.includes('redmagic')) return 'Studio 4K DP';
    if (mode.includes('rog') || mode.includes('realm')) return 'ROG DP 4K';
    if (mode.includes('canvas')) return 'Open Canvas';
    if (mode.includes('hub mode')) return 'Hub Mode DP';
    return 'Type-C Mirror';
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono">
      {/* Video Out / Type-C Screen Mirroring / DisplayPort */}
      {features.usb_video_out ? (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated text-foreground border border-border font-medium"
          title={`Type-C Screen Mirroring & DisplayPort Alt Mode: ${features.desktop_mode || 'Direct Screen Mirroring to TV/Monitor'}`}
        >
          <Monitor className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>{getDisplayModeLabel()}</span>
        </span>
      ) : null}

      {/* MicroSD Slot */}
      {features.sdcard_slot ? (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated text-muted border border-border font-medium"
          title="MicroSD Card Expansion Supported"
        >
          <HardDrive className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>microSD</span>
        </span>
      ) : null}

      {/* Headphone Jack */}
      {features.headphone_jack ? (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated text-muted border border-border font-medium"
          title="3.5mm Headphone Audio Jack Present"
        >
          <Headphones className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>3.5mm</span>
        </span>
      ) : null}
    </div>
  );
}
