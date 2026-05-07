import type { User } from '../../../entities/user';

export type MobileNoiseValue = User['habits']['noiseLevel'] | '';
export type DesktopSmokingValue = User['habits']['smokingPreference'] | '';
export type DesktopNoiseValue = User['habits']['noiseLevel'] | '';
export type DesktopPetsValue = User['habits']['petPreference'] | '';

export type SleepScheduleValue = User['habits']['sleepSchedule'] | '';

export type StayDurationValue =
  | ''
  | 'any'
  | '1-3 months'
  | '3-6 months'
  | '6-12 months'
  | '12+ months';

export type AlcoholValue = User['habits']['alcoholPreference'] | '';
export type RoomOrderValue = User['habits']['roomOrderPreference'] | '';