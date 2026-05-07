import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { User } from '@/entities/user';
import {
  applyFiltersToUsers,
  INITIAL_DISCOVER_ACTION_STATE,
  likeProfile,
  skipProfile,
  superLikeProfile,
  type DiscoverActionState,
} from '@/features/discover';
import { getCurrentUserId } from '@/shared/api/auth/currentUser';
import { profilesApi } from '@/shared/api/services/profiles';
import { mapProfileResponsesToUsers } from '@/shared/api/services/profileUserMapper';
import { DiscoverContext } from './discover-context';
import { useFiltersFlow } from './filters-context';
import type { DiscoverContextValue } from './types';
import { keepOnlyLikedAndSuperLikedIds } from './lib/discoverState';

export function DiscoverProvider({ children }: PropsWithChildren) {
  const { activeFilters } = useFiltersFlow();
  const [discoverUsers, setDiscoverUsers] = useState<User[]>([]);
  const [discoverState, setDiscoverState] = useState<DiscoverActionState>(
    INITIAL_DISCOVER_ACTION_STATE
  );

  useEffect(() => {
    let isCancelled = false;

    const loadDiscoverUsers = async () => {
      try {
        const [currentUserId, profilesResult] = await Promise.all([
          getCurrentUserId().catch(() => null),
          profilesApi.list({ page: 1, page_size: 100 }),
        ]);

        const users = await mapProfileResponsesToUsers(profilesResult.data?.items ?? []);

        if (!isCancelled) {
          setDiscoverUsers(
            currentUserId === null
              ? users
              : users.filter((user) => user.id !== String(currentUserId))
          );
        }
      } catch {
        if (!isCancelled) {
          setDiscoverUsers([]);
        }
      }
    };

    void loadDiscoverUsers();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(
    () => applyFiltersToUsers(discoverUsers, activeFilters),
    [activeFilters, discoverUsers]
  );

  const availableUsers = useMemo(
    () => filteredUsers.filter((user) => !discoverState.dismissedUserIds.includes(user.id)),
    [discoverState.dismissedUserIds, filteredUsers]
  );

  const currentDiscoverUser = availableUsers[0] ?? null;

  const handleLike = useCallback((user: User) => {
    setDiscoverState((currentState) => likeProfile(user, currentState));
  }, []);

  const handleSkip = useCallback((user: User) => {
    setDiscoverState((currentState) => skipProfile(user, currentState));
  }, []);

  const handleSuperLike = useCallback((user: User) => {
    setDiscoverState((currentState) => superLikeProfile(user, currentState));
  }, []);

  const clearSkippedProfiles = useCallback(() => {
    setDiscoverState((currentState) => keepOnlyLikedAndSuperLikedIds(currentState));
  }, []);

  const value = useMemo<DiscoverContextValue>(
    () => ({
      discoverState,
      discoverUsers,
      filteredUsers,
      availableUsers,
      currentDiscoverUser,
      totalUsersCount: discoverUsers.length,
      matchingUsersCount: filteredUsers.length,
      handleLike,
      handleSkip,
      handleSuperLike,
      clearSkippedProfiles,
    }),
    [
      discoverState,
      discoverUsers,
      filteredUsers,
      availableUsers,
      currentDiscoverUser,
      handleLike,
      handleSkip,
      handleSuperLike,
      clearSkippedProfiles,
    ]
  );

  return <DiscoverContext.Provider value={value}>{children}</DiscoverContext.Provider>;
}