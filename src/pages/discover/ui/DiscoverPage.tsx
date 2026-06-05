import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Typography, Skeleton, Alert, message } from 'antd';
import type { User, UserFilters } from '../../../entities/user';
import {
  LikeProfileButton,
  SkipProfileButton,
  SuperLikeProfileButton,
} from '../../../features/discover';
import { ProfileCard } from '../../../widgets/profile-card';
import {
  ReactionFeedback,
  type ReactionType,
} from '../../../shared/ui/ReactionFeedback/ReactionFeedback';
import {
  EMPTY_HABIT_REFERENCES,
  referencesApi,
  type HabitReferenceMap,
  type ReferenceSelectOption,
} from '../../../shared/api';
import { getDiscoverEmptyState } from '../lib/emptyState';
import { useRoomieFlow } from '../../../app/providers/roomie-flow';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import './discover-page.css';

import {
  formatSidebarBudget,
  formatSidebarMoveInDate,
  getInitialSidebarCleanliness,
  getInitialSidebarGuestFrequency,
  getInitialSidebarNoise,
  getInitialSidebarSmoking,
  getSidebarChips,
  parseBudgetInput,
} from '../lib/discoverPageGetters';

import type {
  SidebarCleanlinessValue,
  SidebarGuestValue,
  SidebarNoiseValue,
  SidebarSmokingValue,
} from '../lib/types';
import { BottomNav } from '../../../widgets/bottom-nav';

// Компонент для доступности карточки

interface AccessibleProfileCardProps {
  user: User;
  variant: 'discover';
  compact?: boolean;
  onOpenProfile?: (user: User) => void;
  onLike: (user: User) => void;
  onReaction?: (reaction: DiscoverReaction, callback?: () => void) => void;
  swipeDirection?: 'left' | 'right' | 'up' | null;
}

function AccessibleProfileCard({
  user,
  variant,
  compact,
  onOpenProfile,
  onLike,
  onReaction,
  swipeDirection,
}: AccessibleProfileCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onReaction) {
        onReaction('like', () => onLike(user));
      } else {
        onLike(user);
      }
    }
  };

  const handleClick = () => {
    onOpenProfile?.(user);
  };

  const swipeClass = swipeDirection ? `discover-card--swipe-${swipeDirection}` : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      aria-label={`Открыть профиль (клик) или поставить лайк (Enter/Space) пользователю ${user.name}`}
      className={swipeClass}
    >
      <ProfileCard
        user={user}
        variant={variant}
        compact={compact}
        showActions={false}
      />
    </div>
  );
}

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

type SidebarOption<T extends string> = {
  value: T;
  label: string;
};

type NonEmptyValue<T> = Exclude<T, ''>;

const SIDEBAR_NOISE_FALLBACK_OPTIONS: Array<SidebarOption<NonEmptyValue<SidebarNoiseValue>>> = [
  { value: 'quiet', label: 'Тишина' },
  { value: 'moderate', label: 'Норм шум' },
  { value: 'social', label: 'Шумно' },
];

const SIDEBAR_SMOKING_FALLBACK_OPTIONS: Array<SidebarOption<NonEmptyValue<SidebarSmokingValue>>> = [
  { value: 'no', label: 'Не курю' },
  { value: 'outside_only', label: 'Только на улице' },
  { value: 'yes', label: 'Курение ок' },
];

const SIDEBAR_CLEANLINESS_FALLBACK_OPTIONS: Array<
  SidebarOption<NonEmptyValue<SidebarCleanlinessValue>>
> = [
  { value: 'high', label: 'Аккуратно' },
  { value: 'medium', label: 'Средне' },
  { value: 'low', label: 'Не важно' },
];

const SIDEBAR_GUEST_FALLBACK_OPTIONS: Array<SidebarOption<NonEmptyValue<SidebarGuestValue>>> = [
  { value: 'never', label: 'Без гостей' },
  { value: 'rarely', label: 'Гости редко' },
  { value: 'sometimes', label: 'Гости иногда' },
  { value: 'often', label: 'Гости часто' },
];

function getSidebarOptions<T extends string>(
  options: ReferenceSelectOption[],
  fallbackOptions: Array<SidebarOption<T>>
): Array<SidebarOption<T>> {
  const allowedValues = fallbackOptions.map((option) => option.value);

  const apiOptions = options
    .filter((option): option is ReferenceSelectOption & { value: T } =>
      allowedValues.includes(option.value as T)
    )
    .map((option) => ({
      value: option.value,
      label: option.label,
    }));

  return apiOptions.length > 0 ? apiOptions : fallbackOptions;
}

function getSidebarOptionLabel<T extends string>(
  value: T | '',
  options: Array<SidebarOption<T>>,
  fallbackLabel: string
): string {
  return options.find((option) => option.value === value)?.label ?? fallbackLabel;
}

function getNextSidebarOptionValue<T extends string>(
  value: T | '',
  options: Array<SidebarOption<T>>
): T | '' {
  if (options.length === 0) {
    return '';
  }

  if (!value) {
    return options[0].value;
  }

  const currentIndex = options.findIndex((option) => option.value === value);

  if (currentIndex === -1 || currentIndex === options.length - 1) {
    return '';
  }

  return options[currentIndex + 1].value;
}

type ReactionHistoryItem = {
  userId: string;
  userName: string;
  reaction: ReactionType;
  timestamp: number;
};

const MAX_HISTORY_SIZE = 100;
const HISTORY_STORAGE_KEY = 'roomie_discover_history';

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
  const { loading, error, retry } = useRoomieFlow();

  const [history, setHistory] = useLocalStorage<ReactionHistoryItem[]>(
    HISTORY_STORAGE_KEY,
    []
  );

  const addReaction = useCallback(
    (user: User, reaction: ReactionType) => {
      const newItem: ReactionHistoryItem = {
        userId: user.id,
        userName: user.name,
        reaction,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        const newHistory = [newItem, ...prev];
        return newHistory.slice(0, MAX_HISTORY_SIZE);
      });
    },
    [setHistory]
  );

  const undoLastReaction = useCallback((): ReactionHistoryItem | null => {
    if (history.length === 0) return null;

    const [first, ...rest] = history;
    setHistory(rest);
    return first;
  }, [history, setHistory]);

  const hasHistory = history.length > 0;

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
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);

  const [habitReferences, setHabitReferences] = useState<HabitReferenceMap>(EMPTY_HABIT_REFERENCES);

  const sidebarNoiseOptions = getSidebarOptions(
    habitReferences.noiseLevel,
    SIDEBAR_NOISE_FALLBACK_OPTIONS
  );

  const sidebarSmokingOptions = getSidebarOptions(
    habitReferences.smokingPreference,
    SIDEBAR_SMOKING_FALLBACK_OPTIONS
  );

  const sidebarCleanlinessOptions = getSidebarOptions(
    habitReferences.cleanliness,
    SIDEBAR_CLEANLINESS_FALLBACK_OPTIONS
  );

  const sidebarGuestOptions = getSidebarOptions(
    habitReferences.guestFrequency,
    SIDEBAR_GUEST_FALLBACK_OPTIONS
  );

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(() => {
      if (!isMounted) {
        return;
      }

      setBudgetValue(formatSidebarBudget(activeFilters));
      setMoveInDateValue(activeFilters?.moveInDate ?? '');
      setNoiseValue(getInitialSidebarNoise(activeFilters));
      setSmokingValue(getInitialSidebarSmoking(activeFilters));
      setCleanlinessValue(getInitialSidebarCleanliness(activeFilters));
      setGuestValue(getInitialSidebarGuestFrequency(activeFilters));
    });

    return () => {
      isMounted = false;
    };
  }, [activeFilters]);

  useEffect(() => {
    let isMounted = true;

    referencesApi
      .listHabitReferences()
      .then((references) => {
        if (isMounted) {
          setHabitReferences(references);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHabitReferences(EMPTY_HABIT_REFERENCES);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current !== null) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  const handleReaction = useCallback(
    (reaction: DiscoverReaction, callback?: () => void) => {
      if (pendingReaction || !currentUser) {
        return;
      }

      setPendingReaction(reaction);

      if (reaction === 'skip') {
        setSwipeDirection('left');
      } else if (reaction === 'like') {
        setSwipeDirection('right');
      } else if (reaction === 'superlike') {
        setSwipeDirection('up');
      }

      addReaction(currentUser, reaction);

      if (reactionTimeoutRef.current !== null) {
        window.clearTimeout(reactionTimeoutRef.current);
      }

      reactionTimeoutRef.current = window.setTimeout(() => {
        reactionTimeoutRef.current = null;
        callback?.();
        setPendingReaction(null);
        setSwipeDirection(null);
      }, 700);
    },
    [pendingReaction, currentUser, addReaction]
  );

  const handleUndo = useCallback(() => {
    const undone = undoLastReaction();
    if (undone) {
      message.info({
        content: `Отменено: ${undone.userName} - ${DISCOVER_REACTION_FEEDBACK[undone.reaction].title.toLowerCase()}`,
        duration: 3,
      });
    }
  }, [undoLastReaction]);

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

    if (noiseValue) {
      nextFilters.noiseLevel = noiseValue;
    }

    if (smokingValue) {
      nextFilters.smokingPreference = smokingValue;
    }

    if (cleanlinessValue) {
      nextFilters.cleanliness = cleanlinessValue;
    }

    if (guestValue) {
      nextFilters.guestFrequency = guestValue;
    }

    onApplyFilters?.(nextFilters);
  }

  const renderMobileContent = () => {
    if (loading && users.length === 0) {
      return (
        <div className="discover-mobile__skeleton">
          <Skeleton.Image active style={{ width: '100%', height: 300 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      );
    }

    if (error && users.length === 0) {
      return (
        <div className="discover-mobile__error">
          <Alert
            message="Ошибка загрузки"
            description="Не удалось загрузить анкеты. Попробуйте позже."
            type="error"
            showIcon
          />
          <Button onClick={retry} style={{ marginTop: 16 }}>
            Повторить
          </Button>
        </div>
      );
    }

    if (currentUser) {
      return (
        <>
          <div className="discover-mobile__stack">
            <div className="discover-mobile__stack-layer discover-mobile__stack-layer--back" />
            <div className="discover-mobile__stack-layer discover-mobile__stack-layer--middle" />
            <AccessibleProfileCard
              user={currentUser}
              variant="discover"
              onOpenProfile={() => onOpenProfile?.(currentUser)}
              onLike={(user) => onLike?.(user)}
              onReaction={handleReaction}
              swipeDirection={swipeDirection}
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

          {hasHistory && (
            <div className="discover-mobile__undo">
              <Button
                type="default"
                onClick={handleUndo}
                className="discover-undo-button"
                size="small"
              >
                ↶ Отменить
              </Button>
            </div>
          )}
        </>
      );
    }

    if (emptyState) {
      return (
        <DiscoverEmptyState
          title={emptyState.title}
          text={emptyState.text}
          buttonText={emptyState.buttonText}
          onButtonClick={onOpenFilters}
        />
      );
    }

    return null;
  };

  const renderDesktopContent = () => {
    if (loading && users.length === 0) {
      return (
        <div className="discover-feed__skeleton">
          <Skeleton.Image active style={{ width: 300, height: 400 }} />
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      );
    }

    if (error && users.length === 0) {
      return (
        <div className="discover-feed__error">
          <Alert
            message="Ошибка загрузки"
            description="Не удалось загрузить анкеты. Попробуйте позже."
            type="error"
            showIcon
          />
          <Button onClick={retry} style={{ marginTop: 16 }}>
            Повторить
          </Button>
        </div>
      );
    }

    if (currentUser) {
      return (
        <>
          <AccessibleProfileCard
            user={currentUser}
            variant="discover"
            compact
            onOpenProfile={() => onOpenProfile?.(currentUser)}
            onLike={(user) => onLike?.(user)}
            onReaction={handleReaction}
            swipeDirection={swipeDirection}
          />

          {pendingReaction && (
            <ReactionFeedback
              reaction={pendingReaction}
              messages={DISCOVER_REACTION_FEEDBACK}
              variant="discover"
            />
          )}

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

          {hasHistory && (
            <div className="discover-feed__undo">
              <Button
                type="default"
                onClick={handleUndo}
                className="discover-undo-button"
                size="small"
              >
                ↶ Отменить последнее
              </Button>
            </div>
          )}
        </>
      );
    }

    if (emptyState) {
      return (
        <DiscoverEmptyState
          title={emptyState.title}
          text={emptyState.text}
          buttonText={emptyState.buttonText}
          onButtonClick={onOpenFilters}
        />
      );
    }

    return null;
  };

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

        {renderMobileContent()}

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
                onClick={() =>
                  setNoiseValue((current) =>
                    getNextSidebarOptionValue(current, sidebarNoiseOptions)
                  )
                }
              >
                {getSidebarOptionLabel(noiseValue, sidebarNoiseOptions, 'Шум')}
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
                onClick={() =>
                  setSmokingValue((current) =>
                    getNextSidebarOptionValue(current, sidebarSmokingOptions)
                  )
                }
              >
                {getSidebarOptionLabel(smokingValue, sidebarSmokingOptions, 'Курение')}
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
                onClick={() =>
                  setCleanlinessValue((current) =>
                    getNextSidebarOptionValue(current, sidebarCleanlinessOptions)
                  )
                }
              >
                {getSidebarOptionLabel(cleanlinessValue, sidebarCleanlinessOptions, 'Чистота')}
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
                onClick={() =>
                  setGuestValue((current) =>
                    getNextSidebarOptionValue(current, sidebarGuestOptions)
                  )
                }
              >
                {getSidebarOptionLabel(guestValue, sidebarGuestOptions, 'Гости')}
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

          {renderDesktopContent()}
        </div>
      </div>
    </section>
  );
}