import { createContext, useContext } from 'react';
import type { FiltersContextValue } from './types';

export const FiltersContext = createContext<FiltersContextValue | null>(null);

export function useFiltersFlow() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error('useFiltersFlow must be used inside FiltersProvider');
  }

  return context;
}
