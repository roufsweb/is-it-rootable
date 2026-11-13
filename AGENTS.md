# IsItRootable: Technical Specification & Antigravity Guide

IsItRootable is an open-source, lightning-fast database and search platform answering:
"Is this Android phone rootable, bootloader unlockable, and does it support custom kernels & USB-C DisplayPort/DeX?"

## Core Architecture Principles
1. **Model-Suffix Sensitivity**: Never treat a phone brand as a single entity. Always distinguish regional/carrier variants (e.g. Samsung SM-G950F Exynos = Fully Unlockable vs SM-G950U Snapdragon = Permanently Locked; Pixel Factory Unlocked vs Verizon MMWave).
2. **Static-First Performance**: Instant search (<20ms) in the browser using client-side pre-indexed indices (MiniSearch) with zero backend latency.
3. **Aggressive Programmatic SEO**: Outrank messy XDA forums by generating SSG pages with valid schema.org `FAQPage` and `Product` JSON-LD tags for every device family and exact model string.
4. **Clean, Honest Verdicts**: Clear color-coded badges:
   - Green: `FULL_ROOT` (Unlocked bootloader + custom kernel + Magisk/KernelSU/APatch)
   - Yellow: `CONDITIONAL` (Requires specific bootloader bit/firmware, e.g., Pre-One UI 8 / EDL / Token)
   - Red: `LOCKED` (Carrier or OEM hardware e-fuse lockdown)
5. **Hosting on GitHub Pages**:
   - URL: `https://roufsweb.github.io/is-it-rootable`
   - Static export with `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`.
   - Dynamic `basePath` / `assetPrefix` (`'/is-it-rootable'` in production, `''` in dev).
   - Local-only data gathering: NO scraping or Python scripts in GitHub Actions.

## Repository Layout
- `AGENTS.md`: Antigravity context & instructions
- `.agent/skills/`:
  - `root-schema-validator/SKILL.md`: Validates device JSON and model suffixes
  - `root-search-indexer/SKILL.md`: MiniSearch client-side indexing rules
  - `root-seo-generator/SKILL.md`: Programmatic SEO and JSON-LD schema generation
  - `root-device-scraper/SKILL.md`: Local scraping pipeline & regional bootloader heuristics
- `data/`:
  - `raw/`: Downloaded CSVs / LineageOS / TWRP dumps (gitignored)
  - `devices/`: Individual device JSON files (e.g. `samsung-galaxy-s8.json`)
- `scripts/`:
  - `fetch_google_devices.py`: Ingests Google Certified Android Devices CSV
  - `scrape_device_sources.mjs`: Local scraper for LineageOS, Customrombay & Google CSV
  - `validate_schema.mjs`: Strict schema validator for device JSON files
  - `build_search_index.mjs`: Builds optimized client search index
- `src/`:
  - `app/`: Next.js 15 App Router static export
  - `components/`: Cyberpunk / terminal themed UI components
  - `lib/`: Device loader and search utilities

