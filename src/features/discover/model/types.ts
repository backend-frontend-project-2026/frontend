export type DiscoverActionState = {
  dismissedUserIds: string[];
  likedUserIds: string[];
  superLikedUserIds: string[];
};

export const initialDiscoverActionState: DiscoverActionState = {
  dismissedUserIds: [],
  likedUserIds: [],
  superLikedUserIds: [],
};
