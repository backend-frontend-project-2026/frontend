import type { User, UserFilters } from '../../../entities/user';

function normalize(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function includesText(source: string, search: string): boolean {
  return normalize(source).includes(normalize(search));
}

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

export function applyFiltersToUsers(users: User[], filters: UserFilters): User[] {
  return users.filter((user) => {
    if (filters.search) {
      const searchable = [
        user.name,
        user.university,
        user.faculty,
        user.course,
        user.location,
        user.district,
        user.bio,
        user.rentalCriteria,
        ...user.interests,
      ].join(' ');

      if (!includesText(searchable, filters.search)) {
        return false;
      }
    }

    if (typeof filters.ageMin === 'number' && user.age < filters.ageMin) {
      return false;
    }

    if (typeof filters.ageMax === 'number' && user.age > filters.ageMax) {
      return false;
    }

    if (filters.faculty && !includesText(user.faculty, filters.faculty)) {
      return false;
    }

    if (filters.course && !includesText(user.course, filters.course)) {
      return false;
    }

    if (filters.university && !includesText(user.university, filters.university)) {
      return false;
    }

    if (filters.district && !includesText(user.district, filters.district)) {
      return false;
    }

    if (filters.location && !includesText(user.location, filters.location)) {
      return false;
    }

    if (filters.rentalCriteria && !includesText(user.rentalCriteria, filters.rentalCriteria)) {
      return false;
    }

    if (typeof filters.budgetMin === 'number' && user.budget.max < filters.budgetMin) {
      return false;
    }

    if (typeof filters.budgetMax === 'number' && user.budget.min > filters.budgetMax) {
      return false;
    }

    if (filters.moveInDate && !includesText(user.moveInDate, filters.moveInDate)) {
      return false;
    }

    if (
      filters.stayDuration &&
      filters.stayDuration !== 'any' &&
      user.stayDuration !== filters.stayDuration
    ) {
      return false;
    }

    if (
      filters.smokingPreference &&
      filters.smokingPreference !== 'any' &&
      user.habits.smokingPreference !== filters.smokingPreference
    ) {
      return false;
    }

    if (
      filters.alcoholPreference &&
      filters.alcoholPreference !== 'any' &&
      user.habits.alcoholPreference !== filters.alcoholPreference
    ) {
      return false;
    }

    if (
      filters.petPreference &&
      filters.petPreference !== 'any' &&
      user.habits.petPreference !== filters.petPreference
    ) {
      return false;
    }

    if (
      filters.roomOrderPreference &&
      filters.roomOrderPreference !== 'any' &&
      user.habits.roomOrderPreference !== filters.roomOrderPreference
    ) {
      return false;
    }

    if (filters.quietOnly && !user.hasQuietHours && user.habits.noiseLevel !== 'quiet') {
      return false;
    }

    if (
      filters.noiseLevel &&
      filters.noiseLevel !== 'any' &&
      user.habits.noiseLevel !== filters.noiseLevel
    ) {
      return false;
    }

    if (
      filters.sleepSchedule &&
      filters.sleepSchedule !== 'any' &&
      user.habits.sleepSchedule !== filters.sleepSchedule
    ) {
      return false;
    }

    if (
      filters.cleanliness &&
      filters.cleanliness !== 'any' &&
      user.habits.cleanliness !== filters.cleanliness
    ) {
      return false;
    }

    if (
      filters.guestFrequency &&
      filters.guestFrequency !== 'any' &&
      user.habits.guestFrequency !== filters.guestFrequency
    ) {
      return false;
    }

    if (
      filters.housingType &&
      filters.housingType !== 'any' &&
      user.housingType !== filters.housingType
    ) {
      return false;
    }

    if (filters.gender && filters.gender !== 'any' && user.gender !== filters.gender) {
      return false;
    }

    if (filters.interests?.length) {
      const userInterests = user.interests.map((interest) => normalize(interest));
      const hasMatchedInterest = filters.interests.some((interest) =>
        userInterests.includes(normalize(interest))
      );

      if (!hasMatchedInterest) {
        return false;
      }
    }

    return true;
  });
}
