import { useMemo, useState, type FormEvent } from 'react';
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
  selected: boolean;
  label: string;
  onClick: () => void;
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

function HabitPill({ selected, label, onClick, compact = false }: HabitPillProps) {
  return (
    <button
      type="button"
      className={[
        'step-2-pill',
        compact ? 'step-2-pill--compact' : '',
        selected ? 'is-selected' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <span className="step-2-pill__dot" />
      <span className="step-2-pill__label">{label}</span>
    </button>
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
        <div className="step-2-pills step-2-pills--sleep">
          <HabitPill
            selected={formValue.sleepSchedule === 'early_bird'}
            label="Ложусь рано"
            onClick={() => setField('sleepSchedule', 'early_bird')}
          />
          <HabitPill
            selected={formValue.sleepSchedule === 'night_owl'}
            label="Ложусь позже"
            onClick={() => setField('sleepSchedule', 'night_owl')}
          />
        </div>
        {errors.sleepSchedule ? (
          <small className="rm-form-error">{errors.sleepSchedule}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Курение</h4>
        <div className="step-2-pills step-2-pills--smoking">
          <HabitPill
            compact
            selected={formValue.smokingPreference === 'no'}
            label="Нет"
            onClick={() => setSmoking('no')}
          />
          <HabitPill
            compact
            selected={formValue.smokingPreference === 'yes'}
            label="Да"
            onClick={() => setSmoking('yes')}
          />
          <HabitPill
            compact
            selected={formValue.smokingPreference === 'outside_only'}
            label="Только на улице"
            onClick={() => setSmoking('outside_only')}
          />
        </div>
        {errors.smokingPreference ? (
          <small className="rm-form-error">{errors.smokingPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Алкоголь</h4>
        <div className="step-2-pills step-2-pills--smoking">
          <HabitPill
            compact
            selected={formValue.alcoholPreference === 'no'}
            label="Не пью"
            onClick={() => setField('alcoholPreference', 'no')}
          />
          <HabitPill
            compact
            selected={formValue.alcoholPreference === 'rarely'}
            label="Редко"
            onClick={() => setField('alcoholPreference', 'rarely')}
          />
          <HabitPill
            compact
            selected={formValue.alcoholPreference === 'socially'}
            label="Иногда"
            onClick={() => setField('alcoholPreference', 'socially')}
          />
          <HabitPill
            compact
            selected={formValue.alcoholPreference === 'yes'}
            label="Нормально"
            onClick={() => setField('alcoholPreference', 'yes')}
          />
        </div>
        {errors.alcoholPreference ? (
          <small className="rm-form-error">{errors.alcoholPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Шум / Чистота / Гости</h4>

        <div className="step-2-inline-list">
          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Шум</span>
            <div className="step-2-pills step-2-pills--compact-row">
              <HabitPill
                compact
                selected={formValue.noiseLevel === 'quiet'}
                label="Тишина"
                onClick={() => setField('noiseLevel', 'quiet')}
              />
              <HabitPill
                compact
                selected={formValue.noiseLevel === 'moderate'}
                label="Норм"
                onClick={() => setField('noiseLevel', 'moderate')}
              />
              <HabitPill
                compact
                selected={formValue.noiseLevel === 'social'}
                label="Шумно"
                onClick={() => setField('noiseLevel', 'social')}
              />
            </div>
          </div>
          {errors.noiseLevel ? <small className="rm-form-error">{errors.noiseLevel}</small> : null}

          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Чистота</span>
            <div className="step-2-pills step-2-pills--compact-row">
              <HabitPill
                compact
                selected={formValue.cleanliness === 'high'}
                label="Аккуратно"
                onClick={() => setField('cleanliness', 'high')}
              />
              <HabitPill
                compact
                selected={formValue.cleanliness === 'medium'}
                label="Средне"
                onClick={() => setField('cleanliness', 'medium')}
              />
              <HabitPill
                compact
                selected={formValue.cleanliness === 'low'}
                label="Не важно"
                onClick={() => setField('cleanliness', 'low')}
              />
            </div>
          </div>
          {errors.cleanliness ? (
            <small className="rm-form-error">{errors.cleanliness}</small>
          ) : null}

          <div className="step-2-inline-row">
            <span className="step-2-inline-label">Гости</span>
            <div className="step-2-pills step-2-pills--compact-row">
              <HabitPill
                compact
                selected={formValue.guestFrequency === 'rarely'}
                label="Редко"
                onClick={() => setField('guestFrequency', 'rarely')}
              />
              <HabitPill
                compact
                selected={formValue.guestFrequency === 'sometimes'}
                label="Иногда"
                onClick={() => setField('guestFrequency', 'sometimes')}
              />
              <HabitPill
                compact
                selected={formValue.guestFrequency === 'often'}
                label="Часто"
                onClick={() => setField('guestFrequency', 'often')}
              />
            </div>
          </div>
          {errors.guestFrequency ? (
            <small className="rm-form-error">{errors.guestFrequency}</small>
          ) : null}
        </div>
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Порядок в комнате</h4>
        <div className="step-2-pills step-2-pills--pets">
          <HabitPill
            compact
            selected={formValue.roomOrderPreference === 'strict'}
            label="Строго"
            onClick={() => setField('roomOrderPreference', 'strict')}
          />
          <HabitPill
            compact
            selected={formValue.roomOrderPreference === 'balanced'}
            label="Баланс"
            onClick={() => setField('roomOrderPreference', 'balanced')}
          />
          <HabitPill
            compact
            selected={formValue.roomOrderPreference === 'flexible'}
            label="Гибко"
            onClick={() => setField('roomOrderPreference', 'flexible')}
          />
        </div>
        {errors.roomOrderPreference ? (
          <small className="rm-form-error">{errors.roomOrderPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Животные</h4>
        <div className="step-2-pills step-2-pills--pets">
          <HabitPill
            compact
            selected={formValue.petPreference === 'pet_friendly'}
            label="Ок"
            onClick={() => setField('petPreference', 'pet_friendly')}
          />
          <HabitPill
            compact
            selected={formValue.petPreference === 'no_pets'}
            label="Не ок"
            onClick={() => setField('petPreference', 'no_pets')}
          />
        </div>
        {errors.petPreference ? (
          <small className="rm-form-error">{errors.petPreference}</small>
        ) : null}
      </section>

      <section className="step-2-group">
        <h4 className="step-2-group__title">Тихие часы</h4>
        <label className="step-2-interval-field">
          <span className="step-2-inline-label">Интервал</span>
          <input
            className="step-2-interval-input"
            value={quietInterval}
            onChange={(event) => setQuietInterval(event.target.value)}
            placeholder="23:00 — 08:00"
          />
        </label>
        {errors.quietFrom ? <small className="rm-form-error">{errors.quietFrom}</small> : null}
      </section>

      {!hideActions ? (
        <div className="onboarding-feature-actions">
          <button
            type="button"
            className="rm-nav-button rm-nav-button--ghost"
            onClick={onBack}
            disabled={!onBack}
          >
            <span>Назад</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
          </button>

          <button type="submit" className="rm-nav-button rm-nav-button--primary">
            <span>Далее</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
          </button>
        </div>
      ) : null}
    </form>
  );
}
