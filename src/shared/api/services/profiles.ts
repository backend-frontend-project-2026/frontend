import {
  getProfiles,
  getUsersByUserIdProfile,
  postUsersByUserIdProfile,
  putUsersByUserIdProfile,
  type GetProfilesData,
  type ProfileCreate,
  type ProfileResponse,
  type ProfileUpdate,
} from '@/shared/api/generated';

type ProfilesListQuery = NonNullable<GetProfilesData['query']>;

type NullableString = string | null;

type NullableNumber = number | null;
type NullableBoolean = boolean | null;

type NullableProfileUpdateFields = {
  name?: NullableString;
  age?: NullableNumber;
  profile_picture_url?: NullableString;
  avatar_url?: NullableString;
  sleep_schedule?: NullableString;
  cleanliness?: NullableString;
  noise_level?: NullableString;
  guest_frequency?: NullableString;
  smoking_preference?: NullableString;
  alcohol_preference?: NullableString;
  room_order_preference?: NullableString;
  pet_preference?: NullableString;
  has_quiet_hours?: NullableBoolean;
  quiet_from?: NullableString;
  quiet_to?: NullableString;
  is_smoking_allowed?: NullableBoolean;
  has_pets?: NullableBoolean;
  budget_min?: NullableNumber;
  budget_max?: NullableNumber;
  move_in_date?: NullableString;
  stay_duration?: NullableString;
  housing_type?: NullableString;
  living_notes?: NullableString;
  ideal_roommate_description?: NullableString;
  rental_criteria?: NullableString;
  interests?: string[] | null;
  compatibility_note?: NullableString;
};

export type ProfileUpdatePayload = Omit<ProfileUpdate, keyof NullableProfileUpdateFields> &
  NullableProfileUpdateFields;

export type OnboardingProfilePayload = ProfileCreate & {
  profile_picture_url?: NullableString;
  avatar_url?: NullableString;
  photo_urls?: string[];
  sleep_schedule?: NullableString;
  cleanliness?: NullableString;
  noise_level?: NullableString;
  guest_frequency?: NullableString;
  smoking_preference?: NullableString;
  alcohol_preference?: NullableString;
  room_order_preference?: NullableString;
  pet_preference?: NullableString;
  has_quiet_hours?: boolean;
  quiet_from?: NullableString;
  quiet_to?: NullableString;
  is_smoking_allowed?: boolean;
  has_pets?: boolean;
  budget_min?: number | null;
  budget_max?: number | null;
  move_in_date?: NullableString;
  stay_duration?: NullableString;
  housing_type?: NullableString;
  living_notes?: NullableString;
  ideal_roommate_description?: NullableString;
  rental_criteria?: NullableString;
  interests?: string[];
  compatibility_note?: NullableString;
};

type OnboardingProfileUpdatePayload = ProfileUpdate &
  Partial<Omit<OnboardingProfilePayload, keyof ProfileCreate>>;

function createOnboardingUpdatePayload(
  payload: OnboardingProfilePayload
): OnboardingProfileUpdatePayload {
  return {
    name: payload.name,
    sex: payload.sex,
    age: payload.age,
    profile_description: payload.profile_description,
    uni_id: payload.uni_id,
    faculty_id: payload.faculty_id,
    course: payload.course,
    city: payload.city,
    neighbourhood_id: payload.neighbourhood_id,
    profile_picture_url: payload.profile_picture_url,
    avatar_url: payload.avatar_url,
    photo_urls: payload.photo_urls,
    sleep_schedule: payload.sleep_schedule,
    cleanliness: payload.cleanliness,
    noise_level: payload.noise_level,
    guest_frequency: payload.guest_frequency,
    smoking_preference: payload.smoking_preference,
    alcohol_preference: payload.alcohol_preference,
    room_order_preference: payload.room_order_preference,
    pet_preference: payload.pet_preference,
    has_quiet_hours: payload.has_quiet_hours,
    quiet_from: payload.quiet_from,
    quiet_to: payload.quiet_to,
    is_smoking_allowed: payload.is_smoking_allowed,
    has_pets: payload.has_pets,
    budget_min: payload.budget_min,
    budget_max: payload.budget_max,
    move_in_date: payload.move_in_date,
    stay_duration: payload.stay_duration,
    housing_type: payload.housing_type,
    living_notes: payload.living_notes,
    ideal_roommate_description: payload.ideal_roommate_description,
    rental_criteria: payload.rental_criteria,
    interests: payload.interests,
    compatibility_note: payload.compatibility_note,
  };
}

function getProfileData(data: ProfileResponse | undefined, errorCode: string): ProfileResponse {
  if (!data) {
    throw new Error(errorCode);
  }

  return data;
}

export const profilesApi = {
  list: (query?: ProfilesListQuery) => getProfiles(query ? { query } : {}),

  getByUserId: (userId: number) => getUsersByUserIdProfile({ path: { user_id: userId } }),

  createForUser: (userId: number, body: ProfileCreate) =>
    postUsersByUserIdProfile({
      path: { user_id: userId },
      body,
    }),

  updateForUser: (userId: number, body: ProfileUpdatePayload) =>
    putUsersByUserIdProfile({
      path: { user_id: userId },
      body: body as ProfileUpdate,
    }),

  saveOnboardingForUser: async (
    userId: number,
    body: OnboardingProfilePayload
  ): Promise<ProfileResponse> => {
    const currentProfileResult = await getUsersByUserIdProfile({ path: { user_id: userId } });

    if (currentProfileResult.data) {
      const updateResult = await putUsersByUserIdProfile({
        path: { user_id: userId },
        body: createOnboardingUpdatePayload(body),
      });

      return getProfileData(updateResult.data, 'profile_update_failed');
    }

    if (currentProfileResult.response.status !== 404) {
      throw new Error('profile_load_failed');
    }

    const createResult = await postUsersByUserIdProfile({
      path: { user_id: userId },
      body,
    });

    return getProfileData(createResult.data, 'profile_create_failed');
  },
};