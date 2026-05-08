import { Button, Input, Typography } from 'antd';

import { ApplyFiltersButton, ResetFiltersButton } from '../../../features/discover';
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

type MobileFiltersPanelProps = PreviewStateProps &
  FilterActionsProps & {
    filtersForm: FiltersFormState;
    currentUserUniversity?: string;
    currentUserLocation?: string;
    onBack?: () => void;
    noiseOptions: Array<{ value: FiltersFormState['mobileNoise']; label: string }>;
    sleepScheduleOptions: Array<{ value: FiltersFormState['sleepSchedule']; label: string }>;
    alcoholOptions: Array<{ value: FiltersFormState['alcoholPreference']; label: string }>;
    roomOrderOptions: Array<{ value: FiltersFormState['roomOrderPreference']; label: string }>;
    updateFiltersForm: UpdateFiltersForm;
    setFilterField: SetFilterField;
  };

export function MobileFiltersPanel({
  filtersForm,
  currentUserUniversity,
  currentUserLocation,
  onBack,
  noiseOptions,
  sleepScheduleOptions,
  alcoholOptions,
  roomOrderOptions,
  updateFiltersForm,
  setFilterField,
  showNoPreviewData,
  showEmptyPreview,
  showIdlePreview,
  previewCount,
  resetAll,
  applyFilters,
}: MobileFiltersPanelProps) {
  const {
    onlyDormitory,
    onlyRental,
    petsAllowedMobile,
    noSmokingMobile,
    femaleOnly,
    maleOnly,
    mobileNoise,
    budgetMin,
    budgetMax,
    ageMin,
    ageMax,
    moveInDate,
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
                updateFiltersForm({
                  budgetMin: values[0] ?? '',
                  budgetMax: values[1] ?? '',
                });
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
                updateFiltersForm({
                  ageMin: values[0] ?? '',
                  ageMax: values[1] ?? '',
                });
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
              onChange={(event) => setFilterField('moveInDate', event.target.value)}
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
              onChange={(event) => setFilterField('university', event.target.value)}
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
              onChange={(event) => setFilterField('faculty', event.target.value)}
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
              onChange={(event) => setFilterField('course', event.target.value)}
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
              onChange={(event) => setFilterField('district', event.target.value)}
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
              onChange={(event) => setFilterField('location', event.target.value)}
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
              onChange={(event) => setFilterField('rentalCriteria', event.target.value)}
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
            ) : null}

            {currentUserLocation ? (
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
            ) : null}

            <FilterToggle
              label="Только общежитие"
              checked={onlyDormitory}
              onToggle={() =>
                updateFiltersForm((current) => {
                  const nextValue = !current.onlyDormitory;

                  return {
                    onlyDormitory: nextValue,
                    onlyRental: nextValue ? false : current.onlyRental,
                  };
                })
              }
            />

            <FilterToggle
              label="Только съём"
              checked={onlyRental}
              onToggle={() =>
                updateFiltersForm((current) => {
                  const nextValue = !current.onlyRental;

                  return {
                    onlyRental: nextValue,
                    onlyDormitory: nextValue ? false : current.onlyDormitory,
                  };
                })
              }
            />

            <FilterToggle
              label="С питомцами ок"
              checked={petsAllowedMobile}
              onToggle={() =>
                updateFiltersForm((current) => ({
                  petsAllowedMobile: !current.petsAllowedMobile,
                }))
              }
            />

            <FilterToggle
              label="Без курения"
              checked={noSmokingMobile}
              onToggle={() =>
                updateFiltersForm((current) => ({
                  noSmokingMobile: !current.noSmokingMobile,
                }))
              }
            />

            <FilterToggle
              label="Тихие часы"
              checked={quietOnly}
              onToggle={() =>
                updateFiltersForm((current) => ({
                  quietOnly: !current.quietOnly,
                }))
              }
            />

            <div className="filters-mobile__gender-label">Пол:</div>

            <FilterToggle
              label="Женский"
              checked={femaleOnly}
              onToggle={() =>
                updateFiltersForm((current) => {
                  const nextValue = !current.femaleOnly;

                  return {
                    femaleOnly: nextValue,
                    maleOnly: nextValue ? false : current.maleOnly,
                  };
                })
              }
            />

            <FilterToggle
              label="Мужской"
              checked={maleOnly}
              onToggle={() =>
                updateFiltersForm((current) => {
                  const nextValue = !current.maleOnly;

                  return {
                    maleOnly: nextValue,
                    femaleOnly: nextValue ? false : current.femaleOnly,
                  };
                })
              }
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
                onClick={() => setFilterField('mobileNoise', option.value)}
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
                onClick={() => setFilterField('sleepSchedule', option.value)}
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
                onClick={() => setFilterField('alcoholPreference', option.value)}
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
                onClick={() => setFilterField('roomOrderPreference', option.value)}
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
