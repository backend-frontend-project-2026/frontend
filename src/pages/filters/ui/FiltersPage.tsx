import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, message } from 'antd';
import type { FilterParams } from '../../../entities/user';
import {
  EMPTY_HABIT_REFERENCES,
  referencesApi,
  type HabitReferenceMap,
  type ReferenceSelectOption,
} from '../../../shared/api';
import { applyFiltersToUsers, hasActiveFilters } from '../../../features/discover';
import './filters-page.css';

import { DesktopFiltersPanel } from './DesktopFiltersPanel';
import { MobileFiltersPanel } from './MobileFiltersPanel';
import type {
  ChipOption,
  FiltersFormState,
  FiltersPageProps,
  NonEmptyValue,
} from './FiltersPage.types';

import {
  getInitialAlcohol,
  getInitialDesktopNoise,
  getInitialDesktopPets,
  getInitialDesktopSmoking,
  getInitialGender,
  getInitialHousingType,
  getInitialMobileNoise,
  getInitialRoomOrder,
  getInitialSleepSchedule,
} from '../lib/filtersPageGetters';

import type {
  AlcoholValue,
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

const EMPTY_FILTERS_FORM_STATE: FiltersFormState = {
  onlyDormitory: false,
  onlyRental: false,
  petsAllowedMobile: false,
  noSmokingMobile: false,
  femaleOnly: false,
  maleOnly: false,
  mobileNoise: '',
  desktopSmoking: '',
  desktopNoise: '',
  desktopPets: '',
  budgetMin: DEFAULT_BUDGET_MIN,
  budgetMax: DEFAULT_BUDGET_MAX,
  ageMin: '',
  ageMax: '',
  moveInDate: DEFAULT_MOVE_IN_DATE,
  stayDuration: DEFAULT_STAY_DURATION,
  university: '',
  district: '',
  location: '',
  faculty: '',
  course: '',
  rentalCriteria: '',
  sameUniversityOnly: false,
  sameLocationOnly: false,
  sleepSchedule: '',
  quietOnly: false,
  alcoholPreference: '',
  roomOrderPreference: '',
};

function getInitialFiltersFormState(
  initialFilters?: FilterParams,
  currentUserUniversity?: string,
  currentUserLocation?: string
): FiltersFormState {
  return {
    ...EMPTY_FILTERS_FORM_STATE,
    onlyDormitory: getInitialHousingType(initialFilters) === 'dormitory',
    onlyRental: getInitialHousingType(initialFilters) === 'rental',
    petsAllowedMobile: initialFilters?.petPreference === 'pet_friendly',
    noSmokingMobile: initialFilters?.smokingPreference === 'no',
    femaleOnly: getInitialGender(initialFilters) === 'female',
    maleOnly: getInitialGender(initialFilters) === 'male',
    mobileNoise: getInitialMobileNoise(initialFilters),
    desktopSmoking: getInitialDesktopSmoking(initialFilters),
    desktopNoise: getInitialDesktopNoise(initialFilters),
    desktopPets: getInitialDesktopPets(initialFilters),
    budgetMin: initialFilters?.budgetMin?.toString() ?? DEFAULT_BUDGET_MIN,
    budgetMax: initialFilters?.budgetMax?.toString() ?? DEFAULT_BUDGET_MAX,
    ageMin: initialFilters?.ageMin?.toString() ?? '',
    ageMax: initialFilters?.ageMax?.toString() ?? '',
    moveInDate: initialFilters?.moveInDate ?? DEFAULT_MOVE_IN_DATE,
    stayDuration: (initialFilters?.stayDuration as StayDurationValue) ?? DEFAULT_STAY_DURATION,
    university: initialFilters?.university ?? '',
    district: initialFilters?.district ?? '',
    location: initialFilters?.location ?? '',
    faculty: initialFilters?.faculty ?? '',
    course: initialFilters?.course ?? '',
    rentalCriteria: initialFilters?.rentalCriteria ?? '',
    sameUniversityOnly:
      Boolean(currentUserUniversity) && initialFilters?.university === currentUserUniversity,
    sameLocationOnly:
      Boolean(currentUserLocation) && initialFilters?.location === currentUserLocation,
    sleepSchedule: getInitialSleepSchedule(initialFilters),
    quietOnly: Boolean(initialFilters?.quietOnly),
    alcoholPreference: getInitialAlcohol(initialFilters),
    roomOrderPreference: getInitialRoomOrder(initialFilters),
  };
}

export function FiltersPage({
  initialFilters,
  currentUserUniversity,
  currentUserLocation,
  usersForPreview = [],
  onBack,
  onApply,
}: FiltersPageProps) {
  const [filtersForm, setFiltersForm] = useState<FiltersFormState>(() =>
    getInitialFiltersFormState(initialFilters, currentUserUniversity, currentUserLocation)
  );

  const {
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
  } = filtersForm;

  function updateFiltersForm(
    updater: Partial<FiltersFormState> | ((current: FiltersFormState) => Partial<FiltersFormState>)
  ) {
    setFiltersForm((current) => ({
      ...current,
      ...(typeof updater === 'function' ? updater(current) : updater),
    }));
  }

  function setFilterField<K extends keyof FiltersFormState>(key: K, value: FiltersFormState[K]) {
    setFiltersForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const [habitReferences, setHabitReferences] = useState<HabitReferenceMap>(EMPTY_HABIT_REFERENCES);

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

  const noiseOptions = getReferenceChipOptions(habitReferences.noiseLevel, NOISE_FALLBACK_OPTIONS);
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
  const petsOptions = getReferenceChipOptions(habitReferences.petPreference, PETS_FALLBACK_OPTIONS);

  function resetAll() {
    setFiltersForm(EMPTY_FILTERS_FORM_STATE);
    localStorage.removeItem('roomie_filters');
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

  const [stayModalOpen, setStayModalOpen] = useState(false);
  const [tempStayDuration, setTempStayDuration] = useState<StayDurationValue>(stayDuration);

  function editStayDuration() {
    setTempStayDuration(stayDuration);
    setStayModalOpen(true);
  }

  function handleStayOk() {
    setFilterField('stayDuration', tempStayDuration);
    setStayModalOpen(false);
  }

  function handleStayCancel() {
    setStayModalOpen(false);
  }

  function isAgeRangeValid(): boolean {
    const min = Number(ageMin);
    const max = Number(ageMax);
    // Если оба поля не пустые и min > max – ошибка
    if (ageMin !== '' && ageMax !== '' && min > max) {
      message.error('Возраст «от» не может быть больше возраста «до»');
      return false;
    }
    return true;
  }

  function applyFilters() {
    if (!isAgeRangeValid()) {
      return;
    }
    localStorage.setItem('roomie_filters', JSON.stringify(liveFilters));
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
      <MobileFiltersPanel
        filtersForm={filtersForm}
        currentUserUniversity={currentUserUniversity}
        currentUserLocation={currentUserLocation}
        onBack={onBack}
        noiseOptions={noiseOptions}
        sleepScheduleOptions={sleepScheduleOptions}
        alcoholOptions={alcoholOptions}
        roomOrderOptions={roomOrderOptions}
        updateFiltersForm={updateFiltersForm}
        setFilterField={setFilterField}
        showNoPreviewData={showNoPreviewData}
        showEmptyPreview={showEmptyPreview}
        showIdlePreview={showIdlePreview}
        previewCount={previewCount}
        resetAll={resetAll}
        applyFilters={applyFilters}
      />

      <DesktopFiltersPanel
        filtersForm={filtersForm}
        currentUserUniversity={currentUserUniversity}
        currentUserLocation={currentUserLocation}
        noiseOptions={noiseOptions}
        sleepScheduleOptions={sleepScheduleOptions}
        alcoholOptions={alcoholOptions}
        roomOrderOptions={roomOrderOptions}
        smokingOptions={smokingOptions}
        petsOptions={petsOptions}
        updateFiltersForm={updateFiltersForm}
        setFilterField={setFilterField}
        editStayDuration={editStayDuration}
        showNoPreviewData={showNoPreviewData}
        showEmptyPreview={showEmptyPreview}
        showIdlePreview={showIdlePreview}
        previewCount={previewCount}
        resetAll={resetAll}
        applyFilters={applyFilters}
      />

      {}
      <Modal
        title="Срок аренды"
        open={stayModalOpen}
        onOk={handleStayOk}
        onCancel={handleStayCancel}
      >
        <Select
          style={{ width: '100%' }}
          value={tempStayDuration}
          onChange={setTempStayDuration}
          options={[
            { value: '1-3 months', label: '1-3 месяца' },
            { value: '3-6 months', label: '3-6 месяцев' },
            { value: '6-12 months', label: '6-12 месяцев' },
            { value: '12+ months', label: '12+ месяцев' },
          ]}
        />
      </Modal>
    </section>
    
  );
}