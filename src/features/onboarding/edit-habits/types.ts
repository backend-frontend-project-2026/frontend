import type { User } from '../../../entities/user';

export type HabitsFormValue = {
  sleepSchedule: User['habits']['sleepSchedule'] | '';
  cleanliness: User['habits']['cleanliness'] | '';
  noiseLevel: User['habits']['noiseLevel'] | '';
  guestFrequency: User['habits']['guestFrequency'] | '';
  smokingPreference: User['habits']['smokingPreference'] | '';
  alcoholPreference: User['habits']['alcoholPreference'] | '';
  roomOrderPreference: User['habits']['roomOrderPreference'] | '';
  petPreference: User['habits']['petPreference'] | '';
  hasQuietHours: boolean;
  quietFrom: string;
  quietTo: string;
  quietIntervalDraft: string;
  isSmokingAllowed: boolean;
  hasPets: boolean;
};

export type HabitsErrors = Partial<Record<keyof HabitsFormValue, string>>;
