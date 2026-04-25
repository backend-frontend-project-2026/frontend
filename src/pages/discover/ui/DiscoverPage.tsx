import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Typography } from 'antd';
import type { User, UserFilters } from '../../../entities/user';
import {
  LikeProfileButton,
  SkipProfileButton,
  SuperLikeProfileButton,
} from '../../../features/discover';
import { BottomNav } from '../../../widgets/bottom-nav';
import { ProfileCard } from '../../../widgets/profile-card';
import {
  ReactionFeedback,
  type ReactionType,
} from '../../../shared/ui/ReactionFeedback/ReactionFeedback';
import { getDiscoverEmptyState } from '../lib/emptyState';
import './discover-page.css';

import {
  formatSidebarBudget,
  formatSidebarMoveInDate,
  getCleanlinessLabel,
  getGuestLabel,
  getInitialSidebarCleanliness,
  getInitialSidebarGuestFrequency,
  getInitialSidebarNoise,
  getInitialSidebarSmoking,
  getNextCleanlinessValue,
  getNextGuestValue,
  getNextNoiseValue,
  getNextSmokingValue,
  getNoiseLabel,
  getSidebarChips,
  getSmokingLabel,
  parseBudgetInput,
} from '../lib/discoverPageGetters';

import type {
  SidebarCleanlinessValue,
  SidebarGuestValue,
  SidebarNoiseValue,
  SidebarSmokingValue,
} from '../lib/types';

const { Title } = Typography;

type DiscoverReaction = ReactionType;

const DISCOVER_REACTION_FEEDBACK: Record<
  DiscoverReaction,
  {
    title: string;
    text: string;
    icon: string;
  }
> = {
  like: {
    title: 'Лайк отправлен',
    text: 'Анкета добавлена в понравившиеся. Показываем следующую анкету.',
    icon: '♥',
  },
  skip: {
    title: 'Анкета пропущена',
    text: 'Показываем следующую анкету.',
    icon: '✕',
  },
  superlike: {
    title: 'Супер-лайк отправлен',
    text: 'Анкета отмечена как особенно интересная. Показываем следующую анкету.',
    icon: '★',
  },
};

type DiscoverPageProps = {
  users: User[];
  totalUsersCount?: number;
  matchingUsersCount?: number;
  hasActiveFilters?: boolean;
  activeFilters?: UserFilters;
  onOpenFilters?: () => void;
  onResetFilters?: () => void;
  onApplyFilters?: (filters: UserFilters) => void;
  onOpenProfile?: (user: User) => void;
  onLike?: (user: User) => void;
  onSkip?: (user: User) => void;
  onSuperLike?: (user: User) => void;
};

type DiscoverEmptyStateProps = {
  title: string;
  text: string;
  buttonText: string;
  onButtonClick?: () => void;
};

function DiscoverEmptyState({ title, text, buttonText, onButtonClick }: DiscoverEmptyStateProps) {
  return (
    <div className="discover-empty">
      <div className="discover-empty__icon">◎</div>
      <Title level={3} className="discover-empty__title">
        {title}
      </Title>
      <p className="discover-empty__text">{text}</p>
      <Button type="default" className="discover-empty__button" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  );
}

export default function DiscoverPage({
  users,
  totalUsersCount = users.length,
  matchingUsersCount = users.length,
  hasActiveFilters = false,
  activeFilters,
  onOpenFilters,
  onResetFilters,
  onApplyFilters,
  onOpenProfile,
  onLike,
  onSkip,
  onSuperLike,
}: DiscoverPageProps) {
  const currentUser = users[0] ?? null;
  const emptyState = getDiscoverEmptyState({
    users,
    totalUsersCount,
    matchingUsersCount,
    hasActiveFilters,
  });

  const infoChips = getSidebarChips(currentUser);
  void infoChips;

  const [budgetValue, setBudgetValue] = useState(formatSidebarBudget(activeFilters));
  const [moveInDateValue, setMoveInDateValue] = useState(activeFilters?.moveInDate ?? '');
  const moveInDatePlaceholder = formatSidebarMoveInDate(activeFilters);
  const [noiseValue, setNoiseValue] = useState<SidebarNoiseValue>(
    getInitialSidebarNoise(activeFilters)
  );
  const [smokingValue, setSmokingValue] = useState<SidebarSmokingValue>(
    getInitialSidebarSmoking(activeFilters)
  );

  const [cleanlinessValue, setCleanlinessValue] = useState<SidebarCleanlinessValue>(
    getInitialSidebarCleanliness(activeFilters)
  );

  const [guestValue, setGuestValue] = useState<SidebarGuestValue>(
    getInitialSidebarGuestFrequency(activeFilters)
  );

  const [pendingReaction, setPendingReaction] = useState<DiscoverReaction | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setBudgetValue(formatSidebarBudget(activeFilters));
    setMoveInDateValue(activeFilters?.moveInDate ?? '');
    setNoiseValue(getInitialSidebarNoise(activeFilters));
    setSmokingValue(getInitialSidebarSmoking(activeFilters));
    setCleanlinessValue(getInitialSidebarCleanliness(activeFilters));
    setGuestValue(getInitialSidebarGuestFrequency(activeFilters));
  }, [activeFilters]);

  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current !== null) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  const handleReaction = useCallback(
    (reaction: DiscoverReaction, callback?: () => void) => {
      if (pendingReaction) {
        return;
      }

      setPendingReaction(reaction);

      if (reactionTimeoutRef.current !== null) {
        window.clearTimeout(reactionTimeoutRef.current);
      }

      reactionTimeoutRef.current = window.setTimeout(() => {
        reactionTimeoutRef.current = null;
        callback?.();
        setPendingReaction(null);
      }, 700);
    },
    [pendingReaction]
  );

  function handleApplyDesktopFilters() {
    const nextFilters: UserFilters = {};
    const { min, max } = parseBudgetInput(budgetValue);

    if (typeof min === 'number') {
      nextFilters.budgetMin = min;
    }

    if (typeof max === 'number') {
      nextFilters.budgetMax = max;
    }

    if (moveInDateValue.trim()) {
      nextFilters.moveInDate = moveInDateValue.trim();
    }

    if (noiseValue === 'quiet') {
      nextFilters.noiseLevel = 'quiet';
    } else if (noiseValue === 'normal') {
      nextFilters.noiseLevel = 'moderate';
    } else if (noiseValue === 'loud') {
      nextFilters.noiseLevel = 'social';
    }

    if (smokingValue === 'no') {
      nextFilters.smokingPreference = 'no';
    } else if (smokingValue === 'outside') {
      nextFilters.smokingPreference = 'outside_only';
    } else if (smokingValue === 'yes') {
      nextFilters.smokingPreference = 'yes';
    }

    if (cleanlinessValue === 'high') {
      nextFilters.cleanliness = 'high';
    } else if (cleanlinessValue === 'medium') {
      nextFilters.cleanliness = 'medium';
    } else if (cleanlinessValue === 'low') {
      nextFilters.cleanliness = 'low';
    }

    if (guestValue === 'rarely') {
      nextFilters.guestFrequency = 'rarely';
    } else if (guestValue === 'sometimes') {
      nextFilters.guestFrequency = 'sometimes';
    } else if (guestValue === 'often') {
      nextFilters.guestFrequency = 'often';
    }

    onApplyFilters?.(nextFilters);
  }

  return (
    <section className="discover-page">
      <div className="discover-page__mobile">
        <div className="discover-mobile__top">
          <Title level={1} className="discover-mobile__title">
            Поиск
          </Title>

          <Button type="default" className="discover-mobile__filters" onClick={onOpenFilters}>
            <span>Фильтры</span>
            <span className="discover-mobile__filters-icon">↗</span>
          </Button>
        </div>

        {currentUser ? (
          <>
            <div className="discover-mobile__stack">
              <div className="discover-mobile__stack-layer discover-mobile__stack-layer--back" />
              <div className="discover-mobile__stack-layer discover-mobile__stack-layer--middle" />

              <ProfileCard
                user={currentUser}
                variant="discover"
                showActions={false}
                onOpenProfile={onOpenProfile}
              />
            </div>

            {pendingReaction ? (
              <div className="discover-mobile__feedback">
                <ReactionFeedback
                  reaction={pendingReaction}
                  messages={DISCOVER_REACTION_FEEDBACK}
                  variant="discover"
                />
              </div>
            ) : null}

            <div className="discover-mobile__actions">
              <SkipProfileButton
                className="discover-mobile__action discover-mobile__action--skip"
                ariaLabel="Пропустить"
                onClick={() => handleReaction('skip', () => onSkip?.(currentUser))}
                disabled={Boolean(pendingReaction)}
              >
                ✕
              </SkipProfileButton>

              <SuperLikeProfileButton
                className="discover-mobile__action discover-mobile__action--super"
                ariaLabel="Супер-лайк"
                onClick={() => handleReaction('superlike', () => onSuperLike?.(currentUser))}
                disabled={Boolean(pendingReaction)}
              >
                ★
              </SuperLikeProfileButton>

              <LikeProfileButton
                className="discover-mobile__action discover-mobile__action--like"
                ariaLabel="Лайк"
                onClick={() => handleReaction('like', () => onLike?.(currentUser))}
                disabled={Boolean(pendingReaction)}
              >
                ♥
              </LikeProfileButton>
            </div>
          </>
        ) : emptyState ? (
          <DiscoverEmptyState
            title={emptyState.title}
            text={emptyState.text}
            buttonText={emptyState.buttonText}
            onButtonClick={onOpenFilters}
          />
        ) : null}

        <BottomNav
          classNamePrefix="discover-mobile"
          items={[
            { key: 'discover', label: 'Поиск', active: true },
            { key: 'matches', label: 'Матчи' },
            { key: 'chats', label: 'Чаты' },
            { key: 'profile', label: 'Профиль' },
          ]}
        />
      </div>

      <div className="discover-page__desktop">
        <aside className="discover-panel">
          <div className="discover-panel__head">
            <Title level={2} className="discover-panel__title">
              Фильтры
            </Title>

            <Button type="default" className="discover-panel__more-filters" onClick={onOpenFilters}>
              <span>Все фильтры</span>
              <span className="discover-panel__more-filters-icon">↗</span>
            </Button>
          </div>

          <div className="discover-panel__fields">
            <label className="discover-panel__field">
              <span>Бюджет</span>
              <Input
                value={budgetValue}
                onChange={(event) => setBudgetValue(event.target.value)}
                placeholder="20–35 тыс ₽"
              />
            </label>

            <label className="discover-panel__field">
              <span>Дата заезда</span>
              <Input
                value={moveInDateValue}
                onChange={(event) => setMoveInDateValue(event.target.value)}
                placeholder={moveInDatePlaceholder}
              />
            </label>
          </div>

          <div className="discover-panel__group">
            <p className="discover-panel__subtitle">Привычки</p>

            <div className="discover-panel__chips">
              <Button
                type="default"
                htmlType="button"
                className={[
                  'discover-chip',
                  'discover-chip--small',
                  noiseValue ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setNoiseValue((current) => getNextNoiseValue(current))}
              >
                {getNoiseLabel(noiseValue)}
              </Button>

              <Button
                type="default"
                htmlType="button"
                className={[
                  'discover-chip',
                  'discover-chip--small',
                  smokingValue ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSmokingValue((current) => getNextSmokingValue(current))}
              >
                {getSmokingLabel(smokingValue)}
              </Button>

              <Button
                type="default"
                htmlType="button"
                className={[
                  'discover-chip',
                  'discover-chip--small',
                  cleanlinessValue ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setCleanlinessValue((current) => getNextCleanlinessValue(current))}
              >
                {getCleanlinessLabel(cleanlinessValue)}
              </Button>

              <Button
                type="default"
                htmlType="button"
                className={[
                  'discover-chip',
                  'discover-chip--small',
                  guestValue ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setGuestValue((current) => getNextGuestValue(current))}
              >
                {getGuestLabel(guestValue)}
              </Button>
            </div>
          </div>

          <div className="discover-panel__actions">
            <Button
              type="default"
              className="discover-desktop-button discover-desktop-button--soft"
              onClick={onResetFilters}
            >
              <span>Сбросить</span>
              <span className="discover-desktop-button__icon discover-desktop-button__icon--dark">
                ↗
              </span>
            </Button>

            <Button
              type="default"
              className="discover-desktop-button discover-desktop-button--primary"
              onClick={handleApplyDesktopFilters}
            >
              <span>Применить</span>
              <span className="discover-desktop-button__icon discover-desktop-button__icon--lime">
                ↗
              </span>
            </Button>
          </div>
        </aside>

        <div className="discover-feed">
          <div className="discover-feed__head">
            <Title level={2} className="discover-feed__title">
              Поиск
            </Title>
            <span className="discover-feed__count">{users.length} анкет в подборке</span>
          </div>

          {currentUser ? (
            <>
              <ProfileCard
                user={currentUser}
                variant="discover"
                compact
                showActions={false}
                onOpenProfile={onOpenProfile}
              />

              {pendingReaction ? <ReactionFeedback
                reaction={pendingReaction}
                messages={DISCOVER_REACTION_FEEDBACK}
                variant="discover"
              /> : null}

              <div className="discover-feed__actions">
                <SkipProfileButton
                  className="discover-desktop-button discover-desktop-button--soft"
                  onClick={() => handleReaction('skip', () => onSkip?.(currentUser))}
                  disabled={Boolean(pendingReaction)}
                >
                  <span>Пропуск</span>
                  <span className="discover-desktop-button__icon discover-desktop-button__icon--dark">
                    ↗
                  </span>
                </SkipProfileButton>

                <SuperLikeProfileButton
                  className="discover-desktop-button discover-desktop-button--soft"
                  onClick={() => handleReaction('superlike', () => onSuperLike?.(currentUser))}
                  disabled={Boolean(pendingReaction)}
                >
                  <span>Супер-лайк</span>
                  <span className="discover-desktop-button__icon discover-desktop-button__icon--soft">
                    ↗
                  </span>
                </SuperLikeProfileButton>

                <LikeProfileButton
                  className="discover-desktop-button discover-desktop-button--primary"
                  onClick={() => handleReaction('like', () => onLike?.(currentUser))}
                  disabled={Boolean(pendingReaction)}
                >
                  <span>Лайк</span>
                  <span className="discover-desktop-button__icon discover-desktop-button__icon--lime">
                    ↗
                  </span>
                </LikeProfileButton>
              </div>
            </>
          ) : emptyState ? (
            <DiscoverEmptyState
              title={emptyState.title}
              text={emptyState.text}
              buttonText={emptyState.buttonText}
              onButtonClick={onOpenFilters}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
