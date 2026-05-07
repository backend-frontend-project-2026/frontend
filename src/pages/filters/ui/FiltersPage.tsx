import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Switch, Typography } from 'antd';
import type { FilterParams, User } from '../../../entities/user';
import {
  EMPTY_HABIT_REFERENCES,
  referencesApi,
  type HabitReferenceMap,
  type ReferenceSelectOption,
} from '../../../shared/api';
import {
  applyFiltersToUsers,
  ApplyFiltersButton,
  hasActiveFilters,
  ResetFiltersButton,
} from '../../../features/discover';
import './filters-page.css';

import {
  formatStayDuration,
  getInitialAlcohol,
  getInitialDesktopNoise,
  getInitialDesktopPets,
  getInitialDesktopSmoking,
  getInitialGender,
  getInitialHousingType,
  getInitialMobileNoise,
  getInitialRoomOrder,
  getInitialSleepSchedule,
  normalizeBudgetValue,
  parseStayDurationValue,
  STAY_DURATION_PROMPT_TEXT,
} from '../lib/filtersPageGetters';

import type {
  AlcoholValue,
  DesktopNoiseValue,
  DesktopPetsValue,
  DesktopSmokingValue,
  MobileNoiseValue,
  RoomOrderValue,
  SleepScheduleValue,
  StayDurationValue,
} from '../lib/types';

import {
  DEFAULT_BUDGET_MAX,
  DEFAULT_BUDGET_MIN,
  DEFAULT_MOVE_IN_DATE,
  DEFAULT_STAY_DURATION,
} from '../lib/defaultFilters';

const { Title } = Typography;

type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type NonEmptyValue<T> = Exclude<T, ''>;

const NOISE_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<MobileNoiseValue>>> = [
  { value: 'quiet', label: 'Тишина' },
  { value: 'moderate', label: 'Норм' },
  { value: 'social', label: 'Шумно' },
];

const SLEEP_SCHEDULE_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<SleepScheduleValue>>> = [
  { value: 'early_bird', label: 'Жаворонок' },
  { value: 'night_owl', label: 'Сова' },
  { value: 'flexible', label: 'Гибкий' },
];

const ALCOHOL_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<AlcoholValue>>> = [
  { value: 'no', label: 'Не пью' },
  { value: 'rarely', label: 'Редко' },
  { value: 'socially', label: 'В компании' },
  { value: 'yes', label: 'Да' },
];

const ROOM_ORDER_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<RoomOrderValue>>> = [
  { value: 'strict', label: 'Строго' },
  { value: 'balanced', label: 'Баланс' },
  { value: 'flexible', label: 'Гибко' },
];

const SMOKING_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<DesktopSmokingValue>>> = [
  { value: 'no', label: 'Не курю' },
  { value: 'yes', label: 'Курю' },
  { value: 'outside_only', label: 'Только на улице' },
];

const PETS_FALLBACK_OPTIONS: Array<ChipOption<NonEmptyValue<DesktopPetsValue>>> = [
  { value: 'pet_friendly', label: 'Ок' },
  { value: 'no_pets', label: 'Не ок' },
  { value: 'has_pets', label: 'Есть питомец' },
];

function getReferenceChipOptions<T extends string>(
  options: ReferenceSelectOption[],
  fallbackOptions: Array<ChipOption<T>>
): Array<ChipOption<T>> {
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

type FiltersPageProps = {
  initialFilters?: FilterParams;
  currentUserUniversity?: string;
  currentUserLocation?: string;
  usersForPreview?: User[];
  onBack?: () => void;
  onApply?: (filters: FilterParams) => void;
};

function FilterChip({
  label,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      type="default"
      className={[
        'filters-chip',
        compact ? 'filters-chip--compact' : '',
        selected ? 'is-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <span className="filters-chip__dot" />
      <span>{label}</span>
    </Button>
  );
}

function FilterToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="filters-toggle-row"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <span className="filters-toggle-row__label">{label}</span>

      <Switch
        checked={checked}
        className="filters-toggle"
        onChange={onToggle}
        onClick={(_, event) => event.stopPropagation()}
      />
    </div>
  );
}

export function FiltersPage({
  initialFilters,
  currentUserUniversity,
  currentUserLocation,
  usersForPreview = [],
  onBack,
  onApply,
}: FiltersPageProps) {
  const [onlyDormitory, setOnlyDormitory] = useState(
    getInitialHousingType(initialFilters) === 'dormitory'
  );
  const [onlyRental, setOnlyRental] = useState(getInitialHousingType(initialFilters) === 'rental');
  const [petsAllowedMobile, setPetsAllowedMobile] = useState(
    initialFilters?.petPreference === 'pet_friendly'
  );
  const [noSmokingMobile, setNoSmokingMobile] = useState(
    initialFilters?.smokingPreference === 'no'
  );
  const [femaleOnly, setFemaleOnly] = useState(getInitialGender(initialFilters) === 'female');
  const [maleOnly, setMaleOnly] = useState(getInitialGender(initialFilters) === 'male');
  const [mobileNoise, setMobileNoise] = useState<MobileNoiseValue>(
    getInitialMobileNoise(initialFilters)
  );

  const [desktopSmoking, setDesktopSmoking] = useState<DesktopSmokingValue>(
    getInitialDesktopSmoking(initialFilters)
  );
  const [desktopNoise, setDesktopNoise] = useState<DesktopNoiseValue>(
    getInitialDesktopNoise(initialFilters)
  );
  const [desktopPets, setDesktopPets] = useState<DesktopPetsValue>(
    getInitialDesktopPets(initialFilters)
  );

  const [budgetMin, setBudgetMin] = useState(
    initialFilters?.budgetMin?.toString() ?? DEFAULT_BUDGET_MIN
  );
  const [budgetMax, setBudgetMax] = useState(
    initialFilters?.budgetMax?.toString() ?? DEFAULT_BUDGET_MAX
  );
  const [ageMin, setAgeMin] = useState(initialFilters?.ageMin?.toString() ?? '');
  const [ageMax, setAgeMax] = useState(initialFilters?.ageMax?.toString() ?? '');

  const [moveInDate, setMoveInDate] = useState(initialFilters?.moveInDate ?? DEFAULT_MOVE_IN_DATE);
  const [stayDuration, setStayDuration] = useState<StayDurationValue>(
    (initialFilters?.stayDuration as StayDurationValue) ?? DEFAULT_STAY_DURATION
  );

  const [university, setUniversity] = useState(initialFilters?.university ?? '');
  const [district, setDistrict] = useState(initialFilters?.district ?? '');
  const [location, setLocation] = useState(initialFilters?.location ?? '');

  const [faculty, setFaculty] = useState(initialFilters?.faculty ?? '');
  const [course, setCourse] = useState(initialFilters?.course ?? '');
  const [rentalCriteria, setRentalCriteria] = useState(initialFilters?.rentalCriteria ?? '');

  const [sameUniversityOnly, setSameUniversityOnly] = useState(
    Boolean(currentUserUniversity) && initialFilters?.university === currentUserUniversity
  );

  const [sameLocationOnly, setSameLocationOnly] = useState(
    Boolean(currentUserLocation) && initialFilters?.location === currentUserLocation
  );

  const [sleepSchedule, setSleepSchedule] = useState<SleepScheduleValue>(
    getInitialSleepSchedule(initialFilters)
  );
  const [quietOnly, setQuietOnly] = useState(Boolean(initialFilters?.quietOnly));

  const [alcoholPreference, setAlcoholPreference] = useState<AlcoholValue>(
    getInitialAlcohol(initialFilters)
  );

  const [roomOrderPreference, setRoomOrderPreference] = useState<RoomOrderValue>(
    getInitialRoomOrder(initialFilters)
  );

  const [habitReferences, setHabitReferences] =
    useState<HabitReferenceMap>(EMPTY_HABIT_REFERENCES);

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

  const noiseOptions = getReferenceChipOptions(
    habitReferences.noiseLevel,
    NOISE_FALLBACK_OPTIONS
  );

  const sleepScheduleOptions = getReferenceChipOptions(
    habitReferences.sleepSchedule,
    SLEEP_SCHEDULE_FALLBACK_OPTIONS
  );

  const alcoholOptions = getReferenceChipOptions(
    habitReferences.alcoholPreference,
    ALCOHOL_FALLBACK_OPTIONS
  );

  const roomOrderOptions = getReferenceChipOptions(
    habitReferences.roomOrderPreference,
    ROOM_ORDER_FALLBACK_OPTIONS
  );

  const smokingOptions = getReferenceChipOptions(
    habitReferences.smokingPreference,
    SMOKING_FALLBACK_OPTIONS
  );

  const petsOptions = getReferenceChipOptions(
    habitReferences.petPreference,
    PETS_FALLBACK_OPTIONS
  );

  function resetAll() {
    setOnlyDormitory(false);
    setOnlyRental(false);
    setPetsAllowedMobile(false);
    setNoSmokingMobile(false);
    setFemaleOnly(false);
    setMaleOnly(false);
    setMobileNoise('');

    setDesktopSmoking('');
    setDesktopNoise('');
    setDesktopPets('');

    setBudgetMin(DEFAULT_BUDGET_MIN);
    setBudgetMax(DEFAULT_BUDGET_MAX);
    setAgeMin('');
    setAgeMax('');
    setMoveInDate(DEFAULT_MOVE_IN_DATE);
    setStayDuration(DEFAULT_STAY_DURATION);

    setUniversity('');
    setDistrict('');
    setLocation('');
    setFaculty('');
    setCourse('');
    setRentalCriteria('');
    setSameUniversityOnly(false);
    setSameLocationOnly(false);
    setSleepSchedule('');
    setQuietOnly(false);
    setAlcoholPreference('');
    setRoomOrderPreference('');
  }

  const liveFilters = useMemo<FilterParams>(() => {
    const filters: FilterParams = {};

    const min = Number(budgetMin);
    const max = Number(budgetMax);

    if (!Number.isNaN(min) && budgetMin !== DEFAULT_BUDGET_MIN) {
      filters.budgetMin = min;
    }

    if (!Number.isNaN(max) && budgetMax !== DEFAULT_BUDGET_MAX) {
      filters.budgetMax = max;
    }

    const minAge = Number(ageMin);
    const maxAge = Number(ageMax);

    if (!Number.isNaN(minAge) && ageMin !== '') {
      filters.ageMin = minAge;
    }

    if (!Number.isNaN(maxAge) && ageMax !== '') {
      filters.ageMax = maxAge;
    }

    if (moveInDate && moveInDate !== DEFAULT_MOVE_IN_DATE) {
      filters.moveInDate = moveInDate;
    }

    if (stayDuration && stayDuration !== DEFAULT_STAY_DURATION) {
      filters.stayDuration = stayDuration;
    }

    const resolvedUniversity = sameUniversityOnly
      ? (currentUserUniversity?.trim() ?? '')
      : university.trim();

    if (faculty.trim()) {
      filters.faculty = faculty.trim();
    }

    if (course.trim()) {
      filters.course = course.trim();
    }

    if (resolvedUniversity) {
      filters.university = resolvedUniversity;
    }

    if (district.trim()) {
      filters.district = district.trim();
    }

    const resolvedLocation = sameLocationOnly
      ? (currentUserLocation?.trim() ?? '')
      : location.trim();

    if (rentalCriteria.trim()) {
      filters.rentalCriteria = rentalCriteria.trim();
    }

    if (resolvedLocation) {
      filters.location = resolvedLocation;
    }

    if (onlyDormitory) {
      filters.housingType = 'dormitory';
    } else if (onlyRental) {
      filters.housingType = 'rental';
    }

    if (femaleOnly) {
      filters.gender = 'female';
    } else if (maleOnly) {
      filters.gender = 'male';
    }

    const selectedNoise = mobileNoise || desktopNoise;

    if (selectedNoise) {
      filters.noiseLevel = selectedNoise;
    }

    if (sleepSchedule) {
      filters.sleepSchedule = sleepSchedule;
    }
    if (quietOnly) {
      filters.quietOnly = true;
    }

    if (alcoholPreference) {
      filters.alcoholPreference = alcoholPreference;
    }

    if (roomOrderPreference) {
      filters.roomOrderPreference = roomOrderPreference;
    }

    if (noSmokingMobile || desktopSmoking === 'no') {
      filters.smokingPreference = 'no';
    } else if (desktopSmoking) {
      filters.smokingPreference = desktopSmoking;
    }

    if (petsAllowedMobile) {
      filters.petPreference = 'pet_friendly';
    } else if (desktopPets) {
      filters.petPreference = desktopPets;
    }

    return filters;
  }, [
    onlyDormitory,
    onlyRental,
    petsAllowedMobile,
    noSmokingMobile,
    femaleOnly,
    maleOnly,
    mobileNoise,
    desktopSmoking,
    desktopNoise,
    desktopPets,
    budgetMin,
    budgetMax,
    ageMin,
    ageMax,
    moveInDate,
    stayDuration,
    university,
    district,
    location,
    faculty,
    course,
    rentalCriteria,
    sameUniversityOnly,
    sameLocationOnly,
    sleepSchedule,
    quietOnly,
    alcoholPreference,
    roomOrderPreference,
    currentUserUniversity,
    currentUserLocation,
  ]);

  function editBudgetRange() {
    const nextMinRaw = window.prompt('Минимальный бюджет, тыс ₽', budgetMin);

    if (nextMinRaw === null) {
      return;
    }

    const nextMaxRaw = window.prompt('Максимальный бюджет, тыс ₽', budgetMax);

    if (nextMaxRaw === null) {
      return;
    }

    const nextMin = normalizeBudgetValue(nextMinRaw, budgetMin);
    const nextMax = normalizeBudgetValue(nextMaxRaw, budgetMax);

    if (Number(nextMin) <= Number(nextMax)) {
      setBudgetMin(nextMin);
      setBudgetMax(nextMax);
      return;
    }

    setBudgetMin(nextMax);
    setBudgetMax(nextMin);
  }

  void editBudgetRange;

  function editStayDuration() {
    const nextValueRaw = window.prompt(STAY_DURATION_PROMPT_TEXT, formatStayDuration(stayDuration));

    if (nextValueRaw === null) {
      return;
    }

    const nextValue = parseStayDurationValue(nextValueRaw);

    if (!nextValue) {
      return;
    }

    setStayDuration(nextValue);
  }

  function applyFilters() {
    onApply?.(liveFilters);
  }

  const previewCount = useMemo(
    () => applyFiltersToUsers(usersForPreview, liveFilters).length,
    [usersForPreview, liveFilters]
  );

  const hasLiveFilters = hasActiveFilters(liveFilters);
  const hasPreviewData = usersForPreview.length > 0;
  const showNoPreviewData = !hasPreviewData;
  const showIdlePreview = hasPreviewData && !hasLiveFilters;
  const showEmptyPreview = hasPreviewData && hasLiveFilters && previewCount === 0;

  return (
    <section className="filters-page">
      <div className="filters-page__mobile">
        <div className="filters-mobile__top">
          <Title level={1} className="filters-mobile__title">
            Фильтры
          </Title>

          <Button
            type="text"
            className="filters-mobile__close"
            aria-label="Закрыть фильтры"
            onClick={onBack}
          />
        </div>

        <div className="filters-mobile__card">
          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Бюджет</span>
              <Input
                className="filters-field__input"
                value={[budgetMin, budgetMax].filter(Boolean).join('-')}
                onChange={(event) => {
                  const values = event.target.value.match(/\d+/g) ?? [];
                  setBudgetMin(values[0] ?? '');
                  setBudgetMax(values[1] ?? '');
                }}
                placeholder="20-35 тыс ₽"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Возраст</span>
              <Input
                className="filters-field__input"
                value={[ageMin, ageMax].filter(Boolean).join('-')}
                onChange={(event) => {
                  const values = event.target.value.match(/\d+/g) ?? [];
                  setAgeMin(values[0] ?? '');
                  setAgeMax(values[1] ?? '');
                }}
                placeholder="18-23"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Дата заезда</span>
              <Input
                className="filters-field__input"
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
                placeholder="01.09.2026"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Вуз</span>
              <Input
                className="filters-field__input"
                value={university}
                onChange={(event) => setUniversity(event.target.value)}
                placeholder="КФУ"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Факультет</span>
              <Input
                className="filters-field__input"
                value={faculty}
                onChange={(event) => setFaculty(event.target.value)}
                placeholder="Институт ИТИС"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Курс</span>
              <Input
                className="filters-field__input"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                placeholder="2 курс"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Район</span>
              <Input
                className="filters-field__input"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                placeholder="Приволжский район"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Общежитие / локация</span>
              <Input
                className="filters-field__input"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Деревня Универсиады, корпус 3"
              />
            </label>
          </section>

          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Критерии съёма</span>
              <Input
                className="filters-field__input"
                value={rentalCriteria}
                onChange={(event) => setRentalCriteria(event.target.value)}
                placeholder="мебель, 2 комнаты, рабочее место"
              />
            </label>
          </section>

          <section className="filters-block">
            <Title level={2} className="filters-block__title">
              Уточнения
            </Title>

            <div className="filters-mobile__toggles">
              {currentUserUniversity ? (
                <FilterToggle
                  label="Только мой вуз"
                  checked={sameUniversityOnly}
                  onToggle={() => {
                    const nextValue = !sameUniversityOnly;
                    setSameUniversityOnly(nextValue);
                    if (nextValue) {
                      setUniversity(currentUserUniversity);
                    }
                  }}
                />
              ) : null}

              {currentUserLocation ? (
                <FilterToggle
                  label="Только моё общежитие"
                  checked={sameLocationOnly}
                  onToggle={() => {
                    const nextValue = !sameLocationOnly;
                    setSameLocationOnly(nextValue);
                    if (nextValue) {
                      setLocation(currentUserLocation);
                    }
                  }}
                />
              ) : null}

              <FilterToggle
                label="Только общежитие"
                checked={onlyDormitory}
                onToggle={() => {
                  const nextValue = !onlyDormitory;
                  setOnlyDormitory(nextValue);
                  if (nextValue) {
                    setOnlyRental(false);
                  }
                }}
              />

              <FilterToggle
                label="Только съём"
                checked={onlyRental}
                onToggle={() => {
                  const nextValue = !onlyRental;
                  setOnlyRental(nextValue);
                  if (nextValue) {
                    setOnlyDormitory(false);
                  }
                }}
              />

              <FilterToggle
                label="С питомцами ок"
                checked={petsAllowedMobile}
                onToggle={() => setPetsAllowedMobile((current) => !current)}
              />

              <FilterToggle
                label="Без курения"
                checked={noSmokingMobile}
                onToggle={() => setNoSmokingMobile((current) => !current)}
              />

              <FilterToggle
                label="Тихие часы"
                checked={quietOnly}
                onToggle={() => setQuietOnly((current) => !current)}
              />

              <div className="filters-mobile__gender-label">Пол:</div>

              <FilterToggle
                label="Женский"
                checked={femaleOnly}
                onToggle={() => {
                  const nextValue = !femaleOnly;
                  setFemaleOnly(nextValue);
                  if (nextValue) {
                    setMaleOnly(false);
                  }
                }}
              />

              <FilterToggle
                label="Мужской"
                checked={maleOnly}
                onToggle={() => {
                  const nextValue = !maleOnly;
                  setMaleOnly(nextValue);
                  if (nextValue) {
                    setFemaleOnly(false);
                  }
                }}
              />
            </div>
          </section>

          <section className="filters-block">
            <Title level={2} className="filters-block__title">
              Тишина / Чистота
            </Title>

            <div className="filters-mobile__chips">
              {noiseOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={mobileNoise === option.value}
                  onClick={() => setMobileNoise(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-block">
            <Title level={2} className="filters-block__title">
              Режим сна
            </Title>

            <div className="filters-mobile__chips">
              {sleepScheduleOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={sleepSchedule === option.value}
                  onClick={() => setSleepSchedule(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-block">
            <Title level={2} className="filters-block__title">
              Алкоголь
            </Title>

            <div className="filters-mobile__chips">
              {alcoholOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={alcoholPreference === option.value}
                  onClick={() => setAlcoholPreference(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-block">
            <Title level={2} className="filters-block__title">
              Порядок в комнате
            </Title>

            <div className="filters-mobile__chips">
              {roomOrderOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={roomOrderPreference === option.value}
                  onClick={() => setRoomOrderPreference(option.value)}
                />
              ))}
            </div>
          </section>
        </div>

        {showNoPreviewData ? (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Нет данных для предпросмотра
            </Title>
            <p className="filters-preview-state__text">
              Локальная подборка пока пустая. Фильтры всё равно можно настроить и применить.
            </p>
          </section>
        ) : showEmptyPreview ? (
          <section className="filters-preview-state filters-preview-state--warning">
            <Title level={3} className="filters-preview-state__title">
              Ничего не найдено
            </Title>
            <p className="filters-preview-state__text">
              По текущим фильтрам нет подходящих анкет. Измени параметры перед применением.
            </p>
          </section>
        ) : showIdlePreview ? (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Предпросмотр фильтров
            </Title>
            <p className="filters-preview-state__text">
              Измени параметры, и здесь появится локальный результат до применения.
            </p>
          </section>
        ) : (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Предпросмотр
            </Title>
            <p className="filters-preview-state__text">Подходит анкет: {previewCount}</p>
          </section>
        )}

        <div className="filters-mobile__actions">
          <ResetFiltersButton
            className="filters-action-button filters-action-button--ghost"
            onClick={resetAll}
          >
            <>
              <span>Сбросить</span>
              <span className="filters-action-button__icon filters-action-button__icon--dark">
                ↗
              </span>
            </>
          </ResetFiltersButton>

          <ApplyFiltersButton
            className="filters-action-button filters-action-button--primary"
            onClick={applyFilters}
          >
            <>
              <span>Применить</span>
              <span className="filters-action-button__icon filters-action-button__icon--lime">
                ↗
              </span>
            </>
          </ApplyFiltersButton>
        </div>
      </div>

      <div className="filters-page__desktop">
        <div className="filters-desktop__head">
          <Title level={1} className="filters-desktop__title">
            Фильтры
          </Title>
          <p className="filters-desktop__subtitle">
            Настрой подбор под себя — можно сбросить в любой момент.
          </p>
        </div>

        <div className="filters-desktop__card">
          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Бюджет</span>
              <Input
                value={[budgetMin, budgetMax].filter(Boolean).join('-')}
                onChange={(event) => {
                  const values = event.target.value.match(/\d+/g) ?? [];
                  setBudgetMin(values[0] ?? '');
                  setBudgetMax(values[1] ?? '');
                }}
                placeholder="20-35 тыс ₽"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Возраст</span>
              <Input
                value={[ageMin, ageMax].filter(Boolean).join('-')}
                onChange={(event) => {
                  const values = event.target.value.match(/\d+/g) ?? [];
                  setAgeMin(values[0] ?? '');
                  setAgeMax(values[1] ?? '');
                }}
                placeholder="18-23"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Дата заезда</span>
              <Input
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
                placeholder="01.09.2026"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Срок аренды</span>
              <Input
                value={formatStayDuration(stayDuration)}
                onClick={editStayDuration}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    editStayDuration();
                  }
                }}
                onChange={() => undefined}
                readOnly
                aria-label="Срок аренды"
                title={formatStayDuration(stayDuration)}
              />
            </label>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Вуз</span>
                <Input
                  value={university}
                  onChange={(event) => setUniversity(event.target.value)}
                  placeholder="КФУ"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Факультет</span>
                <Input
                  value={faculty}
                  onChange={(event) => setFaculty(event.target.value)}
                  placeholder="Институт ИТИС"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Курс</span>
                <Input
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="2 курс"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Район</span>
                <Input
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  placeholder="Приволжский район"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Общежитие / локация</span>
                <Input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Деревня Универсиады, корпус 3"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Критерии съёма</span>
                <Input
                  value={rentalCriteria}
                  onChange={(event) => setRentalCriteria(event.target.value)}
                  placeholder="мебель, 2 комнаты, рабочее место"
                />
              </label>
            </section>

            {currentUserUniversity ? (
              <section className="filters-desktop__section">
                <FilterToggle
                  label="Только мой вуз"
                  checked={sameUniversityOnly}
                  onToggle={() => {
                    const nextValue = !sameUniversityOnly;
                    setSameUniversityOnly(nextValue);
                    if (nextValue) {
                      setUniversity(currentUserUniversity);
                    }
                  }}
                />
              </section>
            ) : null}

            {currentUserLocation ? (
              <section className="filters-desktop__section">
                <FilterToggle
                  label="Только моё общежитие"
                  checked={sameLocationOnly}
                  onToggle={() => {
                    const nextValue = !sameLocationOnly;
                    setSameLocationOnly(nextValue);
                    if (nextValue) {
                      setLocation(currentUserLocation);
                    }
                  }}
                />
              </section>
            ) : null}
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Курение
            </Title>
            <div className="filters-desktop__chips">
              {smokingOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={desktopSmoking === option.value}
                  onClick={() => setDesktopSmoking(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Алкоголь
            </Title>
            <div className="filters-desktop__chips">
              {alcoholOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={alcoholPreference === option.value}
                  onClick={() => setAlcoholPreference(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Шум
            </Title>
            <div className="filters-desktop__chips">
              {noiseOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={desktopNoise === option.value}
                  onClick={() => setDesktopNoise(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Режим сна
            </Title>
            <div className="filters-desktop__chips">
              {sleepScheduleOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={sleepSchedule === option.value}
                  onClick={() => setSleepSchedule(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Порядок в комнате
            </Title>
            <div className="filters-desktop__chips">
              {roomOrderOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={roomOrderPreference === option.value}
                  onClick={() => setRoomOrderPreference(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Животные
            </Title>
            <div className="filters-desktop__chips">
              {petsOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  compact
                  label={option.label}
                  selected={desktopPets === option.value}
                  onClick={() => setDesktopPets(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="filters-desktop__section">
            <Title level={2} className="filters-desktop__section-title">
              Тихие часы
            </Title>
            <FilterToggle
              label="Только с тихими часами"
              checked={quietOnly}
              onToggle={() => setQuietOnly((current) => !current)}
            />
          </section>
        </div>

        {showNoPreviewData ? (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Нет данных для предпросмотра
            </Title>
            <p className="filters-preview-state__text">
              Локальная подборка пока пустая. Фильтры всё равно можно настроить и применить.
            </p>
          </section>
        ) : showEmptyPreview ? (
          <section className="filters-preview-state filters-preview-state--warning">
            <Title level={3} className="filters-preview-state__title">
              Ничего не найдено
            </Title>
            <p className="filters-preview-state__text">
              По текущим фильтрам нет подходящих анкет. Измени параметры перед применением.
            </p>
          </section>
        ) : showIdlePreview ? (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Предпросмотр фильтров
            </Title>
            <p className="filters-preview-state__text">
              Измени параметры, и здесь появится локальный результат до применения.
            </p>
          </section>
        ) : (
          <section className="filters-preview-state">
            <Title level={3} className="filters-preview-state__title">
              Предпросмотр
            </Title>
            <p className="filters-preview-state__text">Подходит анкет: {previewCount}</p>
          </section>
        )}

        <div className="filters-desktop__actions">
          <ResetFiltersButton
            className="filters-action-button filters-action-button--ghost"
            onClick={resetAll}
          >
            <>
              <span>Сбросить</span>
              <span className="filters-action-button__icon filters-action-button__icon--dark">
                ↗
              </span>
            </>
          </ResetFiltersButton>

          <ApplyFiltersButton
            className="filters-action-button filters-action-button--primary"
            onClick={applyFilters}
          >
            <>
              <span>Применить</span>
              <span className="filters-action-button__icon filters-action-button__icon--lime">
                ↗
              </span>
            </>
          </ApplyFiltersButton>
        </div>
      </div>
    </section>
  );
}
