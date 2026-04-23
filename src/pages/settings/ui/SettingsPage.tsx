import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import { useBeforeUnload, useBlocker, useNavigate, useSearchParams } from 'react-router-dom';
import type { ProfileResponse, ProfileUpdate } from '@/shared/api/generated';
import { RoutePaths } from '@/app/router/routePaths';
import { clearAuthSession, getStoredUser } from '@/shared/api/auth/session';
import { authApi } from '@/shared/api/services/auth';
import { profilesApi } from '@/shared/api/services/profiles';
import styles from './SettingsPage.module.css';

const habitsOptions = ['Тишина', 'Не курю', 'Аккуратно'];
const interestsOptions = ['Учёба', 'Спорт', 'Кино', 'Музыка'];

const DEFAULT_PHOTOS: (File | null)[] = [null, null, null];
const DEFAULT_BLOCKED_USERS = ['roomie_anna', 'student_igor'];

const LEAVE_MESSAGE = 'Есть несохранённые изменения. Уйти со страницы без сохранения?';

type SettingsFormValues = {
  photos: (File | null)[];
  name: string;
  age: number | '';
  budget: string;
  quietHours: string;
  habits: string[];
  interests: string[];
  bio: string;
  hideAge: boolean;
  hideBio: boolean;
  blockedUsers: string[];
};

const cloneSettingsFormValues = (values: SettingsFormValues): SettingsFormValues => ({
  ...values,
  photos: [...values.photos],
  habits: [...values.habits],
  interests: [...values.interests],
  blockedUsers: [...values.blockedUsers],
});

const createSettingsComparableSnapshot = (values: SettingsFormValues) =>
  JSON.stringify({
    ...values,
    photos: values.photos.map((photo) =>
      photo ? `${photo.name}-${photo.size}-${photo.lastModified}` : null
    ),
    habits: [...values.habits].sort(),
    interests: [...values.interests].sort(),
    blockedUsers: [...values.blockedUsers],
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
  hideAge: false,
  hideBio: false,
  blockedUsers: [...DEFAULT_BLOCKED_USERS],
});

const mapProfileToSettingsFormValues = (profile: ProfileResponse): SettingsFormValues => ({
  ...createDefaultSettingsFormValues(),
  name: profile.name ?? '',
  age: profile.age ?? '',
  bio: profile.profile_description ?? '',
});

const createProfileUpdatePayload = (values: SettingsFormValues): ProfileUpdate => ({
  name: values.name.trim() || undefined,
  age: typeof values.age === 'number' ? values.age : undefined,
  profile_description: values.bio.trim() || undefined,
});

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const quietHoursRef = useRef<HTMLDivElement | null>(null);
  const privacyRef = useRef<HTMLDivElement | null>(null);
  const blacklistRef = useRef<HTMLDivElement | null>(null);
  const helpRef = useRef<HTMLDivElement | null>(null);

  const [photos, setPhotos] = useState<(File | null)[]>(() => [...DEFAULT_PHOTOS]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [budget, setBudget] = useState('');
  const [quietHours, setQuietHours] = useState('');
  const [habits, setHabits] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const [hideAge, setHideAge] = useState(false);
  const [hideBio, setHideBio] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => [...DEFAULT_BLOCKED_USERS]);

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
      hideAge,
      hideBio,
      blockedUsers: [...blockedUsers],
    }),
    [photos, name, age, budget, quietHours, habits, interests, bio, hideAge, hideBio, blockedUsers]
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
    setHideAge(nextValues.hideAge);
    setHideBio(nextValues.hideBio);
    setBlockedUsers(nextValues.blockedUsers);
  }, []);

  const isDirty = useMemo(
    () =>
      createSettingsComparableSnapshot(currentFormValues) !==
      createSettingsComparableSnapshot(savedFormValues),
    [currentFormValues, savedFormValues]
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowImmediateNavigationRef.current &&
      isDirty &&
      `${currentLocation.pathname}${currentLocation.search}` !==
        `${nextLocation.pathname}${nextLocation.search}`
  );

  useBeforeUnload((event) => {
    if (!isDirty) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  });

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return;
    }

    if (window.confirm(LEAVE_MESSAGE)) {
      allowImmediateNavigationRef.current = true;
      blocker.proceed();
      return;
    }

    blocker.reset();
  }, [blocker]);

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
    },
    [isDirty]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadSettings = async () => {
      try {
        setIsLoading(true);

        let resolvedUserId = getStoredUser()?.id ?? null;

        if (!resolvedUserId) {
          const me = await authApi.getMe();
          resolvedUserId = me.id ?? null;
        }

        if (!resolvedUserId) {
          throw new Error('current_user_not_found');
        }

        if (isCancelled) {
          return;
        }

        setCurrentUserId(resolvedUserId);

        const result = await profilesApi.getByUserId(resolvedUserId);

        if (isCancelled) {
          return;
        }

        if (result.data) {
          const nextValues = mapProfileToSettingsFormValues(result.data);
          applyFormValues(nextValues);
          setSavedFormValues(cloneSettingsFormValues(nextValues));
          setHasServerProfile(true);
          resetNativeFileInputs();
          return;
        }

        if (result.response.status === 404) {
          const nextValues = createDefaultSettingsFormValues();
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

      await profilesApi.updateForUser(currentUserId, createProfileUpdatePayload(currentFormValues));

      setSavedFormValues(cloneSettingsFormValues(currentFormValues));
      resetNativeFileInputs();
      message.success('Настройки сохранены.');
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

              <span className={styles.photoMeta}>{photo ? photo.name : 'Фото не выбрано'}</span>
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
            {habitsOptions.map((option) => (
              <button
                key={option}
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
            {interestsOptions.map((option) => (
              <button
                key={option}
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

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={hideAge}
              onChange={(e) => setHideAge(e.target.checked)}
            />
            <span>Скрыть возраст в публичной анкете</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={hideBio}
              onChange={(e) => setHideBio(e.target.checked)}
            />
            <span>Скрыть короткое био до мэтча</span>
          </label>
        </div>

        <div ref={blacklistRef} className={getSectionClassName('blacklist')}>
          <h4>Черный список</h4>

          {blockedUsers.length ? (
            <div className={styles.stack}>
              {blockedUsers.map((user) => (
                <div key={user} className={styles.listRow}>
                  <span>{user}</span>
                  <button
                    type="button"
                    className={styles.inlineAction}
                    onClick={() => setBlockedUsers((prev) => prev.filter((item) => item !== user))}
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
