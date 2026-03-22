import { UserBadge, type User } from '../../../entities/user';
import './profile-card.css';
import { Button } from 'antd';

type ProfileCardProps = {
  user: User;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
  variant?: 'default' | 'discover';
  onOpenProfile?: (user: User) => void;
  onLike?: (user: User) => void;
  onSkip?: (user: User) => void;
  onSuperLike?: (user: User) => void;
};

function getCleanlinessLabel(value: User['habits']['cleanliness']) {
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

function getNoiseLabel(value: User['habits']['noiseLevel']) {
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

function getGuestLabel(value: User['habits']['guestFrequency']) {
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

function getSleepLabel(value: User['habits']['sleepSchedule']) {
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

function getHabitHighlights(user: User) {
  return [
    getCleanlinessLabel(user.habits.cleanliness),
    getNoiseLabel(user.habits.noiseLevel),
    getGuestLabel(user.habits.guestFrequency),
    getSleepLabel(user.habits.sleepSchedule),
  ].slice(0, 3);
}

function getConditionHighlights(user: User) {
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

function getDiscoverChips(user: User): string[] {
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

function getPrimaryPhoto(user: User) {
  return user.photos[0] || user.avatar;
}

export function ProfileCard({
  user,
  className,
  showActions = true,
  compact = false,
  variant = 'default',
  onOpenProfile,
  onLike,
  onSkip,
  onSuperLike,
}: ProfileCardProps) {
  if (variant === 'discover') {
    const discoverChips = getDiscoverChips(user);
    const photo = getPrimaryPhoto(user);

    return (
      <article
        className={['discover-card', compact ? 'discover-card--compact' : '', className ?? '']
          .filter(Boolean)
          .join(' ')}
        onClick={() => onOpenProfile?.(user)}
        style={{ cursor: onOpenProfile ? 'pointer' : 'default' }}
      >
        <div className="discover-card__image">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="discover-card__photo"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : null}

          <div className="discover-card__fallback" aria-hidden="true" />
        </div>

        <div className="discover-card__body">
          <h3 className="discover-card__name">
            {user.name}, {user.age}
          </h3>

          <p className="discover-card__meta">
            {user.university} • {user.faculty} • {user.district}
          </p>

          <div className="discover-card__chips">
            {discoverChips.map((chip) => (
              <span key={chip} className="discover-chip">
                {chip}
              </span>
            ))}
          </div>

          <p className="discover-card__bio">{user.bio}</p>
        </div>
      </article>
    );
  }

  const habits = getHabitHighlights(user);
  const conditions = getConditionHighlights(user);
  const interests = user.interests.slice(0, 4);
  const photo = getPrimaryPhoto(user);

  return (
    <article className={['profile-card', className].filter(Boolean).join(' ')}>
      <div className="profile-card-media">
        {photo ? (
          <img
            src={photo}
            alt={`${user.name} photo`}
            className="profile-card-image"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : null}

        <div className="profile-card-fallback">{user.name.charAt(0).toUpperCase()}</div>

        {user.verified ? <span className="profile-card-verified">Проверен</span> : null}
      </div>

      <div className="profile-card-body">
        <header className="profile-card-header">
          <div>
            <h3 className="profile-card-name">
              {user.name}, {user.age}
            </h3>
            <p className="profile-card-subtitle">
              {user.university} • {user.faculty}
            </p>
            <p className="profile-card-subtitle profile-card-subtitle-muted">
              {user.course} • {user.location} • {user.district}
            </p>
          </div>
        </header>

        <p className="profile-card-bio">{user.bio}</p>

        <section className="profile-card-section">
          <h4 className="profile-card-section-title">Краткие привычки</h4>
          <div className="profile-card-tags">
            {habits.map((habit) => (
              <UserBadge key={habit} label={habit} variant="outline" />
            ))}
          </div>
        </section>

        <section className="profile-card-section">
          <h4 className="profile-card-section-title">Краткие условия</h4>
          <div className="profile-card-tags">
            {conditions.map((condition) => (
              <UserBadge key={condition} label={condition} />
            ))}
          </div>
        </section>

        <section className="profile-card-section">
          <h4 className="profile-card-section-title">Интересы</h4>
          <div className="profile-card-tags">
            {interests.map((interest) => (
              <UserBadge key={interest} label={interest} variant="accent" />
            ))}
          </div>
        </section>

        {showActions ? (
          <div className="profile-card-actions">
            <Button
              htmlType="button"
              className="profile-card-button"
              onClick={() => onSkip?.(user)}
            >
              Пропустить
            </Button>
            <Button
              htmlType="button"
              className="profile-card-button profile-card-super-like"
              onClick={() => onSuperLike?.(user)}
            >
              Супер-лайк
            </Button>
            <Button
              htmlType="button"
              className="profile-card-button profile-card-button-primary"
              onClick={() => onLike?.(user)}
            >
              Лайк
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
