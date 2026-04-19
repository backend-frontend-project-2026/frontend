import type { UserFilters } from '../../../entities/user';
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

export function getInitialMobileNoise(filters?: UserFilters): MobileNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

export function getInitialDesktopSmoking(filters?: UserFilters): DesktopSmokingValue {
  if (filters?.smokingPreference === 'no') return 'no';
  if (filters?.smokingPreference === 'outside_only') return 'outside';
  if (filters?.smokingPreference === 'yes') return 'yes';
  return '';
}

export function getInitialDesktopNoise(filters?: UserFilters): DesktopNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

export function getInitialDesktopPets(filters?: UserFilters): DesktopPetsValue {
  if (filters?.petPreference === 'pet_friendly') return 'ok';
  if (filters?.petPreference === 'no_pets') return 'not-ok';
  return '';
}

export function getInitialSleepSchedule(filters?: UserFilters): SleepScheduleValue {
  if (filters?.sleepSchedule === 'early_bird') return 'early_bird';
  if (filters?.sleepSchedule === 'night_owl') return 'night_owl';
  if (filters?.sleepSchedule === 'flexible') return 'flexible';
  return '';
}

export function getInitialHousingType(filters?: UserFilters): UserFilters['housingType'] | 'any' {
  return filters?.housingType ?? 'any';
}

export function getInitialGender(filters?: UserFilters): UserFilters['gender'] | 'any' {
  return filters?.gender ?? 'any';
}

export function getInitialAlcohol(filters?: UserFilters): AlcoholValue {
  if (filters?.alcoholPreference === 'no') return 'no';
  if (filters?.alcoholPreference === 'rarely') return 'rarely';
  if (filters?.alcoholPreference === 'socially') return 'socially';
  if (filters?.alcoholPreference === 'yes') return 'yes';
  return '';
}

export function getInitialRoomOrder(filters?: UserFilters): RoomOrderValue {
  if (filters?.roomOrderPreference === 'strict') return 'strict';
  if (filters?.roomOrderPreference === 'balanced') return 'balanced';
  if (filters?.roomOrderPreference === 'flexible') return 'flexible';
  return '';
}
