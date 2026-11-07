import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllModels, getModelDetail } from '@/lib/devices';
import { StatusBadge } from '@/components/StatusBadge';
import { HardwareBadges } from '@/components/HardwareBadges';
import {
  ChevronLeft,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Cpu,
  Monitor,
  Terminal,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ModelPageProps {
  params: Promise<{ model: string }>;
}

export async function generateStaticParams() {
  const models = getAllModels();
  // Return unique model parameters
  const paramSet = new Set<string>();
  const params: Array<{ model: string }> = [];

  for (const m of models) {
    const slug = m.normalizedModel;
    if (!paramSet.has(slug)) {
      paramSet.add(slug);
      params.push({ model: slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { model } = await params;
  const detail = getModelDetail(model);

  if (!detail) {
    return {
      title: 'Model Not Found - IsItRootable',
    };
  }

  const { device, variant, model: exactModel } = detail;
  const methods = variant.root_methods.length > 0 ? variant.root_methods.join('/') : 'None';
  const deXStatus = device.hardware_features.usb_video_out ? 'YES' : 'NO';

  const title = `Can You Root ${device.name} (${exactModel})? Bootloader & Kernel Status - IsItRootable`;
  const description = `Check if the ${device.name} ${exactModel} can be rooted. Bootloader unlock status: ${variant.bootloader_unlockable}. Supported methods: ${methods}. DeX/DisplayPort support: ${deXStatus}.`;
  const canonical = `https://roufsweb.github.io/is-it-rootable/model/${detail.normalizedModel}/`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { model } = await params;
  const detail = getModelDetail(model);

  if (!detail) {
    notFound();
  }

  const { device, variant, model: exactModel } = detail;
  const isUnlockable = variant.bootloader_unlockable === 'YES';
  const isLocked = variant.root_status === 'LOCKED' || variant.bootloader_unlockable === 'NO';
  const isConditional = variant.root_status === 'CONDITIONAL' || variant.bootloader_unlockable === 'CONDITIONAL';

  // Other sibling variants in the same device family
  const otherVariants = device.variants.filter((v) => v.codename !== variant.codename || v.region !== variant.region);

  // Schema.org FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can you root the ${device.name} (${exactModel})?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isLocked
            ? `No. The ${exactModel} (${variant.region}) has a permanently locked bootloader or carrier restrictions preventing root access.`
            : isConditional
            ? `Conditionally. The ${exactModel} can be rooted subject to specific firmware/bit versions or unlock tokens (${variant.unlock_method}).`
            : `Yes. The ${exactModel} (${variant.region}) has an unlockable bootloader and can be rooted using ${variant.root_methods.join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does the ${exactModel} have an unlockable bootloader?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Bootloader unlock status: ${variant.bootloader_unlockable}. Method: ${variant.unlock_method}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does the ${device.name} (${exactModel}) support DisplayPort or DeX?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: device.hardware_features.usb_video_out
            ? `Yes. It supports wired USB-C video output${device.hardware_features.desktop_mode ? ` with ${device.hardware_features.desktop_mode}` : ''}.`
            : `No. Wired USB-C DisplayPort output is not supported on this device.`,
        },
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Google FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/device/${device.slug}/`} className="hover:text-cyan-400 transition-colors">
          {device.brand} {device.name}
        </Link>
        <span>/</span>
        <span className="text-cyan-300 font-semibold">{exactModel}</span>
      </div>

      {/* High-Impact SEO Answer Hero Banner */}
      <div
        className={`rounded-2xl border p-6 md:p-8 space-y-6 ${
          isLocked
            ? 'border-rose-900/60 bg-gradient-to-b from-rose-950/20 to-surface/80 glow-locked'
            : isUnlockable
            ? 'border-emerald-900/60 bg-gradient-to-b from-emerald-950/20 to-surface/80 glow-full'
            : 'border-amber-900/60 bg-gradient-to-b from-amber-950/20 to-surface/80 glow-conditional'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <span>{device.brand.toUpperCase()}</span>
              <span>•</span>
              <span className="text-slate-400">Model: {exactModel}</span>
              <span>•</span>
              <span className="text-slate-400">{variant.region}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Can You Root the {device.name} ({exactModel})?
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Root Verdict</div>
            <StatusBadge status={variant.root_status} type="root" size="lg" />
          </div>
        </div>

        {/* Direct Answer Summary Box */}
        <div className="p-4 md:p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-sm leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-white font-bold">
            {isLocked ? (
              <XCircle className="w-5 h-5 text-rose-400" />
            ) : isUnlockable ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <span>
              {isLocked
                ? `Direct Answer: NO. ${exactModel} cannot be rooted.`
                : isUnlockable
                ? `Direct Answer: YES. ${exactModel} is fully rootable.`
                : `Direct Answer: CONDITIONAL. Root depends on firmware version.`}
            </span>
          </div>
          <p className="text-slate-300 text-xs md:text-sm">
            {isLocked
              ? `The ${exactModel} is a ${variant.region} model with a permanently locked bootloader. Carrier e-fuse or Knox hardware policies block bootloader unlock toggling and flashing unsigned kernel images.`
              : isUnlockable
              ? `The international/unlocked ${exactModel} (${variant.region}) features an unlockable bootloader (${variant.unlock_method}). It supports modern root solutions like ${variant.root_methods.join(
                  ', '
                )} with custom kernel support.`
              : `The ${exactModel} can be bootloader unlocked under specific conditions: ${variant.unlock_method}.`}
          </p>
        </div>
      </div>

      {/* Model Technical Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Bootloader & Root Deep Dive */}
        <div className="rounded-xl border border-slate-800 bg-surface/70 p-6 space-y-5">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Bootloader & Unlock Guide
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Bootloader Status:</span>
              <StatusBadge status={variant.bootloader_unlockable} type="bootloader" size="sm" />
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="text-slate-400 uppercase text-[10px]">Unlock Procedure</div>
              <div className="text-white font-medium">{variant.unlock_method}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="text-slate-400 uppercase text-[10px]">Supported Root Implementations</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {variant.root_methods && variant.root_methods.length > 0 ? (
                  variant.root_methods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/50"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-rose-400 italic">None supported</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Custom Recovery</div>
                <div className="text-white font-medium mt-0.5">{variant.custom_recovery || 'None'}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Kernel Support</div>
                <div className="text-cyan-300 font-medium mt-0.5">{variant.custom_kernel_support}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hardware & Chipset Specs */}
        <div className="rounded-xl border border-slate-800 bg-surface/70 p-6 space-y-5">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Chipset & Hardware Features
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Processor / SoC</div>
              <div className="text-cyan-300 font-bold text-sm">{variant.soc}</div>
              <div className="text-slate-500 text-[11px]">Codename: {variant.codename}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">USB-C Video Out & Desktop Mode</div>
              <div className="text-white font-semibold flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {device.hardware_features.usb_video_out
                    ? `Supported (${device.hardware_features.desktop_mode || 'DisplayPort Alt Mode'})`
                    : 'Not supported (No wired DisplayPort)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">MicroSD Slot</div>
                <div className="text-white font-medium mt-0.5">
                  {device.hardware_features.sdcard_slot ? 'YES (Expandable)' : 'NO (Fixed Storage)'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">3.5mm Headphone Jack</div>
                <div className="text-white font-medium mt-0.5">
                  {device.hardware_features.headphone_jack ? 'YES (Present)' : 'NO (USB-C / BT only)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sibling Model Comparison (e.g. Compare SM-G950U vs SM-G950F) */}
      {otherVariants.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Compare with Other {device.name} Variants
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-400">
            Ensure you have the right model before purchasing or modifying:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherVariants.map((ov) => (
              <div
                key={ov.codename}
                className="p-4 rounded-xl border border-slate-800 bg-surface/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 mr-2">
                      {ov.codename}
                    </span>
                    <span className="text-sm font-semibold text-white">{ov.region}</span>
                  </div>
                  <StatusBadge status={ov.root_status} type="root" size="sm" />
                </div>

                <div className="font-mono text-xs text-slate-400">
                  <span>SoC: {ov.soc}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {ov.models.map((m) => (
                    <Link
                      key={m}
                      href={`/model/${encodeURIComponent(m.toLowerCase().replace(/[^a-z0-9]/g, '-'))}/`}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 hover:border-cyan-500 transition-colors"
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Device Overview Banner Link */}
      <div className="p-4 rounded-xl border border-slate-800 bg-surface-elevated/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Looking for the full {device.brand} {device.name} overview?</div>
          <div className="text-xs font-mono text-slate-400">
            View side-by-side variant tables, custom ROM recovery links, and hardware documentation.
          </div>
        </div>
        <Link
          href={`/device/${device.slug}/`}
          className="font-mono text-xs px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
        >
          View Full {device.name} Guide →
        </Link>
      </div>
    </div>
  );
}
