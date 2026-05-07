import type { ProfileResponse } from '@/shared/api/generated';
import type { User, UserBudget, UserHabits, SleepSchedule, CleanlinessLevel, GuestFrequency, PetPreference, SmokingPreference, StayDuration } from '@/entities/user';

function mapBudget(profile: ProfileResponse): UserBudget {
  return {
    min: profile.budget_min ?? 0,
    max: profile.budget_max ?? 0,
    currency: '₽',
    period: 'month',
  };
}

function mapHabits(profile: ProfileResponse): UserHabits {
  return {
    sleepSchedule: (profile.sleep_schedule as unknown as SleepSchedule) ?? 'flexible',
    cleanliness: (profile.cleanliness as unknown as CleanlinessLevel) ?? 'medium',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    noiseLevel: (profile.noise_level as unknown as any) ?? 'moderate',
    guestFrequency: (profile.guest_frequency as unknown as GuestFrequency) ?? 'rarely',
    petPreference: (profile.pet_preference as unknown as PetPreference) ?? 'no_pets',
    smokingPreference: (profile.smoking_preference as unknown as SmokingPreference) ?? 'no',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alcoholPreference: (profile.alcohol_preference as unknown as any) ?? 'rarely',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roomOrderPreference: (profile.room_order_preference as unknown as any) ?? 'balanced',
    quietTime: profile.has_quiet_hours && profile.quiet_from && profile.quiet_to
      ? { from: profile.quiet_from, to: profile.quiet_to }
      : undefined,
  };
}

export function mapProfileToUser(profile: ProfileResponse): User {
  const avatar = profile.avatar_url || profile.profile_picture_url || '';
  const photos = profile.photo_urls || [];

  return {
    id: String(profile.user_id),
    name: profile.name,
    age: profile.age,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gender: (profile.sex as any) === 'male' ? 'male' : 'female',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    housingType: (profile.housing_type as any) ?? 'rental',
    university: String(profile.uni_id),
    course: String(profile.course ?? ''),
    faculty: String(profile.faculty_id ?? ''),
    location: profile.city ?? '',
    district: '',
    bio: profile.profile_description ?? '',
    interests: profile.interests ?? [],
    habits: mapHabits(profile),
    budget: mapBudget(profile),
    moveInDate: profile.move_in_date ?? '',
    stayDuration: (profile.stay_duration as unknown as StayDuration) ?? '1-3 months',
    idealRoommateDescription: profile.ideal_roommate_description ?? '',
    rentalCriteria: profile.rental_criteria ?? '',
    avatar,
    photos,
    isSmokingAllowed: profile.is_smoking_allowed ?? false,
    hasPets: profile.has_pets ?? false,
    hasQuietHours: profile.has_quiet_hours ?? false,
    verified: false,
    compatibilityNote: profile.compatibility_note,
  };
}