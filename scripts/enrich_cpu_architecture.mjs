#!/usr/bin/env node
/**
 * scripts/enrich_cpu_architecture.mjs
 * 
 * Enriches all 352 device JSON files in data/devices/ with accurate
 * CPU Architecture (e.g. ARMv9.2-A, ARMv8.2-A, ARMv7-A) and core configurations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEVICES_DIR = path.join(ROOT_DIR, 'data', 'devices');

export const SOC_CPU_MAP = {
  // Flagship Qualcomm Snapdragon
  'Snapdragon 8 Elite': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (2x 4.32GHz Phoenix L + 6x 3.53GHz Phoenix M - Qualcomm Oryon)'
  },
  'Snapdragon 8 Elite for Galaxy': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (2x 4.47GHz Phoenix L + 6x 3.53GHz Phoenix M - Qualcomm Oryon)'
  },
  'Snapdragon 8 Gen 3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.3GHz Cortex-X4 & 5x 3.2GHz Cortex-A720 & 2x 2.3GHz Cortex-A520)'
  },
  'Snapdragon 8 Gen 3 for Galaxy': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.39GHz Cortex-X4 & 3x 3.1GHz Cortex-A720 & 2x 2.9GHz Cortex-A720 & 2x 2.2GHz Cortex-A520)'
  },
  'Qualcomm Snapdragon 8 Gen 3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.3GHz Cortex-X4 & 5x 3.2GHz Cortex-A720 & 2x 2.3GHz Cortex-A520)'
  },
  'Qualcomm Snapdragon 8 Gen 3 for Galaxy': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.39GHz Cortex-X4 & 3x 3.1GHz Cortex-A720 & 2x 2.9GHz Cortex-A720 & 2x 2.2GHz Cortex-A520)'
  },
  'Snapdragon 8s Gen 3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.0GHz Cortex-X4 & 4x 2.8GHz Cortex-A720 & 3x 2.0GHz Cortex-A520)'
  },
  'Snapdragon 8 Gen 2': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.2GHz Cortex-X3 & 2x 2.8GHz Cortex-A715 & 2x 2.8GHz Cortex-A710 & 3x 2.0GHz Cortex-A510)'
  },
  'Snapdragon 8 Gen 2 for Galaxy': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.36GHz Cortex-X3 & 2x 2.8GHz Cortex-A715 & 2x 2.8GHz Cortex-A710 & 3x 2.0GHz Cortex-A510)'
  },
  'Qualcomm Snapdragon 8 Gen 2': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.2GHz Cortex-X3 & 2x 2.8GHz Cortex-A715 & 2x 2.8GHz Cortex-A710 & 3x 2.0GHz Cortex-A510)'
  },
  'Qualcomm Snapdragon 8 Gen 2 for Galaxy': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.36GHz Cortex-X3 & 2x 2.8GHz Cortex-A715 & 2x 2.8GHz Cortex-A710 & 3x 2.0GHz Cortex-A510)'
  },
  'Snapdragon 8+ Gen 1': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.19GHz Cortex-X2 & 3x 2.75GHz Cortex-A710 & 4x 1.8GHz Cortex-A510)'
  },
  'Qualcomm Snapdragon 8+ Gen 1': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.19GHz Cortex-X2 & 3x 2.75GHz Cortex-A710 & 4x 1.8GHz Cortex-A510)'
  },
  'Snapdragon 8 Gen 1': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.0GHz Cortex-X2 & 3x 2.5GHz Cortex-A710 & 4x 1.8GHz Cortex-A510)'
  },
  'Snapdragon 888': {
    arch: 'ARMv8.4-A (64-bit)',
    cores: 'Octa-core (1x 2.84GHz Cortex-X1 & 3x 2.42GHz Cortex-A78 & 4x 1.8GHz Cortex-A55)'
  },
  'Snapdragon 888+': {
    arch: 'ARMv8.4-A (64-bit)',
    cores: 'Octa-core (1x 2.99GHz Cortex-X1 & 3x 2.42GHz Cortex-A78 & 4x 1.8GHz Cortex-A55)'
  },
  'Snapdragon 870': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 3.2GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Qualcomm Snapdragon 870': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 3.2GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Snapdragon 865+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 3.1GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Qualcomm Snapdragon 865+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 3.1GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Snapdragon 865': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.84GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Qualcomm Snapdragon 865': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.84GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Snapdragon 865 / 865+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.84-3.1GHz Kryo 585 & 3x 2.42GHz Kryo 585 & 4x 1.8GHz Kryo 585)'
  },
  'Snapdragon 860': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.96GHz Kryo 485 & 3x 2.42GHz Kryo 485 & 4x 1.78GHz Kryo 485)'
  },
  'Snapdragon 855+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.96GHz Kryo 485 & 3x 2.42GHz Kryo 485 & 4x 1.78GHz Kryo 485)'
  },
  'Snapdragon 855': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.84GHz Kryo 485 & 3x 2.42GHz Kryo 485 & 4x 1.78GHz Kryo 485)'
  },
  'Qualcomm Snapdragon 855': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.84GHz Kryo 485 & 3x 2.42GHz Kryo 485 & 4x 1.78GHz Kryo 485)'
  },
  'Snapdragon 845': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.8GHz Kryo 385 Gold & 4x 1.77GHz Kryo 385 Silver)'
  },
  'Qualcomm Snapdragon 845': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.8GHz Kryo 385 Gold & 4x 1.77GHz Kryo 385 Silver)'
  },
  'Snapdragon 835': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.45GHz Kryo 280 & 4x 1.9GHz Kryo 280)'
  },
  'Snapdragon 821': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Quad-core (2x 2.34GHz Kryo & 2x 2.19GHz Kryo)'
  },
  'Snapdragon 820': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Quad-core (2x 2.15GHz Kryo & 2x 1.6GHz Kryo)'
  },
  'Snapdragon 810': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.0GHz Cortex-A57 & 4x 1.55GHz Cortex-A53)'
  },
  'Snapdragon 810 v2.1': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.0GHz Cortex-A57 & 4x 1.55GHz Cortex-A53)'
  },
  'Snapdragon 808': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Hexa-core (2x 1.82GHz Cortex-A57 & 4x 1.44GHz Cortex-A53)'
  },
  'Snapdragon 805': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 2.7GHz Krait 450'
  },
  'Snapdragon 801': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 2.5GHz Krait 400'
  },
  'Snapdragon 800': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 2.26GHz Krait 400'
  },
  'Snapdragon 600': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.7GHz Krait 300'
  },
  'Snapdragon S4 Pro': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.5GHz Krait'
  },
  'Snapdragon S4 Plus': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Dual-core 1.5GHz Krait'
  },
  'Qualcomm QSD8250 Snapdragon': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Single-core 1.0GHz Scorpion'
  },

  // Midrange Snapdragon (7-series / 6-series / 4-series)
  'Snapdragon 7+ Gen 3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 2.8GHz Cortex-X4 & 4x 2.6GHz Cortex-A720 & 3x 1.9GHz Cortex-A520)'
  },
  'Snapdragon 7+ Gen 2': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 2.91GHz Cortex-X2 & 3x 2.49GHz Cortex-A710 & 4x 1.8GHz Cortex-A510)'
  },
  'Snapdragon 7 Gen 3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 2.63GHz Cortex-A715 & 3x 2.4GHz Cortex-A715 & 4x 1.8GHz Cortex-A510)'
  },
  'Snapdragon 7s Gen 2': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.40GHz Cortex-A78 & 4x 1.95GHz Cortex-A55)'
  },
  'Qualcomm Snapdragon 7s Gen 2': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.40GHz Cortex-A78 & 4x 1.95GHz Cortex-A55)'
  },
  'Snapdragon 780G': {
    arch: 'ARMv8.4-A (64-bit)',
    cores: 'Octa-core (1x 2.4GHz Cortex-A78 & 3x 2.2GHz Cortex-A78 & 4x 1.9GHz Cortex-A55)'
  },
  'Snapdragon 778G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.4GHz Cortex-A78 & 3x 2.2GHz Cortex-A78 & 4x 1.9GHz Cortex-A55)'
  },
  'Snapdragon 778G 5G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.4GHz Cortex-A78 & 3x 2.2GHz Cortex-A78 & 4x 1.9GHz Cortex-A55)'
  },
  'Snapdragon 778G+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.5GHz Cortex-A78 & 3x 2.4GHz Cortex-A78 & 4x 1.8GHz Cortex-A55)'
  },
  'Snapdragon 765G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.4GHz Kryo 475 Prime & 1x 2.2GHz Kryo 475 Gold & 6x 1.8GHz Kryo 475 Silver)'
  },
  'Snapdragon 750G 5G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Kryo 570 & 6x 1.8GHz Kryo 570)'
  },
  'Snapdragon 732G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.3GHz Kryo 470 Gold & 6x 1.8GHz Kryo 470 Silver)'
  },
  'Snapdragon 730G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Kryo 470 Gold & 6x 1.8GHz Kryo 470 Silver)'
  },
  'Snapdragon 730': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Kryo 470 Gold & 6x 1.8GHz Kryo 470 Silver)'
  },
  'Snapdragon 720G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.3GHz Kryo 465 Gold & 6x 1.8GHz Kryo 465 Silver)'
  },
  'Snapdragon 6 Gen 1': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.2GHz Cortex-A78 & 4x 1.8GHz Cortex-A55)'
  },
  'Snapdragon 695 5G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Kryo 660 Gold & 6x 1.7GHz Kryo 660 Silver)'
  },
  'Snapdragon 690 5G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Kryo 560 Gold & 6x 1.7GHz Kryo 560 Silver)'
  },
  'Snapdragon 680 4G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.4GHz Kryo 265 Gold & 4x 1.9GHz Kryo 265 Silver)'
  },
  'Snapdragon 678': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Kryo 460 Gold & 6x 1.7GHz Kryo 460 Silver)'
  },
  'Snapdragon 675': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Kryo 460 Gold & 6x 1.7GHz Kryo 460 Silver)'
  },
  'Snapdragon 670': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Kryo 360 Gold & 6x 1.7GHz Kryo 360 Silver)'
  },
  'Snapdragon 665': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.0GHz Kryo 260 Gold & 4x 1.8GHz Kryo 260 Silver)'
  },
  'Snapdragon 660': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.2GHz Kryo 260 & 4x 1.8GHz Kryo 260)'
  },
  'Snapdragon 636': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (8x 1.8GHz Kryo 260)'
  },
  'Snapdragon 630': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (8x 2.2GHz Cortex-A53)'
  },
  'Snapdragon 625': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (8x 2.0GHz Cortex-A53)'
  },
  'Snapdragon 617': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 1.5GHz Cortex-A53 & 4x 1.2GHz Cortex-A53)'
  },
  'Snapdragon 4 Gen 1': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Cortex-A78 & 6x 1.8GHz Cortex-A55)'
  },
  'Snapdragon 480 5G': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Kryo 460 & 6x 1.8GHz Kryo 460)'
  },
  'Snapdragon 460': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 1.8GHz Kryo 240 & 4x 1.8GHz Kryo 240)'
  },
  'Snapdragon 410': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Quad-core 1.2GHz Cortex-A53'
  },
  'Snapdragon 400': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.2GHz Cortex-A7'
  },
  'Qualcomm QCM6490': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.7GHz Kryo 670 Prime & 3x 2.4GHz Kryo 670 Gold & 4x 1.9GHz Kryo 670 Silver)'
  },
  'Qualcomm Snapdragon G3x Gen 1': {
    arch: 'ARMv8.4-A (64-bit)',
    cores: 'Octa-core (1x 3.0GHz Kryo Prime & 3x 2.4GHz Kryo Gold & 4x 1.8GHz Kryo Silver)'
  },

  // Google Tensor
  'Google Tensor (1st Gen)': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.80GHz Cortex-X1 & 2x 2.25GHz Cortex-A76 & 4x 1.80GHz Cortex-A55)'
  },
  'Google Tensor G2': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.85GHz Cortex-X1 & 2x 2.35GHz Cortex-A78 & 4x 1.80GHz Cortex-A55)'
  },
  'Google Tensor G3': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Nona-core (1x 3.00GHz Cortex-X3 & 4x 2.45GHz Cortex-A715 & 4x 2.15GHz Cortex-A510)'
  },
  'Google Tensor G4': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Octa-core (1x 3.10GHz Cortex-X4 & 3x 2.60GHz Cortex-A720 & 4x 1.92GHz Cortex-A520)'
  },

  // Samsung Exynos
  'Exynos 2400': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Deca-core (1x 3.2GHz Cortex-X4 & 2x 2.9GHz Cortex-A720 & 3x 2.6GHz Cortex-A720 & 4x 1.95GHz Cortex-A520)'
  },
  'Exynos 2400e': {
    arch: 'ARMv9.2-A (64-bit)',
    cores: 'Deca-core (1x 3.11GHz Cortex-X4 & 2x 2.9GHz Cortex-A720 & 3x 2.6GHz Cortex-A720 & 4x 1.95GHz Cortex-A520)'
  },
  'Exynos 2200': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 2.8GHz Cortex-X2 & 3x 2.52GHz Cortex-A710 & 4x 1.82GHz Cortex-A510)'
  },
  'Exynos 2100': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 2.9GHz Cortex-X1 & 3x 2.8GHz Cortex-A78 & 4x 2.2GHz Cortex-A55)'
  },
  'Exynos 1480': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.75GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'Exynos 1380': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.4GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'Exynos 1280': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.4GHz Cortex-A78 & 6x 2.0GHz Cortex-A55)'
  },
  'Exynos 990': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.73GHz Exynos M5 & 2x 2.50GHz Cortex-A76 & 4x 2.0GHz Cortex-A55)'
  },
  'Exynos 9825': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.73GHz Exynos M4 & 2x 2.40GHz Cortex-A75 & 4x 1.95GHz Cortex-A55)'
  },
  'Exynos 9820': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.73GHz Exynos M4 & 2x 2.31GHz Cortex-A75 & 4x 1.95GHz Cortex-A55)'
  },
  'Exynos 9810': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.7GHz Exynos M3 & 4x 1.8GHz Cortex-A55)'
  },
  'Exynos 9611': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.3GHz Cortex-A73 & 4x 1.7GHz Cortex-A53)'
  },
  'Exynos 9610': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.3GHz Cortex-A73 & 4x 1.7GHz Cortex-A53)'
  },
  'Exynos 8895': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.3GHz Exynos M2 & 4x 1.7GHz Cortex-A53)'
  },
  'Exynos 8890': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.3GHz Exynos M1 & 4x 1.6GHz Cortex-A53)'
  },
  'Exynos 850': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (8x 2.0GHz Cortex-A55)'
  },
  'Exynos 7904': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (2x 1.8GHz Cortex-A73 & 6x 1.6GHz Cortex-A53)'
  },
  'Exynos 7884': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (2x 1.6GHz Cortex-A73 & 6x 1.35GHz Cortex-A53)'
  },
  'Exynos 7420': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 2.1GHz Cortex-A57 & 4x 1.5GHz Cortex-A53)'
  },
  'Exynos 5250': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Dual-core 1.7GHz Cortex-A15'
  },
  'Exynos 4412 Quad': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.4GHz Cortex-A9'
  },
  'Exynos 4412': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.4GHz Cortex-A9'
  },
  'Exynos 4210 Dual': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Dual-core 1.2GHz Cortex-A9'
  },
  'Exynos 4210': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Dual-core 1.2GHz Cortex-A9'
  },

  // MediaTek Dimensity & Helio
  'MediaTek Dimensity 9200+': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.35GHz Cortex-X3 & 3x 3.0GHz Cortex-A715 & 4x 2.0GHz Cortex-A510)'
  },
  'MediaTek Dimensity 9000': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.05GHz Cortex-X2 & 3x 2.85GHz Cortex-A710 & 4x 1.8GHz Cortex-A510)'
  },
  'MediaTek Dimensity 8300-Ultra': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (1x 3.35GHz Cortex-A715 & 3x 3.2GHz Cortex-A715 & 4x 2.2GHz Cortex-A510)'
  },
  'MediaTek Dimensity 8100-Ultra': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.85GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 8100-Max': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.85GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 8100': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.85GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 8020': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.6GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 7300': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.5GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 7200 Pro': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (2x 2.8GHz Cortex-A715 & 6x 2.0GHz Cortex-A510)'
  },
  'MediaTek Dimensity 7200-Ultra': {
    arch: 'ARMv9.0-A (64-bit)',
    cores: 'Octa-core (2x 2.8GHz Cortex-A715 & 6x 2.0GHz Cortex-A510)'
  },
  'MediaTek Dimensity 7020': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Cortex-A78 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 6100+': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Cortex-A76 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 6080': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.4GHz Cortex-A76 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 1300': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (1x 3.0GHz Cortex-A78 & 3x 2.6GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 1100': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (4x 2.6GHz Cortex-A78 & 4x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 1080': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.6GHz Cortex-A78 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 930': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Cortex-A78 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Dimensity 900': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.4GHz Cortex-A78 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Helio G99-Ultra': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.2GHz Cortex-A76 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Helio G90T': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.05GHz Cortex-A76 & 6x 2.0GHz Cortex-A55)'
  },
  'MediaTek Helio G80': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (2x 2.0GHz Cortex-A75 & 6x 1.8GHz Cortex-A55)'
  },

  // Hybrids / Dual SoC options
  'Exynos 9611 / Snapdragon 720G': {
    arch: 'ARMv8.2-A / ARMv8.0-A (64-bit)',
    cores: 'Octa-core (Exynos 9611 or Snapdragon 720G depending on model)'
  },
  'MediaTek Helio P35 / Exynos 850': {
    arch: 'ARMv8.2-A / ARMv8.0-A (64-bit)',
    cores: 'Octa-core (Helio P35 or Exynos 850 depending on model)'
  },
  'Exynos 1330 / Dimensity 700': {
    arch: 'ARMv8.2-A (64-bit)',
    cores: 'Octa-core (Exynos 1330 or Dimensity 700 depending on model)'
  },
  'Exynos 5433 / Snapdragon 805': {
    arch: 'ARMv8.0-A / ARMv7-A',
    cores: 'Octa-core Exynos 5433 or Quad-core Snapdragon 805'
  },
  'Snapdragon 800 / Exynos 5420': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core Krait 400 or Octa-core Exynos 5420'
  },
  'Snapdragon 600 / Exynos 5410': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core Krait 300 or Octa-core Exynos 5410'
  },
  'Snapdragon 801 / Exynos 5422': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core Krait 400 or Octa-core Exynos 5422'
  },

  // Nvidia & TI
  'Nvidia Tegra X1': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Octa-core (4x 1.9GHz Cortex-A57 & 4x 1.3GHz Cortex-A53)'
  },
  'Nvidia Tegra K1-Denver': {
    arch: 'ARMv8.0-A (64-bit)',
    cores: 'Dual-core 2.3GHz Denver 64-bit'
  },
  'Nvidia Tegra K1-32': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 2.2GHz Cortex-A15'
  },
  'Nvidia Tegra 3': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Quad-core 1.4GHz Cortex-A9'
  },
  'TI OMAP 4460': {
    arch: 'ARMv7-A (32-bit)',
    cores: 'Dual-core 1.2GHz Cortex-A9'
  }
};

function main() {
  const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Enriching ${files.length} device records with CPU Architecture & Cores...`);

  let enrichedVariantsCount = 0;

  for (const file of files) {
    const fullPath = path.join(DEVICES_DIR, file);
    const device = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    for (const v of device.variants) {
      const socKey = (v.soc || '').trim();
      const match = SOC_CPU_MAP[socKey];
      if (match) {
        v.cpu_architecture = match.arch;
        v.cpu_cores = match.cores;
        enrichedVariantsCount++;
      } else {
        console.warn(`[WARN] No CPU mapping found for SoC: "${socKey}" in ${file}`);
      }
    }

    fs.writeFileSync(fullPath, JSON.stringify(device, null, 2) + '\n', 'utf8');
  }

  console.log(`✅ Successfully enriched ${enrichedVariantsCount} variants across ${files.length} devices!`);
}

main();
