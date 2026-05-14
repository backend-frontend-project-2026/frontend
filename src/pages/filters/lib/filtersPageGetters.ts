import type { FilterParams } from '../../../entities/user';
import { normalizeText } from '../../../shared/utils/texts';
import type {
  AlcoholValue,
  DesktopNoiseValue,
  DesktopPetsValue,
  DesktopSmokingValue,
  MobileNoiseValue,
  RoomOrderValue,
  SleepScheduleValue,
  StayDurationValue,
} from './types';

export const STAY_DURATION_PROMPT_TEXT = [
  'Выбери срок аренды:',
  '1 — 1–3 месяца',
  '2 — 3–6 месяцев',
  '3 — 6–12 месяцев',
  '4 — 12+ месяцев',
].join('\n');

export function normalizeBudgetValue(value: string, fallback: string) {
  const digitsOnly = value.replace(/[^\d]/g, '');

  if (!digitsOnly) {
    return fallback;
  }

  return String(Math.max(0, Number(digitsOnly)));
}

export function parseStayDurationValue(value: string): StayDurationValue | null {
  const normalized = normalizeText(value);

  if (
    normalized === '1' ||
    normalized === '1-3 months' ||
    normalized === '1–3 месяца' ||
    normalized === '1-3 месяца'
  ) {
    return '1-3 months';
  }

  if (
    normalized === '2' ||
    normalized === '3-6 months' ||
    normalized === '3–6 месяцев' ||
    normalized === '3-6 месяцев'
  ) {
    return '3-6 months';
  }

  if (
    normalized === '3' ||
    normalized === '6-12 months' ||
    normalized === '6–12 месяцев' ||
    normalized === '6-12 месяцев' ||
    normalized === '6 месяцев'
  ) {
    return '6-12 months';
  }

  if (normalized === '4' || normalized === '12+ months' || normalized === '12+ месяцев') {
    return '12+ months';
  }

  return null;
}

export function formatStayDuration(value: StayDurationValue) {
  if (value === '1-3 months') return '1–3 месяца';
  if (value === '3-6 months') return '3–6 месяцев';
  if (value === '6-12 months') return '6–12 месяцев';
  if (value === '12+ months') return '12+ месяцев';
  return '';
}

export function getInitialMobileNoise(filters?: FilterParams): MobileNoiseValue {
  if (filters?.noiseLevel && filters.noiseLevel !== 'any') {
    return filters.noiseLevel;
  }

  if (filters?.quietOnly) {
    return 'quiet';
  }

  return '';
}

export function getInitialDesktopSmoking(filters?: FilterParams): DesktopSmokingValue {
  if (filters?.smokingPreference && filters.smokingPreference !== 'any') {
    return filters.smokingPreference;
  }

  return '';
}

export function getInitialDesktopNoise(filters?: FilterParams): DesktopNoiseValue {
  if (filters?.noiseLevel && filters.noiseLevel !== 'any') {
    return filters.noiseLevel;
  }

  if (filters?.quietOnly) {
    return 'quiet';
  }

  return '';
}

export function getInitialDesktopPets(filters?: FilterParams): DesktopPetsValue {
  if (filters?.petPreference && filters.petPreference !== 'any') {
    return filters.petPreference;
  }

  return '';
}

export function getInitialSleepSchedule(filters?: FilterParams): SleepScheduleValue {
  if (filters?.sleepSchedule && filters.sleepSchedule !== 'any') {
    return filters.sleepSchedule;
  }

  return '';
}

export function getInitialHousingType(filters?: FilterParams): FilterParams['housingType'] | 'any' {
  return filters?.housingType ?? 'any';
}

export function getInitialGender(filters?: FilterParams): FilterParams['gender'] | 'any' {
  return filters?.gender ?? 'any';
}

export function getInitialAlcohol(filters?: FilterParams): AlcoholValue {
  if (filters?.alcoholPreference && filters.alcoholPreference !== 'any') {
    return filters.alcoholPreference;
  }

  return '';
}

export function getInitialRoomOrder(filters?: FilterParams): RoomOrderValue {
  if (filters?.roomOrderPreference && filters.roomOrderPreference !== 'any') {
    return filters.roomOrderPreference;
  }

  return '';
}
