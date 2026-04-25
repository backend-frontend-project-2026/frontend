import {
  postComplaints,
  type ComplaintCreate,
  type ComplaintResponse,
} from '@/shared/api/generated';

export const complaintsApi = {
  create: async (body: ComplaintCreate): Promise<ComplaintResponse> => {
    const result = await postComplaints<true>({
      body,
      throwOnError: true,
    });

    return result.data;
  },
};
