import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';
import { OnboardingContext } from './onboarding-context';
import type { OnboardingContextValue, OnboardingDraft } from './types';
import { INITIAL_ONBOARDING_DRAFT } from './constants';

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_ONBOARDING_DRAFT);
  const [completed, setCompleted] = useState(false);

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
    setCompleted(true);
  }, []);

  const skipOnboarding = useCallback(() => {
    setCompleted(true);
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      completed,
      draft,
      updateBasicInfo,
      updateHabits,
      updateLiving,
      updateInterests,
      finishOnboarding,
      skipOnboarding,
    }),
    [
      completed,
      draft,
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
