import React from 'react';
import { RootStatus, BootloaderStatus } from '@/types/device';
import { ShieldCheck, AlertTriangle, ShieldAlert, Lock, Unlock, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RootStatus | BootloaderStatus | string;
  type?: 'root' | 'bootloader';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  type = 'root',
  size = 'md',
  showIcon = true,
}: StatusBadgeProps) {
  const norm = String(status).toUpperCase();

  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let label = norm;
  let Icon = HelpCircle;

  if (type === 'root') {
    if (norm === 'FULL' || norm === 'YES') {
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-full';
      label = 'FULL ROOT';
      Icon = ShieldCheck;
    } else if (norm === 'CONDITIONAL') {
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30 glow-conditional';
      label = 'CONDITIONAL';
      Icon = AlertTriangle;
    } else if (norm === 'LOCKED' || norm === 'NO') {
      colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30 glow-locked';
      label = 'LOCKED';
      Icon = ShieldAlert;
    }
  } else {
    // Bootloader status
    if (norm === 'YES' || norm === 'FULL') {
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      label = 'UNLOCKABLE';
      Icon = Unlock;
    } else if (norm === 'CONDITIONAL') {
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      label = 'CONDITIONAL';
      Icon = AlertTriangle;
    } else if (norm === 'NO' || norm === 'LOCKED') {
      colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      label = 'LOCKED';
      Icon = Lock;
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-mono font-medium',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-mono font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wider transition-all duration-200 ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
}
