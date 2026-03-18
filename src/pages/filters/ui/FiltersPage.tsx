import { useMemo, useState } from 'react';
import type { User, UserFilters } from '../../../entities/user';
import {
  applyFiltersToUsers,
  ApplyFiltersButton,
  hasActiveFilters,
  ResetFiltersButton,
} from '../../../features/discover';
import './filters-page.css';

type FiltersPageProps = {
  initialFilters?: UserFilters;
  currentUserUniversity?: string;
  currentUserLocation?: string;
  usersForPreview?: User[];
  onBack?: () => void;
  onApply?: (filters: UserFilters) => void;
};

type MobileNoiseValue = 'quiet' | 'normal' | 'loud' | '';
type DesktopSmokingValue = 'no' | 'yes' | 'outside' | '';
type DesktopNoiseValue = 'quiet' | 'normal' | 'loud' | '';
type DesktopPetsValue = 'ok' | 'not-ok' | '';
type SleepScheduleValue = 'early_bird' | 'night_owl' | 'flexible' | '';
type StayDurationValue = '' | 'any' | '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';
type AlcoholValue = 'no' | 'rarely' | 'socially' | 'yes' | '';
type RoomOrderValue = 'strict' | 'balanced' | 'flexible' | '';

const DEFAULT_BUDGET_MIN = '';
const DEFAULT_BUDGET_MAX = '';
const DEFAULT_MOVE_IN_DATE = '';
const DEFAULT_STAY_DURATION: StayDurationValue = '';

const STAY_DURATION_PROMPT_TEXT = [
  'Выбери срок аренды:',
  '1 — 1–3 месяца',
  '2 — 3–6 месяцев',
  '3 — 6–12 месяцев',
  '4 — 12+ месяцев',
].join('\n');

function normalizeBudgetValue(value: string, fallback: string) {
  const digitsOnly = value.replace(/[^\d]/g, '');

  if (!digitsOnly) {
    return fallback;
  }

  return String(Math.max(0, Number(digitsOnly)));
}

function parseStayDurationValue(value: string): StayDurationValue | null {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === '1' ||
    normalized === '1-3 months' ||
    normalized === '1–3 месяца' ||
    normalized === '1-3 месяца'
  ) {
    return '1-3 months';
  }

  if (
    normalized === '2' ||
    normalized === '3-6 months' ||
    normalized === '3–6 месяцев' ||
    normalized === '3-6 месяцев'
  ) {
    return '3-6 months';
  }

  if (
    normalized === '3' ||
    normalized === '6-12 months' ||
    normalized === '6–12 месяцев' ||
    normalized === '6-12 месяцев' ||
    normalized === '6 месяцев'
  ) {
    return '6-12 months';
  }

  if (normalized === '4' || normalized === '12+ months' || normalized === '12+ месяцев') {
    return '12+ months';
  }

  return null;
}

function formatStayDuration(value: StayDurationValue) {
  if (value === '1-3 months') return '1–3 месяца';
  if (value === '3-6 months') return '3–6 месяцев';
  if (value === '6-12 months') return '6–12 месяцев';
  if (value === '12+ months') return '12+ месяцев';
  return '';
}

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
    <button
      type="button"
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
    </button>
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
    <button type="button" className="filters-toggle-row" onClick={onToggle}>
      <span className="filters-toggle-row__label">{label}</span>
      <span className={['filters-toggle', checked ? 'is-active' : ''].join(' ')}>
        <span className="filters-toggle__thumb" />
      </span>
    </button>
  );
}

function getInitialMobileNoise(filters?: UserFilters): MobileNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

function getInitialDesktopSmoking(filters?: UserFilters): DesktopSmokingValue {
  if (filters?.smokingPreference === 'no') return 'no';
  if (filters?.smokingPreference === 'outside_only') return 'outside';
  if (filters?.smokingPreference === 'yes') return 'yes';
  return '';
}

function getInitialDesktopNoise(filters?: UserFilters): DesktopNoiseValue {
  if (filters?.noiseLevel === 'quiet') return 'quiet';
  if (filters?.noiseLevel === 'moderate') return 'normal';
  if (filters?.noiseLevel === 'social') return 'loud';
  if (filters?.quietOnly) return 'quiet';
  return '';
}

function getInitialDesktopPets(filters?: UserFilters): DesktopPetsValue {
  if (filters?.petPreference === 'pet_friendly') return 'ok';
  if (filters?.petPreference === 'no_pets') return 'not-ok';
  return '';
}

function getInitialSleepSchedule(filters?: UserFilters): SleepScheduleValue {
  if (filters?.sleepSchedule === 'early_bird') return 'early_bird';
  if (filters?.sleepSchedule === 'night_owl') return 'night_owl';
  if (filters?.sleepSchedule === 'flexible') return 'flexible';
  return '';
}

function getInitialHousingType(filters?: UserFilters) {
  return filters?.housingType ?? 'any';
}

function getInitialGender(filters?: UserFilters) {
  return filters?.gender ?? 'any';
}

function getInitialAlcohol(filters?: UserFilters): AlcoholValue {
  if (filters?.alcoholPreference === 'no') return 'no';
  if (filters?.alcoholPreference === 'rarely') return 'rarely';
  if (filters?.alcoholPreference === 'socially') return 'socially';
  if (filters?.alcoholPreference === 'yes') return 'yes';
  return '';
}

function getInitialRoomOrder(filters?: UserFilters): RoomOrderValue {
  if (filters?.roomOrderPreference === 'strict') return 'strict';
  if (filters?.roomOrderPreference === 'balanced') return 'balanced';
  if (filters?.roomOrderPreference === 'flexible') return 'flexible';
  return '';
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

  const liveFilters = useMemo<UserFilters>(() => {
    const filters: UserFilters = {};

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

    if (selectedNoise === 'quiet') {
      filters.noiseLevel = 'quiet';
    } else if (selectedNoise === 'normal') {
      filters.noiseLevel = 'moderate';
    } else if (selectedNoise === 'loud') {
      filters.noiseLevel = 'social';
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
    } else if (desktopSmoking === 'outside') {
      filters.smokingPreference = 'outside_only';
    } else if (desktopSmoking === 'yes') {
      filters.smokingPreference = 'yes';
    }

    if (petsAllowedMobile || desktopPets === 'ok') {
      filters.petPreference = 'pet_friendly';
    } else if (desktopPets === 'not-ok') {
      filters.petPreference = 'no_pets';
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
          <h1 className="filters-mobile__title">Фильтры</h1>

          <button
            type="button"
            className="filters-mobile__close"
            aria-label="Закрыть фильтры"
            onClick={onBack}
          />
        </div>

        <div className="filters-mobile__card">
          <section className="filters-block">
            <label className="filters-field">
              <span className="filters-field__label">Бюджет</span>
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
                className="filters-field__input"
                value={rentalCriteria}
                onChange={(event) => setRentalCriteria(event.target.value)}
                placeholder="мебель, 2 комнаты, рабочее место"
              />
            </label>
          </section>

          <section className="filters-block">
            <h2 className="filters-block__title">Уточнения</h2>

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
            <h2 className="filters-block__title">Тишина / Чистота</h2>

            <div className="filters-mobile__chips">
              <FilterChip
                label="Тишина"
                selected={mobileNoise === 'quiet'}
                onClick={() => setMobileNoise('quiet')}
              />
              <FilterChip
                label="Норм"
                selected={mobileNoise === 'normal'}
                onClick={() => setMobileNoise('normal')}
              />
              <FilterChip
                label="Шумно"
                selected={mobileNoise === 'loud'}
                onClick={() => setMobileNoise('loud')}
              />
            </div>
          </section>

          <section className="filters-block">
            <h2 className="filters-block__title">Режим сна</h2>

            <div className="filters-mobile__chips">
              <FilterChip
                label="Жаворонок"
                selected={sleepSchedule === 'early_bird'}
                onClick={() => setSleepSchedule('early_bird')}
              />
              <FilterChip
                label="Сова"
                selected={sleepSchedule === 'night_owl'}
                onClick={() => setSleepSchedule('night_owl')}
              />
              <FilterChip
                label="Гибкий"
                selected={sleepSchedule === 'flexible'}
                onClick={() => setSleepSchedule('flexible')}
              />
            </div>
          </section>

          <section className="filters-block">
            <h2 className="filters-block__title">Алкоголь</h2>

            <div className="filters-mobile__chips">
              <FilterChip
                label="Не пью"
                selected={alcoholPreference === 'no'}
                onClick={() => setAlcoholPreference('no')}
              />
              <FilterChip
                label="Редко"
                selected={alcoholPreference === 'rarely'}
                onClick={() => setAlcoholPreference('rarely')}
              />
              <FilterChip
                label="Соц."
                selected={alcoholPreference === 'socially'}
                onClick={() => setAlcoholPreference('socially')}
              />
              <FilterChip
                label="Да"
                selected={alcoholPreference === 'yes'}
                onClick={() => setAlcoholPreference('yes')}
              />
            </div>
          </section>

          <section className="filters-block">
            <h2 className="filters-block__title">Порядок в комнате</h2>

            <div className="filters-mobile__chips">
              <FilterChip
                label="Строго"
                selected={roomOrderPreference === 'strict'}
                onClick={() => setRoomOrderPreference('strict')}
              />
              <FilterChip
                label="Баланс"
                selected={roomOrderPreference === 'balanced'}
                onClick={() => setRoomOrderPreference('balanced')}
              />
              <FilterChip
                label="Гибко"
                selected={roomOrderPreference === 'flexible'}
                onClick={() => setRoomOrderPreference('flexible')}
              />
            </div>
          </section>
        </div>

        {showNoPreviewData ? (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Нет данных для предпросмотра</h3>
            <p className="filters-preview-state__text">
              Локальная подборка пока пустая. Фильтры всё равно можно настроить и применить.
            </p>
          </section>
        ) : showEmptyPreview ? (
          <section className="filters-preview-state filters-preview-state--warning">
            <h3 className="filters-preview-state__title">Ничего не найдено</h3>
            <p className="filters-preview-state__text">
              По текущим фильтрам нет подходящих анкет. Измени параметры перед применением.
            </p>
          </section>
        ) : showIdlePreview ? (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Предпросмотр фильтров</h3>
            <p className="filters-preview-state__text">
              Измени параметры, и здесь появится локальный результат до применения.
            </p>
          </section>
        ) : (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Предпросмотр</h3>
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
          <h1 className="filters-desktop__title">Фильтры</h1>
          <p className="filters-desktop__subtitle">
            Настрой подбор под себя — можно сбросить в любой момент.
          </p>
        </div>

        <div className="filters-desktop__card">
          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Бюджет</span>
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
                placeholder="01.09.2026"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Срок аренды</span>
              <input
                type="text"
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
                <input
                  type="text"
                  value={university}
                  onChange={(event) => setUniversity(event.target.value)}
                  placeholder="КФУ"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Факультет</span>
                <input
                  type="text"
                  value={faculty}
                  onChange={(event) => setFaculty(event.target.value)}
                  placeholder="Институт ИТИС"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Курс</span>
                <input
                  type="text"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="2 курс"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Район</span>
                <input
                  type="text"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  placeholder="Приволжский район"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Общежитие / локация</span>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Деревня Универсиады, корпус 3"
                />
              </label>
            </section>

            <section className="filters-desktop__section">
              <label className="filters-desktop__field">
                <span className="filters-desktop__label">Критерии съёма</span>
                <input
                  type="text"
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
            <h2 className="filters-desktop__section-title">Курение</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Не курю"
                selected={desktopSmoking === 'no'}
                onClick={() => setDesktopSmoking('no')}
              />
              <FilterChip
                compact
                label="Курю"
                selected={desktopSmoking === 'yes'}
                onClick={() => setDesktopSmoking('yes')}
              />
              <FilterChip
                compact
                label="Только на улице"
                selected={desktopSmoking === 'outside'}
                onClick={() => setDesktopSmoking('outside')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Алкоголь</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Не пью"
                selected={alcoholPreference === 'no'}
                onClick={() => setAlcoholPreference('no')}
              />
              <FilterChip
                compact
                label="Редко"
                selected={alcoholPreference === 'rarely'}
                onClick={() => setAlcoholPreference('rarely')}
              />
              <FilterChip
                compact
                label="Соц."
                selected={alcoholPreference === 'socially'}
                onClick={() => setAlcoholPreference('socially')}
              />
              <FilterChip
                compact
                label="Да"
                selected={alcoholPreference === 'yes'}
                onClick={() => setAlcoholPreference('yes')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Шум</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Тишина"
                selected={desktopNoise === 'quiet'}
                onClick={() => setDesktopNoise('quiet')}
              />
              <FilterChip
                compact
                label="Норм"
                selected={desktopNoise === 'normal'}
                onClick={() => setDesktopNoise('normal')}
              />
              <FilterChip
                compact
                label="Шумно"
                selected={desktopNoise === 'loud'}
                onClick={() => setDesktopNoise('loud')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Режим сна</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Жаворонок"
                selected={sleepSchedule === 'early_bird'}
                onClick={() => setSleepSchedule('early_bird')}
              />
              <FilterChip
                compact
                label="Сова"
                selected={sleepSchedule === 'night_owl'}
                onClick={() => setSleepSchedule('night_owl')}
              />
              <FilterChip
                compact
                label="Гибкий"
                selected={sleepSchedule === 'flexible'}
                onClick={() => setSleepSchedule('flexible')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Порядок в комнате</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Строго"
                selected={roomOrderPreference === 'strict'}
                onClick={() => setRoomOrderPreference('strict')}
              />
              <FilterChip
                compact
                label="Баланс"
                selected={roomOrderPreference === 'balanced'}
                onClick={() => setRoomOrderPreference('balanced')}
              />
              <FilterChip
                compact
                label="Гибко"
                selected={roomOrderPreference === 'flexible'}
                onClick={() => setRoomOrderPreference('flexible')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Животные</h2>
            <div className="filters-desktop__chips">
              <FilterChip
                compact
                label="Ок"
                selected={desktopPets === 'ok'}
                onClick={() => setDesktopPets('ok')}
              />
              <FilterChip
                compact
                label="Не ок"
                selected={desktopPets === 'not-ok'}
                onClick={() => setDesktopPets('not-ok')}
              />
            </div>
          </section>

          <section className="filters-desktop__section">
            <h2 className="filters-desktop__section-title">Тихие часы</h2>
            <FilterToggle
              label="Только с тихими часами"
              checked={quietOnly}
              onToggle={() => setQuietOnly((current) => !current)}
            />
          </section>
        </div>

        {showNoPreviewData ? (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Нет данных для предпросмотра</h3>
            <p className="filters-preview-state__text">
              Локальная подборка пока пустая. Фильтры всё равно можно настроить и применить.
            </p>
          </section>
        ) : showEmptyPreview ? (
          <section className="filters-preview-state filters-preview-state--warning">
            <h3 className="filters-preview-state__title">Ничего не найдено</h3>
            <p className="filters-preview-state__text">
              По текущим фильтрам нет подходящих анкет. Измени параметры перед применением.
            </p>
          </section>
        ) : showIdlePreview ? (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Предпросмотр фильтров</h3>
            <p className="filters-preview-state__text">
              Измени параметры, и здесь появится локальный результат до применения.
            </p>
          </section>
        ) : (
          <section className="filters-preview-state">
            <h3 className="filters-preview-state__title">Предпросмотр</h3>
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
