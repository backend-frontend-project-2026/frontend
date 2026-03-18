import type { User } from '../../../entities/user';
import { BottomNav } from '../../../widgets/bottom-nav';
import './user-profile-page.css';

type UserProfilePageProps = {
  user: User;
  onBack?: () => void;
  onLike?: () => void;
  onSkip?: () => void;
  onSuperLike?: () => void;
};

function ActionButton({
  label,
  variant = 'ghost',
  onClick,
}: {
  label: string;
  variant?: 'ghost' | 'primary';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        'candidate-action-button',
        variant === 'primary' ? 'candidate-action-button--primary' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        className={[
          'candidate-action-button__icon',
          variant === 'primary'
            ? 'candidate-action-button__icon--lime'
            : 'candidate-action-button__icon--dark',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        ↗
      </span>
    </button>
  );
}

function CandidateChip({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span className={['candidate-chip', accent ? 'candidate-chip--accent' : ''].join(' ')}>
      <span className="candidate-chip__dot" />
      <span>{label}</span>
    </span>
  );
}

function getNoiseLabel(user: User): string {
  if (user.habits.noiseLevel === 'quiet') return 'Тишина';
  if (user.habits.noiseLevel === 'moderate') return 'Норм';
  return 'Шумно';
}

function getSmokingLabel(user: User): string {
  if (user.habits.smokingPreference === 'no') return 'Не курю';
  if (user.habits.smokingPreference === 'outside_only') return 'Только на улице';
  return 'Курю';
}

function getAlcoholLabel(user: User): string {
  if (user.habits.alcoholPreference === 'no') return 'Не пью';
  if (user.habits.alcoholPreference === 'rarely') return 'Редко';
  if (user.habits.alcoholPreference === 'socially') return 'Иногда';
  return 'Алкоголь ок';
}

function getRoomOrderLabel(user: User): string {
  if (user.habits.roomOrderPreference === 'strict') return 'Любит порядок';
  if (user.habits.roomOrderPreference === 'balanced') return 'Баланс по быту';
  return 'Гибко к быту';
}

function getCleanlinessLabel(user: User): string {
  if (user.habits.cleanliness === 'high') return 'Аккуратно';
  if (user.habits.cleanliness === 'medium') return 'Средне';
  return 'Не важно';
}

function getGuestsLabel(user: User): string {
  if (user.habits.guestFrequency === 'never') return 'Без гостей';
  if (user.habits.guestFrequency === 'rarely') return 'Гости редко';
  if (user.habits.guestFrequency === 'sometimes') return 'Гости иногда';
  return 'Гости часто';
}

function getQuietHoursLine(user: User) {
  if (user.habits.quietTime) {
    return `${user.habits.quietTime.from} – ${user.habits.quietTime.to}`;
  }

  return user.hasQuietHours ? 'Есть' : 'Нет';
}

function getMoveInShort(value: string) {
  if (value.toLowerCase().includes('март')) return 'март';
  if (value.toLowerCase().includes('сент')) return 'сент.';
  return value.replace(/^с\s+/i, '');
}

function getStayShort(value: User['stayDuration']) {
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

export function UserProfilePage({
  user,
  onBack,
  onLike,
  onSkip,
  onSuperLike,
}: UserProfilePageProps) {
  const mainPhoto = user.avatar || user.photos[0] || '';

  const galleryPhotos = Array.from(new Set([user.avatar, ...user.photos].filter(Boolean)));

  const interestChips = user.interests;

  const habitChips = [
    getNoiseLabel(user),
    getSmokingLabel(user),
    getAlcoholLabel(user),
    getCleanlinessLabel(user),
    getRoomOrderLabel(user),
    getGuestsLabel(user),
  ];

  const conditionChips = [
    `${user.budget.min}–${user.budget.max} тыс ₽`,
    `Заезд: ${getMoveInShort(user.moveInDate)}`,
    `Срок: ${getStayShort(user.stayDuration)}`,
  ];

  const desktopConditionLine = [
    `Бюджет: ${user.budget.min}–${user.budget.max} тыс`,
    `Заезд: ${getMoveInShort(user.moveInDate)}`,
    `Срок: ${getStayShort(user.stayDuration)}`,
  ].join(' • ');

  const quietHoursLine = getQuietHoursLine(user);

  return (
    <section className="candidate-page">
      <div className="candidate-page__mobile">
        <div className="candidate-mobile__top">
          <div className="candidate-mobile__left">
            <div className="candidate-mobile__nav-pill">
              <button
                type="button"
                className="candidate-mobile__nav-icon-button"
                onClick={onBack}
                aria-label="Назад"
              >
                ←
              </button>

              <button
                type="button"
                className="candidate-mobile__nav-icon-button candidate-mobile__nav-icon-button--filled"
                onClick={onBack}
                aria-label="Вернуться"
              >
                ↗
              </button>
            </div>

            <h1 className="candidate-mobile__title">Анкета</h1>
          </div>

          <button type="button" className="candidate-mobile__report">
            <span>Пожаловаться</span>
            <span className="candidate-mobile__report-icon">↗</span>
          </button>
        </div>

        <div className="candidate-mobile__body">
          <div className="candidate-mobile__image-card">
            <div className="candidate-mobile__image">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt=""
                  className="candidate-mobile__photo"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
          </div>

          {galleryPhotos.length > 1 ? (
            <section className="candidate-mobile__section">
              <h3 className="candidate-mobile__section-title">Фото</h3>
              <div className="candidate-mobile__gallery">
                {galleryPhotos.map((photo, index) => (
                  <div key={`${photo}-${index}`} className="candidate-mobile__gallery-thumb">
                    <img src={photo} alt="" className="candidate-mobile__gallery-photo" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="candidate-mobile__summary">
            <h2 className="candidate-mobile__name">
              {user.name}, {user.age}
            </h2>

            <p className="candidate-mobile__meta">
              {user.university} • {user.faculty} • {user.course} •{' '}
              {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district} • {user.location}
            </p>
          </div>

          <section className="candidate-mobile__section">
            <h3 className="candidate-mobile__section-title">Привычки</h3>
            <div className="candidate-mobile__chips-row">
              {habitChips.map((chip) => (
                <CandidateChip key={chip} label={chip} />
              ))}
            </div>
          </section>

          <section className="candidate-mobile__section">
            <h3 className="candidate-mobile__section-title">Условия</h3>
            <div className="candidate-mobile__chips-row">
              {conditionChips.map((chip) => (
                <CandidateChip key={chip} label={chip} />
              ))}
            </div>
          </section>

          <section className="candidate-mobile__section">
            <h3 className="candidate-mobile__section-title">Интересы</h3>
            <div className="candidate-mobile__chips-row">
              {interestChips.map((chip) => (
                <CandidateChip key={chip} label={chip} />
              ))}
            </div>
          </section>

          <section className="candidate-mobile__about">
            <h3 className="candidate-mobile__section-title">Обо мне</h3>
            <p className="candidate-mobile__about-text">{user.bio}</p>
          </section>

          <section className="candidate-mobile__about">
            <h3 className="candidate-mobile__section-title">Идеальный сосед</h3>
            <p className="candidate-mobile__about-text">
              {user.idealRoommateDescription || 'Не указано'}
            </p>
          </section>

          <section className="candidate-mobile__about">
            <h3 className="candidate-mobile__section-title">Критерии для съёма</h3>
            <p className="candidate-mobile__about-text">{user.rentalCriteria || 'Не указано'}</p>
          </section>

          <div className="candidate-mobile__actions">
            <ActionButton label="Назад" onClick={onBack} />
            <ActionButton label="Лайк" variant="primary" onClick={onLike} />
            <ActionButton label="Супер-лайк" onClick={onSuperLike} />
            <ActionButton label="Пропуск" onClick={onSkip} />
          </div>
        </div>

        <BottomNav
          classNamePrefix="candidate-mobile"
          items={[
            { key: 'discover', label: 'Поиск', active: true },
            { key: 'matches', label: 'Матчи' },
            { key: 'chats', label: 'Чаты' },
            { key: 'profile', label: 'Профиль' },
          ]}
        />
      </div>

      <div className="candidate-page__desktop">
        <div className="candidate-desktop__left-card">
          <div className="candidate-desktop__image">
            {mainPhoto ? (
              <img
                src={mainPhoto}
                alt=""
                className="candidate-desktop__photo"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
          </div>

          {galleryPhotos.length > 1 ? (
            <div className="candidate-desktop__gallery">
              {galleryPhotos.map((photo, index) => (
                <div key={`${photo}-${index}`} className="candidate-desktop__gallery-thumb">
                  <img src={photo} alt="" className="candidate-desktop__gallery-photo" />
                </div>
              ))}
            </div>
          ) : null}

          <div className="candidate-desktop__left-body">
            <h2 className="candidate-desktop__name">
              {user.name}, {user.age}
            </h2>

            <p className="candidate-desktop__meta">
              {user.university} • {user.faculty} • {user.course} •{' '}
              {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district}
            </p>

            <div className="candidate-desktop__actions">
              <ActionButton label="Назад" onClick={onBack} />
              <ActionButton label="Лайк" variant="primary" onClick={onLike} />
              <ActionButton label="Супер-лайк" onClick={onSuperLike} />
              <ActionButton label="Пропуск" onClick={onSkip} />
            </div>
          </div>

          <button type="button" className="candidate-desktop__report-link">
            Пожаловаться
          </button>
        </div>

        <div className="candidate-desktop__right-card">
          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Привычки</h3>

            <div className="candidate-desktop__chips">
              {habitChips.map((chip) => (
                <CandidateChip key={chip} label={chip} accent />
              ))}
            </div>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Условия</h3>
            <p className="candidate-desktop__line">{desktopConditionLine}</p>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Интересы</h3>
            <div className="candidate-desktop__chips">
              {interestChips.map((chip) => (
                <CandidateChip key={chip} label={chip} />
              ))}
            </div>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Тихие часы</h3>
            <p className="candidate-desktop__line">{quietHoursLine}</p>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Короткое био</h3>
            <p className="candidate-desktop__bio">{user.bio}</p>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Идеальный сосед</h3>
            <p className="candidate-desktop__bio">
              {user.idealRoommateDescription || 'Не указано'}
            </p>
          </section>

          <section className="candidate-desktop__section">
            <h3 className="candidate-desktop__section-title">Критерии для съёма</h3>
            <p className="candidate-desktop__bio">{user.rentalCriteria || 'Не указано'}</p>
          </section>
        </div>
      </div>
    </section>
  );
}
