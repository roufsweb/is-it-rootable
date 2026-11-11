import React from 'react';
import Link from 'next/link';
import searchData from '@/data/search-index.json';
import { SearchItem } from '@/types/device';
import { SearchBar } from '@/components/SearchBar';
import { HeroDescription } from '@/components/HeroDescription';
import { FAQAccordion, FAQItem } from '@/components/FAQAccordion';
import { Terminal, ShieldCheck, Monitor, AlertTriangle, Disc, Cpu, HelpCircle, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site';

export default function HomePage() {
  const devices = searchData as SearchItem[];

  // Statistics calculation
  const totalFamilies = devices.length;
  const totalVariants = devices.reduce((acc, d) => acc + d.variantsCount, 0);
  const fullRootCount = devices.filter((d) => d.overallRoot === 'FULL').length;
  const conditionalCount = devices.filter((d) => d.overallRoot === 'CONDITIONAL').length;
  const lockedCount = devices.filter((d) => d.overallRoot === 'LOCKED').length;
  const videoOutCount = devices.filter((d) => d.usb_video_out).length;
  const romCount = devices.filter((d) => d.custom_roms && d.custom_roms.length > 0).length;
  const tabletCount = devices.filter((d) => d.form_factor === 'tablet').length;
  const foldableCount = devices.filter((d) => d.form_factor === 'foldable').length;
  const handheldCount = devices.filter((d) => d.form_factor === 'handheld').length;

  const homeFaqItems: FAQItem[] = [
    {
      question: 'How do I check if my Android phone can be rooted?',
      answer:
        'To check if your phone can be rooted, find your exact model number in Settings > About Phone (e.g. SM-S928B or Pixel 8 Pro cheetah) and search it on IsItRootable. Rootability depends on whether your exact model has an unlockable bootloader, which varies significantly between regional carrier models and factory unlocked international editions.',
    },
    {
      question: 'Why does the model suffix matter so much for rooting (e.g. SM-G950F vs SM-G950U)?',
      answer:
        'OEMs manufacture physically distinct hardware and firmware variants for different markets. In North America, carrier contracts (AT&T, Verizon, T-Mobile) mandate permanently locked bootloaders (e.g. model numbers ending in U, U1, or W). In contrast, international global models (ending in F, B, or N) feature unlockable bootloaders that support custom ROMs, custom recoveries (TWRP), and root solutions (KernelSU / Magisk).',
    },
    {
      question: 'What is the difference between KernelSU, APatch, and Magisk in 2026?',
      answer:
        'KernelSU operates directly in kernel space on modern Generic Kernel Image (GKI) Linux 5.10+ devices, making it virtually undetectable by userspace banking apps. APatch dynamically patches the kernel image without needing source compilation. Magisk modifies the userspace init binary in boot.img or init_boot.img, which works on older and newer devices but requires modules like Shamiko and PlayIntegrityFix to hide root status.',
    },
    {
      question: 'Will rooting trip Samsung Knox or disable Samsung Pay?',
      answer:
        'Yes. Unlocking the bootloader on any modern Samsung device blows a physical microscopic hardware e-fuse, permanently flipping the Knox warranty bit from 0x0 to 0x1. This cannot be reversed by software or flashing stock firmware. It permanently disables Samsung Pay and Secure Folder, though banking apps can still be used via Play Integrity spoofing modules.',
    },
    {
      question: 'What is USB-C DisplayPort Alt Mode and Samsung DeX?',
      answer:
        'DisplayPort Alt Mode allows a phone\'s USB-C port to transmit native high-resolution video directly to external monitors and TVs. On supported devices (such as Samsung Galaxy S-series with Samsung DeX, Motorola Edge with Ready For, and Google Pixel 8+), plugging into an external screen launches a full desktop computing environment with multi-window multitasking.',
    },
  ];

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />

      {/* Hero Section: Monochromatic Architectural Craftsmanship */}
      <section className="relative z-0 pt-0 pb-4 text-left border-b border-border w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl min-w-0">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Is Your Phone Rootable?
            </h1>
            <HeroDescription />
          </div>

          {/* Quick Stat Matrix: Monochromatic Glassmorphic Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 sm:gap-3 font-mono max-w-lg w-full shrink-0">
            <div className="p-3.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-tactile-sm">
              <div className="text-muted text-xs uppercase font-bold tracking-wider">Device Families</div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{totalFamilies}</div>
              <div className="text-xs text-muted truncate mt-0.5">{tabletCount} tabs • {foldableCount} fold • {handheldCount} handhelds</div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-tactile-sm">
              <div className="text-muted text-xs uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Full Root</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{fullRootCount}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Unlocked Freedom</div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-tactile-sm">
              <div className="text-muted text-xs uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Conditional</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{conditionalCount}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Bit / Firmware Sensitive</div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-tactile-sm">
              <div className="text-muted text-xs uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-muted shrink-0" />
                <span>Video Out</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{videoOutCount}</div>
              <div className="text-xs text-muted font-medium mt-0.5">DisplayPort / DeX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Search & Filter Component */}
      <section>
        <SearchBar initialDevices={devices} />
      </section>

      {/* Model Suffix Guide & Heuristics Section */}
      <section className="pt-6 sm:pt-8 border-t border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-mono font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span>Essential Rules of Android Rooting: Model Suffix Sensitivity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-xs font-mono">
            {/* Samsung Rule */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Samsung Regional Rule</div>
              <p className="text-muted leading-relaxed font-medium">
                Samsung models ending in <span className="text-rose-700 dark:text-rose-400 font-bold">U, U1, W</span> (North America) have locked bootloaders due to carrier Knox policy. International models ending in{' '}
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">F, B, N</span> are bootloader-unlockable on pre-One UI 8.
              </p>
            </div>

            {/* Google Pixel Rule */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Google Pixel Carrier Trap</div>
              <p className="text-muted leading-relaxed font-medium">
                Factory Unlocked Google Pixels have the fastest <code className="bg-surface-elevated px-1 py-0.5 rounded text-foreground font-bold">fastboot flashing unlock</code>. However,{' '}
                <span className="text-rose-700 dark:text-rose-400 font-bold">Verizon</span> variants permanently disable the OEM Unlocking toggle in bootloader firmware.
              </p>
            </div>

            {/* Modern KernelSU & Custom ROMs */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-contrast-sm space-y-2">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-300">KernelSU & Custom ROMs</div>
              <p className="text-muted leading-relaxed font-medium">
                Modern GKI kernels allow undetectable root via <span className="text-emerald-700 dark:text-emerald-400 font-bold">KernelSU</span>. Official LineageOS and GrapheneOS builds require verified bootloader states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Banner with Live GitHub Page Link */}
      <section className="p-4 sm:p-5 rounded-xl border border-border bg-surface-elevated flex flex-col sm:flex-row items-center justify-between gap-4 shadow-contrast-sm font-mono text-xs sm:text-sm">
        <div className="space-y-1">
          <div className="text-base font-bold text-foreground flex items-center gap-2">
            <span>About IsItRootable</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              Open Source
            </span>
          </div>
          <p className="text-muted leading-relaxed font-medium">
            An open-source, community-driven database running serverless on GitHub Pages. Curating regional model suffix data, KernelSU support, and DisplayPort capabilities.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={SITE_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold transition-colors"
          >
            <span>Platform Home</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/about/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-foreground hover:text-cyan-500 font-bold transition-colors"
          >
            <span>About Project</span>
          </Link>
        </div>
      </section>

      {/* Global FAQ Accordion for High SEO Authority */}
      <FAQAccordion items={homeFaqItems} title="Android Rooting & Bootloader Unlocking Knowledge Base" />
    </div>
  );
}
