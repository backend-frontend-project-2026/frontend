// src/app/providers/roomie-flow/lib/mapProfileToUser.ts
import type { ProfileResponse } from '@/shared/api/generated';
import type {
  User,
  UserBudget,
  UserHabits,
  SleepSchedule,
  CleanlinessLevel,
  NoiseLevel,
  GuestFrequency,
  PetPreference,
  SmokingPreference,
  AlcoholPreference,
  RoomOrderPreference,
  StayDuration,
  HousingType,
  Gender,
} from '@/entities/user';

function toEnum<T extends string>(
  value: string | undefined | null,
  allowed: readonly T[],
  fallback: T
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const SLEEP_SCHEDULES: readonly SleepSchedule[] = ['early_bird', 'night_owl', 'flexible'];
const CLEANLINESS_LEVELS: readonly CleanlinessLevel[] = ['low', 'medium', 'high'];
const NOISE_LEVELS: readonly NoiseLevel[] = ['quiet', 'moderate', 'social'];
const GUEST_FREQUENCIES: readonly GuestFrequency[] = ['never', 'rarely', 'sometimes', 'often'];
const PET_PREFERENCES: readonly PetPreference[] = ['no_pets', 'has_pets', 'pet_friendly'];
const SMOKING_PREFERENCES: readonly SmokingPreference[] = ['no', 'outside_only', 'yes'];
const ALCOHOL_PREFERENCES: readonly AlcoholPreference[] = ['no', 'rarely', 'socially', 'yes'];
const ROOM_ORDER_PREFERENCES: readonly RoomOrderPreference[] = ['strict', 'balanced', 'flexible'];
const STAY_DURATIONS: readonly StayDuration[] = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
];
const HOUSING_TYPES: readonly HousingType[] = ['dormitory', 'rental'];
const GENDERS: readonly Gender[] = ['male', 'female'];

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
    sleepSchedule: toEnum(profile.sleep_schedule, SLEEP_SCHEDULES, 'flexible'),
    cleanliness: toEnum(profile.cleanliness, CLEANLINESS_LEVELS, 'medium'),
    noiseLevel: toEnum(profile.noise_level, NOISE_LEVELS, 'moderate'),
    guestFrequency: toEnum(profile.guest_frequency, GUEST_FREQUENCIES, 'rarely'),
    petPreference: toEnum(profile.pet_preference, PET_PREFERENCES, 'no_pets'),
    smokingPreference: toEnum(profile.smoking_preference, SMOKING_PREFERENCES, 'no'),
    alcoholPreference: toEnum(profile.alcohol_preference, ALCOHOL_PREFERENCES, 'rarely'),
    roomOrderPreference: toEnum(profile.room_order_preference, ROOM_ORDER_PREFERENCES, 'balanced'),
    quietTime:
      profile.has_quiet_hours && profile.quiet_from && profile.quiet_to
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
    gender: toEnum(profile.sex, GENDERS, 'male'),
    housingType: toEnum(profile.housing_type, HOUSING_TYPES, 'rental'),
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
    stayDuration: toEnum(profile.stay_duration, STAY_DURATIONS, '6-12 months'),
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