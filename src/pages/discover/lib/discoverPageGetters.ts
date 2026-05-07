import type { FilterParams, User } from '../../../entities/user';
import type {
  SidebarCleanlinessValue,
  SidebarGuestValue,
  SidebarNoiseValue,
  SidebarSmokingValue,
} from './types';

export function getSidebarChips(user: User | null): string[] {
  if (!user) {
    return ['Тишина', 'Не курю', 'Аккуратно', 'Гости редко'];
  }

  const chips: string[] = [];

  chips.push(user.habits.noiseLevel === 'quiet' ? 'Тишина' : 'Норм шум');
  chips.push(user.habits.smokingPreference === 'no' ? 'Не курю' : 'Курение ок');
  chips.push(user.habits.cleanliness === 'high' ? 'Аккуратно' : 'Средне');

  chips.push(
    user.habits.guestFrequency === 'rarely' || user.habits.guestFrequency === 'never'
      ? 'Гости редко'
      : 'Гости иногда'
  );

  return chips;
}

export function formatSidebarBudget(filters?: FilterParams) {
  const min = filters?.budgetMin;
  const max = filters?.budgetMax;

  if (typeof min === 'number' && typeof max === 'number') {
    return `${min}–${max} тыс ₽`;
  }

  if (typeof min === 'number') {
    return `от ${min} тыс ₽`;
  }

  if (typeof max === 'number') {
    return `до ${max} тыс ₽`;
  }

  return '20–35 тыс ₽';
}

export function formatSidebarMoveInDate(filters?: FilterParams) {
  if (filters?.moveInDate && filters.moveInDate.trim()) {
    return filters.moveInDate;
  }

  return 'любая';
}

export function getInitialSidebarNoise(filters?: FilterParams): SidebarNoiseValue {
  if (filters?.noiseLevel && filters.noiseLevel !== 'any') {
    return filters.noiseLevel;
  }

  if (filters?.quietOnly) {
    return 'quiet';
  }

  return '';
}

export function getInitialSidebarSmoking(filters?: FilterParams): SidebarSmokingValue {
  if (filters?.smokingPreference && filters.smokingPreference !== 'any') {
    return filters.smokingPreference;
  }

  return '';
}

export function getNoiseLabel(value: SidebarNoiseValue) {
  if (value === 'quiet') return 'Тишина';
  if (value === 'moderate') return 'Норм шум';
  if (value === 'social') return 'Шумно';
  return 'Шум';
}

export function getSmokingLabel(value: SidebarSmokingValue) {
  if (value === 'no') return 'Не курю';
  if (value === 'outside_only') return 'Только на улице';
  if (value === 'yes') return 'Курение ок';
  return 'Курение';
}

export function getNextNoiseValue(value: SidebarNoiseValue): SidebarNoiseValue {
  if (value === '') return 'quiet';
  if (value === 'quiet') return 'moderate';
  if (value === 'moderate') return 'social';
  return '';
}

export function getNextSmokingValue(value: SidebarSmokingValue): SidebarSmokingValue {
  if (value === '') return 'no';
  if (value === 'no') return 'outside_only';
  if (value === 'outside_only') return 'yes';
  return '';
}

export function parseBudgetInput(value: string) {
  const values = value.match(/\d+/g) ?? [];
  const min = values[0] ? Number(values[0]) : undefined;
  const max = values[1] ? Number(values[1]) : undefined;

  return {
    min: Number.isNaN(min) ? undefined : min,
    max: Number.isNaN(max) ? undefined : max,
  };
}

export function getInitialSidebarCleanliness(filters?: FilterParams): SidebarCleanlinessValue {
  if (filters?.cleanliness && filters.cleanliness !== 'any') {
    return filters.cleanliness;
  }

  return '';
}

export function getInitialSidebarGuestFrequency(filters?: FilterParams): SidebarGuestValue {
  if (filters?.guestFrequency && filters.guestFrequency !== 'any') {
    return filters.guestFrequency;
  }

  return '';
}

export function getCleanlinessLabel(value: SidebarCleanlinessValue) {
  if (value === 'high') return 'Аккуратно';
  if (value === 'medium') return 'Средне';
  if (value === 'low') return 'Не важно';
  return 'Чистота';
}

export function getGuestLabel(value: SidebarGuestValue) {
  if (value === 'never') return 'Без гостей';
  if (value === 'rarely') return 'Гости редко';
  if (value === 'sometimes') return 'Гости иногда';
  if (value === 'often') return 'Гости часто';
  return 'Гости';
}

export function getNextCleanlinessValue(value: SidebarCleanlinessValue): SidebarCleanlinessValue {
  if (value === '') return 'high';
  if (value === 'high') return 'medium';
  if (value === 'medium') return 'low';
  return '';
}

export function getNextGuestValue(value: SidebarGuestValue): SidebarGuestValue {
  if (value === '') return 'never';
  if (value === 'never') return 'rarely';
  if (value === 'rarely') return 'sometimes';
  if (value === 'sometimes') return 'often';
  return '';
}