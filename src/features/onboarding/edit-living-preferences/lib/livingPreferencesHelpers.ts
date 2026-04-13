import type { User } from '../../../../entities/user';
import {
  includesNormalizedText,
  normalizeText,
  normalizeWhitespace,
} from '../../../../shared/utils/texts';
import type { Step3ConditionOption } from '../types';

export const MOBILE_CONDITIONS: Step3ConditionOption[] = [
  { key: 'room_smoking', label: 'Курение в комнате' },
  { key: 'frequent_guests', label: 'Гости часто' },
  { key: 'late_noise', label: 'Шум после 23:00' },
  { key: 'no_cleaning', label: 'Без уборки вообще' },
  { key: 'pets', label: 'Питомцы' },
];

export const DESKTOP_CONDITIONS: Step3ConditionOption[] = [
  { key: 'non_smoker', label: 'Не курит' },
  { key: 'quiet_evening', label: 'Только тихий режим вечером' },
  { key: 'no_weekday_guests', label: 'Без гостей по будням' },
  { key: 'cleanliness_required', label: 'Чистота обязательна' },
  { key: 'no_animals', label: 'Без животных' },
];

export function formatBudgetRange(min?: string, max?: string) {
  if (!min || !max) {
    return '';
  }

  return `${min}–${max} тыс ₽ / мес`;
}

export function parseBudgetRange(value: string) {
  const matches = value.match(/\d+/g);

  if (!matches || matches.length < 2) {
    return null;
  }

  return {
    min: matches[0],
    max: matches[1],
  };
}

export function formatStayDuration(value: User['stayDuration'] | '') {
  switch (value) {
    case '1-3 months':
      return '1–3 месяца';
    case '3-6 months':
      return '3–6 месяцев';
    case '6-12 months':
      return '6–12 месяцев';
    case '12+ months':
      return '12+ месяцев';
    default:
      return '';
  }
}

export function parseStayDuration(value: string): User['stayDuration'] | '' {
  const normalized = normalizeText(normalizeWhitespace(value));

  if (!normalized) {
    return '';
  }

  if (normalized.includes('12+')) {
    return '12+ months';
  }

  if (normalized.includes('1–3') || normalized.includes('1-3')) {
    return '1-3 months';
  }

  if (normalized.includes('3–6') || normalized.includes('3-6')) {
    return '3-6 months';
  }

  if (
    normalized.includes('6 месяцев') ||
    normalized.includes('6–12') ||
    normalized.includes('6-12')
  ) {
    return '6-12 months';
  }

  return '';
}

export function getSelectedConditionsFromNotes(value: string) {
  return [...MOBILE_CONDITIONS, ...DESKTOP_CONDITIONS]
    .filter((item) => includesNormalizedText(value, item.label))
    .map((item) => item.key);
}
