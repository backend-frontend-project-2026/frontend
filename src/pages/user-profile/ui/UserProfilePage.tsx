import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import type { FullProfile } from '../../../entities/user';
import {
  ReactionFeedback,
  type ReactionType,
} from '../../../shared/ui/ReactionFeedback/ReactionFeedback';
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

type UserProfilePageProps = {
  user: FullProfile;
  onBack?: () => void;
  onLike?: () => void;
  onSkip?: () => void;
  onSuperLike?: () => void;
  onReport?: () => void;
};

type ProfileReaction = ReactionType;

const REACTION_FEEDBACK: Record<
  ProfileReaction,
  {
    title: string;
    text: string;
    icon: string;
  }
> = {
  like: {
    title: 'Лайк отправлен',
    text: 'Анкета добавлена в понравившиеся. Возвращаемся в поиск…',
    icon: '♥',
  },
  skip: {
    title: 'Анкета пропущена',
    text: 'Покажем следующего кандидата в поиске.',
    icon: '✕',
  },
  superlike: {
    title: 'Супер-лайк отправлен',
    text: 'Анкета отмечена как особенно интересная. Возвращаемся в поиск…',
    icon: '★',
  },
};

function ActionButton({
  label,
  variant = 'ghost',
  onClick,
  className,
  disabled,
}: {
  label: string;
  variant?: 'ghost' | 'primary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
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
      disabled={disabled}
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
  onReport,
}: UserProfilePageProps) {
  const [pendingReaction, setPendingReaction] = useState<ProfileReaction | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current !== null) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  const handleReaction = useCallback(
    (reaction: ProfileReaction, callback?: () => void) => {
      if (pendingReaction) {
        return;
      }

      setPendingReaction(reaction);

      reactionTimeoutRef.current = window.setTimeout(() => {
        reactionTimeoutRef.current = null;

        if (callback) {
          callback();
          return;
        }

        setPendingReaction(null);
      }, 700);
    },
    [pendingReaction]
  );
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

              <h1 className="candidate-mobile__title">Анкета</h1>
            </div>

            <Button
              type="text"
              htmlType="button"
              className="candidate-mobile__report"
              icon={<span className="candidate-mobile__report-icon">↗</span>}
              iconPlacement="end"
              onClick={onReport}
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
                {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district} •{' '}
                {user.location}
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
              <h2 className="candidate-mobile__section-title">Условия</h2>
              <div className="candidate-mobile__chips-row">
                {conditionChips.map((chip) => (
                  <CandidateChip key={chip} label={chip} />
                ))}
              </div>
            </section>

            <section className="candidate-mobile__section">
              <h2 className="candidate-mobile__section-title">Интересы</h2>
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

            {pendingReaction ? <ReactionFeedback
              reaction={pendingReaction}
              messages={REACTION_FEEDBACK}
              variant="profile"
            /> : null}

            <div className="candidate-mobile__actions">
              <ActionButton
                label="Лайк"
                variant="primary"
                onClick={() => handleReaction('like', onLike)}
                disabled={Boolean(pendingReaction)}
              />
              <ActionButton
                label="Супер-лайк"
                onClick={() => handleReaction('superlike', onSuperLike)}
                disabled={Boolean(pendingReaction)}
              />
              <ActionButton
                label="Пропуск"
                onClick={() => handleReaction('skip', onSkip)}
                disabled={Boolean(pendingReaction)}
              />
            </div>
          </div>
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
              <h2 className="candidate-desktop__name">
                {user.name}, {user.age}
              </h2>

              <p className="candidate-desktop__meta">
                {user.university} • {user.faculty} • {user.course} •{' '}
                {user.gender === 'female' ? 'Женский' : 'Мужской'} • {user.district}
              </p>

              {pendingReaction ? <ReactionFeedback
                reaction={pendingReaction}
                messages={REACTION_FEEDBACK}
                variant="profile"
              /> : null}

              <div className="candidate-desktop__actions">
                <ActionButton
                  label="Пропуск"
                  onClick={() => handleReaction('skip', onSkip)}
                  disabled={Boolean(pendingReaction)}
                />
                <ActionButton
                  label="Супер-лайк"
                  onClick={() => handleReaction('superlike', onSuperLike)}
                  disabled={Boolean(pendingReaction)}
                />
                <ActionButton
                  label="Лайк"
                  variant="primary"
                  onClick={() => handleReaction('like', onLike)}
                  className="candidate-action-button--wide"
                  disabled={Boolean(pendingReaction)}
                />
              </div>
            </div>

            <Button
              type="text"
              htmlType="button"
              className="candidate-desktop__report-link"
              onClick={onReport}
            >
              Пожаловаться
            </Button>
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
    </ConfigProvider>
  );
}
