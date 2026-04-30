import { requireCurrentUserId } from '@/shared/api/auth/currentUser';
import { profilesApi } from '@/shared/api/services/profiles';
import {
  createOnboardingProfilePayload,
  type OnboardingProfileDraft,
} from './onboardingProfilePayload';

export async function saveOnboardingProfile(draft: OnboardingProfileDraft): Promise<void> {
  const userId = await requireCurrentUserId();
  const payload = await createOnboardingProfilePayload(draft);

  await profilesApi.saveOnboardingForUser(userId, payload);
}