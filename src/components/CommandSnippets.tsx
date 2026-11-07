'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface CommandSnippetsProps {
  brand: string;
  codename: string;
  bootloaderUnlockable: string;
  unlockMethod: string;
}

export function CommandSnippets({
  brand,
  codename,
  bootloaderUnlockable,
  unlockMethod,
}: CommandSnippetsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const b = brand.toLowerCase();
  const isLocked = bootloaderUnlockable === 'NO';

  if (isLocked) {
    return (
      <div className="rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-4 font-mono text-xs text-rose-900 dark:text-rose-200">
        <div className="font-bold flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Fastboot Commands Disabled</span>
        </div>
        <p className="text-muted font-medium">
          This model has a permanently locked carrier bootloader. Flashing custom boot images or running fastboot unlock commands will be rejected with an authorization error.
        </p>
      </div>
    );
  }

  const getCommands = () => {
    if (b === 'google' || b === 'nothing') {
      return [
        { label: '1. Enable Developer Options & OEM Unlocking in Settings', cmd: null },
        { label: '2. Reboot device into Fastboot bootloader', cmd: 'adb reboot bootloader' },
        { label: '3. Execute unlock command (wipes data)', cmd: 'fastboot flashing unlock' },
        { label: '4. Optional (Critical partitions unlock)', cmd: 'fastboot flashing unlock_critical' },
      ];
    }
    if (b === 'oneplus') {
      return [
        { label: '1. Toggle OEM Unlocking in Developer Options', cmd: null },
        { label: '2. Reboot to Fastboot Mode', cmd: 'adb reboot bootloader' },
        { label: '3. Unlock bootloader command', cmd: 'fastboot flashing unlock' },
      ];
    }
    if (b === 'motorola') {
      return [
        { label: '1. Reboot into Fastboot Mode', cmd: 'adb reboot bootloader' },
        { label: '2. Request bootloader unlock string', cmd: 'fastboot oem get_unlock_data' },
        { label: '3. Submit string to Motorola Unlock portal to get key', cmd: null, link: 'https://motorola-global-portal.custhelp.com/app/standalone/bootloader/unlock-your-device-a' },
        { label: '4. Apply unlock key from email', cmd: 'fastboot oem unlock <YOUR_UNLOCK_KEY>' },
      ];
    }
    if (b === 'sony') {
      return [
        { label: '1. Check unlock allowed via *#*#7378423#*#* Service Menu', cmd: null },
        { label: '2. Request unlock code from Sony Open Devices portal', cmd: null, link: 'https://developer.sony.com/open-source/aosp-on-xperia-open-devices/get-started/unlock-bootloader' },
        { label: '3. Enter Fastboot Mode (Hold Vol Up + plug USB)', cmd: 'adb reboot bootloader' },
        { label: '4. Apply Sony unlock code', cmd: 'fastboot oem unlock 0x<YOUR_CODE>' },
      ];
    }
    if (b === 'xiaomi' || b === 'poco') {
      return [
        { label: '1. Bind Mi Account in Settings > Developer Options > Mi Unlock Status', cmd: null },
        { label: '2. Wait required timer (typically 168 hours / 7 days)', cmd: null },
        { label: '3. Reboot into Fastboot mode', cmd: 'adb reboot bootloader' },
        { label: '4. Connect to PC and run official Mi Unlock Tool application', cmd: null },
      ];
    }
    if (b === 'samsung') {
      return [
        { label: '1. Toggle OEM Unlocking in Developer Settings', cmd: null },
        { label: '2. Power off -> Hold Vol Up + Vol Down and connect USB cable', cmd: null },
        { label: '3. Long-press Vol Up to enter Device Unlock Mode and confirm wipe', cmd: null },
        { label: '4. Flash Magisk-patched AP image or TWRP tar via Odin in AP slot', cmd: null },
      ];
    }
    return [
      { label: '1. Enable OEM Unlocking in Settings', cmd: null },
      { label: '2. Reboot to bootloader', cmd: 'adb reboot bootloader' },
      { label: '3. Unlock bootloader', cmd: 'fastboot flashing unlock' },
    ];
  };

  const commands = getCommands();

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 space-y-3.5 shadow-contrast-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span>Fastboot & Bootloader Terminal Procedure</span>
        </h4>
        <span className="text-[10px] font-mono text-muted">Click code to copy</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {commands.map((step, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="text-muted font-medium">
              <span>{step.label}</span>
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline ml-2 font-bold"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {step.cmd ? (
              <button
                onClick={() => copyCommand(step.cmd!, idx)}
                className="group flex items-center gap-2 px-2.5 py-1 rounded bg-background border border-border hover:border-cyan-500 text-foreground font-bold transition-all text-[11px] self-start sm:self-center shrink-0 cursor-pointer shadow-2xs"
                title="Click to copy command"
              >
                <code>{step.cmd}</code>
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted group-hover:text-cyan-500" />
                )}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

