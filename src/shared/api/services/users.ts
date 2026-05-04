import { getUsersByUserId, type UserResponse } from '@/shared/api/generated';

export const usersApi = {
  getById: async (userId: number): Promise<UserResponse> => {
    const result = await getUsersByUserId<true>({
      path: {
        user_id: userId,
      },
      throwOnError: true,
    });

    return result.data;
  },
};