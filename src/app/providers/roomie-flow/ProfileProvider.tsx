import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { MOCK_DISCOVER_USERS, type User } from '@/entities/user';
import { useDiscoverFlow } from './discover-context';
import { ProfileContext } from './profile-context';
import type { ProfileContextValue } from './types';

export function ProfileProvider({ children }: PropsWithChildren) {
  const { currentDiscoverUser } = useDiscoverFlow();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const profileUser = useMemo(
    () => selectedUser, [selectedUser]
  );

  const openProfile = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const selectProfileById = useCallback(
    (userId?: string) => {
      if (!userId) {
        setSelectedUser(currentDiscoverUser ?? null);
        return;
      }

      const foundUser = MOCK_DISCOVER_USERS.find((user) => user.id === userId);

      if (!foundUser) {
        setSelectedUser(null); // ✅ честный not-found
        return;
      }

      setSelectedUser(foundUser);
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