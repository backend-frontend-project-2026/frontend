import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button, Input, Radio, Typography } from 'antd';
import type { HabitsErrors, HabitsFormValue } from './types';
import '../onboarding-form.css';
import { formatQuietInterval, parseQuietInterval } from './lib/quietInterval';
import { DEFAULT_HABITS_FORM_VALUE } from './constants';

const { Title } = Typography;

type EditHabitsProps = {
  initialValue?: Partial<HabitsFormValue>;
  onBack?: () => void;
  onNext: (value: HabitsFormValue) => void;
  onChange?: (value: HabitsFormValue) => void;
  onSkip?: () => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

type HabitPillProps = {
  value: string;
  label: string;
  compact?: boolean;
};

function HabitPill({ value, label, compact = false }: HabitPillProps) {
  return (
    <Radio
      value={value}
      className={['step-2-pill', 'step-2-pill-radio', compact ? 'step-2-pill--compact' : ''].join(
        ' '
      )}
    >
      <span className="step-2-pill__dot" />
      <span className="step-2-pill__label">{label}</span>
    </Radio>
  );
}

export function EditHabits({
  initialValue,
  onBack,
  onNext,
  onChange,
  onSkip,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditHabitsProps) {
  const mergedInitialValue = useMemo(
    () => ({ ...DEFAULT_HABITS_FORM_VALUE, ...initialValue }),
    [initialValue]
  );

  const [formValue, setFormValue] = useState<HabitsFormValue>(mergedInitialValue);
  const [errors, setErrors] = useState<HabitsErrors>({});
  const [quietInterval, setQuietInterval] = useState(
    mergedInitialValue.quietIntervalDraft ||
      formatQuietInterval(mergedInitialValue.quietFrom, mergedInitialValue.quietTo)
  );

  useEffect(() => {
    onChange?.({
      ...formValue,
      quietIntervalDraft: quietInterval,
    });
  }, [formValue, quietInterval, onChange]);

  const selectedCount = [
    formValue.sleepSchedule,
    formValue.cleanliness,
    formValue.noiseLevel,
    formValue.guestFrequency,
    formValue.smokingPreference,
    formValue.alcoholPreference,
    formValue.roomOrderPreference,
    formValue.petPreference,
  ].filter(Boolean).length;

  const isStepEmpty = selectedCount === 0 && !quietInterval.trim();
  const isStepIncomplete = !isStepEmpty && selectedCount < 8;

  function setField<K extends keyof HabitsFormValue>(field: K, value: HabitsFormValue[K]) {
    setFormValue((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function setSmoking(value: HabitsFormValue['smokingPreference']) {
    setFormValue((current) => ({
      ...current,
      smokingPreference: value,
      isSmokingAllowed: value === 'yes',
    }));
    setErrors((current) => ({ ...current, smokingPreference: undefined }));
  }

  function setPetPreference(value: HabitsFormValue['petPreference']) {
    setFormValue((current) => ({
      ...current,
      petPreference: value,
    }));
    setErrors((current) => ({ ...current, petPreference: undefined }));
  }

  function validate(value: HabitsFormValue, intervalValue: string) {
    const nextErrors: HabitsErrors = {};
    const parsedInterval = parseQuietInterval(intervalValue);

    if (!value.sleepSchedule) {
      nextErrors.sleepSchedule = 'Выбери режим.';
    }

    if (!value.smokingPreference) {
      nextErrors.smokingPreference = 'Выбери отношение к курению.';
    }

    if (!value.alcoholPreference) {
      nextErrors.alcoholPreference = 'Выбери отношение к алкоголю.';
    }

    if (!value.roomOrderPreference) {
      nextErrors.roomOrderPreference = 'Выбери отношение к порядку.';
    }

    if (!value.noiseLevel) {
      nextErrors.noiseLevel = 'Выбери шум.';
    }

    if (!value.cleanliness) {
      nextErrors.cleanliness = 'Выбери чистоту.';
    }

    if (!value.guestFrequency) {
      nextErrors.guestFrequency = 'Выбери вариант по гостям.';
    }

    if (!value.petPreference) {
      nextErrors.petPreference = 'Выбери отношение к животным.';
    }

    if (value.hasQuietHours && !parsedInterval) {
      nextErrors.quietFrom = 'Укажи интервал в формате 23:00 — 08:00.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedInterval = parseQuietInterval(quietInterval);
    const nextValue: HabitsFormValue = parsedInterval
      ? {
          ...formValue,
          quietFrom: parsedInterval.from,
          quietTo: parsedInterval.to,
          quietIntervalDraft: quietInterval,
        }
      : {
          ...formValue,
          quietFrom: '',
          quietTo: '',
          quietIntervalDraft: quietInterval,
        };

    const nextErrors = validate(nextValue, quietInterval);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onNext(nextValue);
  }

  return (
    <form
      id={formId}
      className="onboarding-feature-card onboarding-feature-card--habits"
      onSubmit={handleSubmit}
      noValidate
    >
      {!hideHeader ? (
        <div className="onboarding-feature-copy">
          <p className="onboarding-feature-eyebrow">Шаг 2</p>
          <Title level={3} className="onboarding-feature-title">
            Привычки
          </Title>
          <p className="onboarding-feature-description">
            Ритм жизни, бытовые привычки и общие условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <Title level={4} className="onboarding-form-state__title">
            Шаг ещё пустой
          </Title>
          <p className="onboarding-form-state__text">
            Выбери бытовые привычки, чтобы анкета была совместимой по ритму жизни.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <Title level={4} className="onboarding-form-state__title">
            Не все привычки заполнены
          </Title>
          <p className="onboarding-form-state__text">
            На этом шаге лучше выбрать все ключевые параметры: сон, курение, алкоголь, гости и
            порядок.
          </p>
        </div>
      ) : null}

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Режим
        </Title>
        <Radio.Group
          className="step-2-pills step-2-pills--sleep"
          value={formValue.sleepSchedule}
          onChange={(event) => setField('sleepSchedule', event.target.value)}
        >
          <HabitPill value="early_bird" label="Ложусь рано" />
          <HabitPill value="night_owl" label="Ложусь позже" />
        </Radio.Group>
        {errors.sleepSchedule ? (
          <small className="rm-form-error">{errors.sleepSchedule}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Курение
        </Title>
        <Radio.Group
          className="step-2-pills step-2-pills--smoking"
          value={formValue.smokingPreference}
          onChange={(event) =>
            setSmoking(event.target.value as HabitsFormValue['smokingPreference'])
          }
        >
          <HabitPill compact value="no" label="Нет" />
          <HabitPill compact value="yes" label="Да" />
          <HabitPill compact value="outside_only" label="Только на улице" />
        </Radio.Group>
        {errors.smokingPreference ? (
          <small className="rm-form-error">{errors.smokingPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Алкоголь
        </Title>
        <Radio.Group
          className="step-2-pills step-2-pills--smoking"
          value={formValue.alcoholPreference}
          onChange={(event) => setField('alcoholPreference', event.target.value)}
        >
          <HabitPill compact value="no" label="Не пью" />
          <HabitPill compact value="rarely" label="Редко" />
          <HabitPill compact value="socially" label="Иногда" />
          <HabitPill compact value="yes" label="Нормально" />
        </Radio.Group>
        {errors.alcoholPreference ? (
          <small className="rm-form-error">{errors.alcoholPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Шум / Чистота / Гости
        </Title>

        <div className="step-2-inline-list">
          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Шум</span>
            <Radio.Group
              className="step-2-pills step-2-pills--compact-row"
              value={formValue.noiseLevel}
              onChange={(event) => setField('noiseLevel', event.target.value)}
            >
              <HabitPill compact value="quiet" label="Тишина" />
              <HabitPill compact value="moderate" label="Норм" />
              <HabitPill compact value="social" label="Шумно" />
            </Radio.Group>
          </div>
          {errors.noiseLevel ? <small className="rm-form-error">{errors.noiseLevel}</small> : null}

          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Чистота</span>
            <Radio.Group
              className="step-2-pills step-2-pills--compact-row"
              value={formValue.cleanliness}
              onChange={(event) => setField('cleanliness', event.target.value)}
            >
              <HabitPill compact value="high" label="Аккуратно" />
              <HabitPill compact value="medium" label="Средне" />
              <HabitPill compact value="low" label="Не важно" />
            </Radio.Group>
          </div>
          {errors.cleanliness ? (
            <small className="rm-form-error">{errors.cleanliness}</small>
          ) : null}

          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Гости</span>
            <Radio.Group
              className="step-2-pills step-2-pills--compact-row"
              value={formValue.guestFrequency}
              onChange={(event) => setField('guestFrequency', event.target.value)}
            >
              <HabitPill compact value="rarely" label="Редко" />
              <HabitPill compact value="sometimes" label="Иногда" />
              <HabitPill compact value="often" label="Часто" />
            </Radio.Group>
          </div>
          {errors.guestFrequency ? (
            <small className="rm-form-error">{errors.guestFrequency}</small>
          ) : null}
        </div>
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Порядок в комнате
        </Title>
        <Radio.Group
          className="step-2-pills step-2-pills--pets"
          value={formValue.roomOrderPreference}
          onChange={(event) => setField('roomOrderPreference', event.target.value)}
        >
          <HabitPill compact value="strict" label="Строго" />
          <HabitPill compact value="balanced" label="Баланс" />
          <HabitPill compact value="flexible" label="Гибко" />
        </Radio.Group>
        {errors.roomOrderPreference ? (
          <small className="rm-form-error">{errors.roomOrderPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Животные
        </Title>
        <Radio.Group
          className="step-2-pills step-2-pills--pets"
          value={formValue.petPreference}
          onChange={(event) =>
            setPetPreference(event.target.value as HabitsFormValue['petPreference'])
          }
        >
          <HabitPill compact value="pet_friendly" label="Ок" />
          <HabitPill compact value="no_pets" label="Не ок" />
        </Radio.Group>
        {errors.petPreference ? (
          <small className="rm-form-error">{errors.petPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <Title level={4} className="step-2-group__title">
          Тихие часы
        </Title>
        <label className="step-2-interval-field">
          <span className="step-2-inline-label">Интервал</span>
          <Input
            className="step-2-interval-input"
            value={quietInterval}
            onChange={(event) => {
              const nextInterval = event.target.value;
              setQuietInterval(nextInterval);
              setField('quietIntervalDraft', nextInterval);
            }}
            placeholder="23:00 — 08:00"
            autoComplete="off"
          />
        </label>
        {errors.quietFrom ? <small className="rm-form-error">{errors.quietFrom}</small> : null}
      </section>

      {!hideActions ? (
        <div className="onboarding-feature-actions step-2-actions">
          <Button
            htmlType="button"
            className="rm-nav-button rm-nav-button--ghost"
            onClick={onBack}
            disabled={!onBack}
          >
            <span>Назад</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
          </Button>

          {onSkip ? (
            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost"
              onClick={onSkip}
            >
              <span>Пропустить пока</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          ) : null}

          <Button htmlType="submit" className="rm-nav-button rm-nav-button--primary">
            <span>Далее</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
          </Button>
        </div>
      ) : null}
    </form>
  );
}
