'use client';

import React from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Shield,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { RootStatus, BootloaderStatus } from '@/types/device';

interface UnrootGuideSectionProps {
  brand: string;
  name: string;
  codename?: string;
  exactModel?: string;
  rootStatus: RootStatus;
  bootloaderStatus: BootloaderStatus;
}

export function UnrootGuideSection({
  brand,
  name,
  codename,
  exactModel,
  rootStatus,
  bootloaderStatus,
}: UnrootGuideSectionProps) {
  const isLocked = rootStatus === 'LOCKED' || bootloaderStatus === 'NO';
  const isSamsung = brand.toLowerCase().includes('samsung');
  const isGoogle = brand.toLowerCase().includes('google');
  const isXiaomi =
    brand.toLowerCase().includes('xiaomi') ||
    brand.toLowerCase().includes('redmi') ||
    brand.toLowerCase().includes('poco');
  const isOnePlus = brand.toLowerCase().includes('oneplus');

  const displayName = exactModel ? `${name} (${exactModel})` : `${brand} ${name}`;

  if (isLocked) {
    return null; // Locked devices never needed unrooting guides
  }

  return (
    <section id="unroot-guide" className="space-y-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            How to Unroot &amp; Restore Stock Firmware on {displayName}
          </h2>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold">
          Restoration Guide
        </span>
      </div>

      {/* Google Quick Answer / Featured Snippet Box for Unroot Queries */}
      <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-cyan-50/40 dark:bg-cyan-950/20 shadow-contrast-sm">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
              Quick Answer: How to Unroot {displayName}
            </div>
            <p className="font-mono text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
              To unroot the {displayName}, open Magisk or KernelSU and select &quot;Complete Uninstall&quot;. Alternatively, flash your factory stock <code className="bg-surface-elevated px-1 py-0.5 rounded text-cyan-600 dark:text-cyan-300 font-bold">init_boot.img</code> (or <code className="bg-surface-elevated px-1 py-0.5 rounded text-cyan-600 dark:text-cyan-300 font-bold">boot.img</code>) via Fastboot or Odin. To fully return to factory state for warranty or trade-in, execute <code className="bg-surface-elevated px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">fastboot flashing lock</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Unroot Checklist */}
      <div className="space-y-3 font-mono text-xs">
        {/* Step 1: In-App Uninstallation */}
        <div className="p-4 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-sm flex items-center justify-between">
                <span>Method A: Automated In-App Root Removal</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase">Fastest</span>
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Open your superuser management application:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted text-[11px] pt-1">
                <li>
                  <strong className="text-foreground">Magisk:</strong> Tap <span className="text-cyan-600 dark:text-cyan-400 font-bold">&quot;Uninstall Magisk&quot;</span> &gt; <span className="text-foreground font-bold">&quot;Complete Uninstall&quot;</span>. Magisk will automatically restore your original stock boot image from its internal backup and reboot.
                </li>
                <li>
                  <strong className="text-foreground">KernelSU / APatch:</strong> Disable installed modules, uninstall the KernelSU manager APK, and flash stock kernel image below.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 2: Flash Factory Stock Boot Image */}
        <div className="p-4 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-sm flex items-center justify-between">
                <span>Method B: Manual Stock Boot Image Flash</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">100% Clean</span>
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Download the official factory stock firmware matching your exact build number. Extract the unpatched <code className="bg-surface-elevated px-1 py-0.5 rounded text-foreground font-bold">boot.img</code> or <code className="bg-surface-elevated px-1 py-0.5 rounded text-foreground font-bold">init_boot.img</code>.
              </p>
              {isSamsung ? (
                <div className="p-3 rounded-lg bg-surface-elevated border border-border text-[11px] space-y-1 mt-1">
                  <div className="text-foreground font-bold">Samsung Odin Restoration:</div>
                  <p className="text-muted leading-relaxed">
                    Flash the official 4-file factory stock firmware (BL, AP, CP, CSC) using Odin in Download Mode. This completely replaces all patched kernel partitions with Samsung certified binaries.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-surface-elevated border border-border text-[11px] space-y-1 mt-1">
                  <div className="text-foreground font-bold">Fastboot Command:</div>
                  <code className="block text-cyan-600 dark:text-cyan-300 font-bold bg-background p-2 rounded border border-border">
                    adb reboot bootloader<br />
                    fastboot flash init_boot stock_init_boot.img<br />
                    fastboot reboot
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Relocking Bootloader */}
        <div className="p-4 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-sm flex items-center justify-between">
                <span>Relocking the Bootloader (Optional / Resale)</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">Data Wipe Warning</span>
              </div>
              <p className="text-muted leading-relaxed font-medium">
                If preparing your {displayName} for trade-in, warranty claim, or resale, you can relock the bootloader once stock firmware is confirmed running.
              </p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1 mt-1">
                <div className="text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Important: Verify Stock OS Boots BEFORE Relocking!</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Never relock the bootloader while running a custom ROM or modified boot image, or the device will enter a hard brick state (Red Warning / Verified Boot Failure).
                </p>
                <code className="block text-amber-700 dark:text-amber-300 font-bold bg-background p-2 rounded border border-border mt-1">
                  fastboot flashing lock
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Verification */}
        <div className="p-4 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-sm">
                Verify Stock Play Protect Certification
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Open <span className="text-foreground font-bold">Google Play Store &gt; Settings &gt; About</span> and confirm that <span className="text-emerald-600 dark:text-emerald-400 font-bold">&quot;Device is certified&quot;</span>. Banking apps and Google Wallet will now run natively without any Magisk hide or Play Integrity spoofing modules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

