---
name: root-seo-generator
description: Generates high-ranking JSON-LD structured data, FAQPage schemas, and dynamic OpenGraph tags to outrank XDA and forum posts on Google.
---

# Root SEO Generator

Instructions for programmatic SEO generation on device and model pages.

## Dynamic Metadata Rules
Base Canonical URL: `https://roufsweb.github.io/is-it-rootable`

For every model page (`/model/[model]`):
- **Page Title**: `Can You Root [Phone Name] ([Model])? Bootloader & Kernel Status - IsItRootable`
- **Meta Description**: `Check if the [Phone Name] [Model] can be rooted. Bootloader unlock status: [YES/NO]. Supported methods: [KernelSU/Magisk/None]. DeX/DisplayPort support: [YES/NO].`
- **Canonical**: `https://roufsweb.github.io/is-it-rootable/model/[model]/`

For every device page (`/device/[slug]`):
- **Page Title**: `Can You Root [Brand] [Phone Name]? Variants, Bootloader & DeX Guide - IsItRootable`
- **Meta Description**: `Detailed root & bootloader unlock guide for [Brand] [Phone Name]. Compare regional variants ([Model List]), custom recovery (TWRP), and kernel support.`
- **Canonical**: `https://roufsweb.github.io/is-it-rootable/device/[slug]/`

## Structured Data (JSON-LD)
Every device and model page MUST inject an `application/ld+json` script containing a Google `FAQPage` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you root the Samsung Galaxy S8 (SM-G950U)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The SM-G950U is a North American carrier variant with a permanently locked bootloader. It cannot be bootloader-unlocked on modern firmware."
      }
    },
    {
      "@type": "Question",
      "name": "Does the SM-G950F support Samsung DeX and custom kernels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The international Exynos SM-G950F has an unlockable bootloader, full TWRP recovery, and supports custom kernels like HadesKernel."
      }
    }
  ]
}
```

