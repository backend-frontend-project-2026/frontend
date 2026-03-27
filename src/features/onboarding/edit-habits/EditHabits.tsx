import { useMemo, useState, type FormEvent } from 'react';
import { Button, Input, Radio } from 'antd';
import type { User } from '../../../entities/user';
import '../onboarding-form.css';

export type HabitsFormValue = {
  sleepSchedule: User['habits']['sleepSchedule'] | '';
  cleanliness: User['habits']['cleanliness'] | '';
  noiseLevel: User['habits']['noiseLevel'] | '';
  guestFrequency: User['habits']['guestFrequency'] | '';
  smokingPreference: User['habits']['smokingPreference'] | '';
  alcoholPreference: User['habits']['alcoholPreference'] | '';
  roomOrderPreference: User['habits']['roomOrderPreference'] | '';
  petPreference: User['habits']['petPreference'] | '';
  hasQuietHours: boolean;
  quietFrom: string;
  quietTo: string;
  isSmokingAllowed: boolean;
  hasPets: boolean;
};

type HabitsErrors = Partial<Record<keyof HabitsFormValue, string>>;

type EditHabitsProps = {
  initialValue?: Partial<HabitsFormValue>;
  onBack?: () => void;
  onNext: (value: HabitsFormValue) => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

type HabitPillProps = {
  value: string;
  label: string;
  compact?: boolean;
};

const defaultValue: HabitsFormValue = {
  sleepSchedule: '',
  cleanliness: '',
  noiseLevel: '',
  guestFrequency: '',
  smokingPreference: '',
  alcoholPreference: '',
  roomOrderPreference: '',
  petPreference: '',
  hasQuietHours: true,
  quietFrom: '',
  quietTo: '',
  isSmokingAllowed: false,
  hasPets: false,
};

function formatQuietInterval(from: string, to: string) {
  if (!from && !to) {
    return '';
  }

  return `${from} — ${to}`;
}

function parseQuietInterval(value: string) {
  const match = value.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);

  if (!match) {
    return null;
  }

  return {
    from: match[1],
    to: match[2],
  };
}

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
  formId,
  hideHeader = false,
  hideActions = false,
}: EditHabitsProps) {
  const mergedInitialValue = useMemo(() => ({ ...defaultValue, ...initialValue }), [initialValue]);

  const [formValue, setFormValue] = useState<HabitsFormValue>(mergedInitialValue);
  const [errors, setErrors] = useState<HabitsErrors>({});
  const [quietInterval, setQuietInterval] = useState(
    formatQuietInterval(mergedInitialValue.quietFrom, mergedInitialValue.quietTo)
  );

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
        }
      : formValue;

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
          <h3 className="onboarding-feature-title">Привычки</h3>
          <p className="onboarding-feature-description">
            Ритм жизни, бытовые привычки и общие условия совместного проживания.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <h4 className="onboarding-form-state__title">Шаг ещё пустой</h4>
          <p className="onboarding-form-state__text">
            Выбери бытовые привычки, чтобы анкета была совместимой по ритму жизни.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <h4 className="onboarding-form-state__title">Не все привычки заполнены</h4>
          <p className="onboarding-form-state__text">
            На этом шаге лучше выбрать все ключевые параметры: сон, курение, алкоголь, гости и
            порядок.
          </p>
        </div>
      ) : null}

      <section className="step-2-group">
        <h4 className="step-2-group__title">Режим</h4>
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
        <h4 className="step-2-group__title">Курение</h4>
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
        <h4 className="step-2-group__title">Алкоголь</h4>
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
        <h4 className="step-2-group__title">Шум / Чистота / Гости</h4>

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
        <h4 className="step-2-group__title">Порядок в комнате</h4>
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
        <h4 className="step-2-group__title">Животные</h4>
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
        <h4 className="step-2-group__title">Тихие часы</h4>
        <label className="step-2-interval-field">
          <span className="step-2-inline-label">Интервал</span>
          <Input
            className="step-2-interval-input"
            value={quietInterval}
            onChange={(event) => setQuietInterval(event.target.value)}
            placeholder="23:00 — 08:00"
            autoComplete="off"
          />
        </label>
        {errors.quietFrom ? <small className="rm-form-error">{errors.quietFrom}</small> : null}
      </section>

      {!hideActions ? (
        <div className="onboarding-feature-actions onboarding-page__actions--step-2">
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
