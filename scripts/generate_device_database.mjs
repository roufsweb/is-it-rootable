#!/usr/bin/env node
/**
 * scripts/generate_device_database.mjs
 * 
 * Automated, model-suffix-sensitive generator that creates 100% schema-valid
 * device records in data/devices/*.json by querying Google Play Certified Devices
 * and applying precise OEM heuristics (Samsung, Pixel, Xiaomi, POCO, OnePlus,
 * Motorola, Sony, Nothing, LG, Realme, ZTE RedMagic, HTC, Essential, Asus, Fairphone).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEVICES_DIR = path.join(ROOT_DIR, 'data', 'devices');
const RAW_DIR = path.join(ROOT_DIR, 'data', 'raw');
const GP_FILE = path.join(RAW_DIR, 'google_play_devices.json');

if (!fs.existsSync(DEVICES_DIR)) {
  fs.mkdirSync(DEVICES_DIR, { recursive: true });
}

if (!fs.existsSync(GP_FILE)) {
  console.error('[ERROR] google_play_devices.json not found! Run "python scripts/fetch_google_devices.py" first.');
  process.exit(1);
}

const gpData = JSON.parse(fs.readFileSync(GP_FILE, 'utf8'));

// -------------------------------------------------------------
// COMPREHENSIVE TARGET DEFINITIONS (260+ DEVICE FAMILIES)
// -------------------------------------------------------------

const TARGET_FAMILIES = [
  // =========================================================================
  // 1. SAMSUNG GALAXY S-SERIES
  // =========================================================================
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S25 Ultra$/i,
    displayName: 'Galaxy S25 Ultra',
    slug: 'samsung-galaxy-s25-ultra',
    year: 2025,
    socGlobal: 'Snapdragon 8 Elite for Galaxy',
    socNA: 'Snapdragon 8 Elite for Galaxy',
    socChina: 'Snapdragon 8 Elite for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_locked_all'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S25\+$/i,
    displayName: 'Galaxy S25+',
    slug: 'samsung-galaxy-s25-plus',
    year: 2025,
    socGlobal: 'Snapdragon 8 Elite for Galaxy',
    socNA: 'Snapdragon 8 Elite for Galaxy',
    socChina: 'Snapdragon 8 Elite for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_locked_all'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S25$/i,
    displayName: 'Galaxy S25',
    slug: 'samsung-galaxy-s25',
    year: 2025,
    socGlobal: 'Snapdragon 8 Elite for Galaxy',
    socNA: 'Snapdragon 8 Elite for Galaxy',
    socChina: 'Snapdragon 8 Elite for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_locked_all'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S24 Ultra$/i,
    displayName: 'Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3 for Galaxy',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S24\+$/i,
    displayName: 'Galaxy S24+',
    slug: 'samsung-galaxy-s24-plus',
    year: 2024,
    socGlobal: 'Exynos 2400',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S24$/i,
    displayName: 'Galaxy S24',
    slug: 'samsung-galaxy-s24',
    year: 2024,
    socGlobal: 'Exynos 2400',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S23 Ultra$/i,
    displayName: 'Galaxy S23 Ultra',
    slug: 'samsung-galaxy-s23-ultra',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S23\+$/i,
    displayName: 'Galaxy S23+',
    slug: 'samsung-galaxy-s23-plus',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S23$/i,
    displayName: 'Galaxy S23',
    slug: 'samsung-galaxy-s23',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S23 FE$/i,
    displayName: 'Galaxy S23 FE',
    slug: 'samsung-galaxy-s23-fe',
    year: 2023,
    socGlobal: 'Exynos 2200',
    socNA: 'Snapdragon 8 Gen 1',
    socChina: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S22 Ultra$/i,
    displayName: 'Galaxy S22 Ultra',
    slug: 'samsung-galaxy-s22-ultra',
    year: 2022,
    socGlobal: 'Exynos 2200',
    socNA: 'Snapdragon 8 Gen 1',
    socChina: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S22\+$/i,
    displayName: 'Galaxy S22+',
    slug: 'samsung-galaxy-s22-plus',
    year: 2022,
    socGlobal: 'Exynos 2200',
    socNA: 'Snapdragon 8 Gen 1',
    socChina: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S22$/i,
    displayName: 'Galaxy S22',
    slug: 'samsung-galaxy-s22',
    year: 2022,
    socGlobal: 'Exynos 2200',
    socNA: 'Snapdragon 8 Gen 1',
    socChina: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S21 Ultra 5G$/i,
    displayName: 'Galaxy S21 Ultra 5G',
    slug: 'samsung-galaxy-s21-ultra-5g',
    year: 2021,
    socGlobal: 'Exynos 2100',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S21\+ 5G$/i,
    displayName: 'Galaxy S21+ 5G',
    slug: 'samsung-galaxy-s21-plus-5g',
    year: 2021,
    socGlobal: 'Exynos 2100',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S21 5G$/i,
    displayName: 'Galaxy S21 5G',
    slug: 'samsung-galaxy-s21',
    year: 2021,
    socGlobal: 'Exynos 2100',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S21 FE 5G$/i,
    displayName: 'Galaxy S21 FE 5G',
    slug: 'samsung-galaxy-s21-fe-5g',
    year: 2022,
    socGlobal: 'Exynos 2100',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S20 Ultra 5G$/i,
    displayName: 'Galaxy S20 Ultra 5G',
    slug: 'samsung-galaxy-s20-ultra-5g',
    year: 2020,
    socGlobal: 'Exynos 990',
    socNA: 'Snapdragon 865',
    socChina: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S20\+ 5G$/i,
    displayName: 'Galaxy S20+ 5G',
    slug: 'samsung-galaxy-s20-plus-5g',
    year: 2020,
    socGlobal: 'Exynos 990',
    socNA: 'Snapdragon 865',
    socChina: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S20 5G$/i,
    displayName: 'Galaxy S20 5G',
    slug: 'samsung-galaxy-s20-5g',
    year: 2020,
    socGlobal: 'Exynos 990',
    socNA: 'Snapdragon 865',
    socChina: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S20 FE 5G$/i,
    displayName: 'Galaxy S20 FE 5G',
    slug: 'samsung-galaxy-s20-fe-5g',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    socNA: 'Snapdragon 865',
    socChina: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S10\+$/i,
    displayName: 'Galaxy S10+',
    slug: 'samsung-galaxy-s10-plus',
    year: 2019,
    socGlobal: 'Exynos 9820',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S10$/i,
    displayName: 'Galaxy S10',
    slug: 'samsung-galaxy-s10',
    year: 2019,
    socGlobal: 'Exynos 9820',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S10e$/i,
    displayName: 'Galaxy S10e',
    slug: 'samsung-galaxy-s10e',
    year: 2019,
    socGlobal: 'Exynos 9820',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S10 5G$/i,
    displayName: 'Galaxy S10 5G',
    slug: 'samsung-galaxy-s10-5g',
    year: 2019,
    socGlobal: 'Exynos 9820',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S10 Lite$/i,
    displayName: 'Galaxy S10 Lite',
    slug: 'samsung-galaxy-s10-lite',
    year: 2020,
    socGlobal: 'Snapdragon 855',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S9\+$/i,
    displayName: 'Galaxy S9+',
    slug: 'samsung-galaxy-s9-plus',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S9$/i,
    displayName: 'Galaxy S9',
    slug: 'samsung-galaxy-s9',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S8\+$/i,
    displayName: 'Galaxy S8+',
    slug: 'samsung-galaxy-s8-plus',
    year: 2017,
    socGlobal: 'Exynos 8895',
    socNA: 'Snapdragon 835',
    socChina: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Station / Pad)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S8$/i,
    displayName: 'Galaxy S8',
    slug: 'samsung-galaxy-s8',
    year: 2017,
    socGlobal: 'Exynos 8895',
    socNA: 'Snapdragon 835',
    socChina: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Station / Pad)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S7 Edge$/i,
    displayName: 'Galaxy S7 Edge',
    slug: 'samsung-galaxy-s7-edge',
    year: 2016,
    socGlobal: 'Exynos 8890',
    socNA: 'Snapdragon 820',
    socChina: 'Snapdragon 820',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_legacy'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S7$/i,
    displayName: 'Galaxy S7',
    slug: 'samsung-galaxy-s7',
    year: 2016,
    socGlobal: 'Exynos 8890',
    socNA: 'Snapdragon 820',
    socChina: 'Snapdragon 820',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_legacy'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S6$/i,
    displayName: 'Galaxy S6',
    slug: 'samsung-galaxy-s6',
    year: 2015,
    socGlobal: 'Exynos 7420',
    socNA: 'Exynos 7420',
    socChina: 'Exynos 7420',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'samsung_legacy'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy S5$/i,
    displayName: 'Galaxy S5',
    slug: 'samsung-galaxy-s5',
    year: 2014,
    socGlobal: 'Snapdragon 801 / Exynos 5422',
    socNA: 'Snapdragon 801',
    socChina: 'Snapdragon 801',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_legacy'
  },

  // =========================================================================
  // 2. SAMSUNG GALAXY NOTE-SERIES
  // =========================================================================
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /Note20 Ultra 5G/i,
    displayName: 'Galaxy Note 20 Ultra 5G',
    slug: 'samsung-galaxy-note-20-ultra',
    year: 2020,
    socGlobal: 'Exynos 990',
    socNA: 'Snapdragon 865+',
    socChina: 'Snapdragon 865+',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /Note20 5G/i,
    displayName: 'Galaxy Note 20 5G',
    slug: 'samsung-galaxy-note-20-5g',
    year: 2020,
    socGlobal: 'Exynos 990',
    socNA: 'Snapdragon 865+',
    socChina: 'Snapdragon 865+',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /Note10\+/i,
    displayName: 'Galaxy Note 10+',
    slug: 'samsung-galaxy-note-10-plus',
    year: 2019,
    socGlobal: 'Exynos 9825',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note10$/i,
    displayName: 'Galaxy Note 10',
    slug: 'samsung-galaxy-note-10',
    year: 2019,
    socGlobal: 'Exynos 9825',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /Note10 Lite/i,
    displayName: 'Galaxy Note 10 Lite',
    slug: 'samsung-galaxy-note-10-lite',
    year: 2020,
    socGlobal: 'Exynos 9810',
    socNA: 'Exynos 9810',
    socChina: 'Exynos 9810',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note9$/i,
    displayName: 'Galaxy Note 9',
    slug: 'samsung-galaxy-note-9',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Direct HDMI cable)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note8$/i,
    displayName: 'Galaxy Note 8',
    slug: 'samsung-galaxy-note-8',
    year: 2017,
    socGlobal: 'Exynos 8895',
    socNA: 'Snapdragon 835',
    socChina: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Station / Pad)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note5$/i,
    displayName: 'Galaxy Note 5',
    slug: 'samsung-galaxy-note-5',
    year: 2015,
    socGlobal: 'Exynos 7420',
    socNA: 'Exynos 7420',
    socChina: 'Exynos 7420',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'samsung_legacy'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note4$/i,
    displayName: 'Galaxy Note 4',
    slug: 'samsung-galaxy-note-4',
    year: 2014,
    socGlobal: 'Exynos 5433 / Snapdragon 805',
    socNA: 'Snapdragon 805',
    socChina: 'Snapdragon 805',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_legacy'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Note3$/i,
    displayName: 'Galaxy Note 3',
    slug: 'samsung-galaxy-note-3',
    year: 2013,
    socGlobal: 'Snapdragon 800 / Exynos 5420',
    socNA: 'Snapdragon 800',
    socChina: 'Snapdragon 800',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_legacy'
  },

  // =========================================================================
  // 3. SAMSUNG GALAXY Z-SERIES (FOLDABLES)
  // =========================================================================
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Fold6$/i,
    displayName: 'Galaxy Z Fold 6',
    slug: 'samsung-galaxy-z-fold-6',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3 for Galaxy',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Fold5$/i,
    displayName: 'Galaxy Z Fold 5',
    slug: 'samsung-galaxy-z-fold-5',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Fold4$/i,
    displayName: 'Galaxy Z Fold 4',
    slug: 'samsung-galaxy-z-fold-4',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    socNA: 'Snapdragon 8+ Gen 1',
    socChina: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Fold3 5G$/i,
    displayName: 'Galaxy Z Fold 3 5G',
    slug: 'samsung-galaxy-z-fold-3-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Fold2 5G$/i,
    displayName: 'Galaxy Z Fold 2 5G',
    slug: 'samsung-galaxy-z-fold-2-5g',
    year: 2020,
    socGlobal: 'Snapdragon 865+',
    socNA: 'Snapdragon 865+',
    socChina: 'Snapdragon 865+',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Fold$/i,
    displayName: 'Galaxy Fold',
    slug: 'samsung-galaxy-fold',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Flip6$/i,
    displayName: 'Galaxy Z Flip 6',
    slug: 'samsung-galaxy-z-flip-6',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3 for Galaxy',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (External Display)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Flip5$/i,
    displayName: 'Galaxy Z Flip 5',
    slug: 'samsung-galaxy-z-flip-5',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Screen Mirroring)',
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Flip4$/i,
    displayName: 'Galaxy Z Flip 4',
    slug: 'samsung-galaxy-z-flip-4',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    socNA: 'Snapdragon 8+ Gen 1',
    socChina: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Z Flip3 5G$/i,
    displayName: 'Galaxy Z Flip 3 5G',
    slug: 'samsung-galaxy-z-flip-3-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    socNA: 'Snapdragon 888',
    socChina: 'Snapdragon 888',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },

  // =========================================================================
  // 4. SAMSUNG GALAXY A-SERIES
  // =========================================================================
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A73 5G$/i,
    displayName: 'Galaxy A73 5G',
    slug: 'samsung-galaxy-a73-5g',
    year: 2022,
    socGlobal: 'Snapdragon 778G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A72$/i,
    displayName: 'Galaxy A72',
    slug: 'samsung-galaxy-a72',
    year: 2021,
    socGlobal: 'Snapdragon 720G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A71$/i,
    displayName: 'Galaxy A71',
    slug: 'samsung-galaxy-a71',
    year: 2020,
    socGlobal: 'Snapdragon 730',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A55 5G$/i,
    displayName: 'Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    year: 2024,
    socGlobal: 'Exynos 1480',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A54 5G$/i,
    displayName: 'Galaxy A54 5G',
    slug: 'samsung-galaxy-a54-5g',
    year: 2023,
    socGlobal: 'Exynos 1380',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A53 5G$/i,
    displayName: 'Galaxy A53 5G',
    slug: 'samsung-galaxy-a53-5g',
    year: 2022,
    socGlobal: 'Exynos 1280',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A52s 5G$/i,
    displayName: 'Galaxy A52s 5G',
    slug: 'samsung-galaxy-a52s-5g',
    year: 2021,
    socGlobal: 'Snapdragon 778G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A52$/i,
    displayName: 'Galaxy A52',
    slug: 'samsung-galaxy-a52',
    year: 2021,
    socGlobal: 'Snapdragon 720G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A51$/i,
    displayName: 'Galaxy A51',
    slug: 'samsung-galaxy-a51',
    year: 2019,
    socGlobal: 'Exynos 9611',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A50$/i,
    displayName: 'Galaxy A50',
    slug: 'samsung-galaxy-a50',
    year: 2019,
    socGlobal: 'Exynos 9610',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A35 5G$/i,
    displayName: 'Galaxy A35 5G',
    slug: 'samsung-galaxy-a35-5g',
    year: 2024,
    socGlobal: 'Exynos 1380',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A34 5G$/i,
    displayName: 'Galaxy A34 5G',
    slug: 'samsung-galaxy-a34-5g',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 1080',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A33 5G$/i,
    displayName: 'Galaxy A33 5G',
    slug: 'samsung-galaxy-a33-5g',
    year: 2022,
    socGlobal: 'Exynos 1280',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A25 5G$/i,
    displayName: 'Galaxy A25 5G',
    slug: 'samsung-galaxy-a25-5g',
    year: 2024,
    socGlobal: 'Exynos 1280',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A15 5G$/i,
    displayName: 'Galaxy A15 5G',
    slug: 'samsung-galaxy-a15-5g',
    year: 2024,
    socGlobal: 'MediaTek Dimensity 6100+',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy A14 5G$/i,
    displayName: 'Galaxy A14 5G',
    slug: 'samsung-galaxy-a14-5g',
    year: 2023,
    socGlobal: 'Exynos 1330 / Dimensity 700',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },

  // =========================================================================
  // 5. SAMSUNG GALAXY TAB S-SERIES (POWER USERS & DEX)
  // =========================================================================
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Tab S9 Ultra$/i,
    displayName: 'Galaxy Tab S9 Ultra',
    slug: 'samsung-galaxy-tab-s9-ultra',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX On-Device & External Monitor',
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Tab S9\+$/i,
    displayName: 'Galaxy Tab S9+',
    slug: 'samsung-galaxy-tab-s9-plus',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX On-Device & External Monitor',
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Tab S9$/i,
    displayName: 'Galaxy Tab S9',
    slug: 'samsung-galaxy-tab-s9',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: true,
    desktopMode: 'Samsung DeX On-Device & External Monitor',
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Tab S8$/i,
    displayName: 'Galaxy Tab S8',
    slug: 'samsung-galaxy-tab-s8',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Samsung DeX On-Device & External Monitor',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    brandMatch: /^samsung$/i,
    nameMatch: /^Galaxy Tab S7$/i,
    displayName: 'Galaxy Tab S7',
    slug: 'samsung-galaxy-tab-s7',
    year: 2020,
    socGlobal: 'Snapdragon 865+',
    usbVideo: true,
    desktopMode: 'Samsung DeX On-Device & External Monitor',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },

  // =========================================================================
  // 6. GOOGLE PIXEL PHONES & TABLET
  // =========================================================================
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 9 Pro Fold$/i,
    displayName: 'Pixel 9 Pro Fold',
    slug: 'google-pixel-9-pro-fold',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (DisplayPort Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 9 Pro XL$/i,
    displayName: 'Pixel 9 Pro XL',
    slug: 'google-pixel-9-pro-xl',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (DisplayPort Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 9 Pro$/i,
    displayName: 'Pixel 9 Pro',
    slug: 'google-pixel-9-pro',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (DisplayPort Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 9$/i,
    displayName: 'Pixel 9',
    slug: 'google-pixel-9',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (DisplayPort Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 8 Pro$/i,
    displayName: 'Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    year: 2023,
    socGlobal: 'Google Tensor G3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Enabled in QPR/Beta)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 8$/i,
    displayName: 'Pixel 8',
    slug: 'google-pixel-8',
    year: 2023,
    socGlobal: 'Google Tensor G3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Enabled in QPR/Beta)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 8a$/i,
    displayName: 'Pixel 8a',
    slug: 'google-pixel-8a',
    year: 2024,
    socGlobal: 'Google Tensor G3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (DisplayPort Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel Fold$/i,
    displayName: 'Pixel Fold',
    slug: 'google-pixel-fold',
    year: 2023,
    socGlobal: 'Google Tensor G2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 7 Pro$/i,
    displayName: 'Pixel 7 Pro',
    slug: 'google-pixel-7-pro',
    year: 2022,
    socGlobal: 'Google Tensor G2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 7$/i,
    displayName: 'Pixel 7',
    slug: 'google-pixel-7',
    year: 2022,
    socGlobal: 'Google Tensor G2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 7a$/i,
    displayName: 'Pixel 7a',
    slug: 'google-pixel-7a',
    year: 2023,
    socGlobal: 'Google Tensor G2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 6 Pro$/i,
    displayName: 'Pixel 6 Pro',
    slug: 'google-pixel-6-pro',
    year: 2021,
    socGlobal: 'Google Tensor (1st Gen)',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 6$/i,
    displayName: 'Pixel 6',
    slug: 'google-pixel-6',
    year: 2021,
    socGlobal: 'Google Tensor (1st Gen)',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 6a$/i,
    displayName: 'Pixel 6a',
    slug: 'google-pixel-6a',
    year: 2022,
    socGlobal: 'Google Tensor (1st Gen)',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 5$/i,
    displayName: 'Pixel 5',
    slug: 'google-pixel-5',
    year: 2020,
    socGlobal: 'Snapdragon 765G',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 5a with 5G$/i,
    displayName: 'Pixel 5a 5G',
    slug: 'google-pixel-5a-5g',
    year: 2021,
    socGlobal: 'Snapdragon 765G',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 4 XL$/i,
    displayName: 'Pixel 4 XL',
    slug: 'google-pixel-4-xl',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 4$/i,
    displayName: 'Pixel 4',
    slug: 'google-pixel-4',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 4a$/i,
    displayName: 'Pixel 4a',
    slug: 'google-pixel-4a',
    year: 2020,
    socGlobal: 'Snapdragon 730G',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 3 XL$/i,
    displayName: 'Pixel 3 XL',
    slug: 'google-pixel-3-xl',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 3$/i,
    displayName: 'Pixel 3',
    slug: 'google-pixel-3',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 3a$/i,
    displayName: 'Pixel 3a',
    slug: 'google-pixel-3a',
    year: 2019,
    socGlobal: 'Snapdragon 670',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 2 XL$/i,
    displayName: 'Pixel 2 XL',
    slug: 'google-pixel-2-xl',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel 2$/i,
    displayName: 'Pixel 2',
    slug: 'google-pixel-2',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel XL$/i,
    displayName: 'Pixel XL',
    slug: 'google-pixel-xl',
    year: 2016,
    socGlobal: 'Snapdragon 821',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel$/i,
    displayName: 'Pixel',
    slug: 'google-pixel',
    year: 2016,
    socGlobal: 'Snapdragon 821',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    brandMatch: /^google$/i,
    nameMatch: /^Pixel Tablet$/i,
    displayName: 'Pixel Tablet',
    slug: 'google-pixel-tablet',
    year: 2023,
    socGlobal: 'Google Tensor G2',
    usbVideo: false,
    desktopMode: 'Hub Mode',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },

  // =========================================================================
  // 7. ONEPLUS PHONES & TABLETS
  // =========================================================================
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 13$/i,
    displayName: 'OnePlus 13',
    slug: 'oneplus-13',
    year: 2024,
    socGlobal: 'Snapdragon 8 Elite',
    usbVideo: true,
    desktopMode: 'ColorOS / OxygenOS Desktop Mode',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 12$/i,
    displayName: 'OnePlus 12',
    slug: 'oneplus-12',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'ColorOS / OxygenOS Desktop Mode',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 12R$/i,
    displayName: 'OnePlus 12R',
    slug: 'oneplus-12r',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 11 5G$/i,
    displayName: 'OnePlus 11 5G',
    slug: 'oneplus-11-5g',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 11R 5G$/i,
    displayName: 'OnePlus 11R 5G',
    slug: 'oneplus-11r-5g',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 10 Pro 5G$/i,
    displayName: 'OnePlus 10 Pro 5G',
    slug: 'oneplus-10-pro-5g',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'USB 3.1 Gen 1 DP Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 10T 5G$/i,
    displayName: 'OnePlus 10T 5G',
    slug: 'oneplus-10t-5g',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 9 Pro 5G$/i,
    displayName: 'OnePlus 9 Pro 5G',
    slug: 'oneplus-9-pro-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 9 5G$/i,
    displayName: 'OnePlus 9 5G',
    slug: 'oneplus-9-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 9RT 5G$/i,
    displayName: 'OnePlus 9RT 5G',
    slug: 'oneplus-9rt-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 8 Pro$/i,
    displayName: 'OnePlus 8 Pro',
    slug: 'oneplus-8-pro',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 8T$/i,
    displayName: 'OnePlus 8T',
    slug: 'oneplus-8t',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 8$/i,
    displayName: 'OnePlus 8',
    slug: 'oneplus-8',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 7T Pro$/i,
    displayName: 'OnePlus 7T Pro',
    slug: 'oneplus-7t-pro',
    year: 2019,
    socGlobal: 'Snapdragon 855+',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 7T$/i,
    displayName: 'OnePlus 7T',
    slug: 'oneplus-7t',
    year: 2019,
    socGlobal: 'Snapdragon 855+',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 7 Pro$/i,
    displayName: 'OnePlus 7 Pro',
    slug: 'oneplus-7-pro',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 7$/i,
    displayName: 'OnePlus 7',
    slug: 'oneplus-7',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'USB 3.1 DP Video Out',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 6T$/i,
    displayName: 'OnePlus 6T',
    slug: 'oneplus-6t',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus 6$/i,
    displayName: 'OnePlus 6',
    slug: 'oneplus-6',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus ?5T$/i,
    displayName: 'OnePlus 5T',
    slug: 'oneplus-5t',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_legacy'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus ?5$/i,
    displayName: 'OnePlus 5',
    slug: 'oneplus-5',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_legacy'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus ?3T$/i,
    displayName: 'OnePlus 3T',
    slug: 'oneplus-3t',
    year: 2016,
    socGlobal: 'Snapdragon 821',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_legacy'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus ?3$/i,
    displayName: 'OnePlus 3',
    slug: 'oneplus-3',
    year: 2016,
    socGlobal: 'Snapdragon 820',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_legacy'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^One$/i,
    displayName: 'OnePlus One',
    slug: 'oneplus-one',
    year: 2014,
    socGlobal: 'Snapdragon 801',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'oneplus_legacy'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^Open$/i,
    displayName: 'OnePlus Open',
    slug: 'oneplus-open',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'Canvas Desktop Display',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord 4$/i,
    displayName: 'OnePlus Nord 4',
    slug: 'oneplus-nord-4',
    year: 2024,
    socGlobal: 'Snapdragon 7+ Gen 3',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord 3 5G$/i,
    displayName: 'OnePlus Nord 3 5G',
    slug: 'oneplus-nord-3-5g',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 9000',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord 2T 5G$/i,
    displayName: 'OnePlus Nord 2T 5G',
    slug: 'oneplus-nord-2t-5g',
    year: 2022,
    socGlobal: 'MediaTek Dimensity 1300',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord$/i,
    displayName: 'OnePlus Nord',
    slug: 'oneplus-nord',
    year: 2020,
    socGlobal: 'Snapdragon 765G',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord CE4$/i,
    displayName: 'OnePlus Nord CE 4',
    slug: 'oneplus-nord-ce-4',
    year: 2024,
    socGlobal: 'Snapdragon 7 Gen 3',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Nord N30 5G$/i,
    displayName: 'OnePlus Nord N30 5G',
    slug: 'oneplus-nord-n30-5g',
    year: 2023,
    socGlobal: 'Snapdragon 695 5G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    brandMatch: /^oneplus$/i,
    nameMatch: /^OnePlus Pad$/i,
    displayName: 'OnePlus Pad',
    slug: 'oneplus-pad',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 9000',
    usbVideo: false,
    desktopMode: 'OxygenOS Tablet Workspace',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },

  // =========================================================================
  // 8. XIAOMI FLAGSHIPS
  // =========================================================================
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 15$/i,
    displayName: 'Xiaomi 15',
    slug: 'xiaomi-15',
    year: 2024,
    socGlobal: 'Snapdragon 8 Elite',
    usbVideo: true,
    desktopMode: 'HyperOS Workstation Mode (DP Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 15 Pro$/i,
    displayName: 'Xiaomi 15 Pro',
    slug: 'xiaomi-15-pro',
    year: 2024,
    socGlobal: 'Snapdragon 8 Elite',
    usbVideo: true,
    desktopMode: 'HyperOS Workstation Mode (DP Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 14 Ultra$/i,
    displayName: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'HyperOS Desktop Mode (USB 3.2 Gen 2)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 14$/i,
    displayName: 'Xiaomi 14',
    slug: 'xiaomi-14',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'HyperOS Desktop Mode (USB 3.2 Gen 1)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 13 Ultra$/i,
    displayName: 'Xiaomi 13 Ultra',
    slug: 'xiaomi-13-ultra',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'MIUI / HyperOS Desktop Mode (USB 3.2 Gen 1)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 13 Pro$/i,
    displayName: 'Xiaomi 13 Pro',
    slug: 'xiaomi-13-pro',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 13$/i,
    displayName: 'Xiaomi 13',
    slug: 'xiaomi-13',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 13T Pro$/i,
    displayName: 'Xiaomi 13T Pro',
    slug: 'xiaomi-13t-pro',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 9200+',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 12 Pro$/i,
    displayName: 'Xiaomi 12 Pro',
    slug: 'xiaomi-12-pro',
    year: 2021,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 12$/i,
    displayName: 'Xiaomi 12',
    slug: 'xiaomi-12',
    year: 2021,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Xiaomi 11T Pro$/i,
    displayName: 'Xiaomi 11T Pro',
    slug: 'xiaomi-11t-pro',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Mi 11$/i,
    displayName: 'Xiaomi Mi 11',
    slug: 'xiaomi-mi-11',
    year: 2020,
    socGlobal: 'Snapdragon 888',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^MI 10$/i,
    displayName: 'Xiaomi Mi 10',
    slug: 'xiaomi-mi-10',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^MI 9$/i,
    displayName: 'Xiaomi Mi 9',
    slug: 'xiaomi-mi-9',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^MI 8$/i,
    displayName: 'Xiaomi Mi 8',
    slug: 'xiaomi-mi-8',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^MI6$/i,
    displayName: 'Xiaomi Mi 6',
    slug: 'xiaomi-mi-6',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^Mi 5$/i,
    displayName: 'Xiaomi Mi 5',
    slug: 'xiaomi-mi-5',
    year: 2016,
    socGlobal: 'Snapdragon 820',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^xiaomi$/i,
    nameMatch: /^MIX 3$/i,
    displayName: 'Xiaomi Mi Mix 3',
    slug: 'xiaomi-mi-mix-3',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_standard'
  },

  // =========================================================================
  // 9. POCO SERIES
  // =========================================================================
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco F6/i,
    displayName: 'Poco F6 / Redmi Turbo 3',
    slug: 'poco-f6',
    year: 2024,
    socGlobal: 'Snapdragon 8s Gen 3',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_hyperos'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco F6 Pro/i,
    displayName: 'Poco F6 Pro / Redmi K70',
    slug: 'poco-f6-pro',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_hyperos'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /^POCO F5$/i,
    displayName: 'POCO F5',
    slug: 'poco-f5',
    year: 2023,
    socGlobal: 'Snapdragon 7+ Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco F4/i,
    displayName: 'Poco F4',
    slug: 'poco-f4',
    year: 2022,
    socGlobal: 'Snapdragon 870',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco F3/i,
    displayName: 'Poco F3 / Redmi K40',
    slug: 'poco-f3',
    year: 2021,
    socGlobal: 'Snapdragon 870',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Pocophone F1/i,
    displayName: 'Pocophone F1',
    slug: 'pocophone-f1',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco X6 Pro/i,
    displayName: 'Poco X6 Pro 5G',
    slug: 'poco-x6-pro-5g',
    year: 2024,
    socGlobal: 'MediaTek Dimensity 8300-Ultra',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_hyperos'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco X5 Pro/i,
    displayName: 'Poco X5 Pro 5G',
    slug: 'poco-x5-pro-5g',
    year: 2023,
    socGlobal: 'Snapdragon 778G',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /Poco X3 Pro/i,
    displayName: 'Poco X3 Pro',
    slug: 'poco-x3-pro',
    year: 2021,
    socGlobal: 'Snapdragon 860',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_standard'
  },
  {
    brand: 'POCO',
    brandMatch: /^(poco|xiaomi)$/i,
    nameMatch: /POCO X3 NFC/i,
    displayName: 'POCO X3 NFC',
    slug: 'poco-x3-nfc',
    year: 2020,
    socGlobal: 'Snapdragon 732G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_standard'
  },

  // =========================================================================
  // 10. REDMI NOTE SERIES
  // =========================================================================
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /Redmi Note 13 Pro\+/i,
    displayName: 'Redmi Note 13 Pro+ 5G',
    slug: 'redmi-note-13-pro-plus-5g',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 7200-Ultra',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /Redmi Note 12 Pro 5G/i,
    displayName: 'Redmi Note 12 Pro 5G',
    slug: 'redmi-note-12-pro-5g',
    year: 2022,
    socGlobal: 'MediaTek Dimensity 1080',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /Redmi Note 12 Turbo/i,
    displayName: 'Redmi Note 12 Turbo',
    slug: 'redmi-note-12-turbo',
    year: 2023,
    socGlobal: 'Snapdragon 7+ Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 10 Pro$/i,
    displayName: 'Redmi Note 10 Pro',
    slug: 'redmi-note-10-pro',
    year: 2021,
    socGlobal: 'Snapdragon 732G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 9 Pro$/i,
    displayName: 'Redmi Note 9 Pro',
    slug: 'redmi-note-9-pro',
    year: 2020,
    socGlobal: 'Snapdragon 720G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 8$/i,
    displayName: 'Redmi Note 8',
    slug: 'redmi-note-8',
    year: 2019,
    socGlobal: 'Snapdragon 665',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 7$/i,
    displayName: 'Redmi Note 7',
    slug: 'redmi-note-7',
    year: 2019,
    socGlobal: 'Snapdragon 660',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 5 Pro$/i,
    displayName: 'Redmi Note 5 Pro',
    slug: 'redmi-note-5-pro',
    year: 2018,
    socGlobal: 'Snapdragon 636',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },
  {
    brand: 'Xiaomi',
    brandMatch: /^(xiaomi|redmi)$/i,
    nameMatch: /^Redmi Note 4$/i,
    displayName: 'Redmi Note 4',
    slug: 'redmi-note-4',
    year: 2017,
    socGlobal: 'Snapdragon 625',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'xiaomi_standard'
  },

  // =========================================================================
  // 11. MOTOROLA (MOTO EDGE, RAZR, READY FOR & MOTO G)
  // =========================================================================
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /motorola edge 50 ultra/i,
    displayName: 'Motorola Edge 50 Ultra',
    slug: 'motorola-edge-50-ultra',
    year: 2024,
    socGlobal: 'Snapdragon 8s Gen 3',
    usbVideo: true,
    desktopMode: 'Motorola Smart Connect / Ready For (DP Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /motorola edge 50 pro/i,
    displayName: 'Motorola Edge 50 Pro',
    slug: 'motorola-edge-50-pro',
    year: 2024,
    socGlobal: 'Snapdragon 7 Gen 3',
    usbVideo: true,
    desktopMode: 'Motorola Smart Connect / Ready For (DP Alt Mode)',
    sdCard: false,
    jack: false,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /motorola edge 40 pro/i,
    displayName: 'Motorola Edge 40 Pro',
    slug: 'motorola-edge-40-pro',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'Motorola Ready For (Wired DP Alt Mode & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /motorola edge 40$/i,
    displayName: 'Motorola Edge 40',
    slug: 'motorola-edge-40',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 8020',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /motorola edge 30 ultra/i,
    displayName: 'Motorola Edge 30 Ultra',
    slug: 'motorola-edge-30-ultra',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'Motorola Ready For (Wired DP Alt Mode & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /ThinkPhone/i,
    displayName: 'ThinkPhone by Motorola',
    slug: 'motorola-thinkphone',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'ThinkPhone Ready For & PC Integration',
    sdCard: false,
    jack: false,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /razr 50 ultra/i,
    displayName: 'Motorola Razr 50 Ultra / Razr+ (2024)',
    slug: 'motorola-razr-50-ultra',
    year: 2024,
    socGlobal: 'Snapdragon 8s Gen 3',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /razr 40 ultra/i,
    displayName: 'Motorola Razr 40 Ultra / Razr+',
    slug: 'motorola-razr-40-ultra',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /moto g\(?100\)?/i,
    displayName: 'Motorola Moto G100',
    slug: 'motorola-moto-g100',
    year: 2021,
    socGlobal: 'Snapdragon 870',
    usbVideo: true,
    desktopMode: 'Motorola Ready For (Wired Desktop Cradle)',
    sdCard: true,
    jack: true,
    rules: 'motorola_readyfor'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /moto g84 5G/i,
    displayName: 'Motorola Moto G84 5G',
    slug: 'motorola-moto-g84-5g',
    year: 2023,
    socGlobal: 'Snapdragon 695 5G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    brandMatch: /^motorola$/i,
    nameMatch: /moto g \(5\) plus/i,
    displayName: 'Motorola Moto G5 Plus',
    slug: 'motorola-moto-g5-plus',
    year: 2017,
    socGlobal: 'Snapdragon 625',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'motorola_standard'
  },

  // =========================================================================
  // 12. SONY XPERIA
  // =========================================================================
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 1 VI$/i,
    displayName: 'Xperia 1 VI',
    slug: 'sony-xperia-1-vi',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 1 V$/i,
    displayName: 'Xperia 1 V',
    slug: 'sony-xperia-1-v',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 1 IV$/i,
    displayName: 'Xperia 1 IV',
    slug: 'sony-xperia-1-iv',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 1 III$/i,
    displayName: 'Xperia 1 III',
    slug: 'sony-xperia-1-iii',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 1 II$/i,
    displayName: 'Xperia 1 II',
    slug: 'sony-xperia-1-ii',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 5 V$/i,
    displayName: 'Xperia 5 V',
    slug: 'sony-xperia-5-v',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 5 IV$/i,
    displayName: 'Xperia 5 IV',
    slug: 'sony-xperia-5-iv',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 5 II$/i,
    displayName: 'Xperia 5 II',
    slug: 'sony-xperia-5-ii',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'DisplayPort 4K 60Hz Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 10 VI$/i,
    displayName: 'Xperia 10 VI',
    slug: 'sony-xperia-10-vi',
    year: 2024,
    socGlobal: 'Snapdragon 6 Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia 10 V$/i,
    displayName: 'Xperia 10 V',
    slug: 'sony-xperia-10-v',
    year: 2023,
    socGlobal: 'Snapdragon 695 5G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    brandMatch: /^sony$/i,
    nameMatch: /^Xperia XZ Premium$/i,
    displayName: 'Xperia XZ Premium',
    slug: 'sony-xperia-xz-premium',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'USB 3.1 DisplayPort Out',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },

  // =========================================================================
  // 13. NOTHING & CMF
  // =========================================================================
  {
    brand: 'Nothing',
    brandMatch: /^nothing$/i,
    nameMatch: /Phone \(2\)$/i,
    displayName: 'Nothing Phone (2)',
    slug: 'nothing-phone-2',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'nothing_standard'
  },
  {
    brand: 'Nothing',
    brandMatch: /^nothing$/i,
    nameMatch: /Phone \(1\)$/i,
    displayName: 'Nothing Phone (1)',
    slug: 'nothing-phone-1',
    year: 2022,
    socGlobal: 'Snapdragon 778G+',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'nothing_standard'
  },
  {
    brand: 'Nothing',
    brandMatch: /^nothing$/i,
    nameMatch: /Phone \(2a\)$/i,
    displayName: 'Nothing Phone (2a)',
    slug: 'nothing-phone-2a',
    year: 2024,
    socGlobal: 'MediaTek Dimensity 7200 Pro',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'nothing_standard'
  },
  {
    brand: 'CMF by Nothing',
    brandMatch: /^(cmf by nothing|nothing)$/i,
    nameMatch: /CMF Phone 1/i,
    displayName: 'CMF Phone 1',
    slug: 'cmf-phone-1',
    year: 2024,
    socGlobal: 'MediaTek Dimensity 7300',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'nothing_standard'
  },

  // =========================================================================
  // 14. ASUS (ROG PHONE & ZENFONE)
  // =========================================================================
  {
    brand: 'Asus',
    brandMatch: /^asus$/i,
    nameMatch: /rog phone 8/i,
    displayName: 'Asus ROG Phone 8 Pro',
    slug: 'asus-rog-phone-8-pro',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'ROG DisplayPort Gaming & Desktop Mode',
    sdCard: false,
    jack: true,
    rules: 'asus_rog_zenfone'
  },
  {
    brand: 'Asus',
    brandMatch: /^asus$/i,
    nameMatch: /rog phone 7/i,
    displayName: 'Asus ROG Phone 7',
    slug: 'asus-rog-phone-7',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'ROG DisplayPort Gaming & Desktop Mode',
    sdCard: false,
    jack: true,
    rules: 'asus_rog_zenfone'
  },
  {
    brand: 'Asus',
    brandMatch: /^asus$/i,
    nameMatch: /rog phone 6/i,
    displayName: 'Asus ROG Phone 6',
    slug: 'asus-rog-phone-6',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'ROG DisplayPort Gaming & Desktop Mode',
    sdCard: false,
    jack: true,
    rules: 'asus_rog_zenfone'
  },
  {
    brand: 'Asus',
    brandMatch: /^asus$/i,
    nameMatch: /zenfone 10/i,
    displayName: 'Asus Zenfone 10',
    slug: 'asus-zenfone-10',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'asus_rog_zenfone'
  },
  {
    brand: 'Asus',
    brandMatch: /^asus$/i,
    nameMatch: /zenfone 9/i,
    displayName: 'Asus Zenfone 9',
    slug: 'asus-zenfone-9',
    year: 2022,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'asus_rog_zenfone'
  },

  // =========================================================================
  // 15. LG (FLAGSHIP V & G SERIES, QUAD-DAC & SCREEN+)
  // =========================================================================
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /V60 ThinQ/i,
    displayName: 'LG V60 ThinQ 5G',
    slug: 'lg-v60-thinq-5g',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'LG Screen+ Desktop Mode (USB 3.1 DP)',
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /V50 ThinQ/i,
    displayName: 'LG V50 ThinQ 5G',
    slug: 'lg-v50-thinq-5g',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'LG Screen+ Desktop Mode (USB 3.1 DP)',
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /^V30$/i,
    displayName: 'LG V30',
    slug: 'lg-v30',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'USB 3.1 DisplayPort Out',
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /^V20$/i,
    displayName: 'LG V20',
    slug: 'lg-v20',
    year: 2016,
    socGlobal: 'Snapdragon 820',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /G8.*ThinQ/i,
    displayName: 'LG G8 ThinQ',
    slug: 'lg-g8-thinq',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'LG Screen+ Desktop Mode',
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /G7 ThinQ/i,
    displayName: 'LG G7 ThinQ',
    slug: 'lg-g7-thinq',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'USB 3.1 DisplayPort Out',
    sdCard: true,
    jack: true,
    rules: 'lg_standard'
  },
  {
    brand: 'LG',
    brandMatch: /^(lg|lge)$/i,
    nameMatch: /LG WING/i,
    displayName: 'LG Wing 5G',
    slug: 'lg-wing-5g',
    year: 2020,
    socGlobal: 'Snapdragon 765G',
    usbVideo: true,
    desktopMode: 'LG Swivel Dual Screen & Desktop Mode',
    sdCard: true,
    jack: false,
    rules: 'lg_standard'
  },

  // =========================================================================
  // 16. REALME (GT SERIES & FASTBOOT)
  // =========================================================================
  {
    brand: 'Realme',
    brandMatch: /^realme$/i,
    nameMatch: /GT 2 Pro/i,
    displayName: 'Realme GT 2 Pro',
    slug: 'realme-gt-2-pro',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'realme_deeptesting'
  },
  {
    brand: 'Realme',
    brandMatch: /^realme$/i,
    nameMatch: /realme GT 5G/i,
    displayName: 'Realme GT 5G',
    slug: 'realme-gt-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'realme_deeptesting'
  },
  {
    brand: 'Realme',
    brandMatch: /^realme$/i,
    nameMatch: /X2Pro/i,
    displayName: 'Realme X2 Pro',
    slug: 'realme-x2-pro',
    year: 2019,
    socGlobal: 'Snapdragon 855+',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'realme_deeptesting'
  },

  // =========================================================================
  // 17. ZTE & REDMAGIC (GAMING PHONES WITH DISPLAYPORT)
  // =========================================================================
  {
    brand: 'ZTE',
    brandMatch: /^(zte|redmagic|nubia)$/i,
    nameMatch: /REDMAGIC 9 Pro/i,
    displayName: 'ZTE RedMagic 9 Pro',
    slug: 'zte-redmagic-9-pro',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'RedMagic Studio PC & Direct DP 4K Console Mode',
    sdCard: false,
    jack: true,
    rules: 'redmagic_standard'
  },
  {
    brand: 'ZTE',
    brandMatch: /^(zte|redmagic|nubia)$/i,
    nameMatch: /REDMAGIC 7/i,
    displayName: 'ZTE RedMagic 7',
    slug: 'zte-redmagic-7',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'RedMagic Studio PC & Direct DP Console Mode',
    sdCard: false,
    jack: true,
    rules: 'redmagic_standard'
  },

  // =========================================================================
  // 18. HTC (LEGENDARY ROOT ICONS)
  // =========================================================================
  {
    brand: 'HTC',
    brandMatch: /^htc$/i,
    nameMatch: /^10$/i,
    displayName: 'HTC 10',
    slug: 'htc-10',
    year: 2016,
    socGlobal: 'Snapdragon 820',
    usbVideo: true,
    desktopMode: 'DisplayPort over USB Type-C 3.1',
    sdCard: true,
    jack: true,
    rules: 'htc_htcdev'
  },
  {
    brand: 'HTC',
    brandMatch: /^htc$/i,
    nameMatch: /^HTC U11$/i,
    displayName: 'HTC U11',
    slug: 'htc-u11',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'DisplayPort over USB Type-C 3.1',
    sdCard: true,
    jack: false,
    rules: 'htc_htcdev'
  },
  {
    brand: 'HTC',
    brandMatch: /^htc$/i,
    nameMatch: /^U12\s*\+$/i,
    displayName: 'HTC U12+',
    slug: 'htc-u12-plus',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'DisplayPort over USB Type-C 3.1',
    sdCard: true,
    jack: false,
    rules: 'htc_htcdev'
  },
  {
    brand: 'HTC',
    brandMatch: /^htc$/i,
    nameMatch: /^One \(M8\)$/i,
    displayName: 'HTC One (M8)',
    slug: 'htc-one-m8',
    year: 2014,
    socGlobal: 'Snapdragon 801',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'htc_htcdev'
  },
  {
    brand: 'HTC',
    brandMatch: /^htc$/i,
    nameMatch: /^ONE$/i,
    displayName: 'HTC One (M7)',
    slug: 'htc-one-m7',
    year: 2013,
    socGlobal: 'Snapdragon 600',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'htc_htcdev'
  },

  // =========================================================================
  // 19. ESSENTIAL & FAIRPHONE
  // =========================================================================
  {
    brand: 'Essential',
    brandMatch: /^essential/i,
    nameMatch: /^PH-1$/i,
    displayName: 'Essential Phone PH-1',
    slug: 'essential-phone-ph-1',
    year: 2017,
    socGlobal: 'Snapdragon 835',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'essential_ph1'
  },
  {
    brand: 'Fairphone',
    brandMatch: /^fairphone$/i,
    nameMatch: /Fairphone 5/i,
    displayName: 'Fairphone 5',
    slug: 'fairphone-5',
    year: 2023,
    socGlobal: 'Qualcomm QCM6490',
    usbVideo: true,
    desktopMode: 'DisplayPort Alt Mode (USB 3.0)',
    sdCard: true,
    jack: false,
    rules: 'fairphone_open'
  },
  {
    brand: 'Fairphone',
    brandMatch: /^fairphone$/i,
    nameMatch: /Fairphone 4/i,
    displayName: 'Fairphone 4',
    slug: 'fairphone-4',
    year: 2021,
    socGlobal: 'Snapdragon 750G 5G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'fairphone_open'
  }
];

// -------------------------------------------------------------
// BUILD VARIANTS ACCORDING TO OEM HEURISTICS & CUSTOM ROMS
// -------------------------------------------------------------

function buildVariantsForFamily(target, gpMatch) {
  const rawModels = gpMatch ? gpMatch.models : [];
  const codenames = gpMatch ? gpMatch.codenames : ['device'];
  const mainCodename = codenames[0] || 'device';

  // Filter out empty or whitespace model strings
  const models = rawModels.map(m => m.trim()).filter(Boolean);

  // 1. SAMSUNG HEURISTICS
  if (target.rules.startsWith('samsung')) {
    const isLockedAll = target.rules === 'samsung_locked_all';
    const isConditionalOneUI8 = target.rules === 'samsung_conditional_oneui8';
    const isLegacy = target.rules === 'samsung_legacy';

    // Model separation: Never group North America (U/U1/W) with International (F/FD/B/N) or China (0)
    const globalModels = models.filter(m => /(F|FD|B|B\/DS|N|G|S|K|L)$/i.test(m) || /^SC-/i.test(m));
    const naModels = models.filter(m => /(U|U1|W|DL|A|V|T|P)$/i.test(m));
    const chinaModels = models.filter(m => /0$/i.test(m));

    // Fallbacks if no models found in CSV
    const fallbackGlobal = [`SM-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}B`];
    const fallbackNA = [`SM-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}U`];

    const variants = [];

    // Global Variant
    if (globalModels.length > 0 || (naModels.length === 0 && chinaModels.length === 0)) {
      const gList = globalModels.length > 0 ? globalModels : fallbackGlobal;
      variants.push({
        models: gList,
        codename: codenames.find(c => /lte|s$|b$/i.test(c)) || mainCodename,
        region: 'Global / Europe / International',
        soc: target.socGlobal || 'Exynos',
        bootloader_unlockable: isLockedAll ? 'NO' : (isConditionalOneUI8 ? 'CONDITIONAL' : 'YES'),
        unlock_method: isLockedAll
          ? 'Permanently locked worldwide. Samsung Knox rollback bit & One UI 7/8 bootloader lockdown prevent OEM bootloader unlocking.'
          : (isConditionalOneUI8
              ? 'OEM Unlock toggle available. Note: If updated to One UI 8.0 bootloader binary bit, downgrade is blocked by Knox rollback prevention.'
              : (isLegacy ? 'OEM Unlock toggle in Developer Options + Odin Flash' : 'OEM Unlock toggle in Developer Options + Long-press Volume Up in Download Mode')),
        root_status: isLockedAll ? 'LOCKED' : (isConditionalOneUI8 ? 'CONDITIONAL' : 'FULL'),
        root_methods: isLockedAll ? [] : ['Magisk', 'KernelSU', 'APatch'],
        custom_recovery: isLockedAll ? 'None' : (isLegacy ? 'TWRP Official' : 'TWRP Official / Unofficial'),
        custom_kernel_support: isLockedAll ? 'NONE' : 'HIGH',
        custom_roms: isLockedAll ? [] : ['LineageOS Official', 'crDroid', 'HadesROM / HadesKernel'],
        links: {
          xda: 'https://xdaforums.com/'
        }
      });
    }

    // North America Variant (Permanently Locked on Qualcomm)
    if (naModels.length > 0 || variants.length > 0) {
      const nList = naModels.length > 0 ? naModels : fallbackNA;
      variants.push({
        models: nList,
        codename: codenames.find(c => /q/i.test(c)) || `${mainCodename}_na`,
        region: 'USA / Canada Carrier & Unlocked',
        soc: target.socNA || target.socGlobal || 'Snapdragon',
        bootloader_unlockable: 'NO',
        unlock_method: 'Permanently locked North American carrier bootloader and Knox security',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/'
        }
      });
    }

    // China / HK Variant
    if (chinaModels.length > 0) {
      variants.push({
        models: chinaModels,
        codename: codenames.find(c => /chn|0$/i.test(c)) || `${mainCodename}_chn`,
        region: 'China / Hong Kong Open Market',
        soc: target.socChina || target.socGlobal || 'Snapdragon',
        bootloader_unlockable: isLockedAll ? 'NO' : 'YES',
        unlock_method: isLockedAll
          ? 'Locked on One UI 8 bootloader'
          : 'OEM Unlock toggle + CROM service / Odin flash',
        root_status: isLockedAll ? 'LOCKED' : 'FULL',
        root_methods: isLockedAll ? [] : ['Magisk', 'APatch'],
        custom_recovery: isLockedAll ? 'None' : 'TWRP Unofficial',
        custom_kernel_support: isLockedAll ? 'NONE' : 'MODERATE',
        custom_roms: isLockedAll ? [] : ['LineageOS Unofficial'],
        links: {
          xda: 'https://xdaforums.com/'
        }
      });
    }

    return variants;
  }

  // 2. GOOGLE PIXEL HEURISTICS
  if (target.rules === 'google_pixel') {
    return [
      {
        models: models.length > 0 ? models : [`Pixel ${target.displayName}`],
        codename: mainCodename,
        region: 'Global / Factory Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking toggle in Developer Options + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / Kernel Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['GrapheneOS Official', 'LineageOS Official', 'CalyxOS', 'EvolutionX', 'PixelOS'],
        links: {
          xda: 'https://xdaforums.com/',
          github: 'https://github.com/tiann/KernelSU'
        }
      },
      {
        models: [`${mainCodename.toUpperCase()}-VZW`],
        codename: `${mainCodename}_vzw`,
        region: 'Verizon / Carrier Locked',
        soc: target.socGlobal,
        bootloader_unlockable: 'NO',
        unlock_method: 'Permanently locked by Verizon carrier policy; OEM Unlocking greyed out',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/'
        }
      }
    ];
  }

  // 3. XIAOMI & POCO HEURISTICS
  if (target.rules.startsWith('xiaomi') || target.rules.startsWith('poco')) {
    const isHyperOS = target.rules.includes('hyperos');
    const chinaModels = models.filter(m => /C$/i.test(m));
    const globalModels = models.filter(m => !/C$/i.test(m));

    const finalGlobal = globalModels.length > 0 ? globalModels : (models.length > 0 ? models : [`${mainCodename.toUpperCase()}-Global`]);
    const finalChina = chinaModels.length > 0 ? chinaModels : [`${mainCodename.toUpperCase()}-CN`];

    return [
      {
        models: finalGlobal,
        codename: mainCodename,
        region: 'Global / Europe / India',
        soc: target.socGlobal,
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: isHyperOS
          ? 'Mi Account pairing in Developer Settings + Mi Unlock tool (Requires Mi Community account verification and 7-day wait)'
          : 'Mi Account pairing + Mi Unlock tool (7-day wait timer)',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'TWRP Official / OrangeFox',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'crDroid', 'EvolutionX', 'PixelOS', 'Paranoid Android'],
        links: { xda: 'https://xdaforums.com/' }
      },
      {
        models: finalChina,
        codename: `${mainCodename}_cn`,
        region: 'China Domestic',
        soc: target.socGlobal,
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Requires Mainland China Xiaomi Community Level 5 account and real-name authentication under HyperOS',
        root_status: 'CONDITIONAL',
        root_methods: ['KernelSU', 'Magisk'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['Xiaomi.eu Community ROM', 'LineageOS Unofficial'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 4. ONEPLUS HEURISTICS
  if (target.rules === 'oneplus_modern' || target.rules === 'oneplus_legacy') {
    const isLegacy = target.rules === 'oneplus_legacy';
    return [
      {
        models: models.length > 0 ? models : [`OnePlus-${target.slug}`],
        codename: mainCodename,
        region: 'Global / Europe / North America / India',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: isLegacy
          ? 'Developer Options toggle + fastboot oem unlock'
          : 'OEM Unlock in Developer Options + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: isLegacy ? 'TWRP Official' : 'Fastbootd / Kernel Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'Nameless AOSP', 'crDroid', 'Paranoid Android'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 5. MOTOROLA HEURISTICS
  if (target.rules.startsWith('motorola')) {
    return [
      {
        models: models.length > 0 ? models : [`XT-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}`],
        codename: mainCodename,
        region: 'Global / Retail Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'Motorola Bootloader Unlock Website (Unlock Key generation via fastboot oem get_unlock_data)',
        root_status: 'FULL',
        root_methods: ['Magisk', 'APatch'],
        custom_recovery: 'Fastbootd / Boot Image Patch',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['LineageOS Official', 'crDroid'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 6. SONY XPERIA HEURISTICS
  if (target.rules === 'sony_xperia') {
    return [
      {
        models: models.length > 0 ? models : [`XQ-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}`],
        codename: mainCodename,
        region: 'Global / Europe / Asia Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'Sony Open Devices Program (Unlock code via service menu *#*#7378423#*#* + fastboot oem unlock)',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / Kernel Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'SailfishOS Official'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 7. NOTHING PHONE HEURISTICS
  if (target.rules === 'nothing_standard') {
    return [
      {
        models: models.length > 0 ? models : [`Nothing-${target.slug}`],
        codename: mainCodename,
        region: 'Global / Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlock in Developer Options + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / Boot Image Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'Paranoid Android'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 8. FAIRPHONE HEURISTICS
  if (target.rules === 'fairphone_open') {
    return [
      {
        models: models.length > 0 ? models : ['FP5'],
        codename: mainCodename,
        region: 'Global / Official',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'Fairphone official bootloader unlock code website + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / TWRP',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'e/OS/ Official', 'PostmarketOS', 'Ubuntu Touch'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 9. ASUS ROG & ZENFONE
  if (target.rules === 'asus_rog_zenfone') {
    return [
      {
        models: models.length > 0 ? models : [target.displayName],
        codename: mainCodename,
        region: 'Global / Official',
        soc: target.socGlobal || 'Qualcomm Snapdragon',
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Official Asus Unlock Device App (Subject to Asus unlock server availability)',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / TWRP',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Unofficial', 'OmniROM'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 10. LG HEURISTICS (SCREEN+ & HI-FI QUAD DAC)
  if (target.rules === 'lg_standard') {
    return [
      {
        models: models.length > 0 ? models : [`LM-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}`],
        codename: mainCodename,
        region: 'Global / Europe / Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Qualcomm EDL 9008 firehose / QFIL extraction or legacy LG Dev token unlock',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP Official / Unofficial',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'Havoc-OS', 'DotOS'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 11. REALME HEURISTICS
  if (target.rules === 'realme_deeptesting') {
    return [
      {
        models: models.length > 0 ? models : [`RMX-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}`],
        codename: mainCodename,
        region: 'Global / Europe / India',
        soc: target.socGlobal,
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Realme Official In-Depth Test (DeepTesting APK) server approval + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'TWRP / OrangeFox',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'crDroid', 'PixelOS'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 12. ZTE REDMAGIC HEURISTICS
  if (target.rules === 'redmagic_standard') {
    return [
      {
        models: models.length > 0 ? models : [`NX-${target.displayName.replace(/[^a-zA-Z0-9]/g, '')}`],
        codename: mainCodename,
        region: 'Global / Official',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking toggle in Developer Settings + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Kernel Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Unofficial'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 13. HTC HEURISTICS
  if (target.rules === 'htc_htcdev') {
    return [
      {
        models: models.length > 0 ? models : [target.displayName],
        codename: mainCodename,
        region: 'Global / Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'HTCDev official token unlock (fastboot oem get_identifier_token) or Sunshine S-OFF',
        root_status: 'FULL',
        root_methods: ['Magisk'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'Resurrection Remix', 'ViperOne'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 14. ESSENTIAL PHONE HEURISTICS
  if (target.rules === 'essential_ph1') {
    return [
      {
        models: models.length > 0 ? models : ['PH-1'],
        codename: mainCodename,
        region: 'Global / Factory Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking in Developer Settings + fastboot flashing unlock && fastboot flashing unlock_critical',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'Magisk', 'APatch'],
        custom_recovery: 'Fastbootd / Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'EvolutionX', 'ProtonAOSP'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // Default Fallback
  return [
    {
      models: models.length > 0 ? models : [target.displayName],
      codename: mainCodename,
      region: 'Global / Unlocked',
      soc: target.socGlobal || 'Qualcomm Snapdragon',
      bootloader_unlockable: 'YES',
      unlock_method: 'OEM Unlock toggle + fastboot flashing unlock',
      root_status: 'FULL',
      root_methods: ['KernelSU', 'Magisk'],
      custom_recovery: 'Fastbootd / Boot Image Patch',
      custom_kernel_support: 'MODERATE',
      custom_roms: ['LineageOS Official'],
      links: { xda: 'https://xdaforums.com/' }
    }
  ];
}

// -------------------------------------------------------------
// MAIN BATCH GENERATOR EXECUTION
// -------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null;

  console.log(`Starting IsItRootable Automated Database Generator...`);
  console.log(`Configured target families: ${TARGET_FAMILIES.length}`);
  if (brandFilter) {
    console.log(`Filtering by brand: ${brandFilter}`);
  }

  let generatedCount = 0;
  let updatedCount = 0;

  for (const target of TARGET_FAMILIES) {
    if (brandFilter && target.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      continue;
    }

    const bPattern = target.brandMatch || new RegExp(`^${target.brand}$`, 'i');
    const gpMatch = gpData.find(d => {
      if (!bPattern.test(d.brand)) return false;
      return target.nameMatch.test(d.name);
    });

    const variants = buildVariantsForFamily(target, gpMatch);

    const deviceRecord = {
      slug: target.slug,
      brand: target.brand,
      name: target.displayName,
      release_year: target.year,
      hardware_features: {
        usb_video_out: target.usbVideo,
        desktop_mode: target.desktopMode,
        sdcard_slot: target.sdCard,
        headphone_jack: target.jack
      },
      variants
    };

    const filePath = path.join(DEVICES_DIR, `${target.slug}.json`);
    const exists = fs.existsSync(filePath);

    fs.writeFileSync(filePath, JSON.stringify(deviceRecord, null, 2), 'utf8');

    if (exists) {
      updatedCount++;
      console.log(`  [UPDATE] ${target.brand} ${target.displayName} -> data/devices/${target.slug}.json`);
    } else {
      generatedCount++;
      console.log(`  [CREATE] ${target.brand} ${target.displayName} -> data/devices/${target.slug}.json`);
    }
  }

  console.log(`\n🎉 Completed! Created ${generatedCount} new devices, updated ${updatedCount} devices.`);
}

main();
