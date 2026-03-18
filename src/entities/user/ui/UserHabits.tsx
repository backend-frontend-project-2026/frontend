import type { UserHabits as UserHabitsType } from '../model';
import { UserBadge } from './UserBadge';

type UserHabitsProps = {
  habits: UserHabitsType;
  hasPets?: boolean;
  isSmokingAllowed?: boolean;
  hasQuietHours?: boolean;
};

function getSleepScheduleLabel(value: UserHabitsType['sleepSchedule']) {
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

function getCleanlinessLabel(value: UserHabitsType['cleanliness']) {
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

function getNoiseLabel(value: UserHabitsType['noiseLevel']) {
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

function getGuestLabel(value: UserHabitsType['guestFrequency']) {
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

function getPetLabel(value: UserHabitsType['petPreference']) {
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

function getSmokingLabel(value: UserHabitsType['smokingPreference']) {
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

export function UserHabits({ habits, hasPets, isSmokingAllowed, hasQuietHours }: UserHabitsProps) {
  const items = [
    getSleepScheduleLabel(habits.sleepSchedule),
    getCleanlinessLabel(habits.cleanliness),
    getNoiseLabel(habits.noiseLevel),
    getGuestLabel(habits.guestFrequency),
    getPetLabel(habits.petPreference),
    getSmokingLabel(habits.smokingPreference),
  ];

  if (hasPets) {
    items.push('Есть питомец');
  }

  if (isSmokingAllowed) {
    items.push('Можно курить');
  }

  if (hasQuietHours && habits.quietTime) {
    items.push(`Тихие часы: ${habits.quietTime.from}–${habits.quietTime.to}`);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {items.map((item) => (
        <UserBadge key={item} label={item} variant="outline" />
      ))}
    </div>
  );
}
