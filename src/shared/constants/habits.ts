interface HabitOption {
  value: string;
  label: string;
}

export const SLEEP_MODES: HabitOption[] = [
  { value: 'early_sleep', label: 'Рано ложусь' },
  { value: 'late_sleep', label: 'Позже ложусь' },
  { value: 'early_rise', label: 'Рано встаю' },
  { value: 'late_rise', label: 'Позже встаю' },
];

export const SMOKING_OPTIONS: HabitOption[] = [
  { value: 'no', label: 'Не курю' },
  { value: 'yes', label: 'Курю' },
  { value: 'outside', label: 'Только на улице' },
];

export const NOISE_LEVELS: HabitOption[] = [
  { value: 'silence', label: 'Тишина' },
  { value: 'normal', label: 'Норм' },
  { value: 'loud', label: 'Шумно' },
];

export const CLEANLINESS_OPTIONS: HabitOption[] = [
  { value: 'neat', label: 'Аккуратно' },
  { value: 'medium', label: 'Средне' },
  { value: 'not_important', label: 'Не важно' },
];

export const GUEST_OPTIONS: HabitOption[] = [
  { value: 'rarely', label: 'Редко' },
  { value: 'sometimes', label: 'Иногда' },
  { value: 'often', label: 'Часто' },
];

export const PET_OPTIONS: HabitOption[] = [
  { value: 'ok', label: 'Ок' },
  { value: 'not_ok', label: 'Не ок' },
];

export const INTERESTS: HabitOption[] = [
  { value: 'study', label: 'Учёба' },
  { value: 'sport', label: 'Спорт' },
  { value: 'cinema', label: 'Кино' },
  { value: 'music', label: 'Музыка' },
  { value: 'games', label: 'Игры' },
  { value: 'cooking', label: 'Кулинария' },
];
