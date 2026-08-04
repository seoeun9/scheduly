import { tokenService } from '@/services/token.service';

const API_URL = '';

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  userToken?: boolean;
};

export async function apiClient<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, userToken = true, headers, ...requestOptions } = options;

  const accessToken = userToken ? await tokenService.getAccessToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,

    headers: {
      'Content-type': 'application/json',
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },

    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const message = errorData?.message ?? 'API요청실패';

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
