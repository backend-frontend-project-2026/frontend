import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
import type { User } from '@/entities/user';
import { UserProfilePage } from '@/pages/user-profile';
import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';
import type { ProfileResponse } from '@/shared/api/generated';
import { profilesApi } from '@/shared/api/services/profiles';
import { resolveRouteUserId } from '@/shared/utils/route';
import styles from './UserProfileRoutes.module.css';

const DEFAULT_PROFILE_USER: Omit<User, 'id'> = {
  name: 'Пользователь',
  age: 18,
  gender: 'male',
  housingType: 'rental',
  university: 'Вуз не указан',
  course: 'Курс не указан',
  faculty: 'Факультет не указан',
  location: 'Локация не указана',
  district: 'Район не указан',
  bio: 'Пользователь пока не заполнил описание.',
  interests: [],
  habits: {
    sleepSchedule: 'flexible',
    cleanliness: 'medium',
    noiseLevel: 'moderate',
    guestFrequency: 'rarely',
    petPreference: 'no_pets',
    smokingPreference: 'no',
    alcoholPreference: 'no',
    roomOrderPreference: 'balanced',
  },
  budget: {
    min: 0,
    max: 0,
    currency: '₽',
    period: 'month',
  },
  moveInDate: 'Не указано',
  stayDuration: '6-12 months',
  idealRoommateDescription: '',
  rentalCriteria: '',
  avatar: '',
  photos: [],
  isSmokingAllowed: false,
  hasPets: false,
  hasQuietHours: false,
  verified: false,
  compatibilityNote: '',
};

function mapProfileResponseToUser(profile: ProfileResponse, routeUserId: string): User {
  const baseUser: User = {
    id: routeUserId,
    ...DEFAULT_PROFILE_USER,
  };

  return {
    ...baseUser,
    id: routeUserId,
    name: profile.name?.trim() || baseUser.name,
    age: profile.age ?? baseUser.age,
    gender: profile.sex === 'female' || profile.sex === 'male' ? profile.sex : baseUser.gender,
    university: profile.uni_id ? `Вуз #${profile.uni_id}` : baseUser.university,
    faculty: profile.faculty_id ? `Факультет #${profile.faculty_id}` : baseUser.faculty,
    course: profile.course ? `${profile.course} курс` : baseUser.course,
    location: profile.city?.trim() || baseUser.location,
    district: profile.neighbourhood_id ? `Район #${profile.neighbourhood_id}` : baseUser.district,
    bio: profile.profile_description?.trim() || baseUser.bio,
  };
}

export function UserProfileRoute() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { completed, openProfile, clearSelectedUser, handleLike, handleSkip, handleSuperLike } =
    useRoomieFlow();

  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>(
    userId ? 'loading' : 'error'
  );
  const [resolvedUser, setResolvedUser] = useState<User | null>(null);

  const apiUserId = useMemo(() => resolveRouteUserId(userId), [userId]);

  useEffect(() => {
    let isCancelled = false;

    if (!userId || apiUserId === null) {
      setResolvedUser(null);
      setStatus('error');
      return () => {
        clearSelectedUser();
      };
    }

    setResolvedUser(null);
    setStatus('loading');

    void profilesApi
      .getByUserId(apiUserId)
      .then((result) => {
        if (isCancelled) {
          return;
        }

        if (result.data) {
          const mappedUser = mapProfileResponseToUser(result.data, userId);
          setResolvedUser(mappedUser);
          openProfile(mappedUser);
          setStatus('ready');
          return;
        }

        if (result.response.status === 404) {
          setStatus('not-found');
          return;
        }

        setStatus('error');
      })
      .catch(() => {
        if (!isCancelled) {
          setStatus('error');
        }
      });

    return () => {
      isCancelled = true;
      clearSelectedUser();
    };
  }, [apiUserId, userId, openProfile, clearSelectedUser]);

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (status === 'not-found') {
    return <NotFoundPage />;
  }

  if (status === 'error' || resolvedUser === null) {
    return <NotFoundPage />;
  }

  return (
    <UserProfilePage
      user={resolvedUser}
      onBack={() => navigate(RoutePaths.DISCOVER)}
      onLike={() => {
        handleLike(resolvedUser);
        navigate(RoutePaths.DISCOVER);
      }}
      onSkip={() => {
        handleSkip(resolvedUser);
        navigate(RoutePaths.DISCOVER);
      }}
      onSuperLike={() => {
        handleSuperLike(resolvedUser);
        navigate(RoutePaths.DISCOVER);
      }}
      onReport={() => {
        navigate(RoutePaths.reportByUser(resolvedUser.id), {
          state: {
            reportedUserName: resolvedUser.name,
          },
        });
      }}
    />
  );
}