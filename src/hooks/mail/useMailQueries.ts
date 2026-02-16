import { useQuery } from '@tanstack/react-query';
import { appHttp, type AppHttpError } from '../useAppQuery';

export type GoogleMailbox = {
  _id: string;
  googleEmail: string;
  scope?: string[];
  expiryDate?: string | null;
  updatedAt: string;
  isDefault: boolean;
  isDisconnected: boolean;
  isDeleted: boolean;
  disconnectedAt?: string | null;
  deletedAt?: string | null;
  connected: boolean;
};

export type GoogleAccountsData = {
  authUrl: string;
  total: number;
  connectedCount: number;
  mailboxes: GoogleMailbox[];
};

export const mailQueryKeys = {
  googleAccounts: ['mail', 'google', 'accounts'] as const,
};

export const useGoogleMailAccountsQuery = (enabled = true) => {
  const query = useQuery<GoogleAccountsData, AppHttpError>({
    queryKey: mailQueryKeys.googleAccounts,
    queryFn: () =>
      appHttp<GoogleAccountsData>({
        method: 'GET',
        url: '/api/mail/google/accounts',
      }),
    enabled,
  });

  return {
    ...query,
    accounts: query.data,
    loading: query.isLoading,
    hasError: query.isError,
    error: query.error,
    errorMessage: query.error?.message ?? null,
  };
};
