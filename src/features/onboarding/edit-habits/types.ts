import type { OnboardingForm } from '../../../entities/user';

export type HabitsFormValue = OnboardingForm['habits'];

export type HabitsErrors = Partial<Record<keyof HabitsFormValue, string>>;