import MiniSearch from 'minisearch';
import { SearchItem } from '@/types/device';

let miniSearchInstance: MiniSearch<SearchItem> | null = null;

export function createMiniSearch(items: SearchItem[]): MiniSearch<SearchItem> {
  const miniSearch = new MiniSearch<SearchItem>({
    fields: ['models', 'name', 'codenames', 'brand', 'soc'],
    storeFields: [
      'id',
      'slug',
      'brand',
      'name',
      'fullName',
      'release_year',
      'models',
      'rawModels',
      'codenames',
      'soc',
      'overallRoot',
      'overallBootloader',
      'usb_video_out',
      'desktop_mode',
      'sdcard_slot',
      'headphone_jack',
      'variantsCount',
      'sampleVariants',
    ],
    searchOptions: {
      boost: {
        models: 10.0,
        name: 6.0,
        codenames: 4.0,
        brand: 2.0,
        soc: 1.5,
      },
      prefix: true,
      fuzzy: 0.2,
    },
    tokenize: (text) => {
      // Split on spaces, hyphens, slashes and underscores so model numbers like "SM-G950F" yield ["sm", "g950f", "sm-g950f"]
      const clean = text.toLowerCase();
      const parts = clean.split(/[\s,./\\_-]+/);
      const original = clean.split(/\s+/);
      return Array.from(new Set([...parts, ...original])).filter(Boolean);
    },
  });

  miniSearch.addAll(items);
  return miniSearch;
}

export function getSearchIndex(items: SearchItem[]): MiniSearch<SearchItem> {
  if (!miniSearchInstance) {
    miniSearchInstance = createMiniSearch(items);
  }
  return miniSearchInstance;
}
