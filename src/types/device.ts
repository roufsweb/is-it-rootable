export type RootStatus = 'FULL' | 'CONDITIONAL' | 'LOCKED';
export type BootloaderStatus = 'YES' | 'CONDITIONAL' | 'NO';
export type KernelSupport = 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
export type FormFactor = 'phone' | 'tablet' | 'foldable' | 'handheld';

export interface HardwareFeatures {
  usb_video_out: boolean;
  desktop_mode: string | null;
  sdcard_slot: boolean;
  headphone_jack: boolean;
  hardware_mod_required?: boolean;
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
  custom_roms?: string[];
  links?: {
    xda?: string;
    twrp?: string;
    github?: string;
    lineageos?: string;
    [key: string]: string | undefined;
  };
}

export interface Device {
  slug: string;
  brand: string;
  name: string;
  release_year: number;
  form_factor?: FormFactor;
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
  form_factor: FormFactor;
  codenames: string;
  models: string;
  rawModels: string[];
  soc: string;
  soc_family: string;
  overallRoot: RootStatus;
  overallBootloader: BootloaderStatus;
  usb_video_out: boolean;
  desktop_mode: string | null;
  sdcard_slot: boolean;
  headphone_jack: boolean;
  custom_roms: string[];
  variantsCount: number;
  sampleVariants: Array<{
    region: string;
    models: string[];
    soc: string;
    root_status: RootStatus;
    bootloader_unlockable: BootloaderStatus;
    custom_roms?: string[];
  }>;
}
