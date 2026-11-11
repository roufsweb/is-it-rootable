'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SearchItem } from '@/types/device';
import {
  X,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface RootWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: SearchItem[];
}

export function RootWizardModal({ isOpen, onClose, devices }: RootWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDeviceSlug, setSelectedDeviceSlug] = useState<string>('');

  // Available brands sorted alphabetically
  const brands = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.brand))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [devices]);

  // Devices filtered by selected brand
  const filteredDevices = useMemo(() => {
    if (!selectedBrand) return [];
    return devices
      .filter((d) => d.brand.toLowerCase() === selectedBrand.toLowerCase())
      .sort((a, b) => b.release_year - a.release_year || a.name.localeCompare(b.name));
  }, [devices, selectedBrand]);

  // Currently selected device object
  const currentDevice = useMemo(() => {
    return devices.find((d) => d.slug === selectedDeviceSlug) || null;
  }, [devices, selectedDeviceSlug]);

  const resetWizard = () => {
    setStep(1);
    setSelectedBrand('');
    setSelectedDeviceSlug('');
  };

  if (!isOpen) return null;

  const isFull = currentDevice?.overallRoot === 'FULL';
  const isLocked = currentDevice?.overallRoot === 'LOCKED';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-surface/95 border border-border shadow-2xl overflow-hidden font-mono text-foreground flex flex-col max-h-[90vh] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Root &amp; Bootloader Wizard
              </h3>
              <p className="text-[11px] text-muted">
                Step {step} of 3 • Model-Suffix Sensitive Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Monochromatic Progress Bar */}
        <div className="w-full bg-surface-elevated h-1">
          <div
            className="h-1 bg-foreground transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* STEP 1: Select Brand */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="text-xs uppercase font-bold text-muted tracking-wider block mb-1">
                  1. Select Manufacturer / Brand:
                </label>
                <p className="text-[11px] text-muted mb-3">
                  Bootloader unlock policies differ wildly between OEMs (e.g. Google Pixel vs Samsung vs Sony).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setSelectedDeviceSlug('');
                      setStep(2);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedBrand === brand
                        ? 'bg-foreground text-background border-foreground shadow-tactile-sm'
                        : 'bg-surface-elevated/70 border-border text-foreground hover:border-border-hover hover:bg-surface-elevated'
                    }`}
                  >
                    <span>{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Device Model */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs uppercase font-bold text-muted tracking-wider block mb-1">
                    2. Select Your {selectedBrand} Model:
                  </label>
                  <p className="text-[11px] text-muted">
                    Choose your exact hardware family from the database.
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] text-muted hover:text-foreground underline cursor-pointer"
                >
                  Change Brand
                </button>
              </div>

              <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                {filteredDevices.map((dev) => (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeviceSlug(dev.slug);
                      setStep(3);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      selectedDeviceSlug === dev.slug
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-surface-elevated/60 border-border text-foreground hover:bg-surface-elevated hover:border-border-hover'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{dev.name}</div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {dev.release_year} • {dev.soc || 'Standard SoC'} • {dev.variantsCount} variants
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Model Suffix & Instant Verdict */}
          {step === 3 && currentDevice && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted">
                    {currentDevice.brand} • {currentDevice.release_year}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-foreground">
                    {currentDevice.name}
                  </h4>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-[11px] text-muted hover:text-foreground underline cursor-pointer"
                >
                  Change Model
                </button>
              </div>

              {/* Functional Alert Banner (Emerald / Amber / Rose) */}
              <div
                className={`p-4 rounded-xl border ${
                  isFull
                    ? 'verdict-container-full text-emerald-600 dark:text-emerald-400'
                    : isLocked
                    ? 'verdict-container-locked text-rose-600 dark:text-rose-400'
                    : 'verdict-container-conditional text-amber-600 dark:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-black text-sm sm:text-base">
                  {isFull ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  ) : isLocked ? (
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  <span>
                    Verdict:{' '}
                    {isFull
                      ? 'Fully Rootable & Unlockable'
                      : isLocked
                      ? 'Permanently Locked Hardware'
                      : 'Conditional (Firmware / Bit Check)'}
                  </span>
                </div>
                <p className="text-xs font-mono leading-relaxed opacity-90 text-foreground">
                  {isFull
                    ? 'This device features an OEM-unlockable bootloader. Root can be achieved with KernelSU (GKI) or Magisk.'
                    : isLocked
                    ? 'Carrier/hardware e-fuse lockout prevents bootloader unlocking. Fastboot flashing unlock will fail.'
                    : 'Unlockability depends on the current bootloader binary bit version and regional sub-model.'}
                </p>
              </div>

              {/* Exact Model Suffixes Checker */}
              <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border space-y-2">
                <div className="text-[10px] uppercase font-bold text-muted">
                  Known Regional Suffixes:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentDevice.rawModels.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-background border border-border text-foreground text-xs font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features Matrix: Monochromatic Glass */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-elevated/40 border border-border">
                  <div className="text-[10px] text-muted uppercase font-bold">DisplayPort / DeX</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {currentDevice.usb_video_out ? 'Supported (Alt Mode)' : 'USB 2.0 (No Video)'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-elevated/40 border border-border">
                  <div className="text-[10px] text-muted uppercase font-bold">Custom ROMs</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {currentDevice.custom_roms && currentDevice.custom_roms.length > 0
                      ? currentDevice.custom_roms[0]
                      : 'None verified'}
                  </div>
                </div>
              </div>

              {/* CTA Action: High-Contrast Monochromatic Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resetWizard}
                  className="px-3 py-2 rounded-xl border border-border bg-surface-elevated hover:bg-border text-muted hover:text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>

                <Link
                  href={`/device/${currentDevice.slug}/`}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-tactile-sm ml-auto"
                >
                  <span>View Full Device Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
