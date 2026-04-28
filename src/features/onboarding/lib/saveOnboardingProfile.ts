import { getStoredUser } from '@/shared/api/auth/session';
import { authApi } from '@/shared/api/services/auth';
import { profilesApi } from '@/shared/api/services/profiles';
import {
  createOnboardingProfilePayload,
  type OnboardingProfileDraft,
} from './onboardingProfilePayload';

async function getCurrentUserId(): Promise<number> {
  const storedUserId = getStoredUser()?.id ?? null;

  if (storedUserId) {
    return storedUserId;
  }

  const currentUser = await authApi.getMe();

  if (!currentUser.id) {
    throw new Error('current_user_not_found');
  }

  return currentUser.id;
}

export async function saveOnboardingProfile(draft: OnboardingProfileDraft): Promise<void> {
  const userId = await getCurrentUserId();
  const payload = await createOnboardingProfilePayload(draft);

  await profilesApi.saveOnboardingForUser(userId, payload);
}