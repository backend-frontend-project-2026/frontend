import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getDeals, getProfiles } from '@/shared/api/generated/sdk.gen';
import type { DealResponse, ProfileResponse, GetProfilesData } from '@/shared/api/generated';
import { getStoredUser } from '@/shared/api/auth/session';
import { profilesApi } from '@/shared/api/services/profiles';
import { reactionsApi } from '@/shared/api/services/reactions';
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
  const { activeFilters, applyCurrentFilters } = useFiltersFlow();

  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);

  useEffect(() => {
    const currentUserId = getStoredUser()?.id;

    if (!currentUserId) {
      setCurrentProfileId(null);
      return;
    }

    void profilesApi
      .getByUserId(currentUserId)
      .then((result) => {
        setCurrentProfileId(result.data?.id ?? null);
      })
      .catch((error) => {
        console.error('Failed to load current profile', error);
        setCurrentProfileId(null);
      });
  }, []);

  // Загружаем сохранённые фильтры при первом рендере
  useEffect(() => {
    const savedFilters = localStorage.getItem('roomie_filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        // Применяем загруженные фильтры (если они есть)
        applyCurrentFilters(parsed);
      } catch (error) {
        console.error('Failed to load filters from localStorage', error);
      }
    }
  }, []);

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

      const [profilesResponse, dealsResponse] = await Promise.all([
        getProfiles({ query }),
        getDeals({
          query: {
            page: 1,
            page_size: 100,
          },
        }),
      ]);

      const data = profilesResponse.data as {
        items?: ProfileResponse[];
        total?: number;
        page?: number;
        page_size?: number;
      };

      const items = data?.items || [];
      const deals = (dealsResponse.data?.items ?? []) as DealResponse[];

      const dealIdByOwnerProfileId = new Map<number, number>();

      deals.forEach((deal) => {
        if (typeof deal.owner_profile_id === 'number' && typeof deal.id === 'number') {
          dealIdByOwnerProfileId.set(deal.owner_profile_id, deal.id);
        }
      });

      const newUsers = items.map((profile) => ({
        ...mapProfileToUser(profile),
        profileId: profile.id,
        dealId: dealIdByOwnerProfileId.get(profile.id),
      }));

      const totalCount = data?.total || 0;

      setUsers((prev) => (pageNum === 1 ? newUsers : [...prev, ...newUsers]));
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

  const handleLike = useCallback(
    async (user: User) => {
      if (!currentProfileId) {
        console.error('Cannot send like: current profile id is missing');
        return;
      }

      if (!user.dealId) {
        console.error('Cannot send like: target deal id is missing', user);
        return;
      }

      try {
        const reaction = await reactionsApi.createForDeal({
          dealId: user.dealId,
          profileId: currentProfileId,
          reactionType: 'like',
        });

        if (reaction?.mutual) {
          console.log('MATCH CREATED', reaction);
          alert('У вас новый мэтч!');
        }

        removeCurrentUser();
      } catch (error) {
        console.error('Failed to send like', error);
      }
    },
    [currentProfileId, removeCurrentUser]
  );

  const handleSkip = useCallback(
    async (user: User) => {
      if (!currentProfileId || !user.dealId) {
        removeCurrentUser();
        return;
      }

      try {
        await reactionsApi.createForDeal({
          dealId: user.dealId,
          profileId: currentProfileId,
          reactionType: 'dislike',
        });
      } catch (error) {
        console.error('Failed to send dislike', error);
      } finally {
        removeCurrentUser();
      }
    },
    [currentProfileId, removeCurrentUser]
  );

  const handleSuperLike = useCallback(
    async (user: User) => {
      if (!currentProfileId) {
        console.error('Cannot send superlike: current profile id is missing');
        return;
      }

      if (!user.dealId) {
        console.error('Cannot send superlike: target deal id is missing', user);
        return;
      }

      try {
        const reaction = await reactionsApi.createForDeal({
          dealId: user.dealId,
          profileId: currentProfileId,
          reactionType: 'like',
        });

        if (reaction?.mutual) {
          console.log('MATCH CREATED', reaction);
          alert('У вас новый мэтч!');
        }

        removeCurrentUser();
      } catch (error) {
        console.error('Failed to send superlike', error);
      }
    },
    [currentProfileId, removeCurrentUser]
  );

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

  return <DiscoverContext.Provider value={value}>{children}</DiscoverContext.Provider>;
}