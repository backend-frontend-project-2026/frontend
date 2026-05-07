import type { DiscoverCard, User } from '../../../entities/user';

export function getCleanlinessLabel(value: User['habits']['cleanliness']) {
  switch (value) {
    case 'low':
      return 'Базовая чистота';
    case 'medium':
      return 'Средняя чистота';
    case 'high':
      return 'Любит порядок';
    default:
      return value;
  }
}

export function getNoiseLabel(value: User['habits']['noiseLevel']) {
  switch (value) {
    case 'quiet':
      return 'Тихий ритм';
    case 'moderate':
      return 'Умеренный шум';
    case 'social':
      return 'Социальный ритм';
    default:
      return value;
  }
}

export function getGuestLabel(value: User['habits']['guestFrequency']) {
  switch (value) {
    case 'never':
      return 'Без гостей';
    case 'rarely':
      return 'Гости редко';
    case 'sometimes':
      return 'Гости иногда';
    case 'often':
      return 'Гости часто';
    default:
      return value;
  }
}

export function getSleepLabel(value: User['habits']['sleepSchedule']) {
  switch (value) {
    case 'early_bird':
      return 'Рано встаёт';
    case 'night_owl':
      return 'Поздно ложится';
    case 'flexible':
      return 'Гибкий режим';
    default:
      return value;
  }
}

export function getHabitHighlights(user: User) {
  return [
    getCleanlinessLabel(user.habits.cleanliness),
    getNoiseLabel(user.habits.noiseLevel),
    getGuestLabel(user.habits.guestFrequency),
    getSleepLabel(user.habits.sleepSchedule),
  ].slice(0, 3);
}

export function getConditionHighlights(user: User) {
  const budget = `${user.budget.min}–${user.budget.max}${user.budget.currency}/${user.budget.period}`;
  const conditions = [
    `Бюджет: ${budget}`,
    `Заезд: ${user.moveInDate}`,
    `Срок: ${user.stayDuration}`,
  ];

  if (user.hasQuietHours && user.habits.quietTime) {
    conditions.push(`Тихие часы: ${user.habits.quietTime.from}–${user.habits.quietTime.to}`);
  }

  return conditions.slice(0, 3);
}

export function getDiscoverChips(user: DiscoverCard): string[] {
  const chips: string[] = [];

  if (user.habits.noiseLevel === 'quiet') {
    chips.push('Тишина');
  } else if (user.habits.noiseLevel === 'moderate') {
    chips.push('Норм шум');
  } else {
    chips.push('Активный ритм');
  }

  if (user.habits.smokingPreference === 'no') {
    chips.push('Не курю');
  } else if (user.habits.smokingPreference === 'outside_only') {
    chips.push('Курение только вне дома');
  } else {
    chips.push('Курение ок');
  }

  if (user.habits.cleanliness === 'high') {
    chips.push('Аккуратно');
  } else if (user.habits.cleanliness === 'medium') {
    chips.push('Норм по быту');
  } else {
    chips.push('Без фанатизма');
  }

  if (user.habits.guestFrequency === 'never' || user.habits.guestFrequency === 'rarely') {
    chips.push('Гости редко');
  } else if (user.habits.guestFrequency === 'sometimes') {
    chips.push('Гости иногда');
  } else {
    chips.push('Люблю компании');
  }

  return chips.slice(0, 4);
}

export function getPrimaryPhoto(user: Pick<User, 'avatar' | 'photos'>) {
  return user.photos[0] || user.avatar;
}
