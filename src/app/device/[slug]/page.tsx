import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllDevices, getDeviceBySlug, getOverallRootStatus, getOverallBootloader } from '@/lib/devices';
import { VariantTable } from '@/components/VariantTable';
import { StatusBadge } from '@/components/StatusBadge';
import { CommandSnippets } from '@/components/CommandSnippets';
import { FAQAccordion, FAQItem } from '@/components/FAQAccordion';
import { RootGuideSection } from '@/components/RootGuideSection';
import { ShareButton } from '@/components/ShareButton';
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  HardDrive,
  Headphones,
  Terminal,
  AlertTriangle,
  Disc,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
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
  const overallRoot = getOverallRootStatus(device.variants);
  const rootStatusText =
    overallRoot === 'FULL'
      ? 'Yes (Fully Unlockable)'
      : overallRoot === 'CONDITIONAL'
      ? 'Conditionally (Regional Differences)'
      : 'No (Locked)';

  const title = `Can You Root ${device.brand} ${device.name}? Complete Unlock & Root Guide - IsItRootable`;
  const description = `Is the ${device.brand} ${device.name} rootable? Verdict: ${rootStatusText}. Compare regional variants (${allModels}), fastboot unlock steps, custom ROMs, KernelSU/Magisk, and DisplayPort support.`;
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
      siteName: 'IsItRootable',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  const overallBootloader = getOverallBootloader(device.variants);
  const allModels = device.variants.flatMap((v) => v.models);
  const allRoms = Array.from(new Set(device.variants.flatMap((v) => v.custom_roms || [])));
  const allRootMethods = Array.from(new Set(device.variants.flatMap((v) => v.root_methods || [])));
  const primaryVariant = device.variants[0];

  const canonicalUrl = `https://roufsweb.github.io/is-it-rootable/device/${device.slug}/`;

  // 1. BreadcrumbList Structured Data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://roufsweb.github.io/is-it-rootable/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: device.brand,
        item: `https://roufsweb.github.io/is-it-rootable/?brand=${encodeURIComponent(device.brand)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${device.brand} ${device.name}`,
        item: canonicalUrl,
      },
    ],
  };

  // 2. FAQ Items & Schema
  const faqItems: FAQItem[] = [
    {
      question: `Can you root the ${device.brand} ${device.name}?`,
      answer:
        overallRoot === 'FULL'
          ? `Yes. The ${device.brand} ${device.name} has an unlockable bootloader across international models. You can achieve root access using KernelSU, APatch, or Magisk by patching the stock boot or init_boot image.`
          : overallRoot === 'CONDITIONAL'
          ? `Conditionally. Some variants of the ${device.brand} ${device.name} can be rooted (such as international unlocked models like ${device.variants
              .filter((v) => v.root_status === 'FULL')
              .flatMap((v) => v.models)
              .slice(0, 3)
              .join(', ') || 'Global models'}), while North American carrier models (ending in U, U1, W) or Verizon variants have locked bootloaders preventing root.`
          : `No. Current firmware and carrier hardware restrictions on the ${device.brand} ${device.name} prevent bootloader unlocking and root privileges.`,
    },
    {
      question: `How do you unlock the bootloader on the ${device.brand} ${device.name}?`,
      answer:
        primaryVariant?.bootloader_unlockable === 'NO'
          ? `Bootloader unlocking is not permitted on this device variant due to OEM hardware fuses and carrier firmware restrictions.`
          : `To unlock the bootloader on the ${device.name}: 1) Enable Developer Options by tapping Build Number 7 times. 2) Turn on OEM Unlocking and USB Debugging in Settings. 3) ${
              primaryVariant?.unlock_method || 'Boot into Fastboot mode and run `fastboot flashing unlock`.'
            }. Note that unlocking wipes all user data.`,
    },
    {
      question: `Which specific model numbers of ${device.name} are supported?`,
      answer: `This database indexes ${device.variants.length} regional variant families covering ${
        allModels.length
      } specific model codes: ${allModels.join(', ')}. Consult the variant breakdown table to verify your exact model number.`,
    },
    {
      question: `Does rooting the ${device.brand} ${device.name} trip Knox or break banking apps?`,
      answer: device.brand.toLowerCase().includes('samsung')
        ? `Yes. Unlocking the bootloader on a Samsung device irreversibly trips the hardware Knox e-fuse from 0x0 to 0x1, permanently disabling Samsung Pay and Secure Folder. To retain banking apps and Google Wallet, you must install PlayIntegrityFix and Shamiko with Magisk or KernelSU.`
        : `Unlocking the bootloader changes Google Play Integrity from MEETS_STRONG_INTEGRITY to MEETS_BASIC_INTEGRITY. Modern banking applications and Google Wallet will require a Play Integrity bypass module (such as PlayIntegrityFix with KernelSU or Magisk) to operate.`,
    },
    {
      question: `Are custom ROMs available for the ${device.brand} ${device.name}?`,
      answer:
        allRoms.length > 0
          ? `Yes. The ${device.name} has verified custom ROM support, including: ${allRoms.join(
              ', '
            )}. These ROMs provide updated Android versions and enhanced privacy.`
          : `Currently there are no officially verified LineageOS or AOSP custom ROMs cataloged for this specific device model.`,
    },
    {
      question: `Does the ${device.brand} ${device.name} support USB-C DisplayPort or Desktop Mode?`,
      answer: device.hardware_features.usb_video_out
        ? `Yes. The ${device.brand} ${device.name} features hardware USB-C DisplayPort Alt Mode video output${
            device.hardware_features.desktop_mode ? ` with support for ${device.hardware_features.desktop_mode}` : ''
          }. You can connect it directly to an external monitor or portable display.`
        : `No. The ${device.brand} ${device.name} is limited to USB 2.0 or lacks DisplayPort Alt Mode hardware, meaning wired external monitor output is not supported.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // 3. HowTo Structured Data (for unlockable devices)
  const howToSchema =
    overallRoot !== 'LOCKED'
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to Unlock Bootloader & Root ${device.brand} ${device.name}`,
          description: `Step-by-step instructions for unlocking the bootloader and obtaining root access on the ${device.brand} ${device.name}.`,
          totalTime: 'PT30M',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Backup Device Data & Remove Accounts',
              text: 'Unlocking the bootloader erases all device internal storage. Backup all photos and files, and remove Google accounts from Settings to prevent FRP locks.',
              url: `${canonicalUrl}#step-1-backup`,
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Enable OEM Unlocking in Developer Options',
              text: 'Go to Settings > About Phone, tap Build Number 7 times. In Settings > Developer Options, toggle OEM Unlocking and USB Debugging.',
              url: `${canonicalUrl}#step-2-oem-unlock`,
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Reboot to Bootloader & Execute Unlock',
              text:
                primaryVariant?.unlock_method ||
                'Reboot to fastboot mode (adb reboot bootloader) and run fastboot flashing unlock on PC. Confirm on phone screen.',
              url: `${canonicalUrl}#step-3-bootloader-unlock`,
            },
            {
              '@type': 'HowToStep',
              position: 4,
              name: 'Patch Boot Image with KernelSU or Magisk',
              text: `Extract the stock boot.img or init_boot.img for your exact firmware build. Patch using KernelSU Manager or Magisk app, and flash via fastboot.`,
              url: `${canonicalUrl}#step-4-patch-boot`,
            },
            {
              '@type': 'HowToStep',
              position: 5,
              name: 'Verify Root & Configure Play Integrity',
              text: 'Boot into Android, open KernelSU or Magisk, confirm root status, and install PlayIntegrityFix to retain banking application access.',
              url: `${canonicalUrl}#step-5-verify-root`,
            },
          ],
        }
      : null;

  const containerClass =
    overallRoot === 'FULL'
      ? 'verdict-container-full'
      : overallRoot === 'LOCKED'
      ? 'verdict-container-locked'
      : 'verdict-container-conditional';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Semantic Breadcrumb Navigation & Share Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-muted flex-wrap">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <Link
            href={`/?brand=${encodeURIComponent(device.brand)}`}
            className="hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors"
          >
            {device.brand}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <span className="text-foreground font-bold">{device.name}</span>
        </nav>
        <ShareButton title={`${device.brand} ${device.name} Root Guide`} />
      </div>

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
              Bootloader Unlockability, Regional Model Suffixes, Custom ROMs & Hardware Capabilities
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">Overall Verdict</div>
              <StatusBadge status={overallRoot} type="root" size="lg" />
            </div>
          </div>
        </div>

        {/* Google / AI Featured Snippet Direct Answer Box */}
        <div className="p-4 rounded-xl bg-surface/90 border border-cyan-500/40 text-foreground font-mono text-xs sm:text-sm space-y-1.5 shadow-contrast-sm">
          <div className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Direct Verdict Summary</span>
          </div>
          <p className="leading-relaxed font-semibold">
            {overallRoot === 'FULL' ? (
              <>
                <strong className="text-emerald-700 dark:text-emerald-400">Yes</strong>, the {device.brand} {device.name} is fully rootable with an unlockable bootloader. Root can be obtained via{' '}
                {allRootMethods.length > 0 ? allRootMethods.join(' or ') : 'KernelSU and Magisk'}.
              </>
            ) : overallRoot === 'CONDITIONAL' ? (
              <>
                <strong className="text-amber-700 dark:text-amber-400">Conditionally</strong>: Rootability depends strictly on your exact model suffix. International models can be unlocked, while US carrier variants (U, U1, W) or Verizon variants have permanently locked bootloaders.
              </>
            ) : (
              <>
                <strong className="text-rose-700 dark:text-rose-400">No</strong>: The {device.brand} {device.name} has a locked bootloader that cannot be bypassed on current firmware revisions.
              </>
            )}
          </p>
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

      {/* Interactive Terminal Unlock Cheat-sheet */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Fastboot & Terminal Unlock Commands</span>
          </h2>
          <span className="text-xs font-mono text-muted font-bold">1-Click Copy</span>
        </div>
        <CommandSnippets
          brand={device.brand}
          codename={primaryVariant?.codename || device.slug}
          bootloaderUnlockable={primaryVariant?.bootloader_unlockable || 'YES'}
          unlockMethod={primaryVariant?.unlock_method || ''}
        />
      </section>

      {/* Authoritative Root & Bootloader Guide */}
      <RootGuideSection
        brand={device.brand}
        name={device.name}
        codename={primaryVariant?.codename}
        rootStatus={overallRoot}
        bootloaderStatus={overallBootloader}
        unlockMethod={primaryVariant?.unlock_method}
        rootMethods={allRootMethods}
      />

      {/* Google FAQ Accordion */}
      <FAQAccordion items={faqItems} title={`Frequently Asked Questions about ${device.brand} ${device.name}`} />
    </div>
  );
}
