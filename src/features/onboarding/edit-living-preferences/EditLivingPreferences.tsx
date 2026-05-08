import { useEffect, useMemo, useState, type FormEvent } from 'react';

import '../onboarding-form.css';
import type { LivingPreferencesErrors, LivingPreferencesFormValue } from './types';
import { Button, Checkbox, Input, Select, Typography } from 'antd';

import {
  DESKTOP_CONDITIONS,
  formatBudgetRange,
  formatStayDuration,
  getSelectedConditionsFromNotes,
  MOBILE_CONDITIONS,
  parseBudgetRange,
  parseStayDuration,
} from './lib/livingPreferencesHelpers';
import { DEFAULT_LIVING_PREFERENCES_FORM_VALUE } from './constants';
import { referencesApi, type ReferenceSelectOption } from '@/shared/api/services/references';
import { isIsoDate } from '@/shared/utils/date';

const { Title } = Typography;

type EditLivingPreferencesProps = {
  initialValue?: Partial<LivingPreferencesFormValue>;
  onBack?: () => void;
  onNext: (value: LivingPreferencesFormValue) => void;
  onChange?: (value: LivingPreferencesFormValue) => void;
  onSkip?: () => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

function ConditionItem({ value, label }: { value: string; label: string }) {
  return (
    <Checkbox value={value} className="step-3-condition step-3-condition-checkbox">
      <span className="step-3-condition__box" />
      <span className="step-3-condition__text">{label}</span>
    </Checkbox>
  );
}

export function EditLivingPreferences({
  initialValue,
  onBack,
  onNext,
  onChange,
  onSkip,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditLivingPreferencesProps) {
  const mergedInitialValue = useMemo(
    () => ({ ...DEFAULT_LIVING_PREFERENCES_FORM_VALUE, ...initialValue }),
    [initialValue]
  );
  const [formValue, setFormValue] = useState<LivingPreferencesFormValue>(mergedInitialValue);
  const [housingTypeOptions, setHousingTypeOptions] = useState<ReferenceSelectOption[]>([]);
  const [isHousingTypesLoading, setIsHousingTypesLoading] = useState(false);
  const [housingTypesError, setHousingTypesError] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState(
    formatBudgetRange(mergedInitialValue.budgetMin, mergedInitialValue.budgetMax)
  );
  const [stayDurationText, setStayDurationText] = useState(
    formatStayDuration(mergedInitialValue.stayDuration)
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    getSelectedConditionsFromNotes(mergedInitialValue.livingNotes)
  );
  const [errors, setErrors] = useState<LivingPreferencesErrors>({});

  useEffect(() => {
    onChange?.(formValue);
  }, [formValue, onChange]);

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(() => {
      if (isMounted) {
        setIsHousingTypesLoading(true);
        setHousingTypesError(null);
      }
    });

    referencesApi
      .listHousingTypes()
      .then(({ items }) => {
        if (!isMounted) {
          return;
        }

        setHousingTypeOptions(items);
      })
      .catch(() => {
        if (isMounted) {
          setHousingTypeOptions([]);
          setHousingTypesError('Не удалось загрузить типы жилья. Попробуйте обновить страницу.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHousingTypesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filledCount = [
    formValue.housingType,
    budgetRange,
    formValue.moveInDate,
    stayDurationText,
    formValue.idealRoommateDescription,
    formValue.rentalCriteria,
  ].filter((value) => String(value ?? '').trim()).length;

  const isStepEmpty = filledCount === 0;
  const isStepIncomplete = !isStepEmpty && filledCount < 6;

  function setField<K extends keyof LivingPreferencesFormValue>(
    field: K,
    value: LivingPreferencesFormValue[K]
  ) {
    setFormValue((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: LivingPreferencesErrors = {};
    const parsedBudget = parseBudgetRange(budgetRange);
    const parsedDuration = parseStayDuration(stayDurationText);

    if (!formValue.housingType) {
      nextErrors.housingType = 'Выбери тип жилья.';
    }

    if (!parsedBudget) {
      nextErrors.budgetRange = 'Укажи диапазон бюджета.';
    }

    if (!formValue.moveInDate.trim()) {
      nextErrors.moveInDate = 'Укажи дату заезда.';
    } else if (!isIsoDate(formValue.moveInDate.trim())) {
      nextErrors.moveInDate = 'Выбери дату в формате ГГГГ-ММ-ДД.';
    }

    if (!parsedDuration) {
      nextErrors.stayDuration = 'Укажи срок аренды.';
    }

    if (!formValue.idealRoommateDescription.trim()) {
      nextErrors.idealRoommateDescription = 'Опиши идеального соседа.';
    }

    if (!formValue.rentalCriteria.trim()) {
      nextErrors.rentalCriteria = 'Укажи критерии для съёма квартиры.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const parsedBudget = parseBudgetRange(budgetRange);
    const parsedDuration = parseStayDuration(stayDurationText);

    if (!parsedBudget || !parsedDuration) {
      return;
    }

    const labelMap = Object.fromEntries(
      [...MOBILE_CONDITIONS, ...DESKTOP_CONDITIONS].map((item) => [item.key, item.label])
    );

    const selectedLabels = selectedConditions.map((key) => labelMap[key]).filter(Boolean);

    const notesParts = [
      selectedLabels.length > 0 ? `Условия: ${selectedLabels.join(', ')}` : '',
    ].filter(Boolean);

    onNext({
      budgetMin: parsedBudget.min,
      budgetMax: parsedBudget.max,
      moveInDate: formValue.moveInDate.trim(),
      stayDuration: parsedDuration,
      housingType: formValue.housingType,
      livingNotes: notesParts.join('. '),
      idealRoommateDescription: formValue.idealRoommateDescription.trim(),
      rentalCriteria: formValue.rentalCriteria.trim(),
    });
  }

  return (
    <form
      id={formId}
      className="onboarding-feature-card onboarding-feature-card--living"
      onSubmit={handleSubmit}
      noValidate
    >
      {!hideHeader ? (
        <div className="onboarding-feature-copy">
          <p className="onboarding-feature-eyebrow">Шаг 3</p>
          <Title level={3} className="onboarding-feature-title">
            Условия
          </Title>
          <p className="onboarding-feature-description">
            Бюджет, дата заезда, срок аренды и условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <Title level={4} className="onboarding-form-state__title">
            Шаг ещё пустой
          </Title>
          <p className="onboarding-form-state__text">
            Укажи бюджет, дату заезда и основные условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <Title level={4} className="onboarding-form-state__title">
            Условия заполнены не до конца
          </Title>
          <p className="onboarding-form-state__text">
            Здесь ещё стоит дописать срок аренды, идеального соседа и критерии для съёма.
          </p>
        </div>
      ) : null}

      <section className="step-3-group">
        <label className="step-3-field">
          <span className="step-3-label">Тип жилья</span>
          <Select
            className="step-3-input"
            value={formValue.housingType || undefined}
            onChange={(value) => {
              const nextValue = (value ?? '') as LivingPreferencesFormValue['housingType'] | '';
              setField('housingType', nextValue);
            }}
            placeholder="Выбери тип жилья"
            options={housingTypeOptions}
            loading={isHousingTypesLoading}
            allowClear
            optionFilterProp="label"
            notFoundContent={
              isHousingTypesLoading ? 'Загрузка...' : housingTypesError || 'Типы жилья не найдены'
            }
          />
          {housingTypesError ? <small className="rm-form-error">{housingTypesError}</small> : null}
        </label>

        {errors.housingType ? <small className="rm-form-error">{errors.housingType}</small> : null}
      </section>

      <section className="step-3-group">
        <label className="step-3-field">
          <span className="step-3-label">Бюджет (диапазон)</span>

          <Input
            className="step-3-input step-3-input--budget-mobile"
            value={budgetRange}
            onChange={(event) => setBudgetRange(event.target.value)}
            placeholder="20–35 тыс ₽ / мес"
            autoComplete="off"
          />

          <div className="step-3-budget-visual" aria-hidden="true">
            <div className="step-3-budget-track">
              <span className="step-3-budget-fill" />
            </div>
          </div>
        </label>

        {errors.budgetRange ? <small className="rm-form-error">{errors.budgetRange}</small> : null}
      </section>

      <section className="step-3-group">
        <label className="step-3-field">
          <span className="step-3-label">Дата заезда</span>
          <Input
            className="step-3-input"
            type="date"
            value={formValue.moveInDate}
            onChange={(event) => setField('moveInDate', event.target.value)}
            placeholder="2026-03-15"
            autoComplete="off"
          />
        </label>

        {errors.moveInDate ? <small className="rm-form-error">{errors.moveInDate}</small> : null}
      </section>

      <section className="step-3-group">
        <label className="step-3-field">
          <span className="step-3-label">Срок аренды</span>
          <Input
            className="step-3-input"
            value={stayDurationText}
            onChange={(event) => setStayDurationText(event.target.value)}
            placeholder="6 месяцев"
            autoComplete="off"
          />
        </label>

        {errors.stayDuration ? (
          <small className="rm-form-error">{errors.stayDuration}</small>
        ) : null}
      </section>

      <section className="step-3-group step-3-group--conditions">
        <Title level={4} className="step-3-section-title">
          Жёсткие условия
        </Title>

        <Checkbox.Group
          className="step-3-conditions-list step-3-conditions-list--mobile"
          value={selectedConditions}
          onChange={(checkedValues) => setSelectedConditions(checkedValues.map(String))}
        >
          {MOBILE_CONDITIONS.map((item) => (
            <ConditionItem key={item.key} value={item.key} label={item.label} />
          ))}
        </Checkbox.Group>

        <Checkbox.Group
          className="step-3-conditions-list step-3-conditions-list--desktop"
          value={selectedConditions}
          onChange={(checkedValues) => setSelectedConditions(checkedValues.map(String))}
        >
          {DESKTOP_CONDITIONS.map((item) => (
            <ConditionItem key={item.key} value={item.key} label={item.label} />
          ))}
        </Checkbox.Group>
      </section>

      <label className="step-3-ideal-field">
        <span className="step-3-label">Идеальный сосед</span>
        <Input.TextArea
          className="step-3-ideal-textarea"
          rows={3}
          value={formValue.idealRoommateDescription}
          onChange={(event) => setField('idealRoommateDescription', event.target.value)}
          placeholder="Спокойный, аккуратный, без частых гостей..."
        />
      </label>

      {errors.idealRoommateDescription ? (
        <small className="rm-form-error">{errors.idealRoommateDescription}</small>
      ) : null}

      <label className="step-3-ideal-field">
        <span className="step-3-label">Критерии для съёма квартиры</span>
        <Input.TextArea
          className="step-3-ideal-textarea"
          rows={3}
          value={formValue.rentalCriteria}
          onChange={(event) => setField('rentalCriteria', event.target.value)}
          placeholder="1-2 комнаты, мебель, стиральная машина, нормальная кухня..."
        />
      </label>

      {errors.rentalCriteria ? (
        <small className="rm-form-error">{errors.rentalCriteria}</small>
      ) : null}

      {!hideActions ? (
        <div className="onboarding-feature-actions step-3-actions">
          <div className="rm-actions-row">
            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost"
              onClick={onBack}
              disabled={!onBack}
            >
              <span>Назад</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>

            <Button htmlType="submit" className="rm-nav-button rm-nav-button--primary">
              <span>Далее</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
            </Button>
          </div>

          {onSkip ? (
            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost rm-nav-button--skip"
              onClick={onSkip}
            >
              <span>Пропустить пока</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
