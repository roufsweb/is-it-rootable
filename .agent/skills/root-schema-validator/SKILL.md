---
name: root-schema-validator
description: Validates device records, model suffixes, bootloader status, and hardware specs for the IsItRootable database. Use when creating or updating device JSON files in data/devices/.
---

# Root Schema Validator

Use this skill whenever drafting, reviewing, or modifying device JSON records in `data/devices/*.json`.

## Strict Validation Rules

1. **Model Suffix Completeness**:
   - For Samsung: Never group `F/B/N` (Global/Korea) with `U/U1/W` (USA/Canada) or `0` (China/HK).
   - For Google Pixel: Separate standard models from Verizon/carrier-locked variants.
   - For Xiaomi: Differentiate China ROM (requires HyperOS community bypass) from Global ROM.

2. **Required Schema Fields**:
   Every JSON record must strictly follow this structure:
   ```json
   {
     "slug": "samsung-galaxy-s8",
     "brand": "Samsung",
     "name": "Galaxy S8",
     "release_year": 2017,
     "hardware_features": {
       "usb_video_out": true,
       "desktop_mode": "Samsung DeX (Wired)",
       "sdcard_slot": true,
       "headphone_jack": true
     },
     "variants": [
       {
         "models": ["SM-G950F", "SM-G950FD", "SM-G950N"],
         "codename": "dreamlte",
         "region": "Global / Europe / Korea",
         "soc": "Exynos 8895",
         "bootloader_unlockable": "YES",
         "unlock_method": "OEM Unlock toggle in Developer Options + Odin",
         "root_status": "FULL",
         "root_methods": ["Magisk", "KernelSU", "APatch"],
         "custom_recovery": "TWRP Official",
         "custom_kernel_support": "HIGH",
         "links": {
           "xda": "https://xdaforums.com/c/samsung-galaxy-s8.6160/",
           "twrp": "https://twrp.me/samsung/samsunggalaxys8.html"
         }
       }
     ]
   }
   ```

3. **Status Enums**:
   - `bootloader_unlockable`: `"YES"` | `"CONDITIONAL"` | `"NO"`
   - `root_status`: `"FULL"` | `"CONDITIONAL"` | `"LOCKED"`
   - `custom_kernel_support`: `"HIGH"` | `"MODERATE"` | `"LOW"` | `"NONE"`

