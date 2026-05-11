import type { FilterParams } from '../../../../entities/user';

export function createEmptyDiscoverFilters(): FilterParams {
  return {};
}

export function hasActiveFilters(filters: FilterParams): boolean {
  return Object.entries(filters).some(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== '' && value !== false && value !== 'any';
  });
}
