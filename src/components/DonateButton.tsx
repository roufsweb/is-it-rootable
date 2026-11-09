'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Copy, Check, ExternalLink, X, Heart } from 'lucide-react';

const ETH_ADDRESS = '0x609e0AB78d5174F72fF8709564f8337DebEa5BD7';
const ETHERSCAN_URL = `https://etherscan.io/address/${ETH_ADDRESS}`;

export function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(ETH_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold transition-all shadow-xs cursor-pointer"
        title="Support the project / Buy a coffee via Ethereum"
      >
        <Coffee className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Tip / Coffee</span>
        <span className="sm:hidden">Tip</span>
      </button>

      {/* Cyber Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-contrast-lg space-y-5 font-mono text-xs text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">
                  Support IsItRootable
                </h3>
                <p className="text-[11px] text-muted font-medium">
                  Buy a coffee via Ethereum / MetaMask
                </p>
              </div>
            </div>

            {/* Project Note */}
            <div className="p-3.5 rounded-xl border border-border bg-surface-elevated text-muted leading-relaxed space-y-2">
              <p>
                IsItRootable is 100% free, open-source, and operated without advertisements or tracking.
              </p>
              <p>
                If this database saved you from purchasing a carrier-locked device or helped you on your rooting journey, voluntary tips are warmly appreciated!
              </p>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">
                No promises or perks — just pure community appreciation.
              </div>
            </div>

            {/* Wallet Address Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted">
                <span>Ethereum (ERC-20) / MetaMask Wallet</span>
                <span className="text-cyan-600 dark:text-cyan-400">ETH</span>
              </div>

              <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-50/40 dark:bg-cyan-950/20 flex flex-col gap-2">
                <div className="font-mono text-[11px] sm:text-xs text-foreground font-bold break-all select-all">
                  {ETH_ADDRESS}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-background font-bold transition-colors cursor-pointer text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={ETHERSCAN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition-colors"
                  >
                    <span>View on Etherscan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Dismiss Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

