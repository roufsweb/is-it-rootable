'use client';

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Cpu,
  Lock,
  Unlock,
  Layers,
  Info,
} from 'lucide-react';
import { RootStatus, BootloaderStatus } from '@/types/device';

interface RootGuideSectionProps {
  brand: string;
  name: string;
  codename?: string;
  exactModel?: string;
  rootStatus: RootStatus;
  bootloaderStatus: BootloaderStatus;
  unlockMethod?: string;
  rootMethods: string[];
}

export function RootGuideSection({
  brand,
  name,
  codename,
  exactModel,
  rootStatus,
  bootloaderStatus,
  unlockMethod,
  rootMethods,
}: RootGuideSectionProps) {
  const isLocked = rootStatus === 'LOCKED' || bootloaderStatus === 'NO';
  const isSamsung = brand.toLowerCase().includes('samsung');
  const isXiaomi =
    brand.toLowerCase().includes('xiaomi') ||
    brand.toLowerCase().includes('redmi') ||
    brand.toLowerCase().includes('poco');
  const isGoogle = brand.toLowerCase().includes('google');
  const isOnePlus = brand.toLowerCase().includes('oneplus');
  const isMotorola = brand.toLowerCase().includes('motorola');
  const isSony = brand.toLowerCase().includes('sony');

  const displayName = exactModel ? `${name} (${exactModel})` : `${brand} ${name}`;

  if (isLocked) {
    return (
      <section className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Root & Bootloader Status: Permanently Locked
          </h2>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-rose-400/50 bg-rose-50/60 dark:bg-rose-950/20 text-foreground space-y-4 shadow-contrast-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-base text-rose-900 dark:text-rose-200">
                Why is {displayName} Not Rootable?
              </h3>
              <p className="text-sm font-mono leading-relaxed text-muted font-medium">
                This device variant is locked down by OEM firmware and carrier security policies. The bootloader rejects unsigned kernel and recovery partitions, and the hardware fuses (e.g., Knox or Qualcomm Secure Boot) prevent unauthorized binary execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 font-mono text-sm">
            <div className="p-4 rounded-xl border border-border bg-surface">
              <div className="font-bold text-foreground mb-1 text-base">Carrier Lockdown</div>
              <p className="text-muted leading-relaxed font-medium">
                Carrier variants (AT&T, Verizon, T-Mobile, or Sprint) mandate permanently disabled bootloader unlock commands in vendor fastboot.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-surface">
              <div className="font-bold text-foreground mb-1 text-base">Recommended Alternatives</div>
              <p className="text-muted leading-relaxed font-medium">
                Use <span className="text-cyan-600 dark:text-cyan-400 font-bold">Shizuku</span> with ADB permissions to freeze bloatware, grant app permissions, and customize system settings without root.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Complete Root & Bootloader Guide for {displayName}
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
          Verified Guide
        </span>
      </div>

      {/* Inverted Pyramid Quick Answer / Featured Snippet Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-contrast-sm">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
              Quick Answer (AI / Google Summary)
            </div>
            <p className="font-mono text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              Yes, the {displayName} can be rooted. First, enable OEM Unlocking in Developer Options. Next, unlock the bootloader using {unlockMethod || 'standard fastboot'}. Finally, install root via{' '}
              {rootMethods.length > 0 ? rootMethods.join(' or ') : 'Magisk / KernelSU'} by patching the factory boot image.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Implementation Checklist */}
      <div className="space-y-3.5 font-mono text-sm">
        {/* Step 1: Preparation */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-base flex items-center justify-between">
                <span>Backup Data & Remove Google FRP Lock</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase">Mandatory</span>
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Unlocking the bootloader automatically triggers a complete device wipe (factory reset) for security. Remove all Google and OEM accounts from Settings to prevent Factory Reset Protection (FRP) lockout.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Developer Options */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-base">
                Enable Developer Options & OEM Unlocking
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Open <code className="bg-surface-elevated px-2 py-0.5 rounded text-foreground font-bold">Settings &gt; About Phone</code> and tap{' '}
                <span className="text-foreground font-bold">&quot;Build Number&quot; 7 times</span> until Developer Mode is active. Return to Settings &gt; Developer Options and toggle{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">&quot;OEM Unlocking&quot;</span> and{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">&quot;USB Debugging&quot;</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Bootloader Mode & Unlock */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-base">
                {isSamsung ? 'Enter Download Mode & Device Unlock' : 'Reboot into Bootloader / Fastboot'}
              </div>
              <p className="text-muted leading-relaxed font-medium">
                {isSamsung ? (
                  <>
                    Power off your Samsung device. Hold <span className="text-foreground font-bold">Volume Down + Volume Up</span> while connecting the USB cable to a PC. In the turquoise Download screen, <span className="text-amber-600 dark:text-amber-400 font-bold">long-press Volume Up</span> to enter Device Unlock Mode, then press Volume Up to confirm the wipe.
                  </>
                ) : isXiaomi ? (
                  <>
                    Reboot phone into Fastboot mode (<span className="text-foreground font-bold">Volume Down + Power</span>). Connect to PC, bind your Mi Account in Developer Options, and run the official <span className="text-cyan-600 dark:text-cyan-400 font-bold">Mi Unlock Tool</span> (subject to OEM waiting period).
                  </>
                ) : isMotorola || isSony ? (
                  <>
                    Reboot into Fastboot mode (<span className="text-foreground font-bold">adb reboot bootloader</span>). Retrieve your device unlock data string with <code className="bg-surface-elevated px-1.5 py-0.5 rounded font-bold">fastboot oem get_unlock_data</code>, submit it to the official OEM unlock portal, and flash the received unlock key.
                  </>
                ) : (
                  <>
                    Reboot to fastboot mode via <code className="bg-surface-elevated px-1.5 py-0.5 rounded font-bold">adb reboot bootloader</code>. Connect phone to PC and execute:
                    <br />
                    <code className="inline-block mt-1 bg-surface-elevated px-2.5 py-1 rounded text-cyan-600 dark:text-cyan-400 font-bold">
                      fastboot flashing unlock
                    </code>{' '}
                    (or <code className="bg-surface-elevated px-1.5 py-0.5 rounded font-bold">fastboot oem unlock</code> for legacy devices). Confirm on the phone screen with the volume keys.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Root Binary Injection */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-sm">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-base">
                Inject Root via {rootMethods.length > 0 ? rootMethods.join(', ') : 'KernelSU / Magisk'}
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Extract the factory firmware for your exact build. Extract <code className="bg-surface-elevated px-1.5 py-0.5 rounded font-bold">boot.img</code> (or <code className="bg-surface-elevated px-1.5 py-0.5 rounded font-bold">init_boot.img</code> on Android 13+ devices). Patch the image using Magisk App or KernelSU Manager, transfer it to PC, and flash:
                <br />
                <code className="inline-block mt-1 bg-surface-elevated px-2.5 py-1 rounded text-emerald-600 dark:text-emerald-400 font-bold">
                  fastboot flash init_boot patched_boot.img
                </code>{' '}
                {isSamsung && ' (or repack as .tar and flash via Odin AP slot)'}.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Verification */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-sm">
              5
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="font-bold text-foreground text-base">
                Verify Superuser Permissions & Play Integrity
              </div>
              <p className="text-muted leading-relaxed font-medium">
                Reboot into system, open your root management app (KernelSU, APatch, or Magisk), and confirm that root privileges are active. Install <span className="text-foreground font-bold">PlayIntegrityFix</span> module to bypass Google Play Integrity and ensure banking applications function seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Safety & Security Impact Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-4 font-mono text-sm shadow-contrast-sm">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Security & Hardware Warnings Before Rooting</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Knox / Hardware Fuse */}
          <div className="p-3.5 rounded-xl border border-border bg-surface">
            <div className="font-bold text-foreground mb-1 text-base">
              {isSamsung ? 'Samsung Knox 0x1 Fuse' : 'OEM Hardware Fuse'}
            </div>
            <p className="text-muted leading-relaxed font-medium">
              {isSamsung
                ? 'Unlocking permanently burns the physical Knox e-fuse to 0x1. This cannot be reversed. Samsung Pay and Secure Folder will be permanently disabled.'
                : 'Unlocking marks the hardware tamper flag. Some regional warranties may be voided, though EU consumer laws protect hardware.'}
            </p>
          </div>

          {/* Google Play Integrity */}
          <div className="p-3.5 rounded-xl border border-border bg-surface">
            <div className="font-bold text-foreground mb-1 text-base">Play Integrity & Banking</div>
            <p className="text-muted leading-relaxed font-medium">
              Bootloader unlocking drops Play Integrity from MEETS_STRONG_INTEGRITY. Modern banking apps, Google Wallet, and McDonald&apos;s app require Zygisk + Shamiko + PlayIntegrityFix to bypass checks.
            </p>
          </div>

          {/* Widevine DRM */}
          <div className="p-3.5 rounded-xl border border-border bg-surface">
            <div className="font-bold text-foreground mb-1 text-base">Widevine DRM Downgrade</div>
            <p className="text-muted leading-relaxed font-medium">
              Certain devices (especially OnePlus, Xiaomi, and Sony) downgrade Widevine L1 to Widevine L3 upon unlocking, capping Netflix and Amazon Prime Video streaming to 720p or 480p.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

