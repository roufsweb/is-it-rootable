import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllModels, getModelDetail } from '@/lib/devices';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ChevronLeft,
  Terminal,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Monitor,
  Disc,
} from 'lucide-react';

interface ModelPageProps {
  params: Promise<{ model: string }>;
}

export async function generateStaticParams() {
  const models = getAllModels();
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

  const otherVariants = device.variants.filter((v) => v.codename !== variant.codename || v.region !== variant.region);

  const containerClass = isLocked
    ? 'verdict-container-locked'
    : isUnlockable
    ? 'verdict-container-full'
    : 'verdict-container-conditional';

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
    <div className="space-y-6 sm:space-y-8">
      {/* Google FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-muted flex-wrap">
        <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/device/${device.slug}/`} className="hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors">
          {device.brand} {device.name}
        </Link>
        <span>/</span>
        <span className="text-cyan-600 dark:text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-surface-elevated border border-border">
          {exactModel}
        </span>
      </div>

      {/* High-Impact SEO Answer Hero Banner */}
      <div className={`rounded-2xl p-5 sm:p-8 space-y-6 ${containerClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
              <span>{device.brand.toUpperCase()}</span>
              <span>•</span>
              <span className="text-muted">Model: {exactModel}</span>
              <span>•</span>
              <span className="text-muted">{variant.region}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground">
              Can You Root the {device.name} ({exactModel})?
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1">
            <div className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">Root Verdict</div>
            <StatusBadge status={variant.root_status} type="root" size="lg" />
          </div>
        </div>

        {/* Direct Answer Summary Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border font-mono text-sm leading-relaxed space-y-2 shadow-contrast-sm">
          <div className="flex items-center gap-2 text-foreground font-black text-base">
            {isLocked ? (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            ) : isUnlockable ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span>
              {isLocked
                ? `Direct Answer: NO. ${exactModel} cannot be rooted.`
                : isUnlockable
                ? `Direct Answer: YES. ${exactModel} is fully rootable.`
                : `Direct Answer: CONDITIONAL. Root depends on firmware version.`}
            </span>
          </div>
          <p className="text-muted text-xs sm:text-sm font-medium">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Bootloader & Root Deep Dive */}
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-5 shadow-contrast-sm">
          <h3 className="text-base font-bold text-foreground font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-500" />
            Bootloader & Unlock Guide
          </h3>

          <div className="space-y-3.5 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface-elevated border border-border">
              <span className="text-muted font-bold">Bootloader Status:</span>
              <StatusBadge status={variant.bootloader_unlockable} type="bootloader" size="sm" />
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <div className="text-muted uppercase text-[10px] font-bold">Unlock Procedure</div>
              <div className="text-foreground font-semibold leading-relaxed">{variant.unlock_method}</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <div className="text-muted uppercase text-[10px] font-bold">Supported Root Implementations</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {variant.root_methods && variant.root_methods.length > 0 ? (
                  variant.root_methods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 font-bold"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold italic">None supported</span>
                )}
              </div>
            </div>

            {/* Custom ROMs if applicable */}
            {variant.custom_roms && variant.custom_roms.length > 0 && (
              <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
                <div className="text-muted uppercase text-[10px] font-bold flex items-center gap-1">
                  <Disc className="w-3 h-3 text-purple-500" />
                  Custom ROM Support
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {variant.custom_roms.map((rom) => (
                    <span
                      key={rom}
                      className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 font-bold"
                    >
                      {rom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <div className="text-[10px] text-muted uppercase font-bold">Custom Recovery</div>
                <div className="text-foreground font-bold mt-0.5">{variant.custom_recovery || 'None'}</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <div className="text-[10px] text-muted uppercase font-bold">Kernel Support</div>
                <div className="text-cyan-600 dark:text-cyan-300 font-bold mt-0.5">{variant.custom_kernel_support}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hardware & Chipset Specs */}
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-5 shadow-contrast-sm">
          <h3 className="text-base font-bold text-foreground font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            Chipset & Hardware Features
          </h3>

          <div className="space-y-3.5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <div className="text-[10px] text-muted uppercase font-bold">Processor / SoC</div>
              <div className="text-cyan-600 dark:text-cyan-300 font-extrabold text-sm">{variant.soc}</div>
              <div className="text-muted text-[11px] font-medium">Codename: {variant.codename}</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <div className="text-[10px] text-muted uppercase font-bold">USB-C Video Out & Desktop Mode</div>
              <div className="text-foreground font-bold flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-cyan-500" />
                <span>
                  {device.hardware_features.usb_video_out
                    ? `Supported (${device.hardware_features.desktop_mode || 'DisplayPort Alt Mode'})`
                    : 'Not supported (No wired DisplayPort)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <div className="text-[10px] text-muted uppercase font-bold">MicroSD Slot</div>
                <div className="text-foreground font-bold mt-0.5">
                  {device.hardware_features.sdcard_slot ? 'YES (Expandable)' : 'NO (Fixed Storage)'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <div className="text-[10px] text-muted uppercase font-bold">3.5mm Headphone Jack</div>
                <div className="text-foreground font-bold mt-0.5">
                  {device.hardware_features.headphone_jack ? 'YES (Present)' : 'NO (USB-C / BT only)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sibling Model Comparison */}
      {otherVariants.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500" />
            <h3 className="text-lg font-bold text-foreground">
              Compare with Other {device.name} Variants
            </h3>
          </div>
          <p className="font-mono text-xs text-muted font-medium">
            Verify your exact model suffix before attempting any modification:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherVariants.map((ov) => (
              <div
                key={ov.codename}
                className="p-4 rounded-xl border border-border bg-surface space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-elevated text-cyan-600 dark:text-cyan-300 font-bold mr-2 border border-border">
                      {ov.codename}
                    </span>
                    <span className="text-sm font-bold text-foreground">{ov.region}</span>
                  </div>
                  <StatusBadge status={ov.root_status} type="root" size="sm" />
                </div>

                <div className="font-mono text-xs text-muted font-medium">
                  <span>SoC: <strong className="text-foreground">{ov.soc}</strong></span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {ov.models.map((m) => (
                    <Link
                      key={m}
                      href={`/model/${encodeURIComponent(m.toLowerCase().replace(/[^a-z0-9]/g, '-'))}/`}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-surface-elevated text-foreground font-bold border border-border hover:border-cyan-500 hover:text-cyan-500 transition-colors"
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
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface-elevated flex flex-col sm:flex-row items-center justify-between gap-4 shadow-contrast-sm">
        <div>
          <div className="text-sm font-bold text-foreground">Looking for the complete {device.brand} {device.name} overview?</div>
          <div className="text-xs font-mono text-muted font-medium">
            View side-by-side variant tables, custom ROM recovery links, and hardware documentation.
          </div>
        </div>
        <Link
          href={`/device/${device.slug}/`}
          className="font-mono text-xs px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold transition-colors whitespace-nowrap"
        >
          View Full {device.name} Guide →
        </Link>
      </div>
    </div>
  );
}
