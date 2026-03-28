import {
  getProfiles,
  getUsersByUserIdProfile,
  postUsersByUserIdProfile,
  putUsersByUserIdProfile,
  type GetProfilesData,
  type ProfileCreate,
  type ProfileUpdate,
} from '@/shared/api/generated';

type ProfilesListQuery = NonNullable<GetProfilesData['query']>;

export const profilesApi = {
  list: (query?: ProfilesListQuery) => getProfiles(query ? { query } : {}),

  getByUserId: (userId: number) => getUsersByUserIdProfile({ path: { user_id: userId } }),

  createForUser: (userId: number, body: ProfileCreate) =>
    postUsersByUserIdProfile({
      path: { user_id: userId },
      body,
    }),

  updateForUser: (userId: number, body: ProfileUpdate) =>
    putUsersByUserIdProfile({
      path: { user_id: userId },
      body,
    }),
};
