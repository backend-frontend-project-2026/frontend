import type { UserHabits as UserHabitsType } from '../model';
import { UserBadge } from './UserBadge';
import './user-ui.css';

import {
  getCleanlinessLabel,
  getGuestLabel,
  getNoiseLabel,
  getPetLabel,
  getSleepScheduleLabel,
  getSmokingLabel,
} from '../lib/userHabitsGetters';

type UserHabitsProps = {
  habits: UserHabitsType;
  hasPets?: boolean;
  isSmokingAllowed?: boolean;
  hasQuietHours?: boolean;
};

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
    <div className="user-habits">
      {items.map((item) => (
        <UserBadge key={item} label={item} variant="outline" />
      ))}
    </div>
  );
}
