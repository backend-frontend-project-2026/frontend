import type { UserHabits as UserHabitsType } from '../model';

export function getSleepScheduleLabel(value: UserHabitsType['sleepSchedule']) {
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

export function getCleanlinessLabel(value: UserHabitsType['cleanliness']) {
  switch (value) {
    case 'low':
      return 'Чистота: базово';
    case 'medium':
      return 'Чистота: средне';
    case 'high':
      return 'Чистота: любит порядок';
    default:
      return value;
  }
}

export function getNoiseLabel(value: UserHabitsType['noiseLevel']) {
  switch (value) {
    case 'quiet':
      return 'Тихий';
    case 'moderate':
      return 'Умеренный шум';
    case 'social':
      return 'Активный ритм';
    default:
      return value;
  }
}

export function getGuestLabel(value: UserHabitsType['guestFrequency']) {
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

export function getPetLabel(value: UserHabitsType['petPreference']) {
  switch (value) {
    case 'no_pets':
      return 'Без животных';
    case 'has_pets':
      return 'Есть питомцы';
    case 'pet_friendly':
      return 'Любит животных';
    default:
      return value;
  }
}

export function getSmokingLabel(value: UserHabitsType['smokingPreference']) {
  switch (value) {
    case 'no':
      return 'Не курит';
    case 'outside_only':
      return 'Курение только вне дома';
    case 'yes':
      return 'Курение допустимо';
    default:
      return value;
  }
}
