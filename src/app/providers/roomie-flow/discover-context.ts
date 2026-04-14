import { createContext, useContext } from 'react';
import type { DiscoverContextValue } from './types';

export const DiscoverContext = createContext<DiscoverContextValue | null>(null);

export function useDiscoverFlow() {
  const context = useContext(DiscoverContext);

  if (!context) {
    throw new Error('useDiscoverFlow must be used inside DiscoverProvider');
  }

  return context;
}
