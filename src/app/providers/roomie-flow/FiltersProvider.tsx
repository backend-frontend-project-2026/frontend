import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import type { UserFilters } from '@/entities/user';
import { createEmptyDiscoverFilters, hasActiveFilters } from '@/features/discover';
import { FiltersContext } from './filters-context';
import type { FiltersContextValue } from './types';

export function FiltersProvider({ children }: PropsWithChildren) {
  const [activeFilters, setActiveFilters] = useState<UserFilters>(createEmptyDiscoverFilters());

  const filtersAreActive = useMemo(() => hasActiveFilters(activeFilters), [activeFilters]);

  const applyCurrentFilters = useCallback((nextFilters?: UserFilters) => {
    if (nextFilters) {
      setActiveFilters(nextFilters);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters(createEmptyDiscoverFilters());
  }, []);

  const value = useMemo<FiltersContextValue>(
    () => ({
      activeFilters,
      filtersAreActive,
      applyCurrentFilters,
      resetFilters,
    }),
    [activeFilters, filtersAreActive, applyCurrentFilters, resetFilters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}
