import {
  postDealsByDealIdReactions,
  type ReactionResponse,
} from '@/shared/api/generated';

type ReactionType = 'like' | 'dislike';

type CreateDealReactionParams = {
  dealId: number;
  profileId: number;
  reactionType: ReactionType;
};

export const reactionsApi = {
  createForDeal: async ({
                          dealId,
                          profileId,
                          reactionType,
                        }: CreateDealReactionParams): Promise<ReactionResponse | undefined> => {
    const result = await postDealsByDealIdReactions({
      path: {
        deal_id: dealId,
      },
      body: {
        profile_id: profileId,
        reaction_type: reactionType,
      },
      throwOnError: true,
    });

    return result.data;
  },
};