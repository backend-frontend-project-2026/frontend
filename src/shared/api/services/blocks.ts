import {
  deleteUsersByBlockedUserIdBlock,
  getUsersByUserIdBlockedUsers,
  postUsersByBlockedUserIdBlock,
  type BlockedUsersResponse,
  type OperationMessageResponse,
} from '@/shared/api/generated';

export const blocksApi = {

  getBlockedUsers: async (userId: number): Promise<BlockedUsersResponse> => {
    const result = await getUsersByUserIdBlockedUsers<true>({
      path: {
        user_id: userId,
      },
      throwOnError: true,
    });

    return result.data;
  },
  block: async (
    blockedUserId: number,
    blockerUserId: number
  ): Promise<OperationMessageResponse> => {
    const result = await postUsersByBlockedUserIdBlock<true>({
      path: {
        blocked_user_id: blockedUserId,
      },
      body: {
        blocker_user_id: blockerUserId,
      },
      throwOnError: true,
    });

    return result.data;
  },

  unblock: async (
    blockedUserId: number,
    blockerUserId: number
  ): Promise<OperationMessageResponse> => {
    const result = await deleteUsersByBlockedUserIdBlock<true>({
      path: {
        blocked_user_id: blockedUserId,
      },
      query: {
        blocker_user_id: blockerUserId,
      },
      throwOnError: true,
    });

    return result.data;
  },
};