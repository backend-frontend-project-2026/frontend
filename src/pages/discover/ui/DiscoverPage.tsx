import { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import type { User, UserFilters } from '../../../entities/user';
import {
  LikeProfileButton,
  SkipProfileButton,
  SuperLikeProfileButton,
} from '../../../features/discover';
import { BottomNav } from '../../../widgets/bottom-nav';
import { ProfileCard } from '../../../widgets/profile-card';
import { getDiscoverEmptyState } from '../model';
import './discover-page.css';

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
      <h3 className="discover-empty__title">{title}</h3>
      <p className="discover-empty__text">{text}</p>
      <Button type="default" className="discover-empty__button" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  );
}

function getSidebarChips(user: User | null): string[] {
  if (!user) {
    return ['Тишина', 'Не курю', 'Аккуратно', 'Гости редко'];
  }

  const chips: string[] = [];

  chips.push(user.habits.noiseLevel === 'quiet' ? 'Тишина' : 'Норм шум');

  chips.push(user.habits.smokingPreference === 'no' ? 'Не курю' : 'Курение ок');

  chips.push(user.habits.cleanliness === 'high' ? 'Аккуратно' : 'Средне');

  chips.push(
    user.habits.guestFrequency === 'rarely' || user.habits.guestFrequency === 'never'
      ? 'Гости редко'
      : 'Гости иногда'
  );

  return chips;
}

function formatSidebarBudget(filters?: UserFilters) {
  const min = filters?.budgetMin;
  const max = filters?.budgetMax;

  if (typeof min === 'number' && typeof max === 'number') {
    return `${min}–${max} тыс ₽`;
  }

  if (typeof min === 'number') {
    return `от ${min} тыс ₽`;
  }

  if (typeof max === 'number') {
    return `до ${max} тыс ₽`;
  }

  return '20–35 тыс ₽';
}

function formatSidebarMoveInDate(filters?: UserFilters) {
  if (filters?.moveInDate && filters.moveInDate.trim()) {
    return filters.moveInDate;
  }

  return 'любая';
}

type SidebarNoiseValue = 'quiet' | 'normal' | 'loud' | '';
type SidebarSmokingValue = 'no' | 'outside' | 'yes' | '';
type SidebarCleanlinessValue = 'high' | 'medium' | 'low' | '';
type SidebarGuestValue = 'rarely' | 'sometimes' | 'often' | '';

function getInitialSidebarNoise(filters?: UserFilters): SidebarNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

function getInitialSidebarSmoking(filters?: UserFilters): SidebarSmokingValue {
  if (filters?.smokingPreference === 'no') return 'no';
  if (filters?.smokingPreference === 'outside_only') return 'outside';
  if (filters?.smokingPreference === 'yes') return 'yes';
  return '';
}

function getNoiseLabel(value: SidebarNoiseValue) {
  if (value === 'quiet') return 'Тишина';
  if (value === 'normal') return 'Норм шум';
  if (value === 'loud') return 'Шумно';
  return 'Шум';
}

function getSmokingLabel(value: SidebarSmokingValue) {
  if (value === 'no') return 'Не курю';
  if (value === 'outside') return 'Только на улице';
  if (value === 'yes') return 'Курение ок';
  return 'Курение';
}

function getNextNoiseValue(value: SidebarNoiseValue): SidebarNoiseValue {
  if (value === '') return 'quiet';
  if (value === 'quiet') return 'normal';
  if (value === 'normal') return 'loud';
  return '';
}

function getNextSmokingValue(value: SidebarSmokingValue): SidebarSmokingValue {
  if (value === '') return 'no';
  if (value === 'no') return 'outside';
  if (value === 'outside') return 'yes';
  return '';
}

function parseBudgetInput(value: string) {
  const values = value.match(/\d+/g) ?? [];
  const min = values[0] ? Number(values[0]) : undefined;
  const max = values[1] ? Number(values[1]) : undefined;

  return {
    min: Number.isNaN(min) ? undefined : min,
    max: Number.isNaN(max) ? undefined : max,
  };
}

function getInitialSidebarCleanliness(filters?: UserFilters): SidebarCleanlinessValue {
  if (filters?.cleanliness === 'high') return 'high';
  if (filters?.cleanliness === 'medium') return 'medium';
  if (filters?.cleanliness === 'low') return 'low';
  return '';
}

function getInitialSidebarGuestFrequency(filters?: UserFilters): SidebarGuestValue {
  if (filters?.guestFrequency === 'rarely') return 'rarely';
  if (filters?.guestFrequency === 'sometimes') return 'sometimes';
  if (filters?.guestFrequency === 'often') return 'often';
  return '';
}

function getCleanlinessLabel(value: SidebarCleanlinessValue) {
  if (value === 'high') return 'Аккуратно';
  if (value === 'medium') return 'Средне';
  if (value === 'low') return 'Не важно';
  return 'Чистота';
}

function getGuestLabel(value: SidebarGuestValue) {
  if (value === 'rarely') return 'Гости редко';
  if (value === 'sometimes') return 'Гости иногда';
  if (value === 'often') return 'Гости часто';
  return 'Гости';
}

function getNextCleanlinessValue(value: SidebarCleanlinessValue): SidebarCleanlinessValue {
  if (value === '') return 'high';
  if (value === 'high') return 'medium';
  if (value === 'medium') return 'low';
  return '';
}

function getNextGuestValue(value: SidebarGuestValue): SidebarGuestValue {
  if (value === '') return 'rarely';
  if (value === 'rarely') return 'sometimes';
  if (value === 'sometimes') return 'often';
  return '';
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

  useEffect(() => {
    setBudgetValue(formatSidebarBudget(activeFilters));
    setMoveInDateValue(activeFilters?.moveInDate ?? '');
    setNoiseValue(getInitialSidebarNoise(activeFilters));
    setSmokingValue(getInitialSidebarSmoking(activeFilters));
    setCleanlinessValue(getInitialSidebarCleanliness(activeFilters));
    setGuestValue(getInitialSidebarGuestFrequency(activeFilters));
  }, [activeFilters]);

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
          <h1 className="discover-mobile__title">Поиск</h1>

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

            <div className="discover-mobile__actions">
              <SkipProfileButton
                className="discover-mobile__action discover-mobile__action--skip"
                ariaLabel="Пропустить"
                onClick={() => onSkip?.(currentUser)}
              >
                ✕
              </SkipProfileButton>

              <SuperLikeProfileButton
                className="discover-mobile__action discover-mobile__action--super"
                ariaLabel="Супер-лайк"
                onClick={() => onSuperLike?.(currentUser)}
              >
                ★
              </SuperLikeProfileButton>

              <LikeProfileButton
                className="discover-mobile__action discover-mobile__action--like"
                ariaLabel="Лайк"
                onClick={() => onLike?.(currentUser)}
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
            <h2 className="discover-panel__title">Фильтры</h2>

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
            <h2 className="discover-feed__title">Поиск</h2>
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

              <div className="discover-feed__actions">
                <SkipProfileButton
                  className="discover-desktop-button discover-desktop-button--soft"
                  onClick={() => onSkip?.(currentUser)}
                >
                  <span>Пропуск</span>
                  <span className="discover-desktop-button__icon discover-desktop-button__icon--dark">
                    ↗
                  </span>
                </SkipProfileButton>

                <SuperLikeProfileButton
                  className="discover-desktop-button discover-desktop-button--soft"
                  onClick={() => onSuperLike?.(currentUser)}
                >
                  <span>Супер-лайк</span>
                  <span className="discover-desktop-button__icon discover-desktop-button__icon--soft">
                    ↗
                  </span>
                </SuperLikeProfileButton>

                <LikeProfileButton
                  className="discover-desktop-button discover-desktop-button--primary"
                  onClick={() => onLike?.(currentUser)}
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
