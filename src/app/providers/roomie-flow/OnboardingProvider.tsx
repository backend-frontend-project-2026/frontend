import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';
import { setOnboardingCompleted, isOnboardingCompleted } from '@/shared/api/auth/session';
import { OnboardingContext } from './onboarding-context';
import type {
  OnboardingContextValue,
  OnboardingDraft,
  OnboardingStatus,
  OnboardingStep,
} from './types';
import { loadOnboardingState, saveOnboardingState } from './lib/onboardingStorage';

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [persistedState] = useState(() => loadOnboardingState());
  const [draft, setDraft] = useState<OnboardingDraft>(persistedState.draft);
  const [status, setStatus] = useState<OnboardingStatus>(() => {
    if (persistedState.status !== 'in_progress') {
      return persistedState.status;
    }

    return isOnboardingCompleted() ? 'completed' : persistedState.status;
  });
  const [currentStep, setCurrentStepState] = useState<OnboardingStep>(persistedState.currentStep);

  useEffect(() => {
    saveOnboardingState({
      status,
      currentStep,
      draft,
    });
  }, [status, currentStep, draft]);

  const setCurrentStep = useCallback((step: OnboardingStep) => {
    setCurrentStepState(step);
  }, []);

  const replaceDraft = useCallback((value: OnboardingDraft) => {
    setDraft(value);
  }, []);

  const updateBasicInfo = useCallback((value: BasicInfoFormValue) => {
    setDraft((current) => ({ ...current, basicInfo: value }));
  }, []);

  const updateHabits = useCallback((value: HabitsFormValue) => {
    setDraft((current) => ({ ...current, habits: value }));
  }, []);

  const updateLiving = useCallback((value: LivingPreferencesFormValue) => {
    setDraft((current) => ({ ...current, living: value }));
  }, []);

  const updateInterests = useCallback((value: InterestsFormValue) => {
    setDraft((current) => ({ ...current, interests: value }));
  }, []);

  const finishOnboarding = useCallback(() => {
    setOnboardingCompleted();
    setStatus('completed');
    setCurrentStepState(4);
  }, []);

  const skipOnboarding = useCallback(() => {
    setOnboardingCompleted();
    setStatus('skipped');
  }, []);

  const completed = status !== 'in_progress';

  const value = useMemo<OnboardingContextValue>(
    () => ({
      status,
      completed,
      currentStep,
      draft,
      setCurrentStep,
      replaceDraft,
      updateBasicInfo,
      updateHabits,
      updateLiving,
      updateInterests,
      finishOnboarding,
      skipOnboarding,
    }),
    [
      status,
      completed,
      currentStep,
      draft,
      setCurrentStep,
      replaceDraft,
      updateBasicInfo,
      updateHabits,
      updateLiving,
      updateInterests,
      finishOnboarding,
      skipOnboarding,
    ]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
