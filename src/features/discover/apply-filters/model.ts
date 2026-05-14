import type { FilterParams, User } from '../../../entities/user';
import { includesNormalizedText, normalizeText } from '../../../shared/utils/texts';

function matchesTextFilter(userValue: string, filterValue?: string): boolean {
  return !filterValue || includesNormalizedText(userValue, filterValue);
}

function matchesSelectFilter<T extends string>(
  filterValue: T | 'any' | undefined,
  userValue: T
): boolean {
  return !filterValue || filterValue === 'any' || userValue === filterValue;
}

export function applyFiltersToUsers(users: User[], filters: FilterParams): User[] {
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

      if (!includesNormalizedText(searchable, filters.search)) {
        return false;
      }
    }

    if (typeof filters.ageMin === 'number' && user.age < filters.ageMin) {
      return false;
    }

    if (typeof filters.ageMax === 'number' && user.age > filters.ageMax) {
      return false;
    }

    if (!matchesTextFilter(user.faculty, filters.faculty)) {
      return false;
    }

    if (!matchesTextFilter(user.course, filters.course)) {
      return false;
    }

    if (!matchesTextFilter(user.university, filters.university)) {
      return false;
    }

    if (!matchesTextFilter(user.district, filters.district)) {
      return false;
    }

    if (!matchesTextFilter(user.location, filters.location)) {
      return false;
    }

    if (!matchesTextFilter(user.rentalCriteria, filters.rentalCriteria)) {
      return false;
    }

    if (typeof filters.budgetMin === 'number' && user.budget.max < filters.budgetMin) {
      return false;
    }

    if (typeof filters.budgetMax === 'number' && user.budget.min > filters.budgetMax) {
      return false;
    }

    if (!matchesTextFilter(user.moveInDate, filters.moveInDate)) {
      return false;
    }

    if (!matchesSelectFilter(filters.stayDuration, user.stayDuration)) {
      return false;
    }

    if (!matchesSelectFilter(filters.smokingPreference, user.habits.smokingPreference)) {
      return false;
    }

    if (!matchesSelectFilter(filters.alcoholPreference, user.habits.alcoholPreference)) {
      return false;
    }

    if (!matchesSelectFilter(filters.petPreference, user.habits.petPreference)) {
      return false;
    }

    if (!matchesSelectFilter(filters.roomOrderPreference, user.habits.roomOrderPreference)) {
      return false;
    }

    if (filters.quietOnly && !user.hasQuietHours && user.habits.noiseLevel !== 'quiet') {
      return false;
    }

    if (!matchesSelectFilter(filters.noiseLevel, user.habits.noiseLevel)) {
      return false;
    }

    if (!matchesSelectFilter(filters.sleepSchedule, user.habits.sleepSchedule)) {
      return false;
    }

    if (!matchesSelectFilter(filters.cleanliness, user.habits.cleanliness)) {
      return false;
    }

    if (!matchesSelectFilter(filters.guestFrequency, user.habits.guestFrequency)) {
      return false;
    }

    if (!matchesSelectFilter(filters.housingType, user.housingType)) {
      return false;
    }

    if (!matchesSelectFilter(filters.gender, user.gender)) {
      return false;
    }

    if (filters.interests?.length) {
      const userInterests = user.interests.map((interest) => normalizeText(interest));
      const hasMatchedInterest = filters.interests.some((interest) =>
        userInterests.includes(normalizeText(interest))
      );

      if (!hasMatchedInterest) {
        return false;
      }
    }

    return true;
  });
}
