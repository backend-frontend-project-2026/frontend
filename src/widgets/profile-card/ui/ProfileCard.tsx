import { UserBadge, type DiscoverCard, type User } from '../../../entities/user';
import './profile-card.css';
import { Button, Typography } from 'antd';

import {
  getConditionHighlights,
  getDiscoverChips,
  getHabitHighlights,
  getPrimaryPhoto,
} from '../lib/profileCardGetters';

const { Title } = Typography;

type ProfileCardCommonProps = {
  className?: string;
  compact?: boolean;
};

type DefaultProfileCardProps = ProfileCardCommonProps & {
  user: User;
  showActions?: boolean;
  variant?: 'default';
  onOpenProfile?: (user: User) => void;
  onLike?: (user: User) => void;
  onSkip?: (user: User) => void;
  onSuperLike?: (user: User) => void;
};

type DiscoverProfileCardProps = ProfileCardCommonProps & {
  user: DiscoverCard;
  showActions?: false;
  variant: 'discover';
  onOpenProfile?: (user: DiscoverCard) => void;
};

type ProfileCardProps = DefaultProfileCardProps | DiscoverProfileCardProps;

export function ProfileCard(props: ProfileCardProps) {
  const { user, className, compact = false } = props;

  if (props.variant === 'discover') {
    const { onOpenProfile } = props;
    const discoverChips = getDiscoverChips(user);
    const photo = getPrimaryPhoto(user);

    return (
      <article
        className={[
          'discover-card',
          compact ? 'discover-card--compact' : '',
          onOpenProfile ? 'discover-card--clickable' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onOpenProfile?.(user)}
      >
        <div className="discover-card__image">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="discover-card__photo"
              onError={(event) => {
                event.currentTarget.classList.add('is-hidden');
              }}
            />
          ) : null}

          <div className="discover-card__fallback" aria-hidden="true" />

          {onOpenProfile ? (
            <button
              type="button"
              className="discover-card__open-profile"
              onClick={(event) => {
                event.stopPropagation();
                onOpenProfile(user);
              }}
            >
              Открыть профиль
            </button>
          ) : null}
        </div>

        <div className="discover-card__body">
          <Title level={3} className="discover-card__name">
            {user.name}, {user.age}
          </Title>

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

  const { showActions = true, onSkip, onLike, onSuperLike } = props;
  const profileUser = props.user;
  const habits = getHabitHighlights(profileUser);
  const conditions = getConditionHighlights(profileUser);
  const interests = profileUser.interests.slice(0, 4);
  const photo = getPrimaryPhoto(profileUser);

  return (
    <article className={['profile-card', className].filter(Boolean).join(' ')}>
      <div className="profile-card-media">
        {photo ? (
          <img
            src={photo}
            alt={`${profileUser.name} photo`}
            className="profile-card-image"
            onError={(event) => {
              event.currentTarget.classList.add('is-hidden');
            }}
          />
        ) : null}

        <div className="profile-card-fallback">{profileUser.name.charAt(0).toUpperCase()}</div>

        {profileUser.verified ? <span className="profile-card-verified">Проверен</span> : null}
      </div>

      <div className="profile-card-body">
        <header className="profile-card-header">
          <div>
            <Title level={3} className="profile-card-name">
              {profileUser.name}, {profileUser.age}
            </Title>
            <p className="profile-card-subtitle">
              {profileUser.university} • {profileUser.faculty}
            </p>
            <p className="profile-card-subtitle profile-card-subtitle-muted">
              {profileUser.course} • {profileUser.location} • {profileUser.district}
            </p>
          </div>
        </header>

        <p className="profile-card-bio">{profileUser.bio}</p>

        <section className="profile-card-section">
          <Title level={4} className="profile-card-section-title">
            Краткие привычки
          </Title>
          <div className="profile-card-tags">
            {habits.map((habit) => (
              <UserBadge key={habit} label={habit} variant="outline" />
            ))}
          </div>
        </section>

        <section className="profile-card-section">
          <Title level={4} className="profile-card-section-title">
            Краткие условия
          </Title>
          <div className="profile-card-tags">
            {conditions.map((condition) => (
              <UserBadge key={condition} label={condition} />
            ))}
          </div>
        </section>

        <section className="profile-card-section">
          <Title level={4} className="profile-card-section-title">
            Интересы
          </Title>
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
              onClick={() => onSkip?.(profileUser)}
            >
              Пропустить
            </Button>
            <Button
              htmlType="button"
              className="profile-card-button profile-card-super-like"
              onClick={() => onSuperLike?.(profileUser)}
            >
              Супер-лайк
            </Button>
            <Button
              htmlType="button"
              className="profile-card-button profile-card-button-primary"
              onClick={() => onLike?.(profileUser)}
            >
              Лайк
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
