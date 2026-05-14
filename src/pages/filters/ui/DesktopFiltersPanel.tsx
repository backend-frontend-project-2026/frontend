import { Input, Typography } from 'antd';

import { ApplyFiltersButton, ResetFiltersButton } from '../../../features/discover';
import { formatStayDuration } from '../lib/filtersPageGetters';
import { FilterChip } from './FilterChip';
import { FilterToggle } from './FilterToggle';
import type {
  FilterActionsProps,
  FiltersFormState,
  PreviewStateProps,
  SetFilterField,
  UpdateFiltersForm,
} from './FiltersPage.types';

const { Title } = Typography;

type DesktopFiltersPanelProps = PreviewStateProps &
  FilterActionsProps & {
    filtersForm: FiltersFormState;
    currentUserUniversity?: string;
    currentUserLocation?: string;
    noiseOptions: Array<{ value: FiltersFormState['desktopNoise']; label: string }>;
    sleepScheduleOptions: Array<{ value: FiltersFormState['sleepSchedule']; label: string }>;
    alcoholOptions: Array<{ value: FiltersFormState['alcoholPreference']; label: string }>;
    roomOrderOptions: Array<{ value: FiltersFormState['roomOrderPreference']; label: string }>;
    smokingOptions: Array<{ value: FiltersFormState['desktopSmoking']; label: string }>;
    petsOptions: Array<{ value: FiltersFormState['desktopPets']; label: string }>;
    updateFiltersForm: UpdateFiltersForm;
    setFilterField: SetFilterField;
    editStayDuration: () => void;
  };

export function DesktopFiltersPanel({
  filtersForm,
  currentUserUniversity,
  currentUserLocation,
  noiseOptions,
  sleepScheduleOptions,
  alcoholOptions,
  roomOrderOptions,
  smokingOptions,
  petsOptions,
  updateFiltersForm,
  setFilterField,
  editStayDuration,
  showNoPreviewData,
  showEmptyPreview,
  showIdlePreview,
  previewCount,
  resetAll,
  applyFilters,
}: DesktopFiltersPanelProps) {
  const {
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

  return (
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
                updateFiltersForm({
                  budgetMin: values[0] ?? '',
                  budgetMax: values[1] ?? '',
                });
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
                updateFiltersForm({
                  ageMin: values[0] ?? '',
                  ageMax: values[1] ?? '',
                });
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
              onChange={(event) => setFilterField('moveInDate', event.target.value)}
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
                onChange={(event) => setFilterField('university', event.target.value)}
                placeholder="КФУ"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Факультет</span>
              <Input
                value={faculty}
                onChange={(event) => setFilterField('faculty', event.target.value)}
                placeholder="Институт ИТИС"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Курс</span>
              <Input
                value={course}
                onChange={(event) => setFilterField('course', event.target.value)}
                placeholder="2 курс"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Район</span>
              <Input
                value={district}
                onChange={(event) => setFilterField('district', event.target.value)}
                placeholder="Приволжский район"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Общежитие / локация</span>
              <Input
                value={location}
                onChange={(event) => setFilterField('location', event.target.value)}
                placeholder="Деревня Универсиады, корпус 3"
              />
            </label>
          </section>

          <section className="filters-desktop__section">
            <label className="filters-desktop__field">
              <span className="filters-desktop__label">Критерии съёма</span>
              <Input
                value={rentalCriteria}
                onChange={(event) => setFilterField('rentalCriteria', event.target.value)}
                placeholder="мебель, 2 комнаты, рабочее место"
              />
            </label>
          </section>

          {currentUserUniversity ? (
            <section className="filters-desktop__section">
              <FilterToggle
                label="Только мой вуз"
                checked={sameUniversityOnly}
                onToggle={() =>
                  updateFiltersForm((current) => {
                    const nextValue = !current.sameUniversityOnly;

                    return {
                      sameUniversityOnly: nextValue,
                      university: nextValue ? currentUserUniversity : current.university,
                    };
                  })
                }
              />
            </section>
          ) : null}

          {currentUserLocation ? (
            <section className="filters-desktop__section">
              <FilterToggle
                label="Только моё общежитие"
                checked={sameLocationOnly}
                onToggle={() =>
                  updateFiltersForm((current) => {
                    const nextValue = !current.sameLocationOnly;

                    return {
                      sameLocationOnly: nextValue,
                      location: nextValue ? currentUserLocation : current.location,
                    };
                  })
                }
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
                onClick={() => setFilterField('desktopSmoking', option.value)}
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
                onClick={() => setFilterField('alcoholPreference', option.value)}
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
                onClick={() => setFilterField('desktopNoise', option.value)}
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
                onClick={() => setFilterField('sleepSchedule', option.value)}
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
                onClick={() => setFilterField('roomOrderPreference', option.value)}
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
                onClick={() => setFilterField('desktopPets', option.value)}
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
            onToggle={() =>
              updateFiltersForm((current) => ({
                quietOnly: !current.quietOnly,
              }))
            }
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
            <span className="filters-action-button__icon filters-action-button__icon--dark">↗</span>
          </>
        </ResetFiltersButton>

        <ApplyFiltersButton
          className="filters-action-button filters-action-button--primary"
          onClick={applyFilters}
        >
          <>
            <span>Применить</span>
            <span className="filters-action-button__icon filters-action-button__icon--lime">↗</span>
          </>
        </ApplyFiltersButton>
      </div>
    </div>
  );
}
