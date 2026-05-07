import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getProfiles } from '@/shared/api/generated/sdk.gen';
import type { ProfileResponse, GetProfilesData } from '@/shared/api/generated';
import type { User, UserFilters } from '@/entities/user';
import { useFiltersFlow } from './filters-context';
import { DiscoverContext } from './discover-context';
import type { DiscoverContextValue } from './types';
import { mapProfileToUser } from './lib/mapProfileToUser';

function buildProfilesQuery(activeFilters: UserFilters): NonNullable<GetProfilesData['query']> {
  const query: NonNullable<GetProfilesData['query']> = {
    page: 1,
    page_size: 10,
  };

  if (activeFilters.ageMin) query.age_min = activeFilters.ageMin;
  if (activeFilters.ageMax) query.age_max = activeFilters.ageMax;
  if (activeFilters.gender && activeFilters.gender !== 'any') query.sex = activeFilters.gender;
  if (activeFilters.university) query.uni_id = Number(activeFilters.university);
  if (activeFilters.faculty) query.faculty_id = Number(activeFilters.faculty);
  if (activeFilters.location) query.city = activeFilters.location;
  if (activeFilters.district) query.neighbourhood_id = Number(activeFilters.district);
  if (activeFilters.course) query.course = Number(activeFilters.course);

  return query;
}

export function DiscoverProvider({ children }: PropsWithChildren) {
  const { activeFilters } = useFiltersFlow();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async (pageNum: number, filters: UserFilters) => {
    setLoading(true);
    setError(null);
    try {
      const query = buildProfilesQuery(filters);
      query.page = pageNum;
      const response = await getProfiles({ query });
      const data = response.data as { items?: ProfileResponse[]; total?: number; page?: number; page_size?: number };
      const items = data?.items || [];
      const newUsers = items.map(mapProfileToUser);
      const totalCount = data?.total || 0;

      setUsers(prev => (pageNum === 1 ? newUsers : [...prev, ...newUsers]));
      setTotal(totalCount);
      setHasMore((data?.page ?? 1) * (data?.page_size ?? 10) < totalCount);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Network error'));
      console.error('Failed to load profiles', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (!loading) {
      setError(null);
      setUsers([]);
      setDismissedIds([]);
      setPage(1);
      setHasMore(true);
      loadPage(1, activeFilters);
    }
  }, [loading, activeFilters, loadPage]);

  useEffect(() => {
    setError(null);
    setUsers([]);
    setDismissedIds([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, activeFilters);
  }, [activeFilters, loadPage]);

  const availableUsers = useMemo(() => users.filter(u => !dismissedIds.includes(u.id)), [users, dismissedIds]);
  const currentDiscoverUser = availableUsers[0] ?? null;

  const removeCurrentUser = useCallback(() => {
    if (!currentDiscoverUser) return;
    setDismissedIds(prev => [...prev, currentDiscoverUser.id]);
    if (availableUsers.length <= 2 && hasMore && !loading) {
      loadPage(page + 1, activeFilters);
    }
  }, [currentDiscoverUser, availableUsers.length, hasMore, loading, loadPage, page, activeFilters]);

  const handleLike = useCallback((_user: User) => {
    void _user;
    // TODO: отправить лайк
    removeCurrentUser();
  }, [removeCurrentUser]);

  const handleSkip = useCallback((_user: User) => {
    void _user;
    // TODO: отправить скип
    removeCurrentUser();
  }, [removeCurrentUser]);

  const handleSuperLike = useCallback((_user: User) => {
    void _user;
    // TODO: отправить суперлайк
    removeCurrentUser();
  }, [removeCurrentUser]);

  const clearSkippedProfiles = useCallback(() => {
    setDismissedIds([]);
  }, []);

  const value = useMemo<DiscoverContextValue>(
    () => ({
      discoverState: {
        likedUserIds: [],
        superLikedUserIds: [],
        dismissedUserIds: dismissedIds,
      },
      filteredUsers: users,
      availableUsers,
      currentDiscoverUser,
      totalUsersCount: total,
      matchingUsersCount: total,
      loading,
      error,
      retry,
      handleLike,
      handleSkip,
      handleSuperLike,
      clearSkippedProfiles,
    }),
    [
      dismissedIds,
      users,
      availableUsers,
      currentDiscoverUser,
      total,
      loading,
      error,
      retry,
      handleLike,
      handleSkip,
      handleSuperLike,
      clearSkippedProfiles,
    ]
  );

  return (
    <DiscoverContext.Provider value={value}>
      {children}
    </DiscoverContext.Provider>
  );
}