import { useAppQuery, appHttp } from '../useAppQuery';
import type { User } from '../../types/user';
import type { QueryKey } from '@tanstack/react-query';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export const meQueryOptions = () => ({
  queryKey: authQueryKeys.me as QueryKey,
  queryFn: () => appHttp<User>({ method: 'GET', url: '/api/users/me' }),
});

export const useMeQuery = (enabled = true) => {
  const query = useAppQuery<User>({
    queryKey: authQueryKeys.me,
    request: {
      method: 'GET',
      url: '/api/users/me',
    },
    enabled,
  });

  return {
    ...query,
    me: query.data,
    loading: query.isLoading,
    hasError: query.isError,
    error: query.error,
    errorMessage: query.error?.message ?? null,
  };
};
