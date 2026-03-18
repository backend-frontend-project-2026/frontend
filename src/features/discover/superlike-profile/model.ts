import type { User } from '../../../entities/user';
import { addUniqueId } from '../lib/addUniqueId';
import type { DiscoverActionState } from '../model/types';

export function superLikeProfile(user: User, state: DiscoverActionState): DiscoverActionState {
  return {
    ...state,
    dismissedUserIds: addUniqueId(state.dismissedUserIds, user.id),
    superLikedUserIds: addUniqueId(state.superLikedUserIds, user.id),
  };
}
