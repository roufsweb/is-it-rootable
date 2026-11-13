'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
}

export function FAQAccordion({ items, title = 'Frequently Asked Questions' }: FAQAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // Open first item by default

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-cyan-500/50 bg-surface shadow-contrast-sm'
                  : 'border-border bg-surface/60 hover:border-border-hover'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-3 font-semibold text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-mono tracking-tight font-bold">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 font-mono text-sm leading-relaxed text-muted font-medium border-t border-border/50">
                  <div className="pt-3 prose-sm max-w-none text-muted">{item.answer}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

