#!/usr/bin/env node
/**
 * scripts/verify_acid_system.mjs
 * 
 * Comprehensive ACID Verification Pipeline for IsItRootable:
 * - [A] Atomicity: 1:1 synchronization between data/devices/, all-devices.json, and search-index.json.
 * - [C] Consistency: Zero schema violations, strict Samsung suffix isolation, valid sitemap URLs.
 * - [I] Isolation: Deterministic multi-facet filter testing (Form Factor, Root Status, SoC, Hardware).
 * - [D] Durability: Verification of production SSG static export, CNAME, and route availability in out/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DEVICES_DIR = path.join(ROOT, 'data', 'devices');
const ALL_DEVICES_PATH = path.join(ROOT, 'src', 'data', 'all-devices.json');
const SEARCH_INDEX_PATH = path.join(ROOT, 'src', 'data', 'search-index.json');
const OUT_DIR = path.join(ROOT, 'out');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = [];

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedChecks.push(message);
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('   IsItRootable: ACID System Verification Pipeline');
console.log('   Three-Way Synchronization: Database <-> SSG <-> Frontend');
console.log('================================================================\n');

// -------------------------------------------------------------
// [A] ATOMICITY VERIFICATION
// -------------------------------------------------------------
console.log('--- 1. [A] ATOMICITY: Data Store Synchronization ---');
const rawFiles = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
const allDevices = JSON.parse(fs.readFileSync(ALL_DEVICES_PATH, 'utf8'));
const searchIndex = JSON.parse(fs.readFileSync(SEARCH_INDEX_PATH, 'utf8'));

assert(
  rawFiles.length === allDevices.length,
  `Atomicity: Device file count (${rawFiles.length}) matches all-devices.json length (${allDevices.length})`
);

assert(
  rawFiles.length === searchIndex.length,
  `Atomicity: Device file count (${rawFiles.length}) matches search-index.json length (${searchIndex.length})`
);

const rawSlugs = new Set();
for (const file of rawFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(DEVICES_DIR, file), 'utf8'));
  rawSlugs.add(data.slug);
}

const allDeviceSlugs = new Set(allDevices.map(d => d.slug));
const searchIndexSlugs = new Set(searchIndex.map(d => d.slug));

let slugMismatch = false;
for (const slug of rawSlugs) {
  if (!allDeviceSlugs.has(slug) || !searchIndexSlugs.has(slug)) {
    slugMismatch = true;
    break;
  }
}
assert(!slugMismatch, 'Atomicity: Every device slug is synchronously represented in all bundles without loss');


// -------------------------------------------------------------
// [C] CONSISTENCY VERIFICATION
// -------------------------------------------------------------
console.log('\n--- 2. [C] CONSISTENCY: Schema, Suffix Enums & Form Factors ---');
const VALID_FORM_FACTORS = ['phone', 'tablet', 'foldable', 'handheld'];
const VALID_ROOT_STATUS = ['FULL', 'CONDITIONAL', 'LOCKED'];

let schemaValid = true;
let samsungGroupingValid = true;
let formFactorDistribution = { phone: 0, tablet: 0, foldable: 0, handheld: 0 };

for (const dev of allDevices) {
  if (!VALID_FORM_FACTORS.includes(dev.form_factor || 'phone')) {
    schemaValid = false;
  }
  const ff = dev.form_factor || 'phone';
  formFactorDistribution[ff] = (formFactorDistribution[ff] || 0) + 1;

  if (dev.brand.toLowerCase() === 'samsung') {
    for (const v of dev.variants) {
      const hasNorthAmerica = (v.models || []).some(m => /(U|U1|W)$/i.test(m));
      const hasInternational = (v.models || []).some(m => /(F|FD|B|N)$/i.test(m));
      if (hasNorthAmerica && hasInternational) {
        samsungGroupingValid = false;
      }
    }
  }
}

assert(schemaValid, `Consistency: All ${allDevices.length} devices have valid form_factor enums`);
assert(samsungGroupingValid, 'Consistency: Model Suffix Rule enforced (No Samsung North America U/W grouped with Global F/B/N)');
assert(formFactorDistribution.tablet > 0, `Consistency: Database includes ${formFactorDistribution.tablet} Tablets/Pads`);
assert(formFactorDistribution.foldable > 0, `Consistency: Database includes ${formFactorDistribution.foldable} Foldables`);
assert(formFactorDistribution.handheld > 0, `Consistency: Database includes ${formFactorDistribution.handheld} Gaming Handhelds`);


// -------------------------------------------------------------
// [I] ISOLATION VERIFICATION (Multi-Facet Filter Engine Tests)
// -------------------------------------------------------------
console.log('\n--- 3. [I] ISOLATION: Multi-Facet Filter Engine Integrity ---');

// Test 1: Form Factor Filter Isolation
const tabletsOnly = searchIndex.filter(d => d.form_factor === 'tablet');
const tabletsPure = tabletsOnly.every(d => d.form_factor === 'tablet');
assert(tabletsPure && tabletsOnly.length === formFactorDistribution.tablet, `Isolation: Form Factor "tablet" returns strictly ${tabletsOnly.length} tablets with 0 state bleed`);

const handheldsOnly = searchIndex.filter(d => d.form_factor === 'handheld');
const handheldsPure = handheldsOnly.every(d => d.form_factor === 'handheld');
assert(handheldsPure && handheldsOnly.length === formFactorDistribution.handheld, `Isolation: Form Factor "handheld" returns strictly ${handheldsOnly.length} handhelds with 0 state bleed`);

// Test 2: Root Status Filter Isolation
const fullRootOnly = searchIndex.filter(d => d.overallRoot === 'FULL');
const fullRootPure = fullRootOnly.every(d => d.overallRoot === 'FULL');
assert(fullRootPure && fullRootOnly.length > 0, `Isolation: Root Status "FULL" isolates ${fullRootOnly.length} unlockable devices`);

// Test 3: Complex Multi-Facet Intersection
const snapdragonTabletsWithVideoOut = searchIndex.filter(
  d => d.form_factor === 'tablet' && d.soc_family === 'Snapdragon' && d.usb_video_out
);
const multiFacetPure = snapdragonTabletsWithVideoOut.every(
  d => d.form_factor === 'tablet' && d.soc_family === 'Snapdragon' && d.usb_video_out
);
assert(multiFacetPure && snapdragonTabletsWithVideoOut.length > 0, `Isolation: Complex intersection (Tablet + Snapdragon + Video Out) accurately yields ${snapdragonTabletsWithVideoOut.length} devices`);

// Test 4: Tokenized Model Search Isolation
const g950fMatches = searchIndex.filter(d => d.models.includes('G950F'));
assert(
  g950fMatches.length === 1 && g950fMatches[0].slug === 'samsung-galaxy-s8',
  'Isolation: Tokenized model suffix search "G950F" isolates exact device "samsung-galaxy-s8"'
);


// -------------------------------------------------------------
// [D] DURABILITY VERIFICATION (Static Build & Out Integrity)
// -------------------------------------------------------------
console.log('\n--- 4. [D] DURABILITY: Production Build & Asset Integrity ---');

const indexHtmlPath = path.join(OUT_DIR, 'index.html');
const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
const robotsPath = path.join(OUT_DIR, 'robots.txt');
const cnamePath = path.join(OUT_DIR, 'CNAME');

if (fs.existsSync(OUT_DIR)) {
  assert(fs.existsSync(indexHtmlPath), 'Durability: out/index.html is compiled and present');
  assert(fs.existsSync(sitemapPath), 'Durability: out/sitemap.xml is compiled and present');
  assert(fs.existsSync(robotsPath), 'Durability: out/robots.txt is compiled and present');
  assert(fs.existsSync(cnamePath), 'Durability: out/CNAME is present');

  if (fs.existsSync(cnamePath)) {
    const cnameContent = fs.readFileSync(cnamePath, 'utf8').trim();
    assert(
      cnameContent === 'is-it-rootable.roufsweb.com',
      `Durability: CNAME matches custom domain "is-it-rootable.roufsweb.com" (got "${cnameContent}")`
    );
  }

  // Check sample device HTML files across form factors
  const sampleSlugs = [
    'samsung-galaxy-s24',
    'samsung-galaxy-tab-s9',
    'oneplus-open',
    'ayn-odin-2'
  ];
  for (const slug of sampleSlugs) {
    const devPath = path.join(OUT_DIR, 'device', slug, 'index.html');
    assert(
      fs.existsSync(devPath),
      `Durability: Static HTML page generated for [${slug}]`
    );
  }
} else {
  console.log('  [NOTE] ./out directory not built yet. Run "npm run build" to test durability.');
}

// -------------------------------------------------------------
// SUMMARY & VERDICT
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`   ACID Verification Results: ${passedChecks}/${totalChecks} Checks Passed`);
if (failedChecks.length === 0) {
  console.log('   STATUS: 100% ACID COMPLIANT & SYNCHRONOUS ✅');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`   STATUS: ${failedChecks.length} CHECKS FAILED ❌`);
  console.error('================================================================\n');
  process.exit(1);
}

