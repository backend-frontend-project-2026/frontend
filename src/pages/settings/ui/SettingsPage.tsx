import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import { useBeforeUnload, useBlocker, useNavigate, useSearchParams } from 'react-router-dom';
import type { ProfileResponse } from '@/shared/api/generated';
import { RoutePaths } from '@/app/router/routePaths';
import { getCurrentUserId } from '@/shared/api/auth/currentUser';
import { clearAuthSession, getStoredUser } from '@/shared/api/auth/session';
import { profilesApi, type ProfileUpdatePayload } from '@/shared/api/services/profiles';
import { mediaApi } from '@/shared/api/services/media';
import { blocksApi } from '@/shared/api/services/blocks';
import styles from './SettingsPage.module.css';

const DEFAULT_INTERESTS_OPTIONS = ['Учёба', 'Спорт', 'Кино', 'Музыка'];

type SettingsPhoto = File | string | null;

type SettingsBlockedUser = {
  blockId: number;
  blockedUserId: number;
  label: string;
};

type ProfileHabitsPayload = Pick<
  ProfileUpdatePayload,
  | 'sleep_schedule'
  | 'cleanliness'
  | 'noise_level'
  | 'guest_frequency'
  | 'smoking_preference'
  | 'alcohol_preference'
  | 'room_order_preference'
  | 'pet_preference'
  | 'is_smoking_allowed'
  | 'has_pets'
>;

type HabitOption = {
  label: string;
  payload: Partial<ProfileHabitsPayload>;
};

const DEFAULT_PHOTOS: SettingsPhoto[] = [null, null, null];

const LEAVE_MESSAGE = 'Есть несохранённые изменения. Уйти со страницы без сохранения?';

type SettingsFormValues = {
  photos: SettingsPhoto[];
  name: string;
  age: number | '';
  budget: string;
  quietHours: string;
  habits: string[];
  interests: string[];
  bio: string;
  blockedUsers: SettingsBlockedUser[];
};

const cloneSettingsFormValues = (values: SettingsFormValues): SettingsFormValues => ({
  ...values,
  photos: [...values.photos],
  habits: [...values.habits],
  interests: [...values.interests],
  blockedUsers: values.blockedUsers.map((user) => ({ ...user })),
});

const createSettingsComparableSnapshot = (values: SettingsFormValues) =>
  JSON.stringify({
    ...values,
    photos: values.photos.map((photo) =>
      photo instanceof File ? `${photo.name}-${photo.size}-${photo.lastModified}` : photo
    ),
    habits: [...values.habits].sort(),
    interests: [...values.interests].sort(),
    blockedUsers: values.blockedUsers.map((user) => user.blockedUserId).sort((a, b) => a - b),
  });

const createDefaultSettingsFormValues = (): SettingsFormValues => ({
  photos: [...DEFAULT_PHOTOS],
  name: '',
  age: '',
  budget: '',
  quietHours: '',
  habits: [],
  interests: [],
  bio: '',
  blockedUsers: [],
});

const EMPTY_PROFILE_HABIT_PAYLOAD: ProfileHabitsPayload = {
  sleep_schedule: null,
  cleanliness: null,
  noise_level: null,
  guest_frequency: null,
  smoking_preference: null,
  alcohol_preference: null,
  room_order_preference: null,
  pet_preference: null,
  is_smoking_allowed: null,
  has_pets: null,
};

const HABIT_OPTIONS: HabitOption[] = [
  {
    label: 'Рано встаю',
    payload: { sleep_schedule: 'early_bird' },
  },
  {
    label: 'Поздно ложусь',
    payload: { sleep_schedule: 'night_owl' },
  },
  {
    label: 'Гибкий режим',
    payload: { sleep_schedule: 'flexible' },
  },

  {
    label: 'Чистота: базово',
    payload: { cleanliness: 'low' },
  },
  {
    label: 'Чистота: средне',
    payload: { cleanliness: 'medium' },
  },
  {
    label: 'Аккуратно',
    payload: { cleanliness: 'high' },
  },

  {
    label: 'Тишина',
    payload: { noise_level: 'quiet' },
  },
  {
    label: 'Умеренный шум',
    payload: { noise_level: 'moderate' },
  },
  {
    label: 'Активный ритм',
    payload: { noise_level: 'social' },
  },

  {
    label: 'Без гостей',
    payload: { guest_frequency: 'never' },
  },
  {
    label: 'Гости редко',
    payload: { guest_frequency: 'rarely' },
  },
  {
    label: 'Гости иногда',
    payload: { guest_frequency: 'sometimes' },
  },
  {
    label: 'Гости часто',
    payload: { guest_frequency: 'often' },
  },

  {
    label: 'Не курю',
    payload: {
      smoking_preference: 'no',
      is_smoking_allowed: false,
    },
  },
  {
    label: 'Курение только вне дома',
    payload: {
      smoking_preference: 'outside_only',
      is_smoking_allowed: false,
    },
  },
  {
    label: 'Курение допустимо',
    payload: {
      smoking_preference: 'yes',
      is_smoking_allowed: true,
    },
  },

  {
    label: 'Без животных',
    payload: {
      pet_preference: 'no_pets',
      has_pets: false,
    },
  },
  {
    label: 'Есть питомец',
    payload: {
      pet_preference: 'has_pets',
      has_pets: true,
    },
  },
  {
    label: 'Люблю животных',
    payload: { pet_preference: 'pet_friendly' },
  },
];

const HABIT_LABEL_UPDATE_VALUES = Object.fromEntries(
  HABIT_OPTIONS.map((option) => [option.label, option.payload])
) as Record<string, Partial<ProfileHabitsPayload>>;

const HABIT_VALUE_LABELS = Object.fromEntries(
  HABIT_OPTIONS.flatMap((option) =>
    Object.values(option.payload)
      .filter((value): value is string => typeof value === 'string')
      .map((value) => [value, option.label])
  )
) as Record<string, string>;

const DEFAULT_HABITS_OPTIONS = HABIT_OPTIONS.map((option) => option.label);

const getTrimmedString = (value?: string | null) => value?.trim() || '';

const createUniqueOptions = (baseOptions: string[], selectedOptions: string[]) =>
  Array.from(new Set([...baseOptions, ...selectedOptions.filter(Boolean)]));

const mapBlockedUsersToSettingsFormValues = (
  items: { id: number; blocked_user_id: number }[]
): SettingsBlockedUser[] =>
  items.map((item) => ({
    blockId: item.id,
    blockedUserId: item.blocked_user_id,
    label: `Пользователь #${item.blocked_user_id}`,
  }));

const getHabitLabel = (value?: string | null) => {
  const trimmedValue = getTrimmedString(value);

  if (!trimmedValue) {
    return '';
  }

  return HABIT_VALUE_LABELS[trimmedValue] ?? trimmedValue;
};

const createProfileHabitLabels = (profile: ProfileResponse) =>
  Array.from(
    new Set(
      [
        getHabitLabel(profile.sleep_schedule),
        getHabitLabel(profile.cleanliness),
        getHabitLabel(profile.noise_level),
        getHabitLabel(profile.guest_frequency),
        getHabitLabel(profile.smoking_preference),
        getHabitLabel(profile.alcohol_preference),
        getHabitLabel(profile.room_order_preference),
        getHabitLabel(profile.pet_preference),
      ].filter(Boolean)
    )
  );

const createProfilePhotoValues = (profile: ProfileResponse): SettingsPhoto[] => {
  const photoUrls = [
    getTrimmedString(profile.avatar_url),
    getTrimmedString(profile.profile_picture_url),
    ...(profile.photo_urls ?? []).map(getTrimmedString),
  ].filter(Boolean);

  const uniquePhotoUrls = Array.from(new Set(photoUrls));

  return [...uniquePhotoUrls, ...DEFAULT_PHOTOS].slice(0, DEFAULT_PHOTOS.length);
};

const formatProfileBudget = (profile: ProfileResponse) => {
  if (typeof profile.budget_min === 'number' && typeof profile.budget_max === 'number') {
    return `${profile.budget_min} — ${profile.budget_max}`;
  }

  if (typeof profile.budget_min === 'number') {
    return `от ${profile.budget_min}`;
  }

  if (typeof profile.budget_max === 'number') {
    return `до ${profile.budget_max}`;
  }

  return '';
};

const formatProfileQuietHours = (profile: ProfileResponse) => {
  const quietFrom = getTrimmedString(profile.quiet_from);
  const quietTo = getTrimmedString(profile.quiet_to);

  if (quietFrom && quietTo) {
    return `${quietFrom} — ${quietTo}`;
  }

  return quietFrom || quietTo;
};

const formatSettingPhotoLabel = (photo: SettingsPhoto, index: number) => {
  if (photo instanceof File) {
    return photo.name;
  }

  if (typeof photo === 'string' && photo.trim()) {
    return `Текущее фото ${index + 1}`;
  }

  return 'Фото не выбрано';
};

const parseBudgetValue = (
  value: string
): Pick<ProfileUpdatePayload, 'budget_min' | 'budget_max'> => {
  const numbers = value.match(/\d+/g)?.map(Number) ?? [];

  if (numbers.length === 0) {
    return {
      budget_min: null,
      budget_max: null,
    };
  }

  if (numbers.length === 1) {
    return {
      budget_min: numbers[0],
      budget_max: numbers[0],
    };
  }

  return {
    budget_min: numbers[0],
    budget_max: numbers[1],
  };
};

const createProfileHabitsPayload = (habits: string[]): ProfileHabitsPayload =>
  habits.reduce<ProfileHabitsPayload>(
    (payload, habit) => ({
      ...payload,
      ...(HABIT_LABEL_UPDATE_VALUES[habit] ?? {}),
    }),
    { ...EMPTY_PROFILE_HABIT_PAYLOAD }
  );

const parseQuietHoursValue = (
  value: string
): Pick<ProfileUpdatePayload, 'has_quiet_hours' | 'quiet_from' | 'quiet_to'> => {
  const [quietFrom = '', quietTo = ''] = value.split(/\s*[—-]\s*/).map((part) => part.trim());

  return {
    has_quiet_hours: Boolean(quietFrom && quietTo),
    quiet_from: quietFrom || null,
    quiet_to: quietTo || null,
  };
};

const mapProfileToSettingsFormValues = (profile: ProfileResponse): SettingsFormValues => ({
  ...createDefaultSettingsFormValues(),
  photos: createProfilePhotoValues(profile),
  name: profile.name ?? '',
  age: profile.age ?? '',
  budget: formatProfileBudget(profile),
  quietHours: formatProfileQuietHours(profile),
  habits: createProfileHabitLabels(profile),
  interests: Array.isArray(profile.interests) ? profile.interests : [],
  bio: profile.profile_description ?? '',
});

const createSettingsFormValuesFromUpdatedProfile = (
  profile: ProfileResponse,
  fallbackValues: SettingsFormValues
): SettingsFormValues => ({
  ...mapProfileToSettingsFormValues(profile),
  blockedUsers: fallbackValues.blockedUsers.map((user) => ({ ...user })),
});

const resolveSettingsPhotoUrls = async (photos: SettingsPhoto[]): Promise<string[]> => {
  const photoUrls = await Promise.all(
    photos.map(async (photo, index) => {
      if (photo instanceof File) {
        const uploadedPhoto = await mediaApi.upload(
          photo,
          index === 0 ? 'avatar' : 'profile_photo'
        );

        return uploadedPhoto.url;
      }

      return getTrimmedString(photo);
    })
  );

  return Array.from(new Set(photoUrls.filter((url): url is string => Boolean(url))));
};

const createProfileUpdatePayload = (
  values: SettingsFormValues,
  photoUrls: string[]
): ProfileUpdatePayload => ({
  name: values.name.trim() || null,
  age: typeof values.age === 'number' ? values.age : null,
  profile_description: values.bio.trim(),
  profile_picture_url: photoUrls[0] || null,
  avatar_url: photoUrls[0] || null,
  photo_urls: photoUrls,
  interests: values.interests,
  ...parseBudgetValue(values.budget),
  ...parseQuietHoursValue(values.quietHours),
  ...createProfileHabitsPayload(values.habits),
});

const syncBlockedUsers = async (
  blockerUserId: number,
  previousBlockedUsers: SettingsBlockedUser[],
  nextBlockedUsers: SettingsBlockedUser[]
) => {
  const nextBlockedUserIds = new Set(nextBlockedUsers.map((user) => user.blockedUserId));

  const usersToUnblock = previousBlockedUsers.filter(
    (user) => !nextBlockedUserIds.has(user.blockedUserId)
  );

  await Promise.all(
    usersToUnblock.map((user) => blocksApi.unblock(user.blockedUserId, blockerUserId))
  );
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const quietHoursRef = useRef<HTMLDivElement | null>(null);
  const privacyRef = useRef<HTMLDivElement | null>(null);
  const blacklistRef = useRef<HTMLDivElement | null>(null);
  const helpRef = useRef<HTMLDivElement | null>(null);

  const [photos, setPhotos] = useState<SettingsPhoto[]>(() => [...DEFAULT_PHOTOS]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [budget, setBudget] = useState('');
  const [quietHours, setQuietHours] = useState('');
  const [habits, setHabits] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const [blockedUsers, setBlockedUsers] = useState<SettingsBlockedUser[]>([]);
  const activeSection = searchParams.get('section');

  const [savedFormValues, setSavedFormValues] = useState<SettingsFormValues>(
    createDefaultSettingsFormValues
  );

  const allowImmediateNavigationRef = useRef(false);
  const [fileInputsVersion, setFileInputsVersion] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(
    () => getStoredUser()?.id ?? null
  );
  const [hasServerProfile, setHasServerProfile] = useState(false);

  const currentFormValues = useMemo<SettingsFormValues>(
    () => ({
      photos: [...photos],
      name,
      age,
      budget,
      quietHours,
      habits: [...habits],
      interests: [...interests],
      bio,
      blockedUsers: blockedUsers.map((user) => ({ ...user })),
    }),
    [photos, name, age, budget, quietHours, habits, interests, bio, blockedUsers]
  );

  const visibleHabitsOptions = useMemo(
    () => createUniqueOptions(DEFAULT_HABITS_OPTIONS, habits),
    [habits]
  );

  const visibleInterestsOptions = useMemo(
    () => createUniqueOptions(DEFAULT_INTERESTS_OPTIONS, interests),
    [interests]
  );

  const applyFormValues = useCallback((values: SettingsFormValues) => {
    const nextValues = cloneSettingsFormValues(values);

    setPhotos(nextValues.photos);
    setName(nextValues.name);
    setAge(nextValues.age);
    setBudget(nextValues.budget);
    setQuietHours(nextValues.quietHours);
    setHabits(nextValues.habits);
    setInterests(nextValues.interests);
    setBio(nextValues.bio);
    setBlockedUsers(nextValues.blockedUsers.map((user) => ({ ...user })));
  }, []);

  const isDirty = useMemo(
    () =>
      createSettingsComparableSnapshot(currentFormValues) !==
      createSettingsComparableSnapshot(savedFormValues),
    [currentFormValues, savedFormValues]
  );

  useBeforeUnload((event) => {
    if (!isDirty) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  });

  const navigationBlocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!isDirty || allowImmediateNavigationRef.current) {
      return false;
    }

    return (
      currentLocation.pathname !== nextLocation.pathname ||
      currentLocation.search !== nextLocation.search ||
      currentLocation.hash !== nextLocation.hash
    );
  });

  useEffect(() => {
    if (navigationBlocker.state !== 'blocked') {
      return;
    }

    if (window.confirm(LEAVE_MESSAGE)) {
      navigationBlocker.proceed();
      return;
    }

    navigationBlocker.reset();
  }, [navigationBlocker]);

  const restoreSavedForm = useCallback(() => {
    applyFormValues(savedFormValues);
  }, [applyFormValues, savedFormValues]);

  const resetNativeFileInputs = useCallback(() => {
    setFileInputsVersion((prev) => prev + 1);
  }, []);

  const runConfirmedNavigation = useCallback(
    (action: () => void) => {
      if (isDirty && !window.confirm(LEAVE_MESSAGE)) {
        return;
      }

      allowImmediateNavigationRef.current = true;
      action();

      window.setTimeout(() => {
        allowImmediateNavigationRef.current = false;
      }, 0);
    },
    [isDirty]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadSettings = async () => {
      try {
        setIsLoading(true);

        const resolvedUserId = await getCurrentUserId();

        if (resolvedUserId === null) {
          throw new Error('current_user_not_found');
        }

        if (isCancelled) {
          return;
        }

        setCurrentUserId(resolvedUserId);

        const profileResult = await profilesApi.getByUserId(resolvedUserId);

        let apiBlockedUsers: SettingsBlockedUser[] = [];

        try {
          const blockedUsersResult = await blocksApi.getBlockedUsers(resolvedUserId);
          apiBlockedUsers = mapBlockedUsersToSettingsFormValues(blockedUsersResult.items);
        } catch {
          if (!isCancelled) {
            message.warning('Профиль загружен, но черный список временно недоступен.');
          }
        }

        if (isCancelled) {
          return;
        }

        if (profileResult.data) {
          const nextValues = {
            ...mapProfileToSettingsFormValues(profileResult.data),
            blockedUsers: apiBlockedUsers,
          };

          applyFormValues(nextValues);
          setSavedFormValues(cloneSettingsFormValues(nextValues));
          setHasServerProfile(true);
          resetNativeFileInputs();
          return;
        }

        if (profileResult.response.status === 404) {
          const nextValues = {
            ...createDefaultSettingsFormValues(),
            blockedUsers: apiBlockedUsers,
          };

          applyFormValues(nextValues);
          setSavedFormValues(cloneSettingsFormValues(nextValues));
          setHasServerProfile(false);
          resetNativeFileInputs();
          return;
        }

        throw new Error('profile_load_failed');
      } catch {
        if (!isCancelled) {
          message.error('Не удалось загрузить настройки.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isCancelled = true;
    };
  }, [applyFormValues, resetNativeFileInputs]);

  useEffect(() => {
    if (activeSection === 'quiet-hours') {
      quietHoursRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (activeSection === 'privacy') {
      privacyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (activeSection === 'blacklist') {
      blacklistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (activeSection === 'help') {
      helpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  const getSectionClassName = (sectionKey: string) =>
    `${styles.sectionCard} ${activeSection === sectionKey ? styles.sectionCardActive : ''}`;

  const handleLogout = () => {
    runConfirmedNavigation(() => {
      clearAuthSession();
      navigate(RoutePaths.LANDING);
    });
  };

  const toggleOption = (
    option: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    state: string[]
  ) => {
    if (state.includes(option)) {
      setState(state.filter((o) => o !== option));
    } else {
      setState([...state, option]);
    }
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!currentUserId) {
      message.error('Не удалось определить текущего пользователя.');
      return;
    }

    if (!hasServerProfile) {
      message.error('Профиль на сервере ещё не создан. Сначала заверши онбординг.');
      return;
    }

    try {
      setIsSaving(true);

      const photoUrls = await resolveSettingsPhotoUrls(currentFormValues.photos);

      const result = await profilesApi.updateForUser(
        currentUserId,
        createProfileUpdatePayload(currentFormValues, photoUrls)
      );

      await syncBlockedUsers(
        currentUserId,
        savedFormValues.blockedUsers,
        currentFormValues.blockedUsers
      );

      if (!result.data) {
        throw new Error('profile_update_failed');
      }

      const nextValues = createSettingsFormValuesFromUpdatedProfile(result.data, currentFormValues);

      applyFormValues(nextValues);
      setSavedFormValues(cloneSettingsFormValues(nextValues));
      setHasServerProfile(true);
      resetNativeFileInputs();

      message.success('Сохранено');
    } catch {
      message.error('Не удалось сохранить настройки.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isDirty) {
      return;
    }

    restoreSavedForm();
    resetNativeFileInputs();
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Кнопка выхода */}
      <div className={styles.logoutButtonWrapper}>
        <button type="button" onClick={handleLogout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>
      {/* ЛЕВАЯ ЧАСТЬ */}
      <div className={styles.profileForm}>
        <div className={styles.photos}>
          {photos.map((photo, idx) => (
            <div key={idx} className={styles.photoSlot}>
              <input
                key={`${fileInputsVersion}-${idx}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  const newPhotos = [...photos];
                  newPhotos[idx] = file;
                  setPhotos(newPhotos);
                }}
              />

              <span className={styles.photoMeta}>{formatSettingPhotoLabel(photo, idx)}</span>
            </div>
          ))}
        </div>

        <input
          className={styles.input}
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => {
            const nextValue = e.target.value;
            setAge(nextValue === '' ? '' : Number(nextValue));
          }}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Бюджет"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <div ref={quietHoursRef} className={getSectionClassName('quiet-hours')}>
          <h4>Тихие часы</h4>
          <p className={styles.sectionHint}>Укажи интервал, когда дома нужен тихий режим.</p>

          <input
            className={`${styles.input} ${styles.quietHours}`}
            type="text"
            placeholder="Например, 23:00 — 08:00"
            value={quietHours}
            onChange={(e) => setQuietHours(e.target.value)}
          />
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className={styles.preferences}>
        <div className={styles.section}>
          <h4>Привычки</h4>
          <div className={styles.options}>
            {visibleHabitsOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.option} ${habits.includes(option) ? styles.active : ''}`}
                onClick={() => toggleOption(option, setHabits, habits)}
              >
                <span className={styles.dot}>●</span> {option}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h4>Интересы</h4>
          <div className={styles.options}>
            {visibleInterestsOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.option} ${interests.includes(option) ? styles.active : ''}`}
                onClick={() => toggleOption(option, setInterests, interests)}
              >
                <span className={styles.dot}>●</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* БИО */}
        <div className={styles.bioBlock}>
          <label className={styles.bioLabel}>Короткое био</label>
          <textarea className={styles.bio} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div ref={privacyRef} className={getSectionClassName('privacy')}>
          <h4>Приватность</h4>

          <p className={styles.sectionHint}>
            Настройки приватности будут доступны после добавления соответствующих полей в API.
          </p>
        </div>

        <div ref={blacklistRef} className={getSectionClassName('blacklist')}>
          <h4>Черный список</h4>

          {blockedUsers.length ? (
            <div className={styles.stack}>
              {blockedUsers.map((user) => (
                <div key={user.blockId} className={styles.listRow}>
                  <span>{user.label}</span>
                  <button
                    type="button"
                    className={styles.inlineAction}
                    onClick={() =>
                      setBlockedUsers((prev) =>
                        prev.filter((item) => item.blockedUserId !== user.blockedUserId)
                      )
                    }
                  >
                    Разблокировать
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Список пуст.</p>
          )}
        </div>

        <div ref={helpRef} className={getSectionClassName('help')}>
          <h4>Помощь</h4>
          <p className={styles.sectionHint}>
            Если возникла проблема с пользователем, можно открыть экран жалобы и блокировки.
          </p>

          <button
            type="button"
            className={styles.inlineAction}
            onClick={() => navigate(RoutePaths.REPORT)}
          >
            Открыть жалобу
          </button>
        </div>

        {/* КНОПКИ */}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancel}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Отмена
            <span className={styles.iconCircle}>
              <span className={styles.arrow}>↗</span>
            </span>
          </button>

          <button
            type="button"
            className={styles.save}
            onClick={handleSave}
            disabled={isSaving || !hasServerProfile}
          >
            {isSaving ? 'Сохранение…' : 'Сохранить'}
            <span className={styles.iconCircle}>
              <span className={styles.arrow}>↗</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
