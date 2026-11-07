---
name: root-search-indexer
description: Builds and optimizes client-side search indices, fuzzy matching algorithms, and model prefix lookups. Use when implementing or tweaking search components in IsItRootable.
---

# Root Search Indexer

Instructions for building instant, zero-latency client search for IsItRootable.

## Search Algorithm Requirements
- Users search in 4 distinct ways:
  1. Generic phone name: "Galaxy S8", "Pixel 8", "OnePlus 7T"
  2. Exact model suffix: "SM-G950U", "G950F", "A528B", "KB2005"
  3. Codename: "dreamlte", "cheetah", "guacamole"
  4. Feature filters: "dex", "displayport", "usb 3.1", "sdcard"

## Implementation Rules
1. Use **MiniSearch** instead of Fuse.js for multi-field indexing to keep bundle sizes under 150KB.
2. Tokenize hyphenated model numbers: A search for `G950F` MUST match `SM-G950F`.
3. Weighting priority:
   - `models` exact match: weight 10.0
   - `name` match: weight 6.0
   - `codename` match: weight 4.0
   - `brand` match: weight 2.0
4. Client search configuration:
   - Prefix search enabled: `prefix: true`
   - Fuzzy search with threshold `0.2` for minor typos
   - Combine results across brand, name, models, and codenames.
