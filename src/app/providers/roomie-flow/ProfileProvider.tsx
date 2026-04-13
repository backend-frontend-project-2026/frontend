import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { MOCK_DETAILED_USER, MOCK_DISCOVER_USERS, type User } from '@/entities/user';
import { useDiscoverFlow } from './discover-context';
import { ProfileContext } from './profile-context';
import type { ProfileContextValue } from './types';

export function ProfileProvider({ children }: PropsWithChildren) {
    const { currentDiscoverUser } = useDiscoverFlow();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const profileUser = useMemo(
        () => selectedUser ?? currentDiscoverUser ?? MOCK_DETAILED_USER,
        [selectedUser, currentDiscoverUser]
    );

    const openProfile = useCallback((user: User) => {
        setSelectedUser(user.id === MOCK_DETAILED_USER.id ? MOCK_DETAILED_USER : user);
    }, []);

    const selectProfileById = useCallback(
        (userId?: string) => {
            if (!userId) {
                setSelectedUser(currentDiscoverUser ?? MOCK_DETAILED_USER);
                return;
            }

            const foundUser = MOCK_DISCOVER_USERS.find((user) => user.id === userId);

            if (!foundUser) {
                setSelectedUser(currentDiscoverUser ?? MOCK_DETAILED_USER);
                return;
            }

            setSelectedUser(foundUser.id === MOCK_DETAILED_USER.id ? MOCK_DETAILED_USER : foundUser);
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