import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { MOCK_DISCOVER_USERS, type User } from '@/entities/user';
import {
    applyFiltersToUsers,
    INITIAL_DISCOVER_ACTION_STATE,
    likeProfile,
    skipProfile,
    superLikeProfile,
    type DiscoverActionState,
} from '@/features/discover';
import { DiscoverContext } from './discover-context';
import { useFiltersFlow } from './filters-context';
import type { DiscoverContextValue } from './types';
import { keepOnlyLikedAndSuperLikedIds } from './lib/discoverState';

export function DiscoverProvider({ children }: PropsWithChildren) {
    const { activeFilters } = useFiltersFlow();
    const [discoverState, setDiscoverState] = useState<DiscoverActionState>(
        INITIAL_DISCOVER_ACTION_STATE
    );

    const filteredUsers = useMemo(
        () => applyFiltersToUsers(MOCK_DISCOVER_USERS, activeFilters),
        [activeFilters]
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
            filteredUsers,
            availableUsers,
            currentDiscoverUser,
            totalUsersCount: MOCK_DISCOVER_USERS.length,
            matchingUsersCount: filteredUsers.length,
            handleLike,
            handleSkip,
            handleSuperLike,
            clearSkippedProfiles,
        }),
        [
            discoverState,
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