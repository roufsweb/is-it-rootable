import React from 'react';
import { HardwareFeatures } from '@/types/device';
import { Monitor, Headphones, HardDrive, Cpu } from 'lucide-react';

interface HardwareBadgesProps {
  features: HardwareFeatures;
  compact?: boolean;
}

export function HardwareBadges({ features, compact = false }: HardwareBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
      {/* Video Out / DisplayPort */}
      {features.usb_video_out ? (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
          title={features.desktop_mode ? `DisplayPort Alt Mode: ${features.desktop_mode}` : 'USB-C DisplayPort Output Supported'}
        >
          <Monitor className="w-3 h-3 text-cyan-400" />
          <span>{features.desktop_mode ? features.desktop_mode.split(' ')[0] : 'DisplayPort'}</span>
        </span>
      ) : null}

      {/* MicroSD Slot */}
      {features.sdcard_slot ? (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 border border-slate-700/60"
          title="MicroSD Card Expansion Supported"
        >
          <HardDrive className="w-3 h-3 text-emerald-400" />
          <span>microSD</span>
        </span>
      ) : null}

      {/* Headphone Jack */}
      {features.headphone_jack ? (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 border border-slate-700/60"
          title="3.5mm Headphone Audio Jack Present"
        >
          <Headphones className="w-3 h-3 text-amber-400" />
          <span>3.5mm</span>
        </span>
      ) : null}
    </div>
  );
}
