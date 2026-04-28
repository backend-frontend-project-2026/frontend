import {
  getChatsByChatId,
  getChatsByChatIdMessages,
  postChatsByChatIdMessages,
  type MessageCreate,
} from '@/shared/api/generated';

export const chatsApi = {
  getChat: async (chatId: number, signal?: AbortSignal) => {
    const result = await getChatsByChatId<true>({
      path: { chat_id: chatId },
      signal,
      throwOnError: true,
    });
    return result.data;
  },

  getMessages: async (chatId: number, signal?: AbortSignal) => {
    const result = await getChatsByChatIdMessages<true>({
      path: { chat_id: chatId },
      query: { page: 1, page_size: 100 },
      signal,
      throwOnError: true,
    });
    return result.data;
  },

  sendMessage: async (data: MessageCreate) => {
    const result = await postChatsByChatIdMessages<true>({
      path: { chat_id: data.chat_id },
      body: data,
      throwOnError: true,
    });
    return result.data;
  },
};
