import type { User, UserFilters } from '../../../entities/user';
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

export function formatSidebarBudget(filters?: UserFilters) {
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

export function formatSidebarMoveInDate(filters?: UserFilters) {
  if (filters?.moveInDate && filters.moveInDate.trim()) {
    return filters.moveInDate;
  }

  return 'любая';
}

export function getInitialSidebarNoise(filters?: UserFilters): SidebarNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

export function getInitialSidebarSmoking(filters?: UserFilters): SidebarSmokingValue {
  if (filters?.smokingPreference === 'no') return 'no';
  if (filters?.smokingPreference === 'outside_only') return 'outside';
  if (filters?.smokingPreference === 'yes') return 'yes';
  return '';
}

export function getNoiseLabel(value: SidebarNoiseValue) {
  if (value === 'quiet') return 'Тишина';
  if (value === 'normal') return 'Норм шум';
  if (value === 'loud') return 'Шумно';
  return 'Шум';
}

export function getSmokingLabel(value: SidebarSmokingValue) {
  if (value === 'no') return 'Не курю';
  if (value === 'outside') return 'Только на улице';
  if (value === 'yes') return 'Курение ок';
  return 'Курение';
}

export function getNextNoiseValue(value: SidebarNoiseValue): SidebarNoiseValue {
  if (value === '') return 'quiet';
  if (value === 'quiet') return 'normal';
  if (value === 'normal') return 'loud';
  return '';
}

export function getNextSmokingValue(value: SidebarSmokingValue): SidebarSmokingValue {
  if (value === '') return 'no';
  if (value === 'no') return 'outside';
  if (value === 'outside') return 'yes';
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

export function getInitialSidebarCleanliness(filters?: UserFilters): SidebarCleanlinessValue {
  if (filters?.cleanliness === 'high') return 'high';
  if (filters?.cleanliness === 'medium') return 'medium';
  if (filters?.cleanliness === 'low') return 'low';
  return '';
}

export function getInitialSidebarGuestFrequency(filters?: UserFilters): SidebarGuestValue {
  if (filters?.guestFrequency === 'rarely') return 'rarely';
  if (filters?.guestFrequency === 'sometimes') return 'sometimes';
  if (filters?.guestFrequency === 'often') return 'often';
  return '';
}

export function getCleanlinessLabel(value: SidebarCleanlinessValue) {
  if (value === 'high') return 'Аккуратно';
  if (value === 'medium') return 'Средне';
  if (value === 'low') return 'Не важно';
  return 'Чистота';
}

export function getGuestLabel(value: SidebarGuestValue) {
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
  if (value === '') return 'rarely';
  if (value === 'rarely') return 'sometimes';
  if (value === 'sometimes') return 'often';
  return '';
}
