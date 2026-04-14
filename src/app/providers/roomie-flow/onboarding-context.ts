import { createContext, useContext } from 'react';
import type { OnboardingContextValue } from './types';

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboardingFlow() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboardingFlow must be used inside OnboardingProvider');
  }

  return context;
}
