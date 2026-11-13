#!/usr/bin/env node
/**
 * scripts/validate_schema.mjs
 * 
 * Strict schema validator for device JSON files in data/devices/.
 * Validates required keys, enum values, and Samsung model grouping rules.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEVICES_DIR = path.join(ROOT_DIR, 'data', 'devices');

const VALID_BOOTLOADER = ['YES', 'CONDITIONAL', 'NO'];
const VALID_ROOT_STATUS = ['FULL', 'CONDITIONAL', 'LOCKED'];
const VALID_KERNEL_SUPPORT = ['HIGH', 'MODERATE', 'LOW', 'NONE'];
const VALID_FORM_FACTORS = ['phone', 'tablet', 'foldable', 'handheld'];

let errors = [];

function validateDevice(filePath, data) {
  const fileName = path.basename(filePath);
  const prefix = `[${fileName}]`;

  // Top level fields
  if (typeof data.slug !== 'string' || !data.slug.trim()) {
    errors.push(`${prefix} missing or invalid "slug"`);
  }
  if (typeof data.brand !== 'string' || !data.brand.trim()) {
    errors.push(`${prefix} missing or invalid "brand"`);
  }
  if (typeof data.name !== 'string' || !data.name.trim()) {
    errors.push(`${prefix} missing or invalid "name"`);
  }
  if (typeof data.release_year !== 'number' || data.release_year < 2008 || data.release_year > 2030) {
    errors.push(`${prefix} invalid "release_year": ${data.release_year}`);
  }
  if (data.form_factor && !VALID_FORM_FACTORS.includes(data.form_factor)) {
    errors.push(`${prefix} invalid "form_factor": "${data.form_factor}". Must be one of ${VALID_FORM_FACTORS.join(', ')}`);
  }

  // Hardware features
  if (!data.hardware_features || typeof data.hardware_features !== 'object') {
    errors.push(`${prefix} missing "hardware_features" object`);
  } else {
    const hf = data.hardware_features;
    if (typeof hf.usb_video_out !== 'boolean') {
      errors.push(`${prefix} hardware_features.usb_video_out must be a boolean`);
    }
    if (typeof hf.sdcard_slot !== 'boolean') {
      errors.push(`${prefix} hardware_features.sdcard_slot must be a boolean`);
    }
    if (typeof hf.headphone_jack !== 'boolean') {
      errors.push(`${prefix} hardware_features.headphone_jack must be a boolean`);
    }
  }

  // Variants
  if (!Array.isArray(data.variants) || data.variants.length === 0) {
    errors.push(`${prefix} "variants" must be a non-empty array`);
    return;
  }

  data.variants.forEach((v, idx) => {
    const vPrefix = `${prefix} variant[${idx}] (${v.region || 'unknown'})`;

    if (!Array.isArray(v.models) || v.models.length === 0) {
      errors.push(`${vPrefix} must have a non-empty "models" array`);
    }

    if (typeof v.codename !== 'string') {
      errors.push(`${vPrefix} missing "codename"`);
    }
    if (typeof v.region !== 'string') {
      errors.push(`${vPrefix} missing "region"`);
    }
    if (typeof v.soc !== 'string') {
      errors.push(`${vPrefix} missing "soc"`);
    }

    if (v.cpu_architecture !== undefined && (typeof v.cpu_architecture !== 'string' || !v.cpu_architecture.trim())) {
      errors.push(`${vPrefix} "cpu_architecture" must be a non-empty string`);
    }

    if (v.cpu_cores !== undefined && (typeof v.cpu_cores !== 'string' || !v.cpu_cores.trim())) {
      errors.push(`${vPrefix} "cpu_cores" must be a non-empty string`);
    }

    if (!VALID_BOOTLOADER.includes(v.bootloader_unlockable)) {
      errors.push(`${vPrefix} invalid bootloader_unlockable: "${v.bootloader_unlockable}". Must be one of ${VALID_BOOTLOADER.join(', ')}`);
    }
    if (!VALID_ROOT_STATUS.includes(v.root_status)) {
      errors.push(`${vPrefix} invalid root_status: "${v.root_status}". Must be one of ${VALID_ROOT_STATUS.join(', ')}`);
    }
    if (v.custom_kernel_support && !VALID_KERNEL_SUPPORT.includes(v.custom_kernel_support)) {
      errors.push(`${vPrefix} invalid custom_kernel_support: "${v.custom_kernel_support}". Must be one of ${VALID_KERNEL_SUPPORT.join(', ')}`);
    }

    if (!Array.isArray(v.root_methods)) {
      errors.push(`${vPrefix} "root_methods" must be an array`);
    }

    if (v.custom_roms && !Array.isArray(v.custom_roms)) {
      errors.push(`${vPrefix} "custom_roms" must be an array of strings`);
    }

    // Strict Samsung Model Grouping Rule
    if (data.brand.toLowerCase() === 'samsung' && Array.isArray(v.models)) {
      const hasNorthAmerica = v.models.some(m => /(U|U1|W)$/i.test(m));
      const hasInternational = v.models.some(m => /(F|FD|B|N)$/i.test(m));
      const hasChina = v.models.some(m => /0$/i.test(m));

      if (hasNorthAmerica && hasInternational) {
        errors.push(`${vPrefix} VIOLATION: Never group Samsung North American models (U/U1/W) with International models (F/B/N) in the same variant!`);
      }
      if (hasNorthAmerica && hasChina) {
        errors.push(`${vPrefix} VIOLATION: Never group Samsung North American models (U/U1/W) with China models (0) in the same variant!`);
      }
    }
  });
}

function main() {
  if (!fs.existsSync(DEVICES_DIR)) {
    console.error(`Error: Devices directory not found at ${DEVICES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Validating ${files.length} device files in data/devices/...`);

  for (const file of files) {
    const fullPath = path.join(DEVICES_DIR, file);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(content);
      validateDevice(fullPath, data);
    } catch (err) {
      errors.push(`[${file}] JSON Parse Error: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Validation Failed with ${errors.length} error(s):`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`\n✅ All ${files.length} device schemas are 100% compliant with IsItRootable standards!`);
}

main();

