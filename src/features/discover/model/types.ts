export type DiscoverActionState = {
  dismissedUserIds: string[];
  likedUserIds: string[];
  superLikedUserIds: string[];
};

export const INITIAL_DISCOVER_ACTION_STATE: DiscoverActionState = {
  dismissedUserIds: [],
  likedUserIds: [],
  superLikedUserIds: [],
};

export const initialDiscoverActionState = INITIAL_DISCOVER_ACTION_STATE;
