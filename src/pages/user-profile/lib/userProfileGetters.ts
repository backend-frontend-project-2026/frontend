import type { User } from '../../../entities/user';
import { includesNormalizedText } from '../../../shared/utils/texts';

export function getNoiseLabel(user: User): string {
  if (user.habits.noiseLevel === 'quiet') return 'Тишина';
  if (user.habits.noiseLevel === 'moderate') return 'Норм';
  return 'Шумно';
}

export function getSmokingLabel(user: User): string {
  if (user.habits.smokingPreference === 'no') return 'Не курю';
  if (user.habits.smokingPreference === 'outside_only') return 'Только на улице';
  return 'Курю';
}

export function getAlcoholLabel(user: User): string {
  if (user.habits.alcoholPreference === 'no') return 'Не пью';
  if (user.habits.alcoholPreference === 'rarely') return 'Редко';
  if (user.habits.alcoholPreference === 'socially') return 'Иногда';
  return 'Алкоголь ок';
}

export function getRoomOrderLabel(user: User): string {
  if (user.habits.roomOrderPreference === 'strict') return 'Любит порядок';
  if (user.habits.roomOrderPreference === 'balanced') return 'Баланс по быту';
  return 'Гибко к быту';
}

export function getCleanlinessLabel(user: User): string {
  if (user.habits.cleanliness === 'high') return 'Аккуратно';
  if (user.habits.cleanliness === 'medium') return 'Средне';
  return 'Не важно';
}

export function getGuestsLabel(user: User): string {
  if (user.habits.guestFrequency === 'never') return 'Без гостей';
  if (user.habits.guestFrequency === 'rarely') return 'Гости редко';
  if (user.habits.guestFrequency === 'sometimes') return 'Гости иногда';
  return 'Гости часто';
}

export function getQuietHoursLine(user: User) {
  if (user.habits.quietTime) {
    return `${user.habits.quietTime.from} – ${user.habits.quietTime.to}`;
  }

  return user.hasQuietHours ? 'Есть' : 'Нет';
}

export function getMoveInShort(value: string) {
  if (includesNormalizedText(value, 'март')) return 'март';
  if (includesNormalizedText(value, 'сент')) return 'сент.';
  return value.replace(/^с\s+/i, '');
}

export function getStayShort(value: User['stayDuration']) {
  switch (value) {
    case '1-3 months':
      return '1–3 мес';
    case '3-6 months':
      return '3–6 мес';
    case '6-12 months':
      return '6–12 мес';
    case '12+ months':
      return '12+ мес';
    default:
      return value;
  }
}
