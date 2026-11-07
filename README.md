# IsItRootable ⚡

> **Instant, zero-latency Android Bootloader, Root & Hardware Capability Database**  
> Model-suffix sensitive intelligence distinguishing international unlockable devices from carrier lockouts.

[![Deploy to GitHub Pages](https://github.com/roufsweb/is-it-rootable/actions/workflows/deploy.yml/badge.svg)](https://github.com/roufsweb/is-it-rootable/actions/workflows/deploy.yml)
[![Live Website](https://img.shields.io/badge/Live-GitHub%20Pages-06b6d4?style=flat&logo=github)](https://roufsweb.github.io/is-it-rootable/)

---

## 🎯 The Problem IsItRootable Solves

Most Android buyers, developers, and ROM enthusiasts rely on generic advice: *"Just buy a Galaxy S8 or Pixel 8, it supports root and custom kernels!"*

However:
- **Samsung Galaxy S8 (`SM-G950F`, Exynos)** is bootloader unlockable and supports TWRP, KernelSU, and APatch.
- **Samsung Galaxy S8 (`SM-G950U`, Snapdragon)** is permanently locked by North American carrier e-fuses with Knox lockdown.
- **Google Pixel (Factory Unlocked)** has an instant fastboot unlock toggle.
- **Google Pixel (Verizon MMWave)** has `OEM Unlocking` permanently greyed out in firmware.

**IsItRootable** eliminates confusion with **model-suffix sensitivity**, sub-20ms instant client search, and programmatic SEO outranking messy forum posts.

---

## 🚀 Key Features

- ⚡ **Zero-Latency Client Search**: Sub-20ms Trie search powered by **MiniSearch** (<150KB bundle) with fuzzy matching, tokenized model prefix handling (e.g., `G950F` matches `SM-G950F`), and hardware filters.
- 📱 **Exact Regional Model Suffix Breakdown**: Never groups North American models (`U/U1/W`) with Global/European models (`F/B/N`).
- 🖥️ **Hardware Capability Auditing**: Instantly filters devices with wired **DisplayPort over USB-C**, **Samsung DeX**, **Motorola Ready For**, **MicroSD Expansion**, and **3.5mm Headphone Jack**.
- 🛡️ **Three-Tier Honest Verdicts**:
  - `FULL_ROOT`: Bootloader unlockable + custom kernel + Magisk / KernelSU / APatch
  - `CONDITIONAL`: Requires specific bootloader binary bit (One UI 8 downgrade restrictions), Mi Community waiting period, or carrier unlock token.
  - `LOCKED`: Hardware Knox e-fuse / carrier lockdown.
- 🔍 **Aggressive Programmatic SEO**: Generates static pages for every device (`/device/[slug]/`) and exact model (`/model/[model]/`) with valid Schema.org `FAQPage` and `Product` JSON-LD data.
- 🌐 **Static-First Hosting**: Runs 100% serverless on GitHub Pages (`https://roufsweb.github.io/is-it-rootable`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export `output: 'export'`)
- **Styling**: Tailwind CSS (Cyberpunk / Terminal Dark Theme inspired by ProtonDB & CanIUse)
- **Search Engine**: MiniSearch
- **Icons**: Lucide React
- **Data Validation**: Custom strict schema validation script (`scripts/validate_schema.mjs`)
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Validate device schemas
npm run validate

# 3. Build search index
npm run index

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🤖 Local Agent Scraping & Data Pipeline

To ensure GitHub Actions remains fast and clean, **all scraping runs strictly on local developer machines** and dumps raw data into `data/raw/` (gitignored).

```bash
# Ingest official Google Certified Android Devices CSV:
python scripts/fetch_google_devices.py

# Query public sources (LineageOS Wiki YAML, Customrombay, Google CSV) for a target device:
node scripts/scrape_device_sources.mjs --query "galaxy s21"
node scripts/scrape_device_sources.mjs --codename dreamlte
```

---

## 📄 License

MIT License. Open-source and free for the Android community.
