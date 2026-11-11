'use client';

import React, { useState } from 'react';
import { FloatingDock } from './FloatingDock';
import { RootWizardModal } from './RootWizardModal';
import searchData from '@/data/search-index.json';
import { SearchItem } from '@/types/device';

export function GlobalDockWrapper() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const devices = searchData as SearchItem[];

  return (
    <>
      <FloatingDock onOpenWizard={() => setIsWizardOpen(true)} />
      {isWizardOpen && (
        <RootWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          devices={devices}
        />
      )}
    </>
  );
}
