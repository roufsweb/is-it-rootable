import React from 'react';
import Link from 'next/link';
import { SearchItem } from '@/types/device';
import { StatusBadge } from './StatusBadge';
import { HardwareBadges } from './HardwareBadges';
import { ChevronRight, Cpu, Layers } from 'lucide-react';

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

  return (
    <Link
      href={`/device/${device.slug}/`}
      className="group relative block rounded-xl border border-slate-800/80 bg-surface/70 hover:bg-surface-elevated/80 p-5 transition-all duration-200 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20"
    >
      <div className="flex flex-col h-full justify-between gap-4">
        {/* Top header row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/90 font-medium tracking-wider">
                <span>{device.brand.toUpperCase()}</span>
                <span>•</span>
                <span className="text-slate-400">{device.release_year}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {device.name}
              </h3>
            </div>
            <StatusBadge status={device.overallRoot} size="sm" />
          </div>

          {/* SoC & Codenames */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-3">
            {device.soc && (
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>{device.soc}</span>
              </span>
            )}
            {device.codenames && (
              <span className="text-slate-500">
                [{device.codenames.split(' ').slice(0, 3).join(', ')}]
              </span>
            )}
          </div>

          {/* Models preview */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {device.rawModels.slice(0, 4).map((m) => (
              <span
                key={m}
                className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
              >
                {m}
              </span>
            ))}
            {device.rawModels.length > 4 && (
              <span className="font-mono text-xs px-1.5 py-0.5 text-slate-500">
                +{device.rawModels.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom row: Hardware Badges & Variant count */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <HardwareBadges features={hardwareFeatures} compact />

          <div className="flex items-center gap-1 text-xs font-mono text-cyan-400/80 group-hover:text-cyan-300 transition-colors ml-auto">
            <Layers className="w-3.5 h-3.5" />
            <span>{device.variantsCount} {device.variantsCount === 1 ? 'variant' : 'variants'}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

