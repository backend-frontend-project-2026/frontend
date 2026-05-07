import type {
  AlcoholPreference,
  CleanlinessLevel,
  Gender,
  GuestFrequency,
  HousingType,
  NoiseLevel,
  PetPreference,
  RoomOrderPreference,
  SleepSchedule,
  StayDuration,
  User,
} from '@/entities/user/model/types';
import type { ProfileResponse } from '@/shared/api/generated';
import { referencesApi } from './references';

const DEFAULT_PROFILE_USER: Omit<User, 'id'> = {
  name: 'Пользователь',
  age: 18,
  gender: 'male',
  housingType: 'rental',
  university: 'Вуз не указан',
  course: 'Курс не указан',
  faculty: 'Факультет не указан',
  location: 'Локация не указана',
  district: 'Район не указан',
  bio: 'Пользователь пока не заполнил описание.',
  interests: [],
  habits: {
    sleepSchedule: 'flexible',
    cleanliness: 'medium',
    noiseLevel: 'moderate',
    guestFrequency: 'rarely',
    petPreference: 'no_pets',
    smokingPreference: 'no',
    alcoholPreference: 'no',
    roomOrderPreference: 'balanced',
  },
  budget: {
    min: 0,
    max: 0,
    currency: '₽',
    period: 'month',
  },
  moveInDate: 'Не указано',
  stayDuration: '6-12 months',
  idealRoommateDescription: '',
  rentalCriteria: '',
  avatar: '',
  photos: [],
  isSmokingAllowed: false,
  hasPets: false,
  hasQuietHours: false,
  verified: false,
  compatibilityNote: '',
};

type ProfileReferenceNames = {
  university: string;
  faculty: string;
  district: string;
};

const getTrimmedValue = (value?: string | null) => value?.trim() || '';

const isOneOf = <T extends string>(value: unknown, allowedValues: readonly T[], fallback: T): T =>
  typeof value === 'string' && allowedValues.includes(value as T) ? (value as T) : fallback;

const getProfileAvatar = (profile: ProfileResponse) =>
  getTrimmedValue(profile.avatar_url) || getTrimmedValue(profile.profile_picture_url);

const getProfilePhotos = (profile: ProfileResponse) =>
  Array.isArray(profile.photo_urls) ? profile.photo_urls.filter(Boolean) : [];

async function resolveProfileReferenceNames(
  profile: ProfileResponse
): Promise<ProfileReferenceNames> {
  const referenceNames: ProfileReferenceNames = {
    university: '',
    faculty: '',
    district: '',
  };

  try {
    if (profile.uni_id) {
      const universitiesResult = await referencesApi.listUniversities({
        page: 1,
        page_size: 1000,
      });

      const matchedUniversity = universitiesResult.data?.items?.find(
        (item) => item.id === profile.uni_id
      );

      if (matchedUniversity?.name?.trim()) {
        referenceNames.university = matchedUniversity.name.trim();
      }
    }

    if (profile.uni_id && profile.faculty_id) {
      const facultiesResult = await referencesApi.listFaculties(profile.uni_id, {
        page: 1,
        page_size: 1000,
      });

      const matchedFaculty = facultiesResult.data?.items?.find(
        (item) => item.id === profile.faculty_id
      );

      if (matchedFaculty?.name?.trim()) {
        referenceNames.faculty = matchedFaculty.name.trim();
      }
    }

    if (profile.neighbourhood_id) {
      const neighbourhoodsResult = await referencesApi.listNeighbourhoods({
        page: 1,
        page_size: 1000,
      });

      const matchedNeighbourhood = neighbourhoodsResult.data?.items?.find(
        (item) => item.id === profile.neighbourhood_id
      );

      if (matchedNeighbourhood?.district_name?.trim()) {
        referenceNames.district = matchedNeighbourhood.district_name.trim();
      }
    }
  } catch {
    // Если справочники не загрузились, UI всё равно покажет профиль с fallback-значениями.
  }

  return referenceNames;
}

export async function mapProfileResponseToUser(
  profile: ProfileResponse,
  fallbackUserId?: string
): Promise<User> {
  const referenceNames = await resolveProfileReferenceNames(profile);
  const userId = fallbackUserId || String(profile.user_id || profile.id);

  return {
    id: userId,
    name: getTrimmedValue(profile.name) || DEFAULT_PROFILE_USER.name,
    age: profile.age ?? DEFAULT_PROFILE_USER.age,
    gender: isOneOf<Gender>(profile.sex, ['female', 'male'], DEFAULT_PROFILE_USER.gender),
    housingType: isOneOf<HousingType>(
      profile.housing_type,
      ['dormitory', 'rental'],
      DEFAULT_PROFILE_USER.housingType
    ),
    university: referenceNames.university || DEFAULT_PROFILE_USER.university,
    course: profile.course ? `${profile.course} курс` : DEFAULT_PROFILE_USER.course,
    faculty: referenceNames.faculty || DEFAULT_PROFILE_USER.faculty,
    location: getTrimmedValue(profile.city) || DEFAULT_PROFILE_USER.location,
    district: referenceNames.district || DEFAULT_PROFILE_USER.district,
    bio:
      getTrimmedValue(profile.profile_description) ||
      getTrimmedValue(profile.ideal_roommate_description) ||
      getTrimmedValue(profile.compatibility_note) ||
      DEFAULT_PROFILE_USER.bio,
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    habits: {
      sleepSchedule: isOneOf<SleepSchedule>(
        profile.sleep_schedule,
        ['early_bird', 'night_owl', 'flexible'],
        DEFAULT_PROFILE_USER.habits.sleepSchedule
      ),
      cleanliness: isOneOf<CleanlinessLevel>(
        profile.cleanliness,
        ['low', 'medium', 'high'],
        DEFAULT_PROFILE_USER.habits.cleanliness
      ),
      noiseLevel: isOneOf<NoiseLevel>(
        profile.noise_level,
        ['quiet', 'moderate', 'social'],
        DEFAULT_PROFILE_USER.habits.noiseLevel
      ),
      guestFrequency: isOneOf<GuestFrequency>(
        profile.guest_frequency,
        ['never', 'rarely', 'sometimes', 'often'],
        DEFAULT_PROFILE_USER.habits.guestFrequency
      ),
      petPreference: isOneOf<PetPreference>(
        profile.pet_preference,
        ['no_pets', 'has_pets', 'pet_friendly'],
        DEFAULT_PROFILE_USER.habits.petPreference
      ),
      smokingPreference: isOneOf(
        profile.smoking_preference,
        ['no', 'outside_only', 'yes'],
        DEFAULT_PROFILE_USER.habits.smokingPreference
      ),
      alcoholPreference: isOneOf<AlcoholPreference>(
        profile.alcohol_preference,
        ['no', 'rarely', 'socially', 'yes'],
        DEFAULT_PROFILE_USER.habits.alcoholPreference
      ),
      roomOrderPreference: isOneOf<RoomOrderPreference>(
        profile.room_order_preference,
        ['strict', 'balanced', 'flexible'],
        DEFAULT_PROFILE_USER.habits.roomOrderPreference
      ),
      quietTime:
        profile.quiet_from && profile.quiet_to
          ? {
            from: profile.quiet_from,
            to: profile.quiet_to,
          }
          : undefined,
    },
    budget: {
      min: profile.budget_min ?? 0,
      max: profile.budget_max ?? 0,
      currency: '₽',
      period: 'month',
    },
    moveInDate: getTrimmedValue(profile.move_in_date) || DEFAULT_PROFILE_USER.moveInDate,
    stayDuration: isOneOf<StayDuration>(
      profile.stay_duration,
      ['1-3 months', '3-6 months', '6-12 months', '12+ months'],
      DEFAULT_PROFILE_USER.stayDuration
    ),
    idealRoommateDescription: getTrimmedValue(profile.ideal_roommate_description),
    rentalCriteria: getTrimmedValue(profile.rental_criteria),
    avatar: getProfileAvatar(profile),
    photos: getProfilePhotos(profile),
    isSmokingAllowed: profile.is_smoking_allowed ?? false,
    hasPets: profile.has_pets ?? false,
    hasQuietHours: profile.has_quiet_hours ?? false,
    verified: false,
    compatibilityNote: getTrimmedValue(profile.compatibility_note),
  };
}

export async function mapProfileResponsesToUsers(profiles: ProfileResponse[]): Promise<User[]> {
  return Promise.all(profiles.map((profile) => mapProfileResponseToUser(profile)));
}