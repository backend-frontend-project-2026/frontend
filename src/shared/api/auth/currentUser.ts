import { getStoredUser } from './session';
import { authApi } from '../services/auth';

export async function getCurrentUserId(): Promise<number | null> {
  const storedUserId = getStoredUser()?.id ?? null;

  if (storedUserId !== null) {
    return storedUserId;
  }

  const currentUser = await authApi.getMe();

  return currentUser.id ?? null;
}

export async function requireCurrentUserId(): Promise<number> {
  const currentUserId = await getCurrentUserId();

  if (currentUserId === null) {
    throw new Error('current_user_not_found');
  }

  return currentUserId;
}