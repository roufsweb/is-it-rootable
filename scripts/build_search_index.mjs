#!/usr/bin/env node
/**
 * scripts/build_search_index.mjs
 * 
 * Compiles all data/devices/*.json into an optimized search index and data bundle.
 * Tokenizes hyphenated model numbers (e.g. "SM-G950F" generates "G950F" and "SM-G950F")
 * to guarantee instant matching regardless of whether the user types the OEM prefix.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEVICES_DIR = path.join(ROOT_DIR, 'data', 'devices');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(SRC_DATA_DIR)) fs.mkdirSync(SRC_DATA_DIR, { recursive: true });

function tokenizeModels(models) {
  const tokenSet = new Set();
  for (const m of models) {
    tokenSet.add(m);
    tokenSet.add(m.toUpperCase());
    // Strip common hyphens / underscores (e.g., SM-G950F -> G950F, SMG950F)
    const stripped = m.replace(/[-_\s]/g, '');
    tokenSet.add(stripped);
    // Remove OEM brand prefixes like SM-, CPH-, IN2015 -> 2015
    const parts = m.split(/[-_]/);
    if (parts.length > 1) {
      parts.forEach(p => {
        if (p.length >= 3) tokenSet.add(p);
      });
      // Suffix without prefix (e.g. G950F from SM-G950F)
      tokenSet.add(parts.slice(1).join('-'));
    }
  }
  return Array.from(tokenSet);
}

function getOverallRootStatus(variants) {
  const statuses = variants.map(v => v.root_status);
  const allFull = statuses.every(s => s === 'FULL');
  const allLocked = statuses.every(s => s === 'LOCKED');
  if (allFull) return 'FULL';
  if (allLocked) return 'LOCKED';
  return 'CONDITIONAL';
}

function getOverallBootloader(variants) {
  const bls = variants.map(v => v.bootloader_unlockable);
  if (bls.every(b => b === 'YES')) return 'YES';
  if (bls.every(b => b === 'NO')) return 'NO';
  return 'CONDITIONAL';
}

function detectSocFamily(socString) {
  const s = (socString || '').toLowerCase();
  if (s.includes('snapdragon') || s.includes('qualcomm') || s.includes('sm8') || s.includes('sm7') || s.includes('sm6') || s.includes('sd8') || s.includes('sd7')) {
    return 'Snapdragon';
  }
  if (s.includes('dimensity') || s.includes('helio') || s.includes('mediatek') || s.includes('mt6')) {
    return 'MediaTek';
  }
  if (s.includes('exynos')) {
    return 'Exynos';
  }
  if (s.includes('tensor')) {
    return 'Tensor';
  }
  if (s.includes('tegra')) {
    return 'Tegra';
  }
  if (s.includes('unisoc') || s.includes('spreadtrum') || s.includes('tiger')) {
    return 'Unisoc';
  }
  if (s.includes('kirin')) {
    return 'Kirin';
  }
  return 'Other';
}

function main() {
  if (!fs.existsSync(DEVICES_DIR)) {
    console.error(`Devices directory not found at ${DEVICES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Processing ${files.length} device records...`);

  const searchEntries = [];
  const allDevices = [];

  for (const file of files) {
    const fullPath = path.join(DEVICES_DIR, file);
    const device = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    const allModels = device.variants.flatMap(v => v.models || []);
    const tokenizedModels = tokenizeModels(allModels);
    const allCodenames = Array.from(new Set(device.variants.map(v => v.codename).filter(Boolean)));
    const allSoc = Array.from(new Set(device.variants.map(v => v.soc).filter(Boolean)));
    const allRoms = Array.from(new Set(device.variants.flatMap(v => v.custom_roms || [])));

    const overallRoot = getOverallRootStatus(device.variants);
    const overallBootloader = getOverallBootloader(device.variants);
    const formFactor = device.form_factor || 'phone';
    const socFamily = detectSocFamily(allSoc.join(', '));

    const entry = {
      id: device.slug,
      slug: device.slug,
      brand: device.brand,
      name: device.name,
      fullName: `${device.brand} ${device.name}`,
      release_year: device.release_year,
      form_factor: formFactor,
      codenames: allCodenames.join(' '),
      models: tokenizedModels.join(' '),
      rawModels: allModels,
      soc: allSoc.join(', '),
      soc_family: socFamily,
      custom_roms: allRoms,
      overallRoot,
      overallBootloader,
      usb_video_out: device.hardware_features?.usb_video_out ?? false,
      desktop_mode: device.hardware_features?.desktop_mode ?? null,
      sdcard_slot: device.hardware_features?.sdcard_slot ?? false,
      headphone_jack: device.hardware_features?.headphone_jack ?? false,
      variantsCount: device.variants.length,
      sampleVariants: device.variants.map(v => ({
        region: v.region,
        models: v.models,
        soc: v.soc,
        root_status: v.root_status,
        bootloader_unlockable: v.bootloader_unlockable,
        custom_roms: v.custom_roms || []
      }))
    };

    searchEntries.push(entry);
    allDevices.push(device);
  }

  // Write static bundles
  const outputPath = path.join(SRC_DATA_DIR, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchEntries, null, 2), 'utf8');

  const publicOutputPath = path.join(PUBLIC_DIR, 'search-index.json');
  fs.writeFileSync(publicOutputPath, JSON.stringify(searchEntries), 'utf8');

  const allDevicesPath = path.join(SRC_DATA_DIR, 'all-devices.json');
  fs.writeFileSync(allDevicesPath, JSON.stringify(allDevices, null, 2), 'utf8');

  console.log(`✅ Generated search index with ${searchEntries.length} items at:`);
  console.log(`   - ${outputPath}`);
  console.log(`   - ${publicOutputPath}`);
  console.log(`   - ${allDevicesPath}`);
}

main();

