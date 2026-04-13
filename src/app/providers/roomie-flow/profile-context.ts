import { createContext, useContext } from 'react';
import type { ProfileContextValue } from './types';

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfileFlow() {
    const context = useContext(ProfileContext);

    if (!context) {
        throw new Error('useProfileFlow must be used inside ProfileProvider');
    }

    return context;
}