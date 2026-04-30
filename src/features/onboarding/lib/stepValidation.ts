import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';
import { parseQuietInterval } from '@/features/onboarding/edit-habits/lib/quietInterval';
import {
  parseBudgetRange,
  parseStayDuration,
} from '@/features/onboarding/edit-living-preferences/lib/livingPreferencesHelpers';
import { isIsoDate } from '@/shared/utils/date';

export function isBasicInfoStepComplete(value?: Partial<BasicInfoFormValue>) {
  const nextValue: BasicInfoFormValue = {
    name: value?.name ?? '',
    age: value?.age ?? '',
    gender: value?.gender ?? '',
    university: value?.university ?? '',
    faculty: value?.faculty ?? '',
    course: value?.course ?? '',
    location: value?.location ?? '',
    bio: value?.bio ?? '',
    avatar: value?.avatar ?? '',
    photos: value?.photos ?? [],
  };

  const ageNumber = Number(nextValue.age);
  const hasMedia = Boolean(nextValue.avatar.trim()) || nextValue.photos.length > 0;

  return Boolean(
    nextValue.name.trim() &&
    nextValue.age.trim() &&
    !Number.isNaN(ageNumber) &&
    ageNumber >= 17 &&
    ageNumber <= 99 &&
    nextValue.gender &&
    nextValue.university.trim() &&
    nextValue.faculty.trim() &&
    nextValue.course.trim() &&
    nextValue.location.trim() &&
    nextValue.bio.trim().length >= 12 &&
    hasMedia
  );
}

export function isHabitsStepComplete(value?: Partial<HabitsFormValue>) {
  const nextValue: HabitsFormValue = {
    sleepSchedule: value?.sleepSchedule ?? '',
    cleanliness: value?.cleanliness ?? '',
    noiseLevel: value?.noiseLevel ?? '',
    guestFrequency: value?.guestFrequency ?? '',
    smokingPreference: value?.smokingPreference ?? '',
    alcoholPreference: value?.alcoholPreference ?? '',
    roomOrderPreference: value?.roomOrderPreference ?? '',
    petPreference: value?.petPreference ?? '',
    hasQuietHours: value?.hasQuietHours ?? true,
    quietFrom: value?.quietFrom ?? '',
    quietTo: value?.quietTo ?? '',
    quietIntervalDraft: value?.quietIntervalDraft ?? '',
    isSmokingAllowed: value?.isSmokingAllowed ?? false,
    hasPets: value?.hasPets ?? false,
  };

  const quietIntervalValue = `${nextValue.quietFrom} — ${nextValue.quietTo}`.trim();
  const hasValidQuietInterval =
    !nextValue.hasQuietHours || Boolean(parseQuietInterval(quietIntervalValue));

  return Boolean(
    nextValue.sleepSchedule &&
    nextValue.cleanliness &&
    nextValue.noiseLevel &&
    nextValue.guestFrequency &&
    nextValue.smokingPreference &&
    nextValue.alcoholPreference &&
    nextValue.roomOrderPreference &&
    nextValue.petPreference &&
    hasValidQuietInterval
  );
}

export function isLivingStepComplete(value?: Partial<LivingPreferencesFormValue>) {
  const nextValue: LivingPreferencesFormValue = {
    budgetMin: value?.budgetMin ?? '',
    budgetMax: value?.budgetMax ?? '',
    moveInDate: value?.moveInDate ?? '',
    stayDuration: value?.stayDuration ?? '',
    housingType: value?.housingType ?? '',
    livingNotes: value?.livingNotes ?? '',
    idealRoommateDescription: value?.idealRoommateDescription ?? '',
    rentalCriteria: value?.rentalCriteria ?? '',
  };

  const hasValidBudget = Boolean(parseBudgetRange(`${nextValue.budgetMin}-${nextValue.budgetMax}`));
  const hasValidMoveInDate = isIsoDate(nextValue.moveInDate.trim());
  const hasValidStayDuration = Boolean(parseStayDuration(nextValue.stayDuration));

  return Boolean(
    hasValidBudget &&
    hasValidMoveInDate &&
    hasValidStayDuration &&
    nextValue.idealRoommateDescription.trim() &&
    nextValue.rentalCriteria.trim()
  );
}

export function isInterestsStepComplete(value?: Partial<InterestsFormValue>) {
  const nextValue: InterestsFormValue = {
    interests: value?.interests ?? [],
    compatibilityNote: value?.compatibilityNote ?? '',
    customTagDraft: value?.customTagDraft ?? '',
  };

  return nextValue.interests.length >= 3 && Boolean(nextValue.compatibilityNote.trim());
}
