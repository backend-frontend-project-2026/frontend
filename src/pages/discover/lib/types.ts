import type { User } from '../../../entities/user';

export type SidebarNoiseValue = User['habits']['noiseLevel'] | '';
export type SidebarSmokingValue = User['habits']['smokingPreference'] | '';
export type SidebarCleanlinessValue = User['habits']['cleanliness'] | '';
export type SidebarGuestValue = User['habits']['guestFrequency'] | '';

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