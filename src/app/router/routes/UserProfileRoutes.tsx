import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
import { mapUserToFullProfile, type User } from '@/entities/user';
import UserProfileStatusPage from '@/pages/user-profile/ui/UserProfileStatusPage';
import { UserProfilePage } from '@/pages/user-profile';
import { profilesApi } from '@/shared/api/services/profiles';
import { mapProfileResponseToUser } from '@/shared/api/services/profileUserMapper';
import { resolveRouteUserId } from '@/shared/utils/route';
import styles from './UserProfileRoutes.module.css';

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
      void Promise.resolve().then(() => {
        if (!isCancelled) {
          setResolvedUser(null);
          setStatus('error');
        }
      });

      return () => {
        isCancelled = true;
        clearSelectedUser();
      };
    }

    void Promise.resolve().then(() => {
      if (!isCancelled) {
        setResolvedUser(null);
        setStatus('loading');
      }
    });

    void profilesApi
      .getByUserId(apiUserId)
      .then(async (result) => {
        if (isCancelled) {
          return;
        }

        if (result.data) {
          const mappedUser = await mapProfileResponseToUser(result.data, userId);

          if (isCancelled) {
            return;
          }

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
    return <UserProfileStatusPage variant="not-found" />;
  }

  if (status === 'error' || resolvedUser === null) {
    return <UserProfileStatusPage variant="error" />;
  }

  const fullProfile = mapUserToFullProfile(resolvedUser);

  return (
    <UserProfilePage
      user={fullProfile}
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
