import type { DiscoverActionState } from '@/features/discover';

export function keepOnlyLikedAndSuperLikedIds(
    state: DiscoverActionState
): DiscoverActionState {
    return {
        ...state,
        dismissedUserIds: state.dismissedUserIds.filter(
            (id) => state.likedUserIds.includes(id) || state.superLikedUserIds.includes(id)
        ),
    };
}