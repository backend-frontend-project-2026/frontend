import type { User } from '../../../entities/user';

export type Step3ConditionOption = {
  key: string;
  label: string;
};

export type LivingPreferencesFormValue = {
  budgetMin: string;
  budgetMax: string;
  moveInDate: string;
  stayDuration: User['stayDuration'] | '';
  housingType: User['housingType'] | '';
  livingNotes: string;
  idealRoommateDescription: string;
  rentalCriteria: string;
};

export type LivingPreferencesErrors = Partial<
  Record<
    'budgetRange' | 'moveInDate' | 'stayDuration' | 'idealRoommateDescription' | 'rentalCriteria',
    string
  >
>;
