import fs from 'node:fs';
import path from 'node:path';

const devices = [
  // --- TABLETS & PADS ---
  {
    slug: 'oneplus-pad-2',
    brand: 'OnePlus',
    name: 'Pad 2',
    form_factor: 'tablet',
    release_year: 2024,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Open Canvas (Multi-window)',
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['OPD2404', 'OPD2405'],
        codename: 'aries',
        region: 'Global / North America / Europe / India',
        soc: 'Qualcomm Snapdragon 8 Gen 3',
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking in Developer Settings + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / Boot Patching',
        custom_kernel_support: 'HIGH',
        custom_roms: ['OxygenOS Stock Rooted', 'GSI Phh'],
        links: {
          xda: 'https://xdaforums.com/c/oneplus-pad-2.12879/'
        }
      }
    ]
  },
  {
    slug: 'xiaomi-pad-6-pro',
    brand: 'Xiaomi',
    name: 'Pad 6 Pro',
    form_factor: 'tablet',
    release_year: 2023,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Workstation Mode',
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['23046PNC9C'],
        codename: 'liuqin',
        region: 'China / Global Unlocked',
        soc: 'Qualcomm Snapdragon 8+ Gen 1',
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Mi Account bind (HyperOS community level 5 bypass or Mi Unlock Tool with 168h wait)',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'TWRP Official / OrangeFox',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 21', 'Xiaomi.eu', 'PixelExperience'],
        links: {
          xda: 'https://xdaforums.com/c/xiaomi-pad-6-pro.12781/'
        }
      }
    ]
  },
  {
    slug: 'xiaomi-pad-6s-pro',
    brand: 'Xiaomi',
    name: 'Pad 6S Pro 12.4',
    form_factor: 'tablet',
    release_year: 2024,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'HyperOS Workstation Mode',
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['24018RPACC', '24018RPACG'],
        codename: 'sheng',
        region: 'Global / China',
        soc: 'Qualcomm Snapdragon 8 Gen 2',
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'HyperOS Mi Unlock request + Mi Community level check',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / KernelSU boot.img patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Xiaomi.eu Multilingual', 'AOSP GSI'],
        links: {
          xda: 'https://xdaforums.com/c/xiaomi-pad-6s-pro.12885/'
        }
      }
    ]
  },
  {
    slug: 'redmi-pad-pro',
    brand: 'Xiaomi',
    name: 'Redmi Pad Pro',
    form_factor: 'tablet',
    release_year: 2024,
    hardware_features: {
      usb_video_out: false,
      desktop_mode: 'Xiaomi Interconnectivity',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['2405CRPFDL', '2405CRPFDC', '2405CRPFDG'],
        codename: 'dizi',
        region: 'Global / India / China',
        soc: 'Qualcomm Snapdragon 7s Gen 2',
        bootloader_unlockable: 'CONDITIONAL',
        unlock_method: 'Mi Unlock Tool after 168-hour account binding wait',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['EvolutionX', 'Xiaomi.eu', 'LineageOS GSI'],
        links: {
          xda: 'https://xdaforums.com/c/redmi-pad-pro.12883/'
        }
      }
    ]
  },
  {
    slug: 'lenovo-legion-y700-2023',
    brand: 'Lenovo',
    name: 'Legion Y700 (2023)',
    form_factor: 'tablet',
    release_year: 2023,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Lenovo PC Mode / DP Alt Mode',
      sdcard_slot: true,
      headphone_jack: false
    },
    variants: [
      {
        models: ['TB-320FC'],
        codename: 'TB320FC',
        region: 'Global / China / Asia',
        soc: 'Qualcomm Snapdragon 8+ Gen 1',
        bootloader_unlockable: 'YES',
        unlock_method: 'ZUI Developer Options OEM Unlock + fastboot flashing unlock or sn.img token',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'HIGH',
        custom_roms: ['NEC / Global ROM Crossflash', 'LineageOS GSI', 'EvolutionX GSI'],
        links: {
          xda: 'https://xdaforums.com/c/lenovo-legion-y700-2023.12803/'
        }
      }
    ]
  },
  {
    slug: 'lenovo-legion-y700-2022',
    brand: 'Lenovo',
    name: 'Legion Y700 (2022)',
    form_factor: 'tablet',
    release_year: 2022,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Lenovo PC Mode',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['TB-9707F'],
        codename: 'TB9707F',
        region: 'Global / China',
        soc: 'Qualcomm Snapdragon 870',
        bootloader_unlockable: 'YES',
        unlock_method: 'fastboot flashing unlock via OEM Unlock toggle',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Global Firmware Crossflash', 'LineageOS', 'Havoc-OS GSI'],
        links: {
          xda: 'https://xdaforums.com/c/lenovo-legion-y700-2022.12705/'
        }
      }
    ]
  },
  {
    slug: 'lenovo-tab-p12-pro',
    brand: 'Lenovo',
    name: 'Tab P12 Pro',
    form_factor: 'tablet',
    release_year: 2021,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Lenovo Productivity Mode',
      sdcard_slot: true,
      headphone_jack: false
    },
    variants: [
      {
        models: ['TB-Q706F', 'TB-Q706Z'],
        codename: 'q706f',
        region: 'Global / Europe / USA',
        soc: 'Qualcomm Snapdragon 870',
        bootloader_unlockable: 'YES',
        unlock_method: 'Lenovo bootloader unlock portal sn.img flash + fastboot',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 20 Official', 'AOSP Developer Preview'],
        links: {
          xda: 'https://xdaforums.com/c/lenovo-tab-p12-pro.12457/'
        }
      }
    ]
  },
  {
    slug: 'samsung-galaxy-tab-s7-plus',
    brand: 'Samsung',
    name: 'Galaxy Tab S7+',
    form_factor: 'tablet',
    release_year: 2020,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Samsung DeX (Wired & Wireless)',
      sdcard_slot: true,
      headphone_jack: false
    },
    variants: [
      {
        models: ['SM-T970', 'SM-T976B', 'SM-T976N'],
        codename: 'gts7xl',
        region: 'Global / Europe / Korea (Wi-Fi & 5G)',
        soc: 'Qualcomm Snapdragon 865+',
        bootloader_unlockable: 'YES',
        unlock_method: 'Odin download mode long-press Volume Up to unlock bootloader',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 21 Official', 'One UI 6.1 Port'],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-tab-s7.11413/'
        }
      },
      {
        models: ['SM-T976U'],
        codename: 'gts7xl_na',
        region: 'North America / USA Carriers (Verizon, AT&T, T-Mobile)',
        soc: 'Qualcomm Snapdragon 865+',
        bootloader_unlockable: 'NO',
        unlock_method: 'Bootloader locked by North American carrier contract',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-tab-s7.11413/'
        }
      }
    ]
  },
  {
    slug: 'samsung-galaxy-tab-s6',
    brand: 'Samsung',
    name: 'Galaxy Tab S6',
    form_factor: 'tablet',
    release_year: 2019,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Samsung DeX',
      sdcard_slot: true,
      headphone_jack: false
    },
    variants: [
      {
        models: ['SM-T860', 'SM-T865', 'SM-T865N'],
        codename: 'gts6lwifi',
        region: 'Global / Europe / Korea',
        soc: 'Qualcomm Snapdragon 855',
        bootloader_unlockable: 'YES',
        unlock_method: 'Odin download mode device unlock mode',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 20 Official', 'PixelExperience'],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-tab-s6.9247/'
        }
      },
      {
        models: ['SM-T867U'],
        codename: 'gts6llte_na',
        region: 'North America / USA Carriers',
        soc: 'Qualcomm Snapdragon 855',
        bootloader_unlockable: 'NO',
        unlock_method: 'Carrier locked fastboot / download mode',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-tab-s6.9247/'
        }
      }
    ]
  },
  {
    slug: 'google-pixel-c',
    brand: 'Google',
    name: 'Pixel C',
    form_factor: 'tablet',
    release_year: 2015,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'AOSP Multi-window',
      sdcard_slot: false,
      headphone_jack: true
    },
    variants: [
      {
        models: ['Pixel C'],
        codename: 'dragon',
        region: 'Global Factory Unlocked',
        soc: 'Nvidia Tegra X1',
        bootloader_unlockable: 'YES',
        unlock_method: 'fastboot oem unlock / fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['Magisk'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 18.1 / 19.1', 'Ubuntu Touch', 'PostmarketOS Linux'],
        links: {
          xda: 'https://xdaforums.com/c/google-pixel-c.4947/'
        }
      }
    ]
  },

  // --- FOLDABLES ---
  {
    slug: 'samsung-galaxy-z-flip-6',
    brand: 'Samsung',
    name: 'Galaxy Z Flip 6',
    form_factor: 'foldable',
    release_year: 2024,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Samsung DeX (Wired & External Mirroring)',
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['SM-F741B', 'SM-F741N'],
        codename: 'b6q',
        region: 'Global / Europe / Korea',
        soc: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking toggle in Developer Options + Odin download mode unlock',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU', 'APatch'],
        custom_recovery: 'KernelSU Boot Patching',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['Stock Rooted One UI 6.1.1'],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-z-flip-6.12871/'
        }
      },
      {
        models: ['SM-F741U', 'SM-F741U1', 'SM-F741W'],
        codename: 'b6q_na',
        region: 'North America / USA / Canada',
        soc: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
        bootloader_unlockable: 'NO',
        unlock_method: 'Permanently locked bootloader due to North American Knox policy',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-z-flip-6.12871/'
        }
      }
    ]
  },
  {
    slug: 'samsung-galaxy-z-flip-5',
    brand: 'Samsung',
    name: 'Galaxy Z Flip 5',
    form_factor: 'foldable',
    release_year: 2023,
    hardware_features: {
      usb_video_out: false,
      desktop_mode: null,
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['SM-F731B', 'SM-F731N'],
        codename: 'b5q',
        region: 'Global / Europe / Korea',
        soc: 'Qualcomm Snapdragon 8 Gen 2 for Galaxy',
        bootloader_unlockable: 'YES',
        unlock_method: 'OEM Unlocking in Developer Options + Odin bootloader unlock',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU', 'APatch'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'HIGH',
        custom_roms: ['BeyondROM', 'Stock Rooted One UI 6'],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-z-flip-5.12785/'
        }
      },
      {
        models: ['SM-F731U', 'SM-F731U1', 'SM-F731W'],
        codename: 'b5q_na',
        region: 'North America / USA / Canada',
        soc: 'Qualcomm Snapdragon 8 Gen 2 for Galaxy',
        bootloader_unlockable: 'NO',
        unlock_method: 'North American carrier locked fastboot/Odin',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/c/samsung-galaxy-z-flip-5.12785/'
        }
      }
    ]
  },
  {
    slug: 'oneplus-open',
    brand: 'OnePlus',
    name: 'Open',
    form_factor: 'foldable',
    release_year: 2023,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Open Canvas (Multi-app split desktop)',
      sdcard_slot: false,
      headphone_jack: false
    },
    variants: [
      {
        models: ['CPH2551'],
        codename: 'tetris',
        region: 'Global / North America / Europe / India',
        soc: 'Qualcomm Snapdragon 8 Gen 2',
        bootloader_unlockable: 'YES',
        unlock_method: 'Developer Options OEM Unlock + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'APatch', 'Magisk'],
        custom_recovery: 'Fastbootd / KernelSU init_boot patch',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Stock Rooted OxygenOS 14', 'ColorOS Conversion'],
        links: {
          xda: 'https://xdaforums.com/c/oneplus-open.12811/'
        }
      }
    ]
  },

  // --- ANDROID GAMING HANDHELDS ---
  {
    slug: 'ayn-odin-2',
    brand: 'Ayn',
    name: 'Odin 2',
    form_factor: 'handheld',
    release_year: 2023,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: '4K 60Hz DP Alt Mode + Micro-HDMI',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['Odin 2', 'Odin 2 Pro', 'Odin 2 MAX', 'Odin 2 Mini', 'Odin 2 Portal'],
        codename: 'odin2',
        region: 'Global Open Market',
        soc: 'Qualcomm Snapdragon 8 Gen 2',
        bootloader_unlockable: 'YES',
        unlock_method: 'Factory unlocked; fastboot flashing unlock supported out of the box',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU', 'APatch'],
        custom_recovery: 'Fastbootd / Boot Image Patching',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Valhalla OS', 'Stock Rooted AynOS', 'Ubuntu Touch / Linux on ARM'],
        links: {
          xda: 'https://xdaforums.com/',
          github: 'https://github.com/Open-Odin'
        }
      }
    ]
  },
  {
    slug: 'ayn-odin-pro',
    brand: 'Ayn',
    name: 'Odin Pro',
    form_factor: 'handheld',
    release_year: 2022,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'DisplayPort over USB-C + Micro-HDMI',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['Odin Base', 'Odin Pro'],
        codename: 'odin',
        region: 'Global Open Market',
        soc: 'Qualcomm Snapdragon 845',
        bootloader_unlockable: 'YES',
        unlock_method: 'fastboot oem unlock directly in bootloader',
        root_status: 'FULL',
        root_methods: ['Magisk'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 19.1', 'Windows 11 on ARM Dual-Boot', 'Batocera Linux'],
        links: {
          github: 'https://github.com/project-celadon'
        }
      }
    ]
  },
  {
    slug: 'retroid-pocket-4-pro',
    brand: 'Retroid',
    name: 'Pocket 4 Pro',
    form_factor: 'handheld',
    release_year: 2024,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: '1080p DP Alt Mode over USB-C + Micro-HDMI',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['RP4 Pro', 'Retroid Pocket 4 Pro'],
        codename: 'rp4pro',
        region: 'Global Open Market',
        soc: 'MediaTek Dimensity 1100',
        bootloader_unlockable: 'YES',
        unlock_method: 'fastboot flashing unlock via MTK OEM Unlocking',
        root_status: 'FULL',
        root_methods: ['Magisk'],
        custom_recovery: 'Fastbootd / Boot Patching',
        custom_kernel_support: 'MODERATE',
        custom_roms: ['RetroidOS Stock Rooted', 'GSI Android 13/14'],
        links: {
          github: 'https://github.com/bkerler/mtkclient'
        }
      }
    ]
  },
  {
    slug: 'retroid-pocket-5',
    brand: 'Retroid',
    name: 'Pocket 5',
    form_factor: 'handheld',
    release_year: 2024,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: '1080p 60Hz DP Alt Mode',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['RP5', 'Retroid Pocket 5'],
        codename: 'rp5',
        region: 'Global Open Market',
        soc: 'Qualcomm Snapdragon 865',
        bootloader_unlockable: 'YES',
        unlock_method: 'fastboot flashing unlock with Developer Options OEM Unlock',
        root_status: 'FULL',
        root_methods: ['KernelSU', 'Magisk', 'APatch'],
        custom_recovery: 'TWRP Unofficial',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Batocera Linux Dual-Boot', 'LineageOS 21', 'Rocknix'],
        links: {
          github: 'https://github.com/Retroid-Pocket'
        }
      }
    ]
  },
  {
    slug: 'razer-edge',
    brand: 'Razer',
    name: 'Edge Gaming Handheld',
    form_factor: 'handheld',
    release_year: 2023,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Nexus Desktop Mode / DP Alt Mode',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['RZ45-0460 (Wi-Fi)'],
        codename: 'kailua',
        region: 'Global Wi-Fi Edition',
        soc: 'Qualcomm Snapdragon G3x Gen 1',
        bootloader_unlockable: 'YES',
        unlock_method: 'Developer Options OEM Unlock toggle + fastboot flashing unlock',
        root_status: 'FULL',
        root_methods: ['Magisk', 'KernelSU'],
        custom_recovery: 'Fastbootd / Boot Patching',
        custom_kernel_support: 'HIGH',
        custom_roms: ['Stock Rooted RazerOS', 'Treble GSI'],
        links: {
          xda: 'https://xdaforums.com/'
        }
      },
      {
        models: ['RZ45-0460 (Verizon 5G)'],
        codename: 'kailua_vzw',
        region: 'USA Verizon 5G Carrier Edition',
        soc: 'Qualcomm Snapdragon G3x Gen 1',
        bootloader_unlockable: 'NO',
        unlock_method: 'Verizon carrier locked bootloader policy',
        root_status: 'LOCKED',
        root_methods: [],
        custom_recovery: 'None',
        custom_kernel_support: 'NONE',
        custom_roms: [],
        links: {
          xda: 'https://xdaforums.com/'
        }
      }
    ]
  },
  {
    slug: 'nvidia-shield-tablet-k1',
    brand: 'Nvidia',
    name: 'SHIELD Tablet K1',
    form_factor: 'handheld',
    release_year: 2015,
    hardware_features: {
      usb_video_out: true,
      desktop_mode: 'Console Mode (Mini-HDMI 4K)',
      sdcard_slot: true,
      headphone_jack: true
    },
    variants: [
      {
        models: ['SHIELD Tablet K1', 'P1761W'],
        codename: 'shieldtablet',
        region: 'Global Factory Unlocked',
        soc: 'Nvidia Tegra K1-32',
        bootloader_unlockable: 'YES',
        unlock_method: 'Official Nvidia developer OS images + fastboot oem unlock',
        root_status: 'FULL',
        root_methods: ['Magisk'],
        custom_recovery: 'TWRP Official',
        custom_kernel_support: 'HIGH',
        custom_roms: ['LineageOS 17.1 Official', 'Resurrection Remix', 'ShieldOS Factory Stock'],
        links: {
          xda: 'https://xdaforums.com/c/nvidia-shield-tablet.3448/'
        }
      }
    ]
  }
];

const targetDir = path.resolve('data/devices');
let created = 0;

for (const dev of devices) {
  const filePath = path.join(targetDir, `${dev.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dev, null, 2) + '\n', 'utf8');
  console.log(`Wrote [${dev.form_factor}]: ${dev.slug}.json`);
  created++;
}

console.log(`\n✅ Added ${created} high-demand tablets, foldables, and Android gaming handhelds.`);

