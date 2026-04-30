import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { withModeEdit } from '@/shared/utils/route';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
import { getCurrentUserId } from '@/shared/api/auth/currentUser';
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

const DEFAULT_PROFILE_REFERENCE_NAMES = {
  university: '',
  faculty: '',
};

const resolveGender = (sex?: string): 'female' | 'male' | '' =>
  sex === 'female' || sex === 'male' ? sex : '';

const getTrimmedValue = (value?: string) => value?.trim() || '';

const getProfilePhotoUrls = (profile: ProfileResponse) =>
  Array.isArray(profile.photo_urls) ? profile.photo_urls : [];

const getProfileAvatar = (profile?: ProfileResponse | null) =>
  getTrimmedValue(profile?.avatar_url) || getTrimmedValue(profile?.profile_picture_url);


async function resolveProfileReferenceNames(profile: ProfileResponse) {
  const referenceNames = { ...DEFAULT_PROFILE_REFERENCE_NAMES };

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
        referenceNames.university = matchedUniversity.name.trim();
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
        referenceNames.faculty = matchedFaculty.name.trim();
      }
    }
  } catch {
    // Если справочники не загрузились, показываем остальные данные профиля.
  }

  return referenceNames;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [profileReferenceNames, setProfileReferenceNames] = useState(
    DEFAULT_PROFILE_REFERENCE_NAMES
  );
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isPreparingEdit, setIsPreparingEdit] = useState(false);

  const { draft, replaceDraft } = useRoomieFlow();

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        setIsProfileLoading(true);

        const currentUserId = await getCurrentUserId();

        if (!currentUserId) {
          if (!isCancelled) {
            setProfile(null);
            setProfileReferenceNames(DEFAULT_PROFILE_REFERENCE_NAMES);
          }

          return;
        }

        const profileResult = await profilesApi.getByUserId(currentUserId);

        if (isCancelled) {
          return;
        }

        if (!profileResult.data) {
          setProfile(null);
          setProfileReferenceNames(DEFAULT_PROFILE_REFERENCE_NAMES);
          return;
        }

        setProfile(profileResult.data);

        const referenceNames = await resolveProfileReferenceNames(profileResult.data);

        if (!isCancelled) {
          setProfileReferenceNames(referenceNames);
        }
      } catch {
        if (!isCancelled) {
          setProfile(null);
          setProfileReferenceNames(DEFAULT_PROFILE_REFERENCE_NAMES);
          message.warning('Не удалось загрузить профиль с сервера. Попробуйте обновить страницу.');        }
      } finally {
        if (!isCancelled) {
          setIsProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  const profileName = getTrimmedValue(profile?.name) || 'Без имени';
  const profileAge = profile?.age ? String(profile.age) : '';
  const profileTitle = [profileName, profileAge].filter(Boolean).join(', ');

  const profileSubtitle =
    [
      profileReferenceNames.university,
      getTrimmedValue(profile?.city),
      profile?.course ? `${profile.course} курс` : '',
    ]
      .filter(Boolean)
      .join(' • ') || '—';

  const profileNoiseLevel = profile?.noise_level || '';
  const profileSmokingPreference = profile?.smoking_preference || '';
  const profileCleanliness = profile?.cleanliness || '';
  const profileGuestFrequency = profile?.guest_frequency || '';
  const hasQuietHours = profile?.has_quiet_hours ?? false;
  const quietFrom = getTrimmedValue(profile?.quiet_from);
  const quietTo = getTrimmedValue(profile?.quiet_to);

  const profileTags = [
    profileNoiseLevel ? getNoiseLabel(profileNoiseLevel as Parameters<typeof getNoiseLabel>[0]) : null,
    profileSmokingPreference
      ? getSmokingLabel(profileSmokingPreference as Parameters<typeof getSmokingLabel>[0])
      : null,
    profileCleanliness
      ? getCleanlinessLabel(profileCleanliness as Parameters<typeof getCleanlinessLabel>[0])
      : null,
    profileGuestFrequency
      ? getGuestLabel(profileGuestFrequency as Parameters<typeof getGuestLabel>[0])
      : null,
    hasQuietHours && quietFrom && quietTo ? `Тихие часы ${quietFrom}–${quietTo}` : null,
  ].filter(Boolean) as string[];

  const profileBio =
    getTrimmedValue(profile?.profile_description) ||
    getTrimmedValue(profile?.ideal_roommate_description) ||
    getTrimmedValue(profile?.compatibility_note) ||
    'Описание пока не заполнено.';

  const avatarSrc = getProfileAvatar(profile) || undefined;

  const hydrateDraftFromProfile = async (nextProfile: ProfileResponse) => {
    const referenceNames = await resolveProfileReferenceNames(nextProfile);

    replaceDraft({
      ...draft,
      basicInfo: {
        ...draft.basicInfo,
        name: getTrimmedValue(nextProfile.name),
        age: nextProfile.age ? String(nextProfile.age) : '',
        gender: resolveGender(nextProfile.sex),
        university: referenceNames.university,
        faculty: referenceNames.faculty,
        course: nextProfile.course ? String(nextProfile.course) : '',
        location: getTrimmedValue(nextProfile.city),
        bio: getTrimmedValue(nextProfile.profile_description),
        avatar: getProfileAvatar(nextProfile),
        photos: getProfilePhotoUrls(nextProfile),
      },
      habits: {
        ...draft.habits,
        sleepSchedule: (nextProfile.sleep_schedule as typeof draft.habits.sleepSchedule) || '',
        cleanliness: (nextProfile.cleanliness as typeof draft.habits.cleanliness) || '',
        noiseLevel: (nextProfile.noise_level as typeof draft.habits.noiseLevel) || '',
        guestFrequency: (nextProfile.guest_frequency as typeof draft.habits.guestFrequency) || '',
        smokingPreference:
          (nextProfile.smoking_preference as typeof draft.habits.smokingPreference) || '',
        alcoholPreference:
          (nextProfile.alcohol_preference as typeof draft.habits.alcoholPreference) || '',
        roomOrderPreference:
          (nextProfile.room_order_preference as typeof draft.habits.roomOrderPreference) || '',
        petPreference: (nextProfile.pet_preference as typeof draft.habits.petPreference) || '',
        hasQuietHours: nextProfile.has_quiet_hours ?? false,
        quietFrom: getTrimmedValue(nextProfile.quiet_from),
        quietTo: getTrimmedValue(nextProfile.quiet_to),
        quietIntervalDraft:
          nextProfile.quiet_from && nextProfile.quiet_to
            ? `${nextProfile.quiet_from} — ${nextProfile.quiet_to}`
            : '',
        isSmokingAllowed: nextProfile.is_smoking_allowed ?? false,
        hasPets: nextProfile.has_pets ?? false,
      },
      living: {
        ...draft.living,
        budgetMin: nextProfile.budget_min != null ? String(nextProfile.budget_min) : '',
        budgetMax: nextProfile.budget_max != null ? String(nextProfile.budget_max) : '',
        moveInDate: getTrimmedValue(nextProfile.move_in_date),
        stayDuration: (nextProfile.stay_duration as typeof draft.living.stayDuration) || '',
        housingType: (nextProfile.housing_type as typeof draft.living.housingType) || '',
        livingNotes: getTrimmedValue(nextProfile.living_notes),
        idealRoommateDescription: getTrimmedValue(nextProfile.ideal_roommate_description),
        rentalCriteria: getTrimmedValue(nextProfile.rental_criteria),
      },
      interests: {
        ...draft.interests,
        interests: Array.isArray(nextProfile.interests) ? nextProfile.interests : [],
        compatibilityNote: getTrimmedValue(nextProfile.compatibility_note),
        customTagDraft: '',
      },
    });
  };

  const handleEditClick = async () => {
    if (isPreparingEdit) {
      return;
    }

    try {
      setIsPreparingEdit(true);

      let profileForEdit = profile;

      if (!profileForEdit) {
        const currentUserId = await getCurrentUserId();

        if (!currentUserId) {
          message.warning('Не удалось определить текущего пользователя.');
          return;
        }

        const profileResult = await profilesApi.getByUserId(currentUserId);

        if (!profileResult.data) {
          message.warning('Профиль не найден на сервере.');
          return;
        }

        profileForEdit = profileResult.data;
        setProfile(profileForEdit);

        const referenceNames = await resolveProfileReferenceNames(profileForEdit);
        setProfileReferenceNames(referenceNames);
      }

      await hydrateDraftFromProfile(profileForEdit);
      navigate(withModeEdit(RoutePaths.ONBOARDING_STEP_1));
    } catch {
      message.warning('Не удалось загрузить профиль с сервера. Попробуйте ещё раз.');
    } finally {
      setIsPreparingEdit(false);
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
          <UserAvatar src={avatarSrc} alt={profileName} name={profileName} size={60} />

          <div className={styles.userInfo}>
            <h2>{profileTitle}</h2>
            <p>{isProfileLoading ? 'Загрузка профиля…' : profileSubtitle}</p>
          </div>

          <button
            className={styles.editButton}
            type="button"
            onClick={handleEditClick}
            disabled={isPreparingEdit || isProfileLoading}
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
