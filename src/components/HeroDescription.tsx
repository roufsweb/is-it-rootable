'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function HeroDescription() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2 max-w-2xl font-mono text-xs sm:text-sm md:text-base text-muted font-medium leading-relaxed">
      <p>
        Instant bootloader, root, and DeX intelligence across Smartphones, Tablets &amp; Pads, Foldables, and Gaming Handhelds. Check exact regional model suffixes (e.g., Samsung{' '}
        <span className="text-foreground font-bold underline decoration-emerald-500/60 decoration-2">SM-G950F</span> vs locked{' '}
        <span className="text-foreground font-bold underline decoration-rose-500/60 decoration-2">SM-G950U</span>), custom ROM availability, and USB-C DisplayPort/DeX capability.
      </p>

      {isExpanded && (
        <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-muted border-t border-border/70 animate-in fade-in duration-200">
          <p>
            Never assume an Android device is rootable by its commercial name alone. OEMs manufacture distinct hardware variants across carriers and continents:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/90 pl-1 font-mono text-xs sm:text-sm">
            <li>
              <strong className="text-foreground">Regional Model Suffixes:</strong> International models (ending in F, B, or N) feature unlockable bootloaders, whereas US carrier models (U, U1, W) or Verizon editions are permanently locked down.
            </li>
            <li>
              <strong className="text-foreground">Knox &amp; Hardware E-Fuses:</strong> Certain OEMs permanently burn tamper fuses (e.g. Samsung Knox 0x1) when flashing custom binaries, which irreversibly disables Knox-dependent features like Secure Folder and Samsung Wallet.
            </li>
            <li>
              <strong className="text-foreground">KernelSU, APatch &amp; Magisk:</strong> Modern devices with Android 13+ GKI kernels support systemless kernel-level root without modifying vendor partitions or failing basic Play Integrity checks.
            </li>
            <li>
              <strong className="text-foreground">Hardware Productivity Verification:</strong> Check verified support for DisplayPort Alt Mode video output (Samsung DeX, Motorola Ready For), microSD card expansion, and 3.5mm analog audio jacks.
            </li>
          </ul>
        </div>
      )}

      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-foreground hover:text-cyan-500 transition-colors cursor-pointer group"
          aria-expanded={isExpanded}
        >
          <span className="underline underline-offset-4 decoration-border group-hover:decoration-cyan-500">
            {isExpanded ? 'Read less' : 'Read more...'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted group-hover:text-cyan-500 transition-colors" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted group-hover:text-cyan-500 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
}
