import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import type { User } from '@/entities/user';
import { profilesApi } from '@/shared/api/services/profiles';
import { mapProfileResponseToUser } from '@/shared/api/services/profileUserMapper';
import { resolveRouteUserId } from '@/shared/utils/route';
import { useDiscoverFlow } from './discover-context';
import { ProfileContext } from './profile-context';
import type { ProfileContextValue } from './types';

export function ProfileProvider({ children }: PropsWithChildren) {
  const { currentDiscoverUser } = useDiscoverFlow();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const profileUser = useMemo(() => selectedUser, [selectedUser]);

  const openProfile = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const selectProfileById = useCallback(
    (userId?: string) => {
      if (!userId) {
        setSelectedUser(currentDiscoverUser ?? null);
        return;
      }

      const resolvedUserId = resolveRouteUserId(userId);

      if (resolvedUserId === null) {
        setSelectedUser(null);
        return;
      }

      void profilesApi
        .getByUserId(resolvedUserId)
        .then(async (result) => {
          if (!result.data) {
            setSelectedUser(null);
            return;
          }

          const mappedUser = await mapProfileResponseToUser(result.data, userId);
          setSelectedUser(mappedUser);
        })
        .catch(() => {
          setSelectedUser(null);
        });
    },
    [currentDiscoverUser]
  );

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profileUser,
      openProfile,
      selectProfileById,
      clearSelectedUser,
    }),
    [profileUser, openProfile, selectProfileById, clearSelectedUser]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}