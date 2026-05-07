import { useEffect, useMemo, useState, type FormEvent, useRef } from 'react';
import {
  Button,
  Input,
  message,
  Radio,
  Select,
  Typography,
  Upload,
  type RadioChangeEvent,
} from 'antd';import type { BasicInfoErrors, BasicInfoFormValue } from './types';
import './edit-basic-info.css';
import { DEFAULT_BASIC_INFO_FORM_VALUE } from './constants';
import { mediaApi, type MediaUploadKind } from '@/shared/api/services/media';
import { referencesApi } from '@/shared/api/services/references';
import { revokeObjectUrl, validateImageFile } from './lib/basicInfoHelpers';

const { TextArea } = Input;
const { Title } = Typography;

type ReferenceNameOption = {
  value: string;
  label: string;
  id: number;
};

type EditBasicInfoProps = {
  initialValue?: Partial<BasicInfoFormValue>;
  onBack?: () => void;
  onNext: (value: BasicInfoFormValue) => void;
  onChange?: (value: BasicInfoFormValue) => void;
  onSkip?: () => void;
  formId?: string;
  hideHeader?: boolean;
  hideActions?: boolean;
};

export function EditBasicInfo({
  initialValue,
  onBack,
  onNext,
  onChange,
  onSkip,
  formId,
  hideHeader = false,
  hideActions = false,
}: EditBasicInfoProps) {
  const mergedInitialValue = useMemo(
    () => ({
      ...DEFAULT_BASIC_INFO_FORM_VALUE,
      ...initialValue,
      photos: initialValue?.photos ?? DEFAULT_BASIC_INFO_FORM_VALUE.photos,
    }),
    [initialValue]
  );
  const [formValue, setFormValue] = useState<BasicInfoFormValue>(mergedInitialValue);
  const [errors, setErrors] = useState<BasicInfoErrors>({});
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [universityOptions, setUniversityOptions] = useState<ReferenceNameOption[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<ReferenceNameOption[]>([]);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [isUniversitiesLoading, setIsUniversitiesLoading] = useState(false);
  const [isFacultiesLoading, setIsFacultiesLoading] = useState(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);
  const uploadedMediaIdsByUrlRef = useRef<Record<string, number>>({});

  useEffect(() => {
    objectUrlsRef.current = [formValue.avatar, ...formValue.photos].filter((url) =>
      url.startsWith('blob:')
    );
  }, [formValue.avatar, formValue.photos]);

  const selectedUniversityId = useMemo(
    () => universityOptions.find((option) => option.value === formValue.university)?.id ?? null,
    [formValue.university, universityOptions]
  );

  useEffect(() => {
    let isMounted = true;

    setIsUniversitiesLoading(true);

    referencesApi
      .listUniversities({ page: 1, page_size: 1000 })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        setUniversityOptions(
          (result.data?.items ?? [])
            .filter((university) => university.id && university.name?.trim())
            .map((university) => ({
              id: university.id as number,
              value: university.name as string,
              label: university.name as string,
            }))
        );
      })
      .catch(() => {
        if (isMounted) {
          setUniversityOptions([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsUniversitiesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!selectedUniversityId) {
      setFacultyOptions([]);
      return () => {
        isMounted = false;
      };
    }

    setIsFacultiesLoading(true);

    referencesApi
      .listFaculties(selectedUniversityId, { page: 1, page_size: 1000 })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        setFacultyOptions(
          (result.data?.items ?? [])
            .filter((faculty) => faculty.id && faculty.name?.trim())
            .map((faculty) => ({
              id: faculty.id as number,
              value: faculty.name as string,
              label: faculty.name as string,
            }))
        );
      })
      .catch(() => {
        if (isMounted) {
          setFacultyOptions([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFacultiesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedUniversityId]);

  useEffect(() => {
    let isMounted = true;

    setIsCitiesLoading(true);

    referencesApi
      .listCities({ page: 1, page_size: 100 })
      .then(({ items }) => {
        if (!isMounted) {
          return;
        }

        setCityOptions(
          items.map((city) => ({
            value: city.name,
            label: city.name,
          }))
        );
      })
      .catch(() => {
        if (isMounted) {
          setCityOptions([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCitiesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(revokeObjectUrl);
    };
  }, []);
  useEffect(() => {
    onChange?.(formValue);
  }, [formValue, onChange]);

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

  function removeUploadedMedia(mediaId: number) {
    void mediaApi.remove(mediaId).catch(() => {
      message.warning('Фото убрано из анкеты, но не удалилось с сервера.');
    });
  }

  function removeUploadedMediaByUrl(url: string) {
    const mediaId = uploadedMediaIdsByUrlRef.current[url];

    if (!mediaId) {
      return;
    }

    removeUploadedMedia(mediaId);
    delete uploadedMediaIdsByUrlRef.current[url];
  }

  function removePhoto(index: number) {
    setFormValue((current) => {
      const removedPhoto = current.photos[index];

      if (removedPhoto) {
        removeUploadedMediaByUrl(removedPhoto);
        revokeObjectUrl(removedPhoto);
      }

      return {
        ...current,
        photos: current.photos.filter((_, photoIndex) => photoIndex !== index),
      };
    });
  }

  function clearAvatar() {
    setFormValue((current) => {
      if (current.avatar) {
        removeUploadedMediaByUrl(current.avatar);
        revokeObjectUrl(current.avatar);
      }

      return {
        ...current,
        avatar: '',
      };
    });

    setErrors((current) => ({
      ...current,
      avatar: undefined,
    }));
  }

  function setUploadError(message: string) {
    setErrors((current) => ({ ...current, photos: message }));
  }

  function clearUploadErrors() {
    setErrors((current) => ({
      ...current,
      avatar: undefined,
      photos: undefined,
    }));
  }

  async function uploadProfileImage(file: File, kind: MediaUploadKind) {
    const validationError = validateImageFile(file);

    if (validationError) {
      setUploadError(validationError);
      return null;
    }

    try {
      const uploadedMedia = await mediaApi.upload(file, kind);
      clearUploadErrors();

      uploadedMediaIdsByUrlRef.current[uploadedMedia.url] = uploadedMedia.id;

      return uploadedMedia;
    } catch {
      setUploadError('Не удалось загрузить изображение на сервер. Попробуйте другой файл.');
      message.error('Не удалось загрузить изображение на сервер.');
      return null;
    }
  }

  async function handleAvatarUpload(file: File) {
    if (isAvatarUploading) {
      return;
    }

    setIsAvatarUploading(true);

    try {
      const uploadedMedia = await uploadProfileImage(file, 'avatar');

      if (!uploadedMedia) {
        return;
      }

      setFormValue((current) => {
        if (current.avatar) {
          removeUploadedMediaByUrl(current.avatar);
          revokeObjectUrl(current.avatar);
        }

        return {
          ...current,
          avatar: uploadedMedia.url,
        };
      });
    } finally {
      setIsAvatarUploading(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    if (isPhotoUploading) {
      return;
    }

    if (formValue.photos.length >= 6) {
      setUploadError('Можно загрузить не больше 6 дополнительных фото.');
      return;
    }

    setIsPhotoUploading(true);

    try {
      const uploadedMedia = await uploadProfileImage(file, 'profile_photo');

      if (!uploadedMedia) {
        return;
      }

      setFormValue((current) => {
        const remainingSlots = Math.max(0, 6 - current.photos.length);

        if (remainingSlots === 0) {
          removeUploadedMedia(uploadedMedia.id);
          delete uploadedMediaIdsByUrlRef.current[uploadedMedia.url];

          return current;
        }

        return {
          ...current,
          photos: [...current.photos, uploadedMedia.url].slice(0, 6),
        };
      });
    } finally {
      setIsPhotoUploading(false);
    }
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

    if (!value.avatar.trim() && value.photos.length === 0) {
      nextErrors.avatar = 'Добавь хотя бы одно фото.';
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
          <Title level={3} className="rm-form-title">
            Профиль
          </Title>
          <p className="rm-form-description">Базовая информация для анкеты и discover.</p>
        </div>
      ) : null}

      {isStepEmpty ? (
        <div className="onboarding-form-state">
          <Title level={4} className="onboarding-form-state__title">
            Черновик пока пустой
          </Title>
          <p className="onboarding-form-state__text">Добавь имя, пол, вуз и хотя бы одно фото.</p>
        </div>
      ) : null}

      {isStepIncomplete ? (
        <div className="onboarding-form-state onboarding-form-state--warning">
          <Title level={4} className="onboarding-form-state__title">
            Анкета заполнена не до конца
          </Title>
          <p className="onboarding-form-state__text">
            На этом шаге ещё не хватает части базовой информации или фото для профиля.
          </p>
        </div>
      ) : null}

      <section className="rm-form-section">
        <div className="rm-form-section__head">
          <Title level={4} className="rm-form-section__title">
            Пол
          </Title>
          <p className="rm-form-helper">Нужен для анкеты и фильтров</p>
        </div>

        <Radio.Group
          className="rm-form-choice-grid rm-form-radio-group"
          value={formValue.gender}
          onChange={(event: RadioChangeEvent) => setField('gender', event.target.value)}
        >
          <Radio value="female" className="rm-form-radio-card">
            <span className="rm-form-radio-card__top">
              <span className="onboarding-choice-card-title">Женский</span>
              <span className="rm-form-radio-card__check" aria-hidden="true">
                ✓
              </span>
            </span>
            <span className="onboarding-choice-card-description">Для анкеты и фильтров</span>
          </Radio>

          <Radio value="male" className="rm-form-radio-card">
            <span className="rm-form-radio-card__top">
              <span className="onboarding-choice-card-title">Мужской</span>
              <span className="rm-form-radio-card__check" aria-hidden="true">
                ✓
              </span>
            </span>
            <span className="onboarding-choice-card-description">Для анкеты и фильтров</span>
          </Radio>
        </Radio.Group>

        {errors.gender ? <small className="rm-form-error">{errors.gender}</small> : null}
      </section>

      <div className="rm-form-grid">
        <label className="rm-form-field rm-form-field--name">
          <span className="rm-form-label">Имя</span>
          <Input
            className="rm-form-input"
            value={formValue.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="Алекс"
          />
          {errors.name ? <small className="rm-form-error">{errors.name}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--age">
          <span className="rm-form-label">Возраст</span>
          <Input
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
          <Select
            className="rm-form-input"
            value={formValue.university || undefined}
            onChange={(value) => {
              setFormValue((current) => ({
                ...current,
                university: value ?? '',
                faculty: '',
              }));
              setErrors((current) => ({
                ...current,
                university: undefined,
                faculty: undefined,
              }));
            }}
            placeholder="Выбери вуз"
            options={universityOptions}
            loading={isUniversitiesLoading}
            showSearch
            allowClear
            optionFilterProp="label"
            notFoundContent={isUniversitiesLoading ? 'Загрузка...' : 'Вузы не найдены'}
          />
          {errors.university ? <small className="rm-form-error">{errors.university}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--faculty">
          <span className="rm-form-label">Факультет</span>
          <Select
            className="rm-form-input"
            value={formValue.faculty || undefined}
            onChange={(value) => setField('faculty', value ?? '')}
            placeholder={selectedUniversityId ? 'Выбери факультет' : 'Сначала выбери вуз'}
            options={facultyOptions}
            loading={isFacultiesLoading}
            disabled={!selectedUniversityId}
            showSearch
            allowClear
            optionFilterProp="label"
            notFoundContent={isFacultiesLoading ? 'Загрузка...' : 'Факультеты не найдены'}
          />
          {errors.faculty ? <small className="rm-form-error">{errors.faculty}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--course">
          <span className="rm-form-label">Курс</span>
          <Input
            className="rm-form-input"
            value={formValue.course}
            onChange={(event) => setField('course', event.target.value)}
            placeholder="2 курс"
          />
          {errors.course ? <small className="rm-form-error">{errors.course}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--location">
          <span className="rm-form-label">Город</span>
          <Select
            className="rm-form-input"
            value={formValue.location || undefined}
            onChange={(value) => setField('location', value ?? '')}
            placeholder="Выбери город"
            options={cityOptions}
            loading={isCitiesLoading}
            showSearch
            allowClear
            optionFilterProp="label"
            notFoundContent={isCitiesLoading ? 'Загрузка...' : 'Города не найдены'}
          />
          {errors.location ? <small className="rm-form-error">{errors.location}</small> : null}
        </label>

        <label className="rm-form-field rm-form-field--bio">
          <span className="rm-form-label">Короткое био (2–3 строки)</span>
          <TextArea
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
          <Title level={4} className="rm-form-section__title">
            Фото
          </Title>
          <p className="rm-form-helper">
            Главное фото будет аватаром в карточке профиля, дополнительные фото попадут в галерею.
          </p>
        </div>

        {errors.avatar ? <small className="rm-form-error">{errors.avatar}</small> : null}

        <div className="rm-form-upload-row">
          <Upload
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            showUploadList={false}
            beforeUpload={(file) => {
              void handleAvatarUpload(file);
              return false;
            }}
          >
            <Button
              htmlType="button"
              loading={isAvatarUploading}
              className="rm-form-upload-button rm-form-upload-button--ant"
            >
              {formValue.avatar ? 'Заменить аватар' : 'Загрузить аватар'}
            </Button>
          </Upload>

          <Upload
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            showUploadList={false}
            beforeUpload={(file) => {
              void handlePhotoUpload(file);
              return false;
            }}
          >
            <Button
              htmlType="button"
              loading={isPhotoUploading}
              disabled={formValue.photos.length >= 6}
              className="rm-form-upload-button rm-form-upload-button--secondary rm-form-upload-button--ant"
            >
              Добавить фото в галерею
            </Button>
          </Upload>
        </div>

        {errors.photos ? <small className="rm-form-error">{errors.photos}</small> : null}

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

                <Button
                  htmlType="button"
                  type="text"
                  className="rm-form-gallery-remove"
                  onClick={clearAvatar}
                >
                  Убрать аватар
                </Button>
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

                <Button
                  htmlType="button"
                  type="text"
                  className="rm-form-gallery-remove"
                  onClick={() => removePhoto(index)}
                >
                  Убрать
                </Button>
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
          <div className="rm-actions-row">
            {onBack ? (
              <Button
                htmlType="button"
                className="rm-nav-button rm-nav-button--ghost"
                onClick={onBack}
              >
                <span>Назад</span>
                <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
              </Button>
            ) : null}

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
