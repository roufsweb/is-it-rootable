/**
 * Centralized Site & SEO Configuration for IsItRootable
 * 
 * Supports seamless switching between custom domain (e.g. projectname.rosette.com)
 * and GitHub Pages (roufsweb.github.io/is-it-rootable) via environment variables.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://is-it-rootable.roufsweb.com';
// Normalize site URL to remove trailing slash
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const SITE_CONFIG = {
  name: 'IsItRootable',
  shortName: 'IsItRootable',
  title: 'IsItRootable - Instant Android Bootloader, Root & DeX Compatibility Database',
  description:
    'Instant, model-suffix-sensitive Android bootloader unlock and root database. Check whether your exact model (SM-G950F vs SM-G950U), custom ROMs, KernelSU, and USB-C DisplayPort/DeX are supported.',
  url: SITE_URL,
  author: 'IsItRootable Contributors',
  maintainer: 'Rouf (@roufsweb)',
  githubRepo: 'https://github.com/roufsweb/is-it-rootable',
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  cryptoWallet: '0x609e0AB78d5174F72fF8709564f8337DebEa5BD7',
};

/**
 * Returns an absolute canonical URL for a given route path
 * e.g. getCanonicalUrl('/device/samsung-galaxy-s24/') -> 'https://is-it-rootable.roufsweb.com/device/samsung-galaxy-s24/'
 * e.g. getCanonicalUrl('sitemap.xml') -> 'https://is-it-rootable.roufsweb.com/sitemap.xml'
 */
export function getCanonicalUrl(pathname: string = ''): string {
  const cleanPath = pathname.replace(/^\/+/, '');
  if (!cleanPath) return `${SITE_URL}/`;
  
  // Do not append trailing slash to file assets (.xml, .txt, .json, .svg, etc.)
  const hasFileExtension = /\.[a-z0-9]{2,5}$/i.test(cleanPath);
  if (hasFileExtension) {
    return `${SITE_URL}/${cleanPath.replace(/\/+$/, '')}`;
  }

  return `${SITE_URL}/${cleanPath}${cleanPath.endsWith('/') ? '' : '/'}`;
}

