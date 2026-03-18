import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { User } from '../../../entities/user';
import './edit-basic-info.css';

export type BasicInfoFormValue = {
  name: string;
  age: string;
  gender: User['gender'] | '';
  university: string;
  faculty: string;
  course: string;
  location: string;
  bio: string;
  avatar: string;
  photos: string[];
};

type BasicInfoErrors = Partial<Record<keyof BasicInfoFormValue, string>>;

type EditBasicInfoProps = {
  initialValue?: Partial<BasicInfoFormValue>;
  onBack?: () => void;
  onNext: (value: BasicInfoFormValue) => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

const defaultValue: BasicInfoFormValue = {
  name: '',
  age: '',
  gender: '',
  university: '',
  faculty: '',
  course: '',
  location: '',
  bio: '',
  avatar: '',
  photos: [],
};

function revokeObjectUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function EditBasicInfo({
  initialValue,
  onBack,
  onNext,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditBasicInfoProps) {
  const mergedInitialValue = useMemo(
    () => ({
      ...defaultValue,
      ...initialValue,
      photos: initialValue?.photos ?? defaultValue.photos,
    }),
    [initialValue]
  );

  const [formValue, setFormValue] = useState<BasicInfoFormValue>(mergedInitialValue);
  const [errors, setErrors] = useState<BasicInfoErrors>({});

  const filledMainFields = [
    formValue.name,
    formValue.age,
    formValue.gender,
    formValue.university,
    formValue.faculty,
    formValue.course,
    formValue.location,
    formValue.bio,
  ].filter((value) => String(value ?? '').trim()).length;

  const hasMedia = Boolean(formValue.avatar.trim()) || formValue.photos.length > 0;
  const isStepEmpty = filledMainFields === 0 && !hasMedia;
  const isStepIncomplete = !isStepEmpty && (filledMainFields < 8 || !hasMedia);

  function setField<K extends keyof BasicInfoFormValue>(field: K, value: BasicInfoFormValue[K]) {
    setFormValue((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (formValue.avatar) {
      revokeObjectUrl(formValue.avatar);
    }

    setField('avatar', URL.createObjectURL(file));
    event.target.value = '';
  }

  function handlePhotosUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const nextPhotos = files.map((file) => URL.createObjectURL(file));

    setFormValue((current) => ({
      ...current,
      photos: [...current.photos, ...nextPhotos].slice(0, 6),
    }));

    event.target.value = '';
  }

  function removePhoto(index: number) {
    setFormValue((current) => {
      const removedPhoto = current.photos[index];

      if (removedPhoto) {
        revokeObjectUrl(removedPhoto);
      }

      return {
        ...current,
        photos: current.photos.filter((_, photoIndex) => photoIndex !== index),
      };
    });
  }

  function clearAvatar() {
    if (formValue.avatar) {
      revokeObjectUrl(formValue.avatar);
    }

    setField('avatar', '');
  }

  function validate(value: BasicInfoFormValue) {
    const nextErrors: BasicInfoErrors = {};
    const ageNumber = Number(value.age);

    if (!value.name.trim()) {
      nextErrors.name = 'Укажи имя.';
    }

    if (!value.age.trim()) {
      nextErrors.age = 'Укажи возраст.';
    } else if (Number.isNaN(ageNumber) || ageNumber < 17 || ageNumber > 99) {
      nextErrors.age = 'Возраст должен быть от 17 до 99.';
    }

    if (!value.gender) {
      nextErrors.gender = 'Укажи пол.';
    }

    if (!value.university.trim()) {
      nextErrors.university = 'Укажи вуз.';
    }

    if (!value.faculty.trim()) {
      nextErrors.faculty = 'Укажи факультет.';
    }

    if (!value.course.trim()) {
      nextErrors.course = 'Укажи курс.';
    }

    if (!value.location.trim()) {
      nextErrors.location = 'Укажи город, район или общежитие.';
    }

    if (!value.bio.trim()) {
      nextErrors.bio = 'Добавь короткое био.';
    } else if (value.bio.trim().length < 12) {
      nextErrors.bio = 'Био должно быть хотя бы 12 символов.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(formValue);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onNext({
      name: formValue.name.trim(),
      age: formValue.age.trim(),
      gender: formValue.gender,
      university: formValue.university.trim(),
      faculty: formValue.faculty.trim(),
      course: formValue.course.trim(),
      location: formValue.location.trim(),
      bio: formValue.bio.trim(),
      avatar: formValue.avatar.trim(),
      photos: formValue.photos.map((photo) => photo.trim()).filter(Boolean),
    });
  }

  return (
    <form
      id={formId}
      className="rm-form-card rm-form-card--basic rm-form-card--profile"
      onSubmit={handleSubmit}
      noValidate
    >
      {!hideHeader ? (
        <div className="rm-form-head">
          <p className="rm-form-step">Шаг 1</p>
          <h3 className="rm-form-title">Профиль</h3>
          <p className="rm-form-description">Базовая информация для анкеты и discover.</p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <h4 className="onboarding-form-state__title">Черновик пока пустой</h4>
          <p className="onboarding-form-state__text">
            Добавь имя, пол, вуз и хотя бы одно фото, чтобы анкета начала выглядеть живой.
          </p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <h4 className="onboarding-form-state__title">Анкета заполнена не до конца</h4>
          <p className="onboarding-form-state__text">
            На этом шаге ещё не хватает части базовой информации или фото для профиля.
          </p>
        </div>
      ) : null}

      <section className="rm-form-section">
        <div className="rm-form-section__head">
          <h4 className="rm-form-section__title">Пол</h4>
          <p className="rm-form-helper">Нужен для анкеты и фильтров</p>
        </div>

        <div className="rm-form-choice-grid">
          <button
            type="button"
            className={[
              'onboarding-choice-card',
              formValue.gender === 'female' ? 'is-selected' : '',
            ].join(' ')}
            onClick={() => setField('gender', 'female')}
          >
            <span className="onboarding-choice-card-title">Женский</span>
            <span className="onboarding-choice-card-description">
              Показывать в анкете как женский профиль
            </span>
          </button>

          <button
            type="button"
            className={[
              'onboarding-choice-card',
              formValue.gender === 'male' ? 'is-selected' : '',
            ].join(' ')}
            onClick={() => setField('gender', 'male')}
          >
            <span className="onboarding-choice-card-title">Мужской</span>
            <span className="onboarding-choice-card-description">
              Показывать в анкете как мужской профиль
            </span>
          </button>
        </div>

        {errors.gender ? <small className="rm-form-error">{errors.gender}</small> : null}
      </section>

      <div className="rm-form-grid">
        <label className="rm-form-field rm-form-field--name">
          <span className="rm-form-label">Имя</span>
          <input
            className="rm-form-input"
            value={formValue.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="Алекс"
          />
          {errors.name ? <small className="rm-form-error">{errors.name}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--age">
          <span className="rm-form-label">Возраст</span>
          <input
            className="rm-form-input"
            value={formValue.age}
            onChange={(event) => setField('age', event.target.value)}
            placeholder="20"
            inputMode="numeric"
          />
          {errors.age ? <small className="rm-form-error">{errors.age}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--university">
          <span className="rm-form-label">Вуз</span>
          <input
            className="rm-form-input"
            value={formValue.university}
            onChange={(event) => setField('university', event.target.value)}
            placeholder="КФУ"
          />
          {errors.university ? <small className="rm-form-error">{errors.university}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--faculty">
          <span className="rm-form-label">Факультет</span>
          <input
            className="rm-form-input"
            value={formValue.faculty}
            onChange={(event) => setField('faculty', event.target.value)}
            placeholder="Институт ИТИС"
          />
          {errors.faculty ? <small className="rm-form-error">{errors.faculty}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--course">
          <span className="rm-form-label">Курс</span>
          <input
            className="rm-form-input"
            value={formValue.course}
            onChange={(event) => setField('course', event.target.value)}
            placeholder="2 курс"
          />
          {errors.course ? <small className="rm-form-error">{errors.course}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--location">
          <span className="rm-form-label">Город/район/общежитие</span>
          <input
            className="rm-form-input"
            value={formValue.location}
            onChange={(event) => setField('location', event.target.value)}
            placeholder="Казань, Приволжский, Д-3"
          />
          {errors.location ? <small className="rm-form-error">{errors.location}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--bio">
          <span className="rm-form-label">Короткое био (2–3 строки)</span>
          <textarea
            className="rm-form-input rm-form-textarea"
            value={formValue.bio}
            onChange={(event) => setField('bio', event.target.value)}
            placeholder="Люблю порядок, учусь допоздна, не курю."
            rows={2}
          />
          {errors.bio ? <small className="rm-form-error">{errors.bio}</small> : null}
        </label>
      </div>

      <section className="rm-form-section">
        <div className="rm-form-section__head">
          <h4 className="rm-form-section__title">Фото</h4>
          <p className="rm-form-helper">Аватар и дополнительные фото для профиля</p>
        </div>

        <div className="rm-form-upload-row">
          <label className="rm-form-upload-button">
            <input
              type="file"
              accept="image/*"
              className="rm-form-upload-input"
              onChange={handleAvatarUpload}
            />
            <span>{formValue.avatar ? 'Заменить аватар' : 'Загрузить аватар'}</span>
          </label>

          <label className="rm-form-upload-button rm-form-upload-button--secondary">
            <input
              type="file"
              accept="image/*"
              multiple
              className="rm-form-upload-input"
              onChange={handlePhotosUpload}
            />
            <span>Добавить фото</span>
          </label>
        </div>

        {hasMedia ? (
          <div className="rm-form-gallery">
            {formValue.avatar ? (
              <div className="rm-form-gallery-card">
                <div className="rm-form-gallery-item">
                  <img
                    className="rm-form-gallery-image"
                    src={formValue.avatar}
                    alt="Аватар профиля"
                  />
                </div>

                <button type="button" className="rm-form-gallery-remove" onClick={clearAvatar}>
                  Убрать аватар
                </button>
              </div>
            ) : null}

            {formValue.photos.map((photo, index) => (
              <div key={`${photo}-${index}`} className="rm-form-gallery-card">
                <div className="rm-form-gallery-item">
                  <img
                    className="rm-form-gallery-image"
                    src={photo}
                    alt={`Фото профиля ${index + 1}`}
                  />
                </div>

                <button
                  type="button"
                  className="rm-form-gallery-remove"
                  onClick={() => removePhoto(index)}
                >
                  Убрать
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="rm-form-helper">
            Пока нет фото. Загрузи хотя бы аватар, чтобы анкета выглядела завершённой.
          </p>
        )}
      </section>

      {!hideActions ? (
        <div className="rm-form-actions">
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
