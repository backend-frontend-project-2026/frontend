import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
import { getStoredUser } from '@/shared/api/auth/session';
import { authApi } from '@/shared/api/services/auth';
import { profilesApi } from '@/shared/api/services/profiles';
import { referencesApi } from '@/shared/api/services/references';
import type { ProfileResponse } from '@/shared/api/generated';
import { UserAvatar } from '@/entities/user';
import {
  getCleanlinessLabel,
  getGuestLabel,
  getNoiseLabel,
  getSmokingLabel,
} from '@/entities/user/lib/userHabitsGetters';
import styles from './ProfilePage.module.css';

const resolveGender = (sex?: string): 'female' | 'male' | '' =>
  sex === 'female' || sex === 'male' ? sex : '';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isPreparingEdit, setIsPreparingEdit] = useState(false);

  const { draft, replaceDraft } = useRoomieFlow();

  const profileName = draft.basicInfo.name.trim() || 'Без имени';
  const profileAge = draft.basicInfo.age.trim();
  const profileTitle = [profileName, profileAge].filter(Boolean).join(', ');

  const profileSubtitle =
    [
      draft.basicInfo.university.trim(),
      draft.basicInfo.location.trim(),
      draft.basicInfo.course.trim(),
    ]
      .filter(Boolean)
      .join(' • ') || '—';

  const profileTags = [
    draft.habits.noiseLevel ? getNoiseLabel(draft.habits.noiseLevel) : null,
    draft.habits.smokingPreference ? getSmokingLabel(draft.habits.smokingPreference) : null,
    draft.habits.cleanliness ? getCleanlinessLabel(draft.habits.cleanliness) : null,
    draft.habits.guestFrequency ? getGuestLabel(draft.habits.guestFrequency) : null,
    draft.habits.hasQuietHours && draft.habits.quietFrom && draft.habits.quietTo
      ? `Тихие часы ${draft.habits.quietFrom}–${draft.habits.quietTo}`
      : null,
  ].filter(Boolean) as string[];

  const profileBio =
    draft.basicInfo.bio.trim() ||
    draft.living.idealRoommateDescription.trim() ||
    draft.interests.compatibilityNote.trim() ||
    'Описание пока не заполнено.';

  const hydrateDraftFromProfile = async (profile: ProfileResponse) => {
    let universityName = draft.basicInfo.university;
    let facultyName = draft.basicInfo.faculty;

    try {
      if (profile.uni_id) {
        const universitiesResult = await referencesApi.listUniversities({
          page: 1,
          page_size: 1000,
        });

        const matchedUniversity = universitiesResult.data?.items?.find(
          (item) => item.id === profile.uni_id
        );

        if (matchedUniversity?.name?.trim()) {
          universityName = matchedUniversity.name.trim();
        }
      }

      if (profile.uni_id && profile.faculty_id) {
        const facultiesResult = await referencesApi.listFaculties(profile.uni_id, {
          page: 1,
          page_size: 1000,
        });

        const matchedFaculty = facultiesResult.data?.items?.find(
          (item) => item.id === profile.faculty_id
        );

        if (matchedFaculty?.name?.trim()) {
          facultyName = matchedFaculty.name.trim();
        }
      }
    } catch {
      // Если справочники не загрузились, не ломаем редактирование.
    }

    replaceDraft({
      ...draft,
      basicInfo: {
        ...draft.basicInfo,
        name: profile.name?.trim() || '',
        age: profile.age ? String(profile.age) : '',
        gender: resolveGender(profile.sex),
        university: universityName,
        faculty: facultyName,
        course: profile.course ? String(profile.course) : '',
        location: profile.city?.trim() || '',
        bio: profile.profile_description?.trim() || '',
      },
    });
  };

  const handleEditClick = async () => {
    if (isPreparingEdit) {
      return;
    }

    try {
      setIsPreparingEdit(true);

      let currentUserId = getStoredUser()?.id ?? null;

      if (!currentUserId) {
        const me = await authApi.getMe();
        currentUserId = me.id ?? null;
      }

      if (currentUserId) {
        const profileResult = await profilesApi.getByUserId(currentUserId);

        if (profileResult.data) {
          await hydrateDraftFromProfile(profileResult.data);
        }
      }
    } catch {
      message.warning('Не удалось загрузить профиль с сервера. Откроется локальный черновик.');
    } finally {
      setIsPreparingEdit(false);
      navigate(`${RoutePaths.ONBOARDING_STEP_1}?mode=edit`);
    }
  };

  const settingsItems = [
    {
      key: 'quiet-hours',
      label: 'Тихие часы',
      onClick: () => navigate(`${RoutePaths.SETTINGS}?section=quiet-hours`),
    },
    {
      key: 'privacy',
      label: 'Приватность',
      onClick: () => navigate(`${RoutePaths.SETTINGS}?section=privacy`),
    },
    {
      key: 'blacklist',
      label: 'Черный список',
      onClick: () => navigate(`${RoutePaths.SETTINGS}?section=blacklist`),
    },
    {
      key: 'help',
      label: 'Помощь',
      onClick: () => navigate(`${RoutePaths.SETTINGS}?section=help`),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Профиль */}
      <section className={styles.profileCard}>
        <div className={styles.header}>
          <UserAvatar
            src={draft.basicInfo.avatar || undefined}
            alt={profileName}
            name={profileName}
            size={60}
          />

          <div className={styles.userInfo}>
            <h2>{profileTitle}</h2>
            <p>{profileSubtitle}</p>
          </div>

          <button
            className={styles.editButton}
            type="button"
            onClick={handleEditClick}
            disabled={isPreparingEdit}
          >
            {isPreparingEdit ? 'Загрузка…' : 'Редактировать'}
          </button>
        </div>

        {/* Теги */}
        <div className={styles.tags}>
          {profileTags.length > 0 ? (
            profileTags.map((tag) => <span key={tag}>{tag}</span>)
          ) : (
            <span>Теги пока не заполнены</span>
          )}
        </div>

        {/* Короткое био */}
        <p className={styles.bio}>{profileBio}</p>
      </section>

      {/* Настройки */}
      <section className={styles.settings}>
        <h3>Настройки</h3>
        <ul>
          {settingsItems.map((item) => (
            <li key={item.key}>
              <button type="button" className={styles.settingsButton} onClick={item.onClick}>
                <span>{item.label}</span>
                <span className={styles.settingsArrow} aria-hidden="true">
                  &gt;
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProfilePage;
