import {
  getAuthMe,
  postAuthLogin,
  postAuthRegister,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type UserResponse,
} from '@/shared/api/generated';

export const authApi = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const result = await postAuthLogin<true>({
      body,
      throwOnError: true,
    });

    return result.data;
  },

  register: async (body: RegisterRequest): Promise<AuthResponse> => {
    const result = await postAuthRegister<true>({
      body,
      throwOnError: true,
    });

    return result.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const result = await getAuthMe<true>({
      throwOnError: true,
    });

    return result.data;
  },
};
