export type RootStatus = 'FULL' | 'CONDITIONAL' | 'LOCKED';
export type BootloaderStatus = 'YES' | 'CONDITIONAL' | 'NO';
export type KernelSupport = 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';

export interface HardwareFeatures {
  usb_video_out: boolean;
  desktop_mode: string | null;
  sdcard_slot: boolean;
  headphone_jack: boolean;
}

export interface Variant {
  models: string[];
  codename: string;
  region: string;
  soc: string;
  bootloader_unlockable: BootloaderStatus;
  unlock_method: string;
  root_status: RootStatus;
  root_methods: string[];
  custom_recovery: string;
  custom_kernel_support: KernelSupport;
  links?: {
    xda?: string;
    twrp?: string;
    github?: string;
    [key: string]: string | undefined;
  };
}

export interface Device {
  slug: string;
  brand: string;
  name: string;
  release_year: number;
  hardware_features: HardwareFeatures;
  variants: Variant[];
}

export interface SearchItem {
  id: string;
  slug: string;
  brand: string;
  name: string;
  fullName: string;
  release_year: number;
  codenames: string;
  models: string;
  rawModels: string[];
  soc: string;
  overallRoot: RootStatus;
  overallBootloader: BootloaderStatus;
  usb_video_out: boolean;
  desktop_mode: string | null;
  sdcard_slot: boolean;
  headphone_jack: boolean;
  variantsCount: number;
  sampleVariants: Array<{
    region: string;
    models: string[];
    soc: string;
    root_status: RootStatus;
    bootloader_unlockable: BootloaderStatus;
  }>;
}
