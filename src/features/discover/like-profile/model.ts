import type { User } from '../../../entities/user';
import { addUniqueId } from '../lib/addUniqueId';
import type { DiscoverActionState } from '../model/types';

export function likeProfile(user: User, state: DiscoverActionState): DiscoverActionState {
  return {
    ...state,
    dismissedUserIds: addUniqueId(state.dismissedUserIds, user.id),
    likedUserIds: addUniqueId(state.likedUserIds, user.id),
  };
}
