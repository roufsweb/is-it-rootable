#!/usr/bin/env node
/**
 * scripts/scrape_device_sources.mjs
 * 
 * Local agent scraping helper to fetch and cross-reference device specs from:
 * 1. LineageOS Wiki raw YAML: https://raw.githubusercontent.com/LineageOS/lineage_wiki/refs/heads/main/_data/devices/{codename}.yml
 * 2. Customrombay raw YAML: https://raw.githubusercontent.com/Customrombay/database/refs/heads/main/data/devices/{codename}.yaml
 * 3. Google Play certified devices: data/raw/google_play_devices.json
 * 
 * Usage:
 *   node scripts/scrape_device_sources.mjs --codename dreamlte
 *   node scripts/scrape_device_sources.mjs --query "galaxy s21"
 *   node scripts/scrape_device_sources.mjs --brand Google
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'data', 'raw');
const CACHE_DIR = path.join(RAW_DIR, 'sources_cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function fetchWithCache(url, cacheKey) {
  const cachePath = path.join(CACHE_DIR, `${cacheKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`);
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath, 'utf8');
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'IsItRootable-Agent/1.0 (Local Developer Tool)'
      }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status} from ${url}`);
    }
    const text = await res.text();
    fs.writeFileSync(cachePath, text, 'utf8');
    return text;
  } catch (err) {
    console.warn(`[WARN] Failed to fetch ${url}:`, err.message);
    return null;
  }
}

async function queryGooglePlay(searchTerm) {
  const gpPath = path.join(RAW_DIR, 'google_play_devices.json');
  if (!fs.existsSync(gpPath)) {
    console.log('[INFO] google_play_devices.json not found in data/raw. Run "python scripts/fetch_google_devices.py" first.');
    return [];
  }
  const allDevices = JSON.parse(fs.readFileSync(gpPath, 'utf8'));
  const term = searchTerm.toLowerCase();

  return allDevices.filter(dev => {
    return (
      dev.name.toLowerCase().includes(term) ||
      dev.brand.toLowerCase().includes(term) ||
      dev.codenames.some(c => c.toLowerCase().includes(term)) ||
      dev.models.some(m => m.toLowerCase().includes(term))
    );
  });
}

async function fetchCodenameSources(codename) {
  console.log(`\n=== Inspecting Codename: ${codename} ===`);

  // 1. LineageOS Wiki
  const lineageUrl = `https://raw.githubusercontent.com/LineageOS/lineage_wiki/refs/heads/main/_data/devices/${codename}.yml`;
  console.log(`Fetching LineageOS: ${lineageUrl}`);
  const lineageContent = await fetchWithCache(lineageUrl, `lineage_${codename}`);
  if (lineageContent) {
    console.log(`[LineageOS Wiki] Found metadata for ${codename}:`);
    const preview = lineageContent.split('\n').slice(0, 15).join('\n');
    console.log(preview + '\n...');
  } else {
    console.log(`[LineageOS Wiki] No entry found for ${codename}`);
  }

  // 2. Customrombay
  const crbUrl = `https://raw.githubusercontent.com/Customrombay/database/refs/heads/main/data/devices/${codename}.yaml`;
  console.log(`Fetching Customrombay: ${crbUrl}`);
  const crbContent = await fetchWithCache(crbUrl, `crb_${codename}`);
  if (crbContent) {
    console.log(`[Customrombay] Found metadata for ${codename}:`);
    const preview = crbContent.split('\n').slice(0, 15).join('\n');
    console.log(preview + '\n...');
  } else {
    console.log(`[Customrombay] No entry found for ${codename}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };

  const codename = getArg('--codename');
  const query = getArg('--query');
  const brand = getArg('--brand');

  if (codename) {
    await fetchCodenameSources(codename);
    return;
  }

  if (query || brand) {
    const term = query || brand;
    console.log(`Searching Google Play certified database for: "${term}"...`);
    const matches = await queryGooglePlay(term);
    console.log(`Found ${matches.length} matching device families.`);
    matches.slice(0, 10).forEach(dev => {
      console.log(`\n• ${dev.brand} ${dev.name}`);
      console.log(`  Codenames: ${dev.codenames.join(', ')}`);
      console.log(`  Models: ${dev.models.join(', ')}`);
    });
    if (matches.length > 10) {
      console.log(`... and ${matches.length - 10} more.`);
    }

    // If exact single match or user provided query, prompt codenames
    if (matches.length > 0 && matches.length <= 3) {
      for (const dev of matches) {
        for (const c of dev.codenames) {
          if (c) await fetchCodenameSources(c);
        }
      }
    }
    return;
  }

  console.log(`
IsItRootable Local Agent Scraper Helper
Usage:
  node scripts/scrape_device_sources.mjs --codename <codename>
  node scripts/scrape_device_sources.mjs --query <search phrase>
  node scripts/scrape_device_sources.mjs --brand <brand name>
  `);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
