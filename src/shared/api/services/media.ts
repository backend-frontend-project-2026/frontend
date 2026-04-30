import {
  deleteMediaByMediaId,
  postMediaUpload,
  type MediaUploadResponse,
} from '@/shared/api/generated';

export type MediaUploadKind = 'avatar' | 'profile_photo';

export const mediaApi = {
  upload: async (
    file: File,
    kind: MediaUploadKind
  ): Promise<MediaUploadResponse> => {
    const result = await postMediaUpload<true>({
      body: {
        file,
        kind,
      },
      throwOnError: true,
    });

    return result.data;
  },

  remove: async (mediaId: number): Promise<void> => {
    await deleteMediaByMediaId<true>({
      path: {
        media_id: mediaId,
      },
      throwOnError: true,
    });
  },
};