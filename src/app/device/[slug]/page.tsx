import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllDevices, getDeviceBySlug, getOverallRootStatus, getOverallBootloader } from '@/lib/devices';
import { VariantTable } from '@/components/VariantTable';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ChevronLeft,
  Monitor,
  HardDrive,
  Headphones,
  Terminal,
  AlertTriangle,
  Disc,
} from 'lucide-react';

interface DevicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const devices = getAllDevices();
  return devices.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: DevicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const device = getDeviceBySlug(slug);

  if (!device) {
    return {
      title: 'Device Not Found - IsItRootable',
    };
  }

  const allModels = device.variants.flatMap((v) => v.models).join(', ');
  const title = `Can You Root ${device.brand} ${device.name}? Variants, Bootloader & ROM Guide - IsItRootable`;
  const description = `Detailed root & bootloader unlock guide for ${device.brand} ${device.name}. Compare regional variants (${allModels}), custom recovery, custom ROMs, and kernel support.`;
  const canonical = `https://roufsweb.github.io/is-it-rootable/device/${device.slug}/`;

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

export default async function DevicePage({ params }: DevicePageProps) {
  const { slug } = await params;
  const device = getDeviceBySlug(slug);

  if (!device) {
    notFound();
  }

  const overallRoot = getOverallRootStatus(device.variants);
  const allModels = device.variants.flatMap((v) => v.models);
  const allRoms = Array.from(new Set(device.variants.flatMap((v) => v.custom_roms || [])));

  // FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can you root the ${device.brand} ${device.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            overallRoot === 'FULL'
              ? `Yes. The ${device.brand} ${device.name} can be rooted across international models using tools like KernelSU, APatch, or Magisk once the bootloader is unlocked.`
              : overallRoot === 'CONDITIONAL'
              ? `Partially. Some variants of the ${device.brand} ${device.name} can be rooted (e.g. international unlocked versions), whereas North American carrier editions (U/U1/W) or newer firmware bits may be locked.`
              : `No. The ${device.brand} ${device.name} has hardware or firmware bootloader lockdowns preventing root access on current revisions.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does the ${device.brand} ${device.name} support USB-C DisplayPort or Desktop Mode?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: device.hardware_features.usb_video_out
            ? `Yes. The ${device.brand} ${device.name} supports wired USB DisplayPort output${
                device.hardware_features.desktop_mode ? ` with ${device.hardware_features.desktop_mode}` : ''
              }.`
            : `No. The ${device.brand} ${device.name} does not support wired DisplayPort video output over USB-C.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which models of ${device.name} are bootloader unlockable?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Tested models: ${allModels.join(', ')}. Check individual variant tables to distinguish unlocked models from carrier locked versions.`,
        },
      },
    ],
  };

  const containerClass =
    overallRoot === 'FULL'
      ? 'verdict-container-full'
      : overallRoot === 'LOCKED'
      ? 'verdict-container-locked'
      : 'verdict-container-conditional';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Devices</span>
      </Link>

      {/* Hero Header with Contrast Container */}
      <div className={`rounded-2xl p-5 sm:p-8 space-y-6 ${containerClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
              <span className="uppercase">{device.brand}</span>
              <span>•</span>
              <span className="text-muted">Released {device.release_year}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground">
              {device.brand} {device.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted font-medium">
              Bootloader, Regional Suffixes, Custom ROMs & Hardware Capabilities
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">Overall Verdict</div>
              <StatusBadge status={overallRoot} type="root" size="lg" />
            </div>
          </div>
        </div>

        {/* Custom ROM Highlights if available */}
        {allRoms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-surface/80 border border-purple-400/40 shadow-xs">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
              <Disc className="w-4 h-4 text-purple-500" />
              Verified Custom ROMs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allRoms.map((r) => (
                <span
                  key={r}
                  className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 font-semibold"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hardware Features Row */}
        <div className="pt-4 sm:pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono text-xs">
          {/* DisplayPort / Video Out */}
          <div
            className={`p-3 rounded-xl border ${
              device.hardware_features.usb_video_out
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-800 dark:text-cyan-300'
                : 'bg-surface border-border text-muted'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider text-muted font-bold">
              <Monitor className="w-3.5 h-3.5 text-cyan-500" />
              <span>Video Out</span>
            </div>
            <div className="font-bold text-foreground">
              {device.hardware_features.usb_video_out ? 'Supported' : 'Not Supported'}
            </div>
            {device.hardware_features.desktop_mode && (
              <div className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate mt-0.5 font-medium">
                {device.hardware_features.desktop_mode}
              </div>
            )}
          </div>

          {/* MicroSD Slot */}
          <div
            className={`p-3 rounded-xl border ${
              device.hardware_features.sdcard_slot
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-surface border-border text-muted'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider text-muted font-bold">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              <span>MicroSD Slot</span>
            </div>
            <div className="font-bold text-foreground">
              {device.hardware_features.sdcard_slot ? 'Present' : 'None'}
            </div>
          </div>

          {/* Headphone Jack */}
          <div
            className={`p-3 rounded-xl border ${
              device.hardware_features.headphone_jack
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300'
                : 'bg-surface border-border text-muted'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider text-muted font-bold">
              <Headphones className="w-3.5 h-3.5 text-amber-500" />
              <span>3.5mm Jack</span>
            </div>
            <div className="font-bold text-foreground">
              {device.hardware_features.headphone_jack ? 'Present' : 'None'}
            </div>
          </div>

          {/* Variants Count */}
          <div className="p-3 rounded-xl border bg-surface border-border text-foreground">
            <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider text-muted font-bold">
              <Terminal className="w-3.5 h-3.5 text-muted" />
              <span>Sub-Variants</span>
            </div>
            <div className="font-bold text-foreground">{device.variants.length} Regional Types</div>
            <div className="text-[10px] text-muted mt-0.5 font-medium">{allModels.length} Model Codes</div>
          </div>
        </div>
      </div>

      {/* Model Suffix Warning Notice if mixed */}
      {overallRoot === 'CONDITIONAL' && (
        <div className="p-4 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-foreground">Critical Model Suffix Notice for {device.name}</div>
            <p className="leading-relaxed font-medium">
              Do NOT assume every {device.name} is unlockable! North American carrier variants (ending in U, U1, W) or Verizon variants have locked bootloaders, whereas International unlocked models can be rooted. Compare the exact sub-models below before buying or attempting to flash.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Variant Comparison Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Regional Variant Breakdown & Root Methods
          </h2>
          <span className="text-xs font-mono text-muted font-bold">
            {device.variants.length} {device.variants.length === 1 ? 'Variant' : 'Variants'}
          </span>
        </div>

        <VariantTable variants={device.variants} brand={device.brand} name={device.name} />
      </section>
    </div>
  );
}
