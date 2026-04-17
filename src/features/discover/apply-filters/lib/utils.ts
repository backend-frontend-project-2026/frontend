import type { UserFilters } from '../../../../entities/user';

export function createEmptyDiscoverFilters(): UserFilters {
  return {};
}

export function hasActiveFilters(filters: UserFilters): boolean {
  return Object.entries(filters).some(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== '' && value !== false && value !== 'any';
  });
}
