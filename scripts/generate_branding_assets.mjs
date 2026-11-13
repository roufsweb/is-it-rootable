import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const PUBLIC_DIR = path.resolve('public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Core Brand Logo Mark (SVG)
// Android silhouette + Terminal Superuser '#' + Unlocked Cyber Shackle + Neon Cyan Glow
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e1a"/>
      <stop offset="50%" stop-color="#040711"/>
      <stop offset="100%" stop-color="#020409"/>
    </linearGradient>

    <!-- Neon Cyan to Emerald Gradient -->
    <linearGradient id="cyanGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="60%" stop-color="#00e5a3"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <!-- Border Glow Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#0088ff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.7"/>
    </linearGradient>

    <!-- Shackle Gradient (Unlocked Gold/Emerald) -->
    <linearGradient id="shackleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <!-- Soft Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Outer Rounded Cyber Shield Background -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="4"/>
  
  <!-- Subtle Grid Pattern Lines -->
  <g opacity="0.12" stroke="#00f0ff" stroke-width="1.5">
    <line x1="16" y1="136" x2="496" y2="136" />
    <line x1="16" y1="256" x2="496" y2="256" />
    <line x1="16" y1="376" x2="496" y2="376" />
    <line x1="136" y1="16" x2="136" y2="496" />
    <line x1="256" y1="16" x2="256" y2="496" />
    <line x1="376" y1="16" x2="376" y2="496" />
  </g>

  <!-- Unlocked Padlock Shackle Arc (Symbolizing Bootloader Unlock) -->
  <path d="M 216 170 L 216 116 C 216 76 296 76 296 116 L 296 130" 
        fill="none" 
        stroke="url(#shackleGrad)" 
        stroke-width="22" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#subtleGlow)"/>

  <!-- Android Head Silhouette (Upper Dome) -->
  <path d="M 136 264 C 136 198 190 144 256 144 C 322 144 376 198 376 264 Z" 
        fill="url(#cyanGreenGrad)" 
        opacity="0.95"
        filter="url(#neonGlow)"/>

  <!-- Left Antenna -->
  <line x1="190" y1="164" x2="162" y2="114" 
        stroke="#00f0ff" 
        stroke-width="16" 
        stroke-linecap="round"
        filter="url(#subtleGlow)"/>

  <!-- Right Antenna -->
  <line x1="322" y1="164" x2="350" y2="114" 
        stroke="#10b981" 
        stroke-width="16" 
        stroke-linecap="round"
        filter="url(#subtleGlow)"/>

  <!-- Eyes: Terminal Prompts (Left: '>', Right: '#') -->
  <!-- Left Eye: Terminal Prompt Arrow '>' -->
  <path d="M 194 212 L 214 224 L 194 236" 
        fill="none" 
        stroke="#040711" 
        stroke-width="7" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>

  <!-- Right Eye: Superuser Hash '#' -->
  <g stroke="#040711" stroke-width="5" stroke-linecap="round">
    <line x1="298" y1="212" x2="298" y2="236" />
    <line x1="312" y1="212" x2="312" y2="236" />
    <line x1="292" y1="219" x2="318" y2="219" />
    <line x1="292" y1="229" x2="318" y2="229" />
  </g>

  <!-- Lower Terminal Container / Fastboot Box -->
  <rect x="136" y="284" width="240" height="120" rx="20" fill="#0c1424" stroke="url(#cyanGreenGrad)" stroke-width="4"/>

  <!-- Prominent Glowing '#' Root Hash Inside Fastboot Box -->
  <g stroke="url(#cyanGreenGrad)" stroke-width="12" stroke-linecap="round" filter="url(#neonGlow)">
    <line x1="236" y1="308" x2="230" y2="380" />
    <line x1="282" y1="308" x2="276" y2="380" />
    <line x1="208" y1="330" x2="304" y2="330" />
    <line x1="202" y1="358" x2="298" y2="358" />
  </g>

  <!-- Corner Tech Accent Decals -->
  <path d="M 50 110 L 50 50 L 110 50" fill="none" stroke="#00f0ff" stroke-width="4" opacity="0.6"/>
  <path d="M 462 110 L 462 50 L 402 50" fill="none" stroke="#10b981" stroke-width="4" opacity="0.6"/>
  <path d="M 50 402 L 50 462 L 110 462" fill="none" stroke="#00f0ff" stroke-width="4" opacity="0.6"/>
  <path d="M 462 402 L 462 462 L 402 462" fill="none" stroke="#10b981" stroke-width="4" opacity="0.6"/>
</svg>`;

// 2. Favicon SVG (High contrast, optimized for 16px - 32px visibility)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e1a"/>
      <stop offset="100%" stop-color="#020409"/>
    </linearGradient>
    <linearGradient id="favNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#favBg)" stroke="url(#favNeon)" stroke-width="4"/>
  <!-- Antennas -->
  <line x1="48" y1="38" x2="38" y2="22" stroke="#00f0ff" stroke-width="6" stroke-linecap="round"/>
  <line x1="80" y1="38" x2="90" y2="22" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
  <!-- Android Head -->
  <path d="M 32 68 C 32 46 46 32 64 32 C 82 32 96 46 96 68 Z" fill="url(#favNeon)"/>
  <!-- Superuser '#' in body -->
  <rect x="32" y="74" width="64" height="34" rx="8" fill="#080e1a" stroke="url(#favNeon)" stroke-width="3"/>
  <g stroke="url(#favNeon)" stroke-width="4" stroke-linecap="round">
    <line x1="58" y1="80" x2="56" y2="102" />
    <line x1="72" y1="80" x2="70" y2="102" />
    <line x1="50" y1="87" x2="78" y2="87" />
    <line x1="48" y1="95" x2="76" y2="95" />
  </g>
</svg>`;

// 3. GitHub Banner & OpenGraph Social Card (1280x640)
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080d19"/>
      <stop offset="50%" stop-color="#04060d"/>
      <stop offset="100%" stop-color="#020307"/>
    </linearGradient>

    <!-- Brand Cyan-Green Gradient -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#00e5a3"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <!-- Card Background Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#090e17" stop-opacity="0.95"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Deep Cyber Slate Background -->
  <rect width="1280" height="640" fill="url(#bgGrad)"/>

  <!-- Perspective Grid Pattern -->
  <g opacity="0.08" stroke="#00f0ff" stroke-width="1.5">
    <!-- Horizontal Grid Lines -->
    <line x1="0" y1="80" x2="1280" y2="80" />
    <line x1="0" y1="160" x2="1280" y2="160" />
    <line x1="0" y1="240" x2="1280" y2="240" />
    <line x1="0" y1="320" x2="1280" y2="320" />
    <line x1="0" y1="400" x2="1280" y2="400" />
    <line x1="0" y1="480" x2="1280" y2="480" />
    <line x1="0" y1="560" x2="1280" y2="560" />

    <!-- Vertical Grid Lines -->
    <line x1="80" y1="0" x2="80" y2="640" />
    <line x1="200" y1="0" x2="200" y2="640" />
    <line x1="320" y1="0" x2="320" y2="640" />
    <line x1="440" y1="0" x2="440" y2="640" />
    <line x1="560" y1="0" x2="560" y2="640" />
    <line x1="680" y1="0" x2="680" y2="640" />
    <line x1="800" y1="0" x2="800" y2="640" />
    <line x1="920" y1="0" x2="920" y2="640" />
    <line x1="1040" y1="0" x2="1040" y2="640" />
    <line x1="1160" y1="0" x2="1160" y2="640" />
  </g>

  <!-- Ambient Light Orbs -->
  <circle cx="240" cy="220" r="180" fill="#00f0ff" opacity="0.06" filter="url(#glow)"/>
  <circle cx="1040" cy="360" r="220" fill="#10b981" opacity="0.05" filter="url(#glow)"/>

  <!-- LEFT COLUMN: Brand Identity & Logo Mark -->
  <g transform="translate(80, 80)">
    <!-- Small Brand Badge -->
    <rect x="0" y="0" width="280" height="32" rx="16" fill="#081a26" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="16" cy="16" r="4" fill="#00f0ff"/>
    <text x="28" y="21" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#00f0ff" letter-spacing="1">MODEL-SUFFIX SENSITIVE DATABASE</text>

    <!-- Main Title -->
    <text x="0" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="900" fill="#ffffff" letter-spacing="-1.5">
      IsIt<tspan fill="url(#brandGrad)">Rootable</tspan>
    </text>

    <!-- Tagline -->
    <text x="0" y="152" font-family="'Courier New', monospace" font-size="19" font-weight="600" fill="#94a3b8">
      Instant Android Bootloader, Root &amp; DeX Compatibility
    </text>

    <!-- Subtitle explanation -->
    <text x="0" y="186" font-family="'Courier New', monospace" font-size="14" font-weight="500" fill="#64748b">
      Exposes carrier lockdowns (SM-G950F vs SM-G950U), KernelSU, custom ROMs &amp; DisplayPort.
    </text>

    <!-- Feature Stat Pills -->
    <g transform="translate(0, 230)">
      <!-- Pill 1: 336+ Phone Families -->
      <g>
        <rect x="0" y="0" width="160" height="48" rx="12" fill="#0b1322" stroke="#1e293b" stroke-width="1.5"/>
        <text x="18" y="22" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#00f0ff">PHONE ARSENAL</text>
        <text x="18" y="40" font-family="system-ui, sans-serif" font-size="17" font-weight="900" fill="#ffffff">336+ Devices</text>
      </g>

      <!-- Pill 2: 1,600+ Model Codes -->
      <g transform="translate(175, 0)">
        <rect x="0" y="0" width="160" height="48" rx="12" fill="#0b1322" stroke="#1e293b" stroke-width="1.5"/>
        <text x="18" y="22" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#10b981">MODEL SUFFIXES</text>
        <text x="18" y="40" font-family="system-ui, sans-serif" font-size="17" font-weight="900" fill="#ffffff">1,600+ Codes</text>
      </g>

      <!-- Pill 3: Zero Latency -->
      <g transform="translate(350, 0)">
        <rect x="0" y="0" width="160" height="48" rx="12" fill="#0b1322" stroke="#1e293b" stroke-width="1.5"/>
        <text x="18" y="22" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#a855f7">CLIENT SEARCH</text>
        <text x="18" y="40" font-family="system-ui, sans-serif" font-size="17" font-weight="900" fill="#ffffff">&lt;20ms MiniSearch</text>
      </g>
    </g>

    <!-- Open Source GitHub Pill -->
    <g transform="translate(0, 310)">
      <text x="0" y="20" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#38bdf8">
        ▶ Live at: <tspan fill="#ffffff">roufsweb.github.io/is-it-rootable</tspan>
      </text>
    </g>
  </g>

  <!-- RIGHT COLUMN: High-Tech Cyber Terminal Window Mockup -->
  <g transform="translate(710, 80)">
    <!-- Terminal Container -->
    <rect x="0" y="0" width="490" height="480" rx="20" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="2"/>

    <!-- Terminal Window Header Bar -->
    <path d="M 0 20 C 0 8.954 8.954 0 20 0 L 470 0 C 481.046 0 490 8.954 490 20 L 490 48 L 0 48 Z" fill="#090e17"/>
    <line x1="0" y1="48" x2="490" y2="48" stroke="#1e293b" stroke-width="1.5"/>
    
    <!-- Traffic light dots -->
    <circle cx="24" cy="24" r="6" fill="#f43f5e"/>
    <circle cx="44" cy="24" r="6" fill="#f59e0b"/>
    <circle cx="64" cy="24" r="6" fill="#10b981"/>

    <!-- Window Title -->
    <text x="245" y="30" text-anchor="middle" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#64748b">
      is-it-rootable --cli v1.1
    </text>

    <!-- Terminal Body Content -->
    <g transform="translate(24, 76)" font-family="'Courier New', monospace" font-size="13" font-weight="600">
      <!-- Command 1 -->
      <text x="0" y="0" fill="#64748b">$ <tspan fill="#00f0ff">fastboot</tspan> <tspan fill="#ffffff">devices</tspan></text>
      <text x="0" y="24" fill="#10b981">9889da34a2    fastboot (cheetah)</text>

      <!-- Command 2 -->
      <text x="0" y="60" fill="#64748b">$ <tspan fill="#00f0ff">isitrootable</tspan> <tspan fill="#ffffff">check SM-G950F vs SM-G950U</tspan></text>
      
      <!-- Box 1: Unlocked Global -->
      <g transform="translate(0, 80)">
        <rect x="0" y="0" width="442" height="64" rx="8" fill="#061d15" stroke="#10b981" stroke-width="1.5"/>
        <text x="14" y="24" fill="#34d399" font-weight="bold">✓ SM-G950F (Global / Exynos)</text>
        <text x="14" y="46" fill="#94a3b8" font-size="11">Verdict: FULL_ROOT | KernelSU + LineageOS + DeX</text>
      </g>

      <!-- Box 2: Locked US Carrier -->
      <g transform="translate(0, 156)">
        <rect x="0" y="0" width="442" height="64" rx="8" fill="#200b0e" stroke="#f43f5e" stroke-width="1.5"/>
        <text x="14" y="24" fill="#fb7185" font-weight="bold">✗ SM-G950U (USA / Snapdragon)</text>
        <text x="14" y="46" fill="#94a3b8" font-size="11">Verdict: LOCKED | Bootloader permanently fused</text>
      </g>

      <!-- Diagnostic Status -->
      <g transform="translate(0, 240)">
        <text x="0" y="0" fill="#00f0ff">[i] Indexing 16 Major OEMs (Samsung, Pixel, OnePlus, Xiaomi...)</text>
        <text x="0" y="22" fill="#38bdf8">[i] Verified against Play Integrity API &amp; Knox 0x1</text>
        <text x="0" y="44" fill="#34d399">[✓] Client index ready: 20ms response time</text>
      </g>
    </g>

    <!-- Terminal Footer Badge -->
    <g transform="translate(24, 430)">
      <rect x="0" y="0" width="442" height="30" rx="6" fill="#04060d" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="20" font-family="'Courier New', monospace" font-size="11" fill="#64748b">
        STATUS: <tspan fill="#00f0ff">READY</tspan> | SYSTEM: <tspan fill="#34d399">100% STATIC EXPORT</tspan>
      </text>
    </g>
  </g>

  <!-- Outer Tech Border Decals -->
  <line x1="20" y1="20" x2="60" y2="20" stroke="#00f0ff" stroke-width="3"/>
  <line x1="20" y1="20" x2="20" y2="60" stroke="#00f0ff" stroke-width="3"/>
  <line x1="1260" y1="20" x2="1220" y2="20" stroke="#10b981" stroke-width="3"/>
  <line x1="1260" y1="20" x2="1260" y2="60" stroke="#10b981" stroke-width="3"/>
  <line x1="20" y1="620" x2="60" y2="620" stroke="#00f0ff" stroke-width="3"/>
  <line x1="20" y1="620" x2="20" y2="580" stroke="#00f0ff" stroke-width="3"/>
  <line x1="1260" y1="620" x2="1220" y2="620" stroke="#10b981" stroke-width="3"/>
  <line x1="1260" y1="620" x2="1260" y2="580" stroke="#10b981" stroke-width="3"/>
</svg>`;

async function main() {
  console.log('1. Writing vector SVG files...');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), logoSvg, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'banner.svg'), bannerSvg, 'utf8');

  // Also write into src/app/icon.svg for Next.js 15 automatic metadata icon support
  fs.writeFileSync(path.resolve('src/app/icon.svg'), faviconSvg, 'utf8');

  console.log('2. Rasterizing PNG assets with Sharp...');
  // Rasterize logo to PNG
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'logo.png'));

  // Rasterize icons
  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // Multi-size icons for ICO packaging
  await sharp(Buffer.from(faviconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-16.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-32.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-48.png'));

  // Rasterize GitHub Banner & OG Image
  console.log('3. Generating GitHub Banner (1280x640) and OpenGraph Image (1200x630)...');
  await sharp(Buffer.from(bannerSvg))
    .resize(1280, 640)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'banner.png'));

  await sharp(Buffer.from(bannerSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'og-image.png'));

  // Also write banner.png to root directory for easy README display
  fs.copyFileSync(path.join(PUBLIC_DIR, 'banner.png'), path.resolve('banner.png'));

  console.log('4. Generating favicon.ico via Python Pillow...');
  const pythonScript = `
from PIL import Image
import os

img48 = Image.open('public/icon-48.png')
img32 = Image.open('public/icon-32.png')
img16 = Image.open('public/icon-16.png')

img48.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('Favicon.ico successfully created!')
`;
  fs.writeFileSync('scripts/make_ico.py', pythonScript, 'utf8');
  execSync('python scripts/make_ico.py', { stdio: 'inherit' });
  fs.unlinkSync('scripts/make_ico.py');

  // Clean up temporary small PNGs
  fs.unlinkSync(path.join(PUBLIC_DIR, 'icon-16.png'));
  fs.unlinkSync(path.join(PUBLIC_DIR, 'icon-32.png'));
  fs.unlinkSync(path.join(PUBLIC_DIR, 'icon-48.png'));

  console.log('✅ All branding assets generated successfully in /public!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

