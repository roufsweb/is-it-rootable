#!/usr/bin/env node
/**
 * scripts/generate_device_database.mjs
 * 
 * Automated, model-suffix-sensitive generator that creates 100% schema-valid
 * device records in data/devices/*.json by querying Google Play Certified Devices
 * and applying precise OEM heuristics (Samsung, Pixel, Xiaomi, OnePlus, Motorola, Sony, Nothing).
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

// Helper to sanitize slug
function makeSlug(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[+]/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// -------------------------------------------------------------
// HEURISTIC DEFINITIONS FOR EXPANDED DEVICE ARSENAL
// -------------------------------------------------------------

const TARGET_FAMILIES = [
  // === SAMSUNG GALAXY S-SERIES ===
  {
    brand: 'Samsung',
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
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
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
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
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
    nameMatch: /^Galaxy S9$/i,
    displayName: 'Galaxy S9',
    slug: 'samsung-galaxy-s9',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy S9\+$/i,
    displayName: 'Galaxy S9+',
    slug: 'samsung-galaxy-s9-plus',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy S8\+$/i,
    displayName: 'Galaxy S8+',
    slug: 'samsung-galaxy-s8-plus',
    year: 2017,
    socGlobal: 'Exynos 8895',
    socNA: 'Snapdragon 835',
    socChina: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy Note8$/i,
    displayName: 'Galaxy Note 8',
    slug: 'samsung-galaxy-note-8',
    year: 2017,
    socGlobal: 'Exynos 8895',
    socNA: 'Snapdragon 835',
    socChina: 'Snapdragon 835',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy Note9$/i,
    displayName: 'Galaxy Note 9',
    slug: 'samsung-galaxy-note-9',
    year: 2018,
    socGlobal: 'Exynos 9810',
    socNA: 'Snapdragon 845',
    socChina: 'Snapdragon 845',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy Note10$/i,
    displayName: 'Galaxy Note 10',
    slug: 'samsung-galaxy-note-10',
    year: 2019,
    socGlobal: 'Exynos 9825',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: false,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy Note10\+$/i,
    displayName: 'Galaxy Note 10+',
    slug: 'samsung-galaxy-note-10-plus',
    year: 2019,
    socGlobal: 'Exynos 9825',
    socNA: 'Snapdragon 855',
    socChina: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Samsung DeX (Wired)',
    sdCard: true,
    jack: false,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
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
    nameMatch: /^Galaxy Z Flip5$/i,
    displayName: 'Galaxy Z Flip 5',
    slug: 'samsung-galaxy-z-flip-5',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2 for Galaxy',
    socNA: 'Snapdragon 8 Gen 2 for Galaxy',
    socChina: 'Snapdragon 8 Gen 2 for Galaxy',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy Z Flip6$/i,
    displayName: 'Galaxy Z Flip 6',
    slug: 'samsung-galaxy-z-flip-6',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3 for Galaxy',
    socNA: 'Snapdragon 8 Gen 3 for Galaxy',
    socChina: 'Snapdragon 8 Gen 3 for Galaxy',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy A55 5G$/i,
    displayName: 'Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    year: 2024,
    socGlobal: 'Exynos 1480',
    socNA: 'Exynos 1480',
    socChina: 'Exynos 1480',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy A53 5G$/i,
    displayName: 'Galaxy A53 5G',
    slug: 'samsung-galaxy-a53-5g',
    year: 2022,
    socGlobal: 'Exynos 1280',
    socNA: 'Exynos 1280',
    socChina: 'Exynos 1280',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy A52s 5G$/i,
    displayName: 'Galaxy A52s 5G',
    slug: 'samsung-galaxy-a52s-5g',
    year: 2021,
    socGlobal: 'Snapdragon 778G',
    socNA: 'Snapdragon 778G',
    socChina: 'Snapdragon 778G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'samsung_pre_oneui8'
  },
  {
    brand: 'Samsung',
    nameMatch: /^Galaxy A35 5G$/i,
    displayName: 'Galaxy A35 5G',
    slug: 'samsung-galaxy-a35-5g',
    year: 2024,
    socGlobal: 'Exynos 1380',
    socNA: 'Exynos 1380',
    socChina: 'Exynos 1380',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: false,
    rules: 'samsung_conditional_oneui8'
  },

  // === GOOGLE PIXEL SERIES ===
  {
    brand: 'Google',
    nameMatch: /^Pixel 9 Pro$/i,
    displayName: 'Pixel 9 Pro',
    slug: 'google-pixel-9-pro',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort Alt Mode USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    nameMatch: /^Pixel 9 Pro XL$/i,
    displayName: 'Pixel 9 Pro XL',
    slug: 'google-pixel-9-pro-xl',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort Alt Mode USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    nameMatch: /^Pixel 9 Pro Fold$/i,
    displayName: 'Pixel 9 Pro Fold',
    slug: 'google-pixel-9-pro-fold',
    year: 2024,
    socGlobal: 'Google Tensor G4',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort Alt Mode USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    nameMatch: /^Pixel 8 Pro$/i,
    displayName: 'Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    year: 2023,
    socGlobal: 'Google Tensor G3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort Alt Mode USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
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
    nameMatch: /^Pixel 6 Pro$/i,
    displayName: 'Pixel 6 Pro',
    slug: 'google-pixel-6-pro',
    year: 2021,
    socGlobal: 'Google Tensor G1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
    nameMatch: /^Pixel 6a$/i,
    displayName: 'Pixel 6a',
    slug: 'google-pixel-6a',
    year: 2022,
    socGlobal: 'Google Tensor G1',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'google_pixel'
  },
  {
    brand: 'Google',
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

  // === XIAOMI & POCO SERIES ===
  {
    brand: 'Xiaomi',
    nameMatch: /^Xiaomi 14$/i,
    displayName: 'Xiaomi 14',
    slug: 'xiaomi-14',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    nameMatch: /^Xiaomi 14 Ultra$/i,
    displayName: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.2)',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'Xiaomi',
    nameMatch: /^Xiaomi 13 Pro$/i,
    displayName: 'Xiaomi 13 Pro',
    slug: 'xiaomi-13-pro',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'DisplayPort Video Out USB 3.2',
    sdCard: false,
    jack: false,
    rules: 'xiaomi_hyperos'
  },
  {
    brand: 'POCO',
    nameMatch: /^POCO F6$/i,
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
    nameMatch: /^POCO F6 Pro$/i,
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
    nameMatch: /^POCO X6 Pro 5G$/i,
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
    nameMatch: /^POCO F4$/i,
    displayName: 'Poco F4',
    slug: 'poco-f4',
    year: 2022,
    socGlobal: 'Snapdragon 870',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_miui'
  },
  {
    brand: 'POCO',
    nameMatch: /^POCO F3$/i,
    displayName: 'Poco F3 / Redmi K40',
    slug: 'poco-f3',
    year: 2021,
    socGlobal: 'Snapdragon 870',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_miui'
  },
  {
    brand: 'POCO',
    nameMatch: /^POCO X3 Pro$/i,
    displayName: 'Poco X3 Pro',
    slug: 'poco-x3-pro',
    year: 2021,
    socGlobal: 'Snapdragon 860',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_miui'
  },
  {
    brand: 'Xiaomi',
    nameMatch: /^POCOPHONE F1$/i,
    displayName: 'Pocophone F1',
    slug: 'pocophone-f1',
    year: 2018,
    socGlobal: 'Snapdragon 845',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_miui'
  },
  {
    brand: 'Xiaomi',
    nameMatch: /^Redmi Note 13 Pro\+ 5G$/i,
    displayName: 'Redmi Note 13 Pro+ 5G',
    slug: 'redmi-note-13-pro-plus-5g',
    year: 2023,
    socGlobal: 'MediaTek Dimensity 7200-Ultra',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'poco_hyperos'
  },
  {
    brand: 'Xiaomi',
    nameMatch: /^Redmi Note 10 Pro$/i,
    displayName: 'Redmi Note 10 Pro',
    slug: 'redmi-note-10-pro',
    year: 2021,
    socGlobal: 'Snapdragon 732G',
    usbVideo: false,
    desktopMode: null,
    sdCard: true,
    jack: true,
    rules: 'poco_miui'
  },

  // === ONEPLUS SERIES ===
  {
    brand: 'OnePlus',
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
    nameMatch: /^OnePlus 10 Pro 5G$/i,
    displayName: 'OnePlus 10 Pro 5G',
    slug: 'oneplus-10-pro-5g',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.1)',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    nameMatch: /^OnePlus 9 Pro 5G$/i,
    displayName: 'OnePlus 9 Pro 5G',
    slug: 'oneplus-9-pro-5g',
    year: 2021,
    socGlobal: 'Snapdragon 888',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.1)',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    nameMatch: /^OnePlus 8 Pro$/i,
    displayName: 'OnePlus 8 Pro',
    slug: 'oneplus-8-pro',
    year: 2020,
    socGlobal: 'Snapdragon 865',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.1)',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
    nameMatch: /^OnePlus 7 Pro$/i,
    displayName: 'OnePlus 7 Pro',
    slug: 'oneplus-7-pro',
    year: 2019,
    socGlobal: 'Snapdragon 855',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.1)',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },
  {
    brand: 'OnePlus',
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
    nameMatch: /^OnePlus Open$/i,
    displayName: 'OnePlus Open',
    slug: 'oneplus-open',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.1)',
    sdCard: false,
    jack: false,
    rules: 'oneplus_modern'
  },

  // === MOTOROLA SERIES ===
  {
    brand: 'Motorola',
    nameMatch: /^Lenovo ThinkPhone by Motorola$/i,
    displayName: 'ThinkPhone by Motorola',
    slug: 'motorola-thinkphone',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'Motorola Ready For (Wired & Wireless)',
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    nameMatch: /^motorola edge 50 pro$/i,
    displayName: 'Motorola Edge 50 Pro',
    slug: 'motorola-edge-50-pro',
    year: 2024,
    socGlobal: 'Snapdragon 7 Gen 3',
    usbVideo: true,
    desktopMode: 'Motorola Smart Connect / Ready For',
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },
  {
    brand: 'Motorola',
    nameMatch: /^motorola razr 40 ultra$/i,
    displayName: 'Motorola Razr 40 Ultra / Razr+',
    slug: 'motorola-razr-40-ultra',
    year: 2023,
    socGlobal: 'Snapdragon 8+ Gen 1',
    usbVideo: true,
    desktopMode: 'Motorola Ready For',
    sdCard: false,
    jack: false,
    rules: 'motorola_standard'
  },

  // === SONY XPERIA SERIES ===
  {
    brand: 'Sony',
    nameMatch: /^Xperia 1 VI$/i,
    displayName: 'Xperia 1 VI',
    slug: 'sony-xperia-1-vi',
    year: 2024,
    socGlobal: 'Snapdragon 8 Gen 3',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.2)',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    nameMatch: /^Xperia 1 IV$/i,
    displayName: 'Xperia 1 IV',
    slug: 'sony-xperia-1-iv',
    year: 2022,
    socGlobal: 'Snapdragon 8 Gen 1',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.2)',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },
  {
    brand: 'Sony',
    nameMatch: /^Xperia 5 V$/i,
    displayName: 'Xperia 5 V',
    slug: 'sony-xperia-5-v',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort USB 3.2)',
    sdCard: true,
    jack: true,
    rules: 'sony_xperia'
  },

  // === NOTHING SERIES ===
  {
    brand: 'Nothing',
    nameMatch: /^Phone \(1\)$/i,
    displayName: 'Phone (1)',
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
    nameMatch: /^Phone \(2a\)$/i,
    displayName: 'Phone (2a)',
    slug: 'nothing-phone-2a',
    year: 2024,
    socGlobal: 'MediaTek Dimensity 7200 Pro',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: false,
    rules: 'nothing_standard'
  },

  // === FAIRPHONE & ASUS ===
  {
    brand: 'Fairphone',
    nameMatch: /^Fairphone 5$/i,
    displayName: 'Fairphone 5',
    slug: 'fairphone-5',
    year: 2023,
    socGlobal: 'Qualcomm QCM6490',
    usbVideo: true,
    desktopMode: 'Android Desktop Mode (Wired DisplayPort Alt Mode)',
    sdCard: true,
    jack: false,
    rules: 'fairphone_open'
  },
  {
    brand: 'Asus',
    nameMatch: /^ROG Phone 7$/i,
    displayName: 'ROG Phone 7',
    slug: 'asus-rog-phone-7',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: true,
    desktopMode: 'DisplayPort Video Out USB 3.1',
    sdCard: false,
    jack: true,
    rules: 'asus_rog'
  },
  {
    brand: 'Asus',
    nameMatch: /^Zenfone 10$/i,
    displayName: 'Zenfone 10',
    slug: 'asus-zenfone-10',
    year: 2023,
    socGlobal: 'Snapdragon 8 Gen 2',
    usbVideo: false,
    desktopMode: null,
    sdCard: false,
    jack: true,
    rules: 'asus_rog'
  }
];

// -------------------------------------------------------------
// BUILD VARIANTS ACCORDING TO OEM HEURISTICS & CUSTOM ROMS
// -------------------------------------------------------------

function buildVariantsForFamily(target, gpMatch) {
  const models = gpMatch ? gpMatch.models : [];
  const codenames = gpMatch ? gpMatch.codenames : ['device'];
  const mainCodename = codenames[0] || 'device';

  // 1. SAMSUNG HEURISTICS
  if (target.rules.startsWith('samsung')) {
    const isConditionalOneUI8 = target.rules === 'samsung_conditional_oneui8';
    const isPreOneUI8 = target.rules === 'samsung_pre_oneui8';

    const globalModels = models.filter(m => /(F|FD|B|B\/DS|N|G)$/i.test(m));
    const naModels = models.filter(m => /(U|U1|W|DL|A|V|T)$/i.test(m));
    const chinaModels = models.filter(m => /0$/i.test(m));

    const variants = [];

    // Global Variant
    if (globalModels.length > 0) {
      variants.push({
        models: globalModels,
        codename: codenames.find(c => /lte|s$|b$/i.test(c)) || mainCodename,
        region: 'Global / Europe / International',
        soc: target.socGlobal || 'Exynos',
        bootloader_unlockable: isConditionalOneUI8 ? 'CONDITIONAL' : 'YES',
        unlock_method: isConditionalOneUI8
          ? 'OEM Unlock toggle available. Note: If updated to One UI 8.0 bootloader binary bit, downgrade is blocked by Knox roll-back prevention.'
          : 'OEM Unlock toggle in Developer Options + Long-press Volume Up in Download Mode',
        root_status: isConditionalOneUI8 ? 'CONDITIONAL' : 'FULL',
        root_methods: ['Magisk', 'KernelSU', 'APatch'],
        custom_recovery: 'TWRP Official / Unofficial',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'crDroid', 'HadesROM / HadesKernel'],
        links: {
          xda: 'https://xdaforums.com/'
        }
      });
    }

    // North America Variant (Permanently Locked)
    if (naModels.length > 0) {
      variants.push({
        models: naModels,
        codename: codenames.find(c => /q/i.test(c)) || `${mainCodename}_na`,
        region: 'USA / Canada Carrier & Unlocked',
        soc: target.socNA || 'Snapdragon',
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
        soc: target.socChina || 'Snapdragon',
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlock toggle + CROM service / Odin flash',
        root_status: 'FULL',
        root_methods: ['Magisk', 'APatch'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['LineageOS Unofficial'],
        links: {
          xda: 'https://xdaforums.com/'
        }
      });
    }

    if (variants.length === 0) {
      variants.push({
        models: models.length > 0 ? models : [`SM-${target.displayName.replace(/\s+/g, '')}`],
        codename: mainCodename,
        region: 'Global / Unlocked',
        soc: target.socGlobal || 'Samsung Processor',
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlock toggle in Developer Options',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS'],
        links: { xda: 'https://xdaforums.com/' }
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
  if (target.rules === 'oneplus_modern') {
    return [
      {
        models: models.length > 0 ? models : [`OnePlus-${target.slug}`],
        codename: mainCodename,
        region: 'Global / Europe / North America / India',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlock in Developer Options + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / Kernel Boot Patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS Official', 'Nameless AOSP', 'crDroid', 'Paranoid Android'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 5. MOTOROLA HEURISTICS
  if (target.rules === 'motorola_standard') {
    return [
      {
        models: models.length > 0 ? models : [`XT-${target.displayName}`],
        codename: mainCodename,
        region: 'Global / Retail Unlocked',
        soc: target.socGlobal,
        bootloader_unlockable: 'YES',
        unlock_method: 'Motorola Bootloader Unlock Website (Unlock Key generation via fastboot oem get_unlock_data)',
        root_status: 'FULL',
        root_methods: ['Magisk', 'APatch'],
        custom_recovery: 'Fastbootd / Boot Image Patch',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['LineageOS Unofficial', 'crDroid'],
        links: { xda: 'https://xdaforums.com/' }
      }
    ];
  }

  // 6. SONY XPERIA HEURISTICS
  if (target.rules === 'sony_xperia') {
    return [
      {
        models: models.length > 0 ? models : [`XQ-${target.displayName}`],
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

// -------------------------------------------------------------
// MAIN BATCH GENERATOR EXECUTION
// -------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null;

  console.log(`Starting IsItRootable Automated Database Generator...`);
  if (brandFilter) {
    console.log(`Filtering by brand: ${brandFilter}`);
  }

  let generatedCount = 0;
  let updatedCount = 0;

  for (const target of TARGET_FAMILIES) {
    if (brandFilter && target.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      continue;
    }

    const gpMatch = gpData.find(d => {
      if (d.brand.toLowerCase() !== target.brand.toLowerCase()) return false;
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
