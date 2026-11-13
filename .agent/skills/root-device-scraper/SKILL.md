---
name: root-device-scraper
description: Local data gathering and web scraping workflow for Antigravity agents to research Android devices, verify bootloader unlock status across regional sub-models, check TWRP/LineageOS/Custom Kernel availability, and write validated JSON files into data/devices/. Use whenever asked to scrape, research, populate, or add new phones to IsItRootable.
---

# Root Device Scraper (Local Agent Workflow)

Use this skill to research and populate device data locally so no scraping ever runs on GitHub Actions.

## Step-by-Step Local Scraping Pipeline

1. **Source Extraction (Run Locally Only)**:
   - Query local `data/raw/google_play_devices.json` (from Google's certified list) to get exact regional model numbers and codenames for the target phone.
   - Fetch official open data endpoints locally via Python/Node scripts or browser tools:
     - LineageOS Wiki YAML: `https://raw.githubusercontent.com/LineageOS/lineage_wiki/refs/heads/main/_data/devices/[codename].yml`
     - Customrombay Data: `https://raw.githubusercontent.com/Customrombay/database/refs/heads/main/data/devices/[codename].yaml`
     - TWRP Device List: `https://twrp.me/Devices/`
   - Cross-reference XDA Forums and GitHub repositories for custom kernels (`KernelSU`, `NetHunter`, `Docker`, upstream kernels) and hardware USB-C DisplayPort / DeX support.

2. **Apply Regional Bootloader Heuristics**:
   - **Samsung**:
     - Models ending in `U`, `U1`, `W` (North America) or Japanese carrier prefixes (`SC-`, `SCG`) -> `bootloader_unlockable: "NO"`, `root_status: "LOCKED"`.
     - Devices launching with One UI 8.0+ (S25 series, A56, A36, Z Fold 7) -> `bootloader_unlockable: "NO"`, `root_status: "LOCKED"`.
     - Devices updated to One UI 8.0 that launched on One UI 7 or older (S22, S23, S24, A54, A55) -> `root_status: "CONDITIONAL"` (Document the Odin `SW REV` binary bit downgrade requirement).
     - Pre-One UI 8 EOL International models (`F`, `B`, `N`, `G` on S8 through S21) -> `bootloader_unlockable: "YES"`, `root_status: "FULL"`.
   - **Google Pixel**:
     - Factory Unlocked / EU / Global -> `FULL`.
     - Verizon (`MMWave` carrier locked) -> `LOCKED`.
   - **Xiaomi / Poco / Redmi**:
     - Global (`G` / `MI` / `EU` / `IN`) -> `CONDITIONAL` or `FULL` (via Mi Community / Mi Unlock Tool).
     - China (`CN`) on HyperOS -> `CONDITIONAL` or `LOCKED` (Note strict Mainland China account restrictions).
   - **OnePlus**:
     - Factory Unlocked / International -> `bootloader_unlockable: "YES"`, `root_status: "FULL"`.
     - Carrier locked (T-Mobile / Verizon) -> `CONDITIONAL` (Requires unlock token from carrier or MSM Download Tool / EDL crossflash).
   - **Motorola**:
     - Retail Unlocked -> `bootloader_unlockable: "YES"`, `root_status: "FULL"` (via Motorola Bootloader Unlock portal).
     - Carrier locked (Verizon / AT&T / Cricket) -> `bootloader_unlockable: "NO"`, `root_status: "LOCKED"`.

3. **Write & Validate**:
   - Save the structured output to `data/devices/[brand]-[device-slug].json`.
   - Run `node scripts/validate_schema.mjs` to ensure 100% schema compliance before staging with Git.

