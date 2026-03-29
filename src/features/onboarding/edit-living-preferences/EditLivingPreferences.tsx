import { useMemo, useState, type FormEvent } from 'react';
import type { User } from '../../../entities/user';
import '../onboarding-form.css';
import { Button, Checkbox, Input } from 'antd';

export type LivingPreferencesFormValue = {
  budgetMin: string;
  budgetMax: string;
  moveInDate: string;
  stayDuration: User['stayDuration'] | '';
  housingType: User['housingType'] | '';
  livingNotes: string;
  idealRoommateDescription: string;
  rentalCriteria: string;
};

type LivingPreferencesErrors = Partial<
  Record<'budgetRange' | 'moveInDate' | 'stayDuration', string>
>;

type EditLivingPreferencesProps = {
  initialValue?: Partial<LivingPreferencesFormValue>;
  onBack?: () => void;
  onNext: (value: LivingPreferencesFormValue) => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

type Step3ConditionOption = {
  key: string;
  label: string;
};

const defaultValue: LivingPreferencesFormValue = {
  budgetMin: '',
  budgetMax: '',
  moveInDate: '',
  stayDuration: '',
  housingType: '',
  livingNotes: '',
  idealRoommateDescription: '',
  rentalCriteria: '',
};

const mobileConditions: Step3ConditionOption[] = [
  { key: 'room_smoking', label: 'Курение в комнате' },
  { key: 'frequent_guests', label: 'Гости часто' },
  { key: 'late_noise', label: 'Шум после 23:00' },
  { key: 'no_cleaning', label: 'Без уборки вообще' },
  { key: 'pets', label: 'Питомцы' },
];

const desktopConditions: Step3ConditionOption[] = [
  { key: 'non_smoker', label: 'Не курит' },
  { key: 'quiet_evening', label: 'Только тихий режим вечером' },
  { key: 'no_weekday_guests', label: 'Без гостей по будням' },
  { key: 'cleanliness_required', label: 'Чистота обязательна' },
  { key: 'no_animals', label: 'Без животных' },
];

function formatBudgetRange(min?: string, max?: string) {
  if (!min || !max) {
    return '';
  }

  return `${min}–${max} тыс ₽ / мес`;
}

function parseBudgetRange(value: string) {
  const matches = value.match(/\d+/g);

  if (!matches || matches.length < 2) {
    return null;
  }

  return {
    min: matches[0],
    max: matches[1],
  };
}

function formatStayDuration(value: LivingPreferencesFormValue['stayDuration']) {
  switch (value) {
    case '1-3 months':
      return '1–3 месяца';
    case '3-6 months':
      return '3–6 месяцев';
    case '6-12 months':
      return '6–12 месяцев';
    case '12+ months':
      return '12+ месяцев';
    default:
      return '';
  }
}

function parseStayDuration(value: string): LivingPreferencesFormValue['stayDuration'] | '' {
  const normalized = value.toLowerCase().replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.includes('12+')) {
    return '12+ months';
  }

  if (normalized.includes('1–3') || normalized.includes('1-3')) {
    return '1-3 months';
  }

  if (normalized.includes('3–6') || normalized.includes('3-6')) {
    return '3-6 months';
  }

  if (
    normalized.includes('6 месяцев') ||
    normalized.includes('6–12') ||
    normalized.includes('6-12')
  ) {
    return '6-12 months';
  }

  return '';
}

function getSelectedConditionsFromNotes(value: string) {
  const normalized = value.toLowerCase();

  return [...mobileConditions, ...desktopConditions]
    .filter((item) => normalized.includes(item.label.toLowerCase()))
    .map((item) => item.key);
}

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
  formId,
  hideHeader = false,
  hideActions = false,
}: EditLivingPreferencesProps) {
  const mergedInitialValue = useMemo(() => ({ ...defaultValue, ...initialValue }), [initialValue]);

  const [formValue, setFormValue] = useState<LivingPreferencesFormValue>(mergedInitialValue);
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

  const filledCount = [
    budgetRange,
    formValue.moveInDate,
    stayDurationText,
    formValue.housingType,
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

    if (!parsedBudget) {
      nextErrors.budgetRange = 'Укажи диапазон бюджета.';
    }

    if (!formValue.moveInDate.trim()) {
      nextErrors.moveInDate = 'Укажи дату заезда.';
    }

    if (!parsedDuration) {
      nextErrors.stayDuration = 'Укажи срок аренды.';
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
      [...mobileConditions, ...desktopConditions].map((item) => [item.key, item.label])
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
          <h3 className="onboarding-feature-title">Условия</h3>
          <p className="onboarding-feature-description">
            Бюджет, дата заезда, срок аренды и условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <h4 className="onboarding-form-state__title">Шаг ещё пустой</h4>
          <p className="onboarding-form-state__text">
            Укажи бюджет, дату заезда и основные условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <h4 className="onboarding-form-state__title">Условия заполнены не до конца</h4>
          <p className="onboarding-form-state__text">
            Здесь ещё стоит дописать срок аренды, идеального соседа и критерии для съёма.
          </p>
        </div>
      ) : null}

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
            value={formValue.moveInDate}
            onChange={(event) => setField('moveInDate', event.target.value)}
            placeholder="с 15 марта"
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
        <h4 className="step-3-section-title">Жёсткие условия</h4>

        <Checkbox.Group
          className="step-3-conditions-list step-3-conditions-list--mobile"
          value={selectedConditions}
          onChange={(checkedValues) => setSelectedConditions(checkedValues.map(String))}
        >
          {mobileConditions.map((item) => (
            <ConditionItem key={item.key} value={item.key} label={item.label} />
          ))}
        </Checkbox.Group>

        <Checkbox.Group
          className="step-3-conditions-list step-3-conditions-list--desktop"
          value={selectedConditions}
          onChange={(checkedValues) => setSelectedConditions(checkedValues.map(String))}
        >
          {desktopConditions.map((item) => (
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

      {!hideActions ? (
        <div className="onboarding-feature-actions onboarding-page__actions--step-3">
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
      ) : null}
    </form>
  );
}
