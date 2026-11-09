import { MetadataRoute } from 'next';
import { getAllDevices, getAllModels } from '@/lib/devices';
import { getCanonicalUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const devices = getAllDevices();
  const models = getAllModels();

  const routes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl(''),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: getCanonicalUrl('about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Device pages
  for (const device of devices) {
    routes.push({
      url: getCanonicalUrl(`device/${device.slug}`),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Model pages
  const uniqueModels = new Set<string>();
  for (const entry of models) {
    if (!uniqueModels.has(entry.normalizedModel)) {
      uniqueModels.add(entry.normalizedModel);
      routes.push({
        url: getCanonicalUrl(`model/${entry.normalizedModel}`),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return routes;
}
