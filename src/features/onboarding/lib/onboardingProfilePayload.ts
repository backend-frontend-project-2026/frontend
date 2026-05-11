import type { ProfileCreate, UniversityResponse, FacultyResponse } from '@/shared/api/generated';
import type { OnboardingProfilePayload } from '@/shared/api/services/profiles';
import { referencesApi } from '@/shared/api/services/references';
import { isIsoDate } from '@/shared/utils/date';
import type { OnboardingForm } from '@/entities/user';

export type OnboardingProfileDraft = OnboardingForm;

type OnboardingReferenceIds = {
  universityId: number;
  facultyId: number;
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

function createMoveInDate(value: string): string | undefined {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return undefined;
  }

  return isIsoDate(normalizedValue) ? normalizedValue : undefined;
}

async function resolveUniversityId(universityName: string): Promise<number> {
  const normalizedUniversityName = normalizeLookupValue(universityName);
  const universitySearchName = normalizeText(universityName);

  const universitiesResult = await referencesApi.listUniversities({
    page: 1,
    page_size: 10,
    name: universitySearchName,
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
  const facultySearchName = normalizeText(facultyName);

  // TODO: подумать над полноценной пагинацией, чтобы при необходимости получать запись со следующих страниц.
  const facultiesResult = await referencesApi.listFaculties(universityId, {
    page: 1,
    page_size: 10,
    name: facultySearchName,
  });

  const matchedFaculty = facultiesResult.data?.items?.find(
    (item: FacultyResponse) => normalizeLookupValue(item.name) === normalizedFacultyName
  );

  if (!matchedFaculty?.id) {
    throw new Error('faculty_not_found');
  }

  return matchedFaculty.id;
}

function mapBasicInfoToPayload(
  basicInfo: OnboardingForm['basicInfo'],
  referenceIds: OnboardingReferenceIds
) {
  const avatarUrl = emptyToUndefined(basicInfo.avatar);
  const photoUrls = basicInfo.photos.map(normalizeText).filter(Boolean);

  return {
    name: normalizeText(basicInfo.name),
    sex: basicInfo.gender as ProfileCreate['sex'],
    age: parseRequiredInteger(basicInfo.age, 'age_invalid'),
    profile_description: normalizeText(basicInfo.bio),
    uni_id: referenceIds.universityId,
    faculty_id: referenceIds.facultyId,
    course: parseOptionalInteger(basicInfo.course),
    city: normalizeText(basicInfo.location),
    profile_picture_url: avatarUrl,
    avatar_url: avatarUrl,
    photo_urls: photoUrls,
  };
}

function mapHabitsToPayload(habits: OnboardingForm['habits']) {
  return {
    sleep_schedule: emptyToUndefined(habits.sleepSchedule),
    cleanliness: emptyToUndefined(habits.cleanliness),
    noise_level: emptyToUndefined(habits.noiseLevel),
    guest_frequency: emptyToUndefined(habits.guestFrequency),
    smoking_preference: emptyToUndefined(habits.smokingPreference),
    alcohol_preference: emptyToUndefined(habits.alcoholPreference),
    room_order_preference: emptyToUndefined(habits.roomOrderPreference),
    pet_preference: emptyToUndefined(habits.petPreference),
    has_quiet_hours: habits.hasQuietHours,
    quiet_from: habits.hasQuietHours ? emptyToUndefined(habits.quietFrom) : undefined,
    quiet_to: habits.hasQuietHours ? emptyToUndefined(habits.quietTo) : undefined,
    is_smoking_allowed: habits.isSmokingAllowed,
    has_pets: habits.hasPets,
  };
}

function mapLivingToPayload(living: OnboardingForm['living']) {
  return {
    budget_min: parseNullableInteger(living.budgetMin),
    budget_max: parseNullableInteger(living.budgetMax),
    move_in_date: createMoveInDate(living.moveInDate),
    stay_duration: emptyToUndefined(living.stayDuration),
    housing_type: emptyToUndefined(living.housingType),
    living_notes: emptyToUndefined(living.livingNotes),
    ideal_roommate_description: emptyToUndefined(living.idealRoommateDescription),
    rental_criteria: emptyToUndefined(living.rentalCriteria),
  };
}

function mapInterestsToPayload(interests: OnboardingForm['interests']) {
  return {
    interests: interests.interests.map(normalizeText).filter(Boolean),
    compatibility_note: emptyToUndefined(interests.compatibilityNote),
  };
}

function mapDraftToPayload(
  draft: OnboardingProfileDraft,
  referenceIds: OnboardingReferenceIds
): OnboardingProfilePayload {
  return {
    ...mapBasicInfoToPayload(draft.basicInfo, referenceIds),
    ...mapHabitsToPayload(draft.habits),
    ...mapLivingToPayload(draft.living),
    ...mapInterestsToPayload(draft.interests),
  };
}

export async function createOnboardingProfilePayload(
  draft: OnboardingProfileDraft
): Promise<OnboardingProfilePayload> {
  const universityId = await resolveUniversityId(draft.basicInfo.university);
  const facultyId = await resolveFacultyId(universityId, draft.basicInfo.faculty);

  return mapDraftToPayload(draft, { universityId, facultyId });
}
