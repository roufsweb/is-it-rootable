'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Coffee, Copy, Check, ExternalLink, X, Heart } from 'lucide-react';

const ETH_ADDRESS = '0x609e0AB78d5174F72fF8709564f8337DebEa5BD7';
const ETHERSCAN_URL = `https://etherscan.io/address/${ETH_ADDRESS}`;

export function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
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

  const modalContent = isOpen && mounted && typeof document !== 'undefined' ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-modal-title"
      onClick={() => setIsOpen(false)}
      style={{ zIndex: 100000 }}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
    >
      {/* Modal Container: Max-height constrained, fully opaque, never gets cut off or go under banners */}
      <div
        style={{ zIndex: 100001 }}
        className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[min(90vh,600px)] my-auto flex flex-col rounded-2xl border border-border bg-surface shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden font-mono text-xs text-foreground shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header with Pinned Close Button */}
        <div className="sticky top-0 z-10 bg-surface border-b border-border p-3.5 sm:p-5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="donate-modal-title" className="text-sm sm:text-base font-black text-foreground truncate">
                Support IsItRootable
              </h3>
              <p className="text-xs text-muted font-medium truncate">
                Buy a coffee via Ethereum / MetaMask
              </p>
            </div>
          </div>

          {/* Prominent, high-contrast Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            className="p-1.5 sm:p-2 rounded-xl bg-surface-elevated border border-border/80 text-muted hover:text-foreground hover:bg-border transition-colors cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Project Note */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated text-muted leading-relaxed space-y-2 text-xs sm:text-sm font-medium">
            <p>
              IsItRootable is 100% free, open-source, and operated without advertisements or tracking.
            </p>
            <p>
              If this database saved you from purchasing a carrier-locked device or supported your custom ROM journey, voluntary community tips are warmly appreciated!
            </p>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">
              No promises or perks — voluntary community appreciation.
            </div>
          </div>

          {/* Wallet Address Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted">
              <span>Ethereum (ERC-20) / MetaMask Wallet</span>
              <span className="text-cyan-600 dark:text-cyan-400">ETH</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl border border-cyan-500/40 bg-cyan-50/40 dark:bg-cyan-950/20 flex flex-col gap-3">
              <div className="font-mono text-xs sm:text-sm text-foreground font-bold break-all select-all leading-relaxed bg-surface/70 p-2.5 rounded-lg border border-border/60">
                {ETH_ADDRESS}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-border/40">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-background font-bold transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={ETHERSCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition-colors"
                >
                  <span>View on Etherscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer Dismiss Action */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-3 sm:p-4 flex items-center justify-between shrink-0">
          <span className="text-xs text-muted hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-bold">Esc</kbd> to close
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-surface-elevated hover:bg-border border border-border text-foreground font-bold transition-colors cursor-pointer ml-auto text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold transition-all shadow-xs cursor-pointer"
        title="Support the project / Buy a coffee via Ethereum"
      >
        <Coffee className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Tip / Coffee</span>
        <span className="sm:hidden">Tip</span>
      </button>

      {/* Cyber Modal mounted outside header via React Portal */}
      {modalContent && createPortal(modalContent, document.getElementById('portal-root') || document.body)}
    </>
  );
}
