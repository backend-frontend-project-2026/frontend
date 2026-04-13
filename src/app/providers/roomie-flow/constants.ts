import type { OnboardingDraft, PersistedOnboardingState } from './types';

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
    basicInfo: {
        name: '',
        age: '',
        gender: '',
        university: '',
        faculty: '',
        course: '',
        location: '',
        bio: '',
        avatar: '',
        photos: [],
    },
    habits: {
        sleepSchedule: '',
        cleanliness: '',
        noiseLevel: '',
        guestFrequency: '',
        smokingPreference: '',
        alcoholPreference: '',
        roomOrderPreference: '',
        petPreference: '',
        hasQuietHours: true,
        quietFrom: '',
        quietTo: '',
        quietIntervalDraft: '',
        isSmokingAllowed: false,
        hasPets: false,
    },
    living: {
        budgetMin: '',
        budgetMax: '',
        moveInDate: '',
        stayDuration: '',
        housingType: '',
        livingNotes: '',
        idealRoommateDescription: '',
        rentalCriteria: '',
    },
    interests: {
        interests: [],
        compatibilityNote: '',
        customTagDraft: '',
    },
};

export const ONBOARDING_STORAGE_KEY = 'roomie-flow:onboarding';

export const INITIAL_ONBOARDING_STATUS: PersistedOnboardingState['status'] = 'in_progress';

export const INITIAL_ONBOARDING_STEP: PersistedOnboardingState['currentStep'] = 1;

export const INITIAL_PERSISTED_ONBOARDING_STATE: PersistedOnboardingState = {
    status: INITIAL_ONBOARDING_STATUS,
    currentStep: INITIAL_ONBOARDING_STEP,
    draft: INITIAL_ONBOARDING_DRAFT,
};