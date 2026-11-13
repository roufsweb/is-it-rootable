import { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: getCanonicalUrl('sitemap.xml'),
  };
}
