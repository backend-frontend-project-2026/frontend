import type { OnboardingForm } from '../../../entities/user';

export type InterestsFormValue = OnboardingForm['interests'];

export type InterestsErrors = {
  interests?: string;
  compatibilityNote?: string;
};