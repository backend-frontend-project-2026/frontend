import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react';
import '../onboarding-form.css';

export type InterestsFormValue = {
  interests: string[];
  compatibilityNote: string;
};

type InterestsErrors = {
  interests?: string;
};

type EditInterestsProps = {
  initialValue?: Partial<InterestsFormValue>;
  onBack?: () => void;
  onNext: (value: InterestsFormValue) => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

const defaultValue: InterestsFormValue = {
  interests: [],
  compatibilityNote: '',
};

const presetInterests = ['Учёба', 'Спорт', 'Кино', 'Музыка', 'Игры', 'Кулинария'];
const desktopPreviewText = 'Люблю порядок и спокойные вечера. Ищу соседку на весенний семестр.';

function normalizeTag(value: string) {
  return value
    .trim()
    .replace(/^["“”']+|["“”']+$/g, '')
    .replace(/\s+/g, ' ');
}

export function EditInterests({
  initialValue,
  onBack,
  onNext,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditInterestsProps) {
  const mergedInitialValue = useMemo(() => ({ ...defaultValue, ...initialValue }), [initialValue]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    mergedInitialValue.interests.length > 0 ? mergedInitialValue.interests : []
  );
  const [customTag, setCustomTag] = useState('');
  const [bio, setBio] = useState(mergedInitialValue.compatibilityNote);
  const [errors, setErrors] = useState<InterestsErrors>({});

  const hasBio = Boolean(bio.trim());
  const isStepEmpty = selectedInterests.length === 0 && !hasBio;
  const isStepIncomplete = !isStepEmpty && (selectedInterests.length < 3 || !hasBio);

  function toggleInterest(value: string) {
    setSelectedInterests((current) => {
      const exists = current.includes(value);

      return exists ? current.filter((item) => item !== value) : [...current, value];
    });

    setErrors((current) => ({ ...current, interests: undefined }));
  }

  function appendCustomTag() {
    const normalized = normalizeTag(customTag);

    if (!normalized) {
      return selectedInterests;
    }

    if (selectedInterests.includes(normalized)) {
      setCustomTag('');
      return selectedInterests;
    }

    const next = [...selectedInterests, normalized];
    setSelectedInterests(next);
    setCustomTag('');
    setErrors((current) => ({ ...current, interests: undefined }));
    return next;
  }

  function handleCustomTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      appendCustomTag();
    }
  }

  function validate(interests: string[]) {
    const nextErrors: InterestsErrors = {};

    if (interests.length < 3) {
      nextErrors.interests = 'Нужно выбрать хотя бы 3 интереса.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const withCustomTag = appendCustomTag();
    const finalInterests = Array.isArray(withCustomTag) ? withCustomTag : selectedInterests;
    const nextErrors = validate(finalInterests);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onNext({
      interests: finalInterests,
      compatibilityNote: bio.trim() || desktopPreviewText,
    });
  }

  return (
    <form
      id={formId}
      className="onboarding-feature-card onboarding-feature-card--interests"
      onSubmit={handleSubmit}
      noValidate
    >
      {!hideHeader ? (
        <div className="onboarding-feature-copy">
          <p className="onboarding-feature-eyebrow">Шаг 4</p>
          <h3 className="onboarding-feature-title">Интересы</h3>
          <p className="onboarding-feature-description">
            Последний шаг для тегов и короткой заметки.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <h4 className="onboarding-form-state__title">Шаг ещё пустой</h4>
          <p className="onboarding-form-state__text">
            Добавь интересы и короткую заметку о себе, чтобы анкета не выглядела пустой.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <h4 className="onboarding-form-state__title">Интересов пока мало</h4>
          <p className="onboarding-form-state__text">
            Для этого шага лучше выбрать хотя бы 3 интереса и заполнить краткое био.
          </p>
        </div>
      ) : null}

      <section className="step-4-section">
        <div className="step-4-section__head">
          <h4 className="step-4-section__title">
            Интересы
            <span className="step-4-section__title-extra"> (теги)</span>
          </h4>
          {errors.interests ? <small className="rm-form-error">{errors.interests}</small> : null}
        </div>

        <div className="step-4-tags-track">
          {presetInterests.map((interest) => {
            const selected = selectedInterests.includes(interest);

            return (
              <button
                key={interest}
                type="button"
                className={['step-4-tag', selected ? 'is-selected' : ''].join(' ')}
                onClick={() => toggleInterest(interest)}
              >
                <span className="step-4-tag__dot" />
                <span className="step-4-tag__label">{interest}</span>
              </button>
            );
          })}
        </div>
      </section>

      <label className="step-4-custom-field">
        <span className="step-4-field-label">Добавить тег</span>
        <input
          className="step-4-input"
          value={customTag}
          onChange={(event) => setCustomTag(event.target.value)}
          onKeyDown={handleCustomTagKeyDown}
          placeholder="например: “йога”"
        />
      </label>

      <label className="step-4-bio-field">
        <span className="step-4-field-label">Короткое био (2–3 строки)</span>
        <textarea
          className="step-4-bio-textarea"
          rows={3}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder=""
        />
        <span className="step-4-bio-preview">{bio.trim() || desktopPreviewText}</span>
      </label>

      {!hideActions ? (
        <div className="step-4-inner-actions">
          <button type="button" className="rm-nav-button rm-nav-button--ghost" onClick={onBack}>
            <span>Назад</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
          </button>

          <button type="submit" className="rm-nav-button rm-nav-button--primary">
            <span>Готово</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
          </button>
        </div>
      ) : null}

      <p className="step-4-mobile-note">Можно изменить позже в профиле.</p>
    </form>
  );
}
