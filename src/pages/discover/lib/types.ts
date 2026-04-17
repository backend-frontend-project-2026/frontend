import type { User } from '../../../entities/user';

export type SidebarNoiseValue = 'quiet' | 'normal' | 'loud' | '';
export type SidebarSmokingValue = 'no' | 'outside' | 'yes' | '';
export type SidebarCleanlinessValue = 'high' | 'medium' | 'low' | '';
export type SidebarGuestValue = 'rarely' | 'sometimes' | 'often' | '';

export type DiscoverEmptyState = {
  title: string;
  text: string;
  buttonText: string;
};

export type GetDiscoverPageStateParams = {
  users: User[];
  totalUsersCount: number;
  matchingUsersCount: number;
  hasActiveFilters: boolean;
};
