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
import type { ProfileResponse } from '@/shared/api/generated';
import { profilesApi } from '@/shared/api/services/profiles';
import { mapProfileResponsesToUsers } from '@/shared/api/services/profileUserMapper';
import { DiscoverContext } from './discover-context';
import { useFiltersFlow } from './filters-context';
import type { DiscoverContextValue } from './types';
import { keepOnlyLikedAndSuperLikedIds } from './lib/discoverState';

const DISCOVER_PROFILES_FIRST_PAGE = 1;
const DISCOVER_PROFILES_PAGE_SIZE = 100;

async function loadAllDiscoverProfiles(): Promise<ProfileResponse[]> {
  const firstProfilesResult = await profilesApi.list({
    page: DISCOVER_PROFILES_FIRST_PAGE,
    page_size: DISCOVER_PROFILES_PAGE_SIZE,
  });

  const firstPageItems = firstProfilesResult.data?.items ?? [];
  const totalProfiles = firstProfilesResult.data?.total;

  if (typeof totalProfiles === 'number') {
    const pagesCount = Math.ceil(totalProfiles / DISCOVER_PROFILES_PAGE_SIZE);

    if (pagesCount <= DISCOVER_PROFILES_FIRST_PAGE) {
      return firstPageItems;
    }

    const nextPageNumbers = Array.from(
      { length: pagesCount - DISCOVER_PROFILES_FIRST_PAGE },
      (_, index) => DISCOVER_PROFILES_FIRST_PAGE + index + 1
    );

    const nextPagesResults = await Promise.all(
      nextPageNumbers.map((page) =>
        profilesApi.list({
          page,
          page_size: DISCOVER_PROFILES_PAGE_SIZE,
        })
      )
    );

    return [...firstPageItems, ...nextPagesResults.flatMap((result) => result.data?.items ?? [])];
  }

  const allProfiles = [...firstPageItems];

  if (firstPageItems.length < DISCOVER_PROFILES_PAGE_SIZE) {
    return allProfiles;
  }

  let nextPage = DISCOVER_PROFILES_FIRST_PAGE + 1;

  while (true) {
    const nextProfilesResult = await profilesApi.list({
      page: nextPage,
      page_size: DISCOVER_PROFILES_PAGE_SIZE,
    });

    const nextPageItems = nextProfilesResult.data?.items ?? [];

    if (nextPageItems.length === 0) {
      break;
    }

    allProfiles.push(...nextPageItems);

    if (nextPageItems.length < DISCOVER_PROFILES_PAGE_SIZE) {
      break;
    }

    nextPage += 1;
  }

  return allProfiles;
}

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
        const [currentUserId, profiles] = await Promise.all([
          getCurrentUserId().catch(() => null),
          loadAllDiscoverProfiles(),
        ]);

        const users = await mapProfileResponsesToUsers(profiles);

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
