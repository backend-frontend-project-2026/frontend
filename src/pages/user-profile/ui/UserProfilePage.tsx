import { Button, ConfigProvider, Typography } from 'antd';
import type { User } from '../../../entities/user';
import { BottomNav } from '../../../widgets/bottom-nav';
import './user-profile-page.css';

import {
  getAlcoholLabel,
  getCleanlinessLabel,
  getGuestsLabel,
  getMoveInShort,
  getNoiseLabel,
  getQuietHoursLine,
  getRoomOrderLabel,
  getSmokingLabel,
  getStayShort,
} from '../lib/userProfileGetters';

const { Title } = Typography;

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
  className,
}: {
  label: string;
  variant?: 'ghost' | 'primary';
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      type="text"
      htmlType="button"
      className={[
        'candidate-action-button',
        variant === 'primary' ? 'candidate-action-button--primary' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      icon={
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
      }
      iconPlacement="end"
      onClick={onClick}
    >
      {label}
    </Button>
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
    <ConfigProvider wave={{ disabled: true }}>
      <section className="candidate-page">
        <div className="candidate-page__mobile">
          <div className="candidate-mobile__top">
            <div className="candidate-mobile__left">
              <div className="candidate-mobile__nav-pill">
                <Button
                  type="text"
                  htmlType="button"
                  className="candidate-mobile__nav-icon-button"
                  onClick={onBack}
                  aria-label="Назад"
                >
                  ←
                </Button>

                <Button
                  type="text"
                  htmlType="button"
                  className="candidate-mobile__nav-icon-button candidate-mobile__nav-icon-button--filled"
                  onClick={onBack}
                  aria-label="Вернуться"
                >
                  ↗
                </Button>
              </div>

              <Title level={1} className="candidate-mobile__title">
                Анкета
              </Title>
            </div>

            <Button
              type="text"
              htmlType="button"
              className="candidate-mobile__report"
              icon={<span className="candidate-mobile__report-icon">↗</span>}
              iconPlacement="end"
            >
              Пожаловаться
            </Button>
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
                      event.currentTarget.classList.add('is-hidden');
                    }}
                  />
                ) : null}
              </div>
            </div>

            {galleryPhotos.length > 1 ? (
              <section className="candidate-mobile__section">
                <Title level={3} className="candidate-mobile__section-title">
                  Фото
                </Title>
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
              <Title level={2} className="candidate-mobile__name">
                {user.name}, {user.age}
              </Title>

              <p className="candidate-mobile__meta">
                {user.university} • {user.faculty} • {user.course} •{' '}
                {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district} •{' '}
                {user.location}
              </p>
            </div>

            <section className="candidate-mobile__section">
              <Title level={3} className="candidate-mobile__section-title">
                Привычки
              </Title>
              <div className="candidate-mobile__chips-row">
                {habitChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} />
                ))}
              </div>
            </section>

            <section className="candidate-mobile__section">
              <Title level={3} className="candidate-mobile__section-title">
                Условия
              </Title>
              <div className="candidate-mobile__chips-row">
                {conditionChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} />
                ))}
              </div>
            </section>

            <section className="candidate-mobile__section">
              <Title level={3} className="candidate-mobile__section-title">
                Интересы
              </Title>
              <div className="candidate-mobile__chips-row">
                {interestChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} />
                ))}
              </div>
            </section>

            <section className="candidate-mobile__about">
              <Title level={3} className="candidate-mobile__section-title">
                Обо мне
              </Title>
              <p className="candidate-mobile__about-text">{user.bio}</p>
            </section>

            <section className="candidate-mobile__about">
              <Title level={3} className="candidate-mobile__section-title">
                Идеальный сосед
              </Title>
              <p className="candidate-mobile__about-text">
                {user.idealRoommateDescription || 'Не указано'}
              </p>
            </section>

            <section className="candidate-mobile__about">
              <Title level={3} className="candidate-mobile__section-title">
                Критерии для съёма
              </Title>
              <p className="candidate-mobile__about-text">{user.rentalCriteria || 'Не указано'}</p>
            </section>

            <div className="candidate-mobile__actions">
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
            <div className="candidate-desktop__top-action">
              <ActionButton
                label="Назад"
                onClick={onBack}
                className="candidate-desktop__back-button"
              />
            </div>

            <div className="candidate-desktop__image">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt=""
                  className="candidate-desktop__photo"
                  onError={(event) => {
                    event.currentTarget.classList.add('is-hidden');
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
              <Title level={2} className="candidate-desktop__name">
                {user.name}, {user.age}
              </Title>

              <p className="candidate-desktop__meta">
                {user.university} • {user.faculty} • {user.course} •{' '}
                {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district}
              </p>

              <div className="candidate-desktop__actions">
                <ActionButton label="Пропуск" onClick={onSkip} />
                <ActionButton label="Супер-лайк" onClick={onSuperLike} />
                <ActionButton
                  label="Лайк"
                  variant="primary"
                  onClick={onLike}
                  className="candidate-action-button--wide"
                />
              </div>
            </div>

            <Button type="text" htmlType="button" className="candidate-desktop__report-link">
              Пожаловаться
            </Button>
          </div>

          <div className="candidate-desktop__right-card">
            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Привычки
              </Title>

              <div className="candidate-desktop__chips">
                {habitChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} accent />
                ))}
              </div>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Условия
              </Title>
              <p className="candidate-desktop__line">{desktopConditionLine}</p>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Интересы
              </Title>
              <div className="candidate-desktop__chips">
                {interestChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} />
                ))}
              </div>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Тихие часы
              </Title>
              <p className="candidate-desktop__line">{quietHoursLine}</p>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Короткое био
              </Title>
              <p className="candidate-desktop__bio">{user.bio}</p>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Идеальный сосед
              </Title>
              <p className="candidate-desktop__bio">
                {user.idealRoommateDescription || 'Не указано'}
              </p>
            </section>

            <section className="candidate-desktop__section">
              <Title level={3} className="candidate-desktop__section-title">
                Критерии для съёма
              </Title>
              <p className="candidate-desktop__bio">{user.rentalCriteria || 'Не указано'}</p>
            </section>
          </div>
        </div>
      </section>
    </ConfigProvider>
  );
}
