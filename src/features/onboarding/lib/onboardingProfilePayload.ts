import type { ProfileCreate, UniversityResponse, FacultyResponse } from '@/shared/api/generated';
import { referencesApi } from '@/shared/api/services/references';
import type { OnboardingProfilePayload } from '@/shared/api/services/profiles';
import type { BasicInfoFormValue } from '../edit-basic-info';
import type { HabitsFormValue } from '../edit-habits';
import type { InterestsFormValue } from '../edit-interests';
import type { LivingPreferencesFormValue } from '../edit-living-preferences';

export type OnboardingProfileDraft = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
};

function normalizeText(value?: string): string {
  return value?.trim() ?? '';
}

function emptyToUndefined(value?: string): string | undefined {
  const normalizedValue = normalizeText(value);

  return normalizedValue || undefined;
}

function normalizeLookupValue(value?: string): string {
  return normalizeText(value).toLowerCase();
}

function parseRequiredInteger(value: string, errorCode: string): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue)) {
    throw new Error(errorCode);
  }

  return parsedValue;
}

function parseOptionalInteger(value: string): number | undefined {
  const firstNumberMatch = normalizeText(value).match(/\d+/);

  if (!firstNumberMatch) {
    return undefined;
  }

  const parsedValue = Number(firstNumberMatch[0]);

  return Number.isInteger(parsedValue) ? parsedValue : undefined;
}

function parseNullableInteger(value: string): number | undefined {
  return parseOptionalInteger(value);
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function createMoveInDate(value: string): string | undefined {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return undefined;
  }

  return isIsoDate(normalizedValue) ? normalizedValue : undefined;
}

async function resolveUniversityId(universityName: string): Promise<number> {
  const normalizedUniversityName = normalizeLookupValue(universityName);

  const universitiesResult = await referencesApi.listUniversities({
    page: 1,
    page_size: 1000,
  });

  const matchedUniversity = universitiesResult.data?.items?.find(
    (item: UniversityResponse) => normalizeLookupValue(item.name) === normalizedUniversityName
  );

  if (!matchedUniversity?.id) {
    throw new Error('university_not_found');
  }

  return matchedUniversity.id;
}

async function resolveFacultyId(universityId: number, facultyName: string): Promise<number> {
  const normalizedFacultyName = normalizeLookupValue(facultyName);

  const facultiesResult = await referencesApi.listFaculties(universityId, {
    page: 1,
    page_size: 1000,
  });

  const matchedFaculty = facultiesResult.data?.items?.find(
    (item: FacultyResponse) => normalizeLookupValue(item.name) === normalizedFacultyName
  );

  if (!matchedFaculty?.id) {
    throw new Error('faculty_not_found');
  }

  return matchedFaculty.id;
}

export async function createOnboardingProfilePayload(
  draft: OnboardingProfileDraft
): Promise<OnboardingProfilePayload> {
  const universityId = await resolveUniversityId(draft.basicInfo.university);
  const facultyId = await resolveFacultyId(universityId, draft.basicInfo.faculty);
  const avatarUrl = emptyToUndefined(draft.basicInfo.avatar);
  const photoUrls = draft.basicInfo.photos.map(normalizeText).filter(Boolean);

  return {
    name: normalizeText(draft.basicInfo.name),
    sex: draft.basicInfo.gender as ProfileCreate['sex'],
    age: parseRequiredInteger(draft.basicInfo.age, 'age_invalid'),
    profile_description: normalizeText(draft.basicInfo.bio),
    uni_id: universityId,
    faculty_id: facultyId,
    course: parseOptionalInteger(draft.basicInfo.course),
    city: normalizeText(draft.basicInfo.location),
    profile_picture_url: avatarUrl,
    avatar_url: avatarUrl,
    photo_urls: photoUrls,
    sleep_schedule: emptyToUndefined(draft.habits.sleepSchedule),
    cleanliness: emptyToUndefined(draft.habits.cleanliness),
    noise_level: emptyToUndefined(draft.habits.noiseLevel),
    guest_frequency: emptyToUndefined(draft.habits.guestFrequency),
    smoking_preference: emptyToUndefined(draft.habits.smokingPreference),
    alcohol_preference: emptyToUndefined(draft.habits.alcoholPreference),
    room_order_preference: emptyToUndefined(draft.habits.roomOrderPreference),
    pet_preference: emptyToUndefined(draft.habits.petPreference),
    has_quiet_hours: draft.habits.hasQuietHours,
    quiet_from: draft.habits.hasQuietHours ? emptyToUndefined(draft.habits.quietFrom) : undefined,
    quiet_to: draft.habits.hasQuietHours ? emptyToUndefined(draft.habits.quietTo) : undefined,
    is_smoking_allowed: draft.habits.isSmokingAllowed,
    has_pets: draft.habits.hasPets,
    budget_min: parseNullableInteger(draft.living.budgetMin),
    budget_max: parseNullableInteger(draft.living.budgetMax),
    move_in_date: createMoveInDate(draft.living.moveInDate),
    stay_duration: emptyToUndefined(draft.living.stayDuration),
    housing_type: emptyToUndefined(draft.living.housingType),
    living_notes: emptyToUndefined(draft.living.livingNotes),
    ideal_roommate_description: emptyToUndefined(draft.living.idealRoommateDescription),
    rental_criteria: emptyToUndefined(draft.living.rentalCriteria),
    interests: draft.interests.interests.map(normalizeText).filter(Boolean),
    compatibility_note: emptyToUndefined(draft.interests.compatibilityNote),
  };
}