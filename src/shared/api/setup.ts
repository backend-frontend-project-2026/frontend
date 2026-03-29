import { getAccessToken } from '@/shared/api/auth/session';
import { client } from '@/shared/api/generated/client.gen';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

function normalizeBaseUrl(rawUrl?: string): string {
  return (rawUrl ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

client.setConfig({
  baseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  auth: () => getAccessToken() ?? undefined,
  headers: {
    Accept: 'application/json',
  },
});
