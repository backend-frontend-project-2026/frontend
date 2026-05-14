import { getMatches } from '@/shared/api/generated';

export const matchesApi = {
  getMatches: async (profileId: number, signal?: AbortSignal) => {
    const result = await getMatches<true>({
      query: { profile_id: profileId },
      signal,
      throwOnError: true,
    });
    return result.data;
  },
};
