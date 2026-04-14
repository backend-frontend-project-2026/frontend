import {
  INITIAL_ONBOARDING_DRAFT,
  INITIAL_PERSISTED_ONBOARDING_STATE,
  INITIAL_ONBOARDING_STATUS,
  INITIAL_ONBOARDING_STEP,
  ONBOARDING_STORAGE_KEY,
} from '../constants';
import type {
  OnboardingDraft,
  OnboardingStatus,
  OnboardingStep,
  PersistedOnboardingState,
} from '../types';

const ONBOARDING_STEPS: OnboardingStep[] = [1, 2, 3, 4];
const ONBOARDING_STATUSES: OnboardingStatus[] = ['in_progress', 'skipped', 'completed'];

function mergeDraft(draft?: Partial<OnboardingDraft>): OnboardingDraft {
  return {
    basicInfo: {
      ...INITIAL_ONBOARDING_DRAFT.basicInfo,
      ...draft?.basicInfo,
      photos: Array.isArray(draft?.basicInfo?.photos) ? draft.basicInfo.photos : [],
    },
    habits: {
      ...INITIAL_ONBOARDING_DRAFT.habits,
      ...draft?.habits,
    },
    living: {
      ...INITIAL_ONBOARDING_DRAFT.living,
      ...draft?.living,
    },
    interests: {
      ...INITIAL_ONBOARDING_DRAFT.interests,
      ...draft?.interests,
      interests: Array.isArray(draft?.interests?.interests) ? draft.interests.interests : [],
    },
  };
}

function normalizeStep(step: unknown): OnboardingStep {
  return ONBOARDING_STEPS.includes(step as OnboardingStep)
    ? (step as OnboardingStep)
    : INITIAL_ONBOARDING_STEP;
}

function normalizeStatus(status: unknown): OnboardingStatus {
  return ONBOARDING_STATUSES.includes(status as OnboardingStatus)
    ? (status as OnboardingStatus)
    : INITIAL_ONBOARDING_STATUS;
}

export function loadOnboardingState(): PersistedOnboardingState {
  if (typeof window === 'undefined') {
    return INITIAL_PERSISTED_ONBOARDING_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

    if (!rawState) {
      return INITIAL_PERSISTED_ONBOARDING_STATE;
    }

    const parsedState = JSON.parse(rawState) as Partial<PersistedOnboardingState>;

    return {
      status: normalizeStatus(parsedState.status),
      currentStep: normalizeStep(parsedState.currentStep),
      draft: mergeDraft(parsedState.draft),
    };
  } catch {
    return INITIAL_PERSISTED_ONBOARDING_STATE;
  }
}

export function saveOnboardingState(state: PersistedOnboardingState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
