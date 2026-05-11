import type { OnboardingForm } from '../../../entities/user';

export type Step3ConditionOption = {
  key: string;
  label: string;
};

export type LivingPreferencesFormValue = OnboardingForm['living'];

export type LivingPreferencesErrors = Partial<
  Record<
    | 'budgetRange'
    | 'housingType'
    | 'moveInDate'
    | 'stayDuration'
    | 'idealRoommateDescription'
    | 'rentalCriteria',
    string
  >
>;
