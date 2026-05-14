import type { OnboardingForm } from '../../../entities/user';

export type BasicInfoFormValue = OnboardingForm['basicInfo'];

export type BasicInfoErrors = Partial<Record<keyof BasicInfoFormValue, string>>;