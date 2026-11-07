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

  let colorClasses = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-350 dark:border-slate-700';
  let label = norm;
  let Icon = HelpCircle;

  if (type === 'root') {
    if (norm === 'FULL' || norm === 'YES') {
      colorClasses = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600/60 shadow-sm font-bold';
      label = 'FULL ROOT';
      Icon = ShieldCheck;
    } else if (norm === 'CONDITIONAL') {
      colorClasses = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600/60 shadow-sm font-bold';
      label = 'CONDITIONAL';
      Icon = AlertTriangle;
    } else if (norm === 'LOCKED' || norm === 'NO') {
      colorClasses = 'bg-rose-100 dark:bg-rose-950/50 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-600/60 shadow-sm font-bold';
      label = 'LOCKED';
      Icon = ShieldAlert;
    }
  } else {
    // Bootloader status
    if (norm === 'YES' || norm === 'FULL') {
      colorClasses = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700/60 font-semibold';
      label = 'UNLOCKABLE';
      Icon = Unlock;
    } else if (norm === 'CONDITIONAL') {
      colorClasses = 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700/60 font-semibold';
      label = 'CONDITIONAL';
      Icon = AlertTriangle;
    } else if (norm === 'NO' || norm === 'LOCKED') {
      colorClasses = 'bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-700/60 font-semibold';
      label = 'LOCKED';
      Icon = Lock;
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-mono tracking-wide',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-mono tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border transition-all duration-200 select-none ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
}
