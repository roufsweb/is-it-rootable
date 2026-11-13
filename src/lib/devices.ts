import fs from 'node:fs';
import path from 'node:path';
import { Device, Variant, RootStatus, BootloaderStatus } from '@/types/device';

const DEVICES_DIR = path.join(process.cwd(), 'data', 'devices');

export function getAllDevices(): Device[] {
  if (!fs.existsSync(DEVICES_DIR)) {
    return [];
  }
  const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
  const devices: Device[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(DEVICES_DIR, file), 'utf8');
      devices.push(JSON.parse(content));
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }

  // Sort by release year descending, then brand, then name
  return devices.sort((a, b) => {
    if (b.release_year !== a.release_year) return b.release_year - a.release_year;
    return a.name.localeCompare(b.name);
  });
}

export function getDeviceBySlug(slug: string): Device | undefined {
  const devices = getAllDevices();
  return devices.find(d => d.slug.toLowerCase() === slug.toLowerCase());
}

export interface ModelEntry {
  model: string;
  normalizedModel: string;
  device: Device;
  variant: Variant;
}

export function getAllModels(): ModelEntry[] {
  const devices = getAllDevices();
  const entries: ModelEntry[] = [];

  for (const device of devices) {
    for (const variant of device.variants) {
      for (const model of variant.models) {
        entries.push({
          model,
          normalizedModel: model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          device,
          variant,
        });
      }
    }
  }

  return entries;
}

export function getModelDetail(modelParam: string): ModelEntry | undefined {
  const all = getAllModels();
  const cleanParam = modelParam.toLowerCase().replace(/[^a-z0-9]/g, '');

  return all.find(e => {
    const cleanModel = e.model.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanModel === cleanParam || e.normalizedModel === modelParam.toLowerCase();
  });
}

export function getOverallRootStatus(variants: Variant[]): RootStatus {
  const statuses = variants.map(v => v.root_status);
  if (statuses.every(s => s === 'FULL')) return 'FULL';
  if (statuses.every(s => s === 'LOCKED')) return 'LOCKED';
  return 'CONDITIONAL';
}

export function getOverallBootloader(variants: Variant[]): BootloaderStatus {
  const bls = variants.map(v => v.bootloader_unlockable);
  if (bls.every(b => b === 'YES')) return 'YES';
  if (bls.every(b => b === 'NO')) return 'NO';
  return 'CONDITIONAL';
}

