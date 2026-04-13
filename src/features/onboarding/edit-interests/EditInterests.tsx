import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button, Input, Tag, Typography } from 'antd';
import '../onboarding-form.css';
import { DESKTOP_PREVIEW_TEXT, normalizeTag, PRESET_INTERESTS } from './lib/interestsConfig';
import type { InterestsErrors, InterestsFormValue } from './types';
import { DEFAULT_INTERESTS_FORM_VALUE } from './constants';

const { Title } = Typography;

type EditInterestsProps = {
  initialValue?: Partial<InterestsFormValue>;
  onBack?: () => void;
  onNext: (value: InterestsFormValue) => void;
  onChange?: (value: InterestsFormValue) => void;
  onSkip?: () => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

export function EditInterests({
  initialValue,
  onBack,
  onNext,
  onChange,
  onSkip,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditInterestsProps) {
  const mergedInitialValue = useMemo(
    () => ({ ...DEFAULT_INTERESTS_FORM_VALUE, ...initialValue }),
    [initialValue]
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    mergedInitialValue.interests.length > 0 ? mergedInitialValue.interests : []
  );
  const [customTag, setCustomTag] = useState(mergedInitialValue.customTagDraft);
  const [bio, setBio] = useState(mergedInitialValue.compatibilityNote);
  const [errors, setErrors] = useState<InterestsErrors>({});

  useEffect(() => {
    onChange?.({
      interests: selectedInterests,
      compatibilityNote: bio,
      customTagDraft: customTag,
    });
  }, [selectedInterests, bio, customTag, onChange]);

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

  function validate(interests: string[], compatibilityNote: string) {
    const nextErrors: InterestsErrors = {};

    if (interests.length < 3) {
      nextErrors.interests = 'Нужно выбрать хотя бы 3 интереса.';
    }

    if (!compatibilityNote.trim()) {
      nextErrors.compatibilityNote = 'Добавь короткое био.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const withCustomTag = appendCustomTag();
    const finalInterests = Array.isArray(withCustomTag) ? withCustomTag : selectedInterests;
    const nextErrors = validate(finalInterests, bio);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onNext({
      interests: finalInterests,
      compatibilityNote: bio.trim(),
      customTagDraft: '',
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
          <Title level={3} className="onboarding-feature-title">
            Интересы
          </Title>
          <p className="onboarding-feature-description">
            Последний шаг для тегов и короткой заметки.
          </p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <Title level={4} className="onboarding-form-state__title">
            Шаг ещё пустой
          </Title>
          <p className="onboarding-form-state__text">
            Добавь интересы и короткую заметку о себе, чтобы анкета не выглядела пустой.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <Title level={4} className="onboarding-form-state__title">
            Интересов пока мало
          </Title>
          <p className="onboarding-form-state__text">
            Для этого шага лучше выбрать хотя бы 3 интереса и заполнить краткое био.
          </p>
        </div>
      ) : null}

      <section className="step-4-section">
        <div className="step-4-section__head">
          <Title level={4} className="step-4-section__title">
            Интересы
            <span className="step-4-section__title-extra"> (теги)</span>
          </Title>
          {errors.interests ? <small className="rm-form-error">{errors.interests}</small> : null}
        </div>

        <div className="step-4-tags-track">
          {PRESET_INTERESTS.map((interest) => {
            const selected = selectedInterests.includes(interest);

            return (
              <Tag.CheckableTag
                key={interest}
                checked={selected}
                className="step-4-tag step-4-tag-checkable"
                onChange={() => toggleInterest(interest)}
              >
                <span className="step-4-tag__dot" />
                <span className="step-4-tag__label">{interest}</span>
              </Tag.CheckableTag>
            );
          })}
        </div>
      </section>

      <label className="step-4-custom-field">
        <span className="step-4-field-label">Добавить тег</span>
        <Input
          className="step-4-input"
          value={customTag}
          onChange={(event) => setCustomTag(event.target.value)}
          onKeyDown={handleCustomTagKeyDown}
          placeholder="например: “йога”"
          autoComplete="off"
        />
      </label>

      {errors.compatibilityNote ? (
        <small className="rm-form-error">{errors.compatibilityNote}</small>
      ) : null}

      <label className="step-4-bio-field">
        <span className="step-4-field-label">Короткое био (2–3 строки)</span>
        <Input.TextArea
          className="step-4-bio-textarea"
          rows={3}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder=""
        />
        <span className="step-4-bio-preview">{bio.trim() || DESKTOP_PREVIEW_TEXT}</span>
      </label>

      {!hideActions ? (
        <div className="step-4-inner-actions step-4-actions">
          <Button htmlType="button" className="rm-nav-button rm-nav-button--ghost" onClick={onBack}>
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
            <span>Готово</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
          </Button>
        </div>
      ) : null}

      <p className="step-4-mobile-note">Можно изменить позже в профиле.</p>
    </form>
  );
}
