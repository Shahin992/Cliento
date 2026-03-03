import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppHttpError } from '../useAppQuery';
import { httpRequest } from '../../services/api';
import { mailQueryKeys } from './useMailQueries';

type GoogleMailboxActionResponse = {
  message: string;
};

export type SendGoogleMailPayload = {
  to: string[];
  from: string;
  subject: string;
  body: string;
};

export const useDisconnectGoogleMailboxMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<GoogleMailboxActionResponse, AppHttpError, string>({
    mutationFn: (mailboxId: string) =>
      httpRequest<unknown>({
        method: 'POST',
        url: `/api/mail/google/disconnect/${mailboxId}`,
      }).then((response) => {
        if (!response.success) {
          throw new AppHttpError(response as never);
        }

        return {
          message: response.message || 'Google mailbox disconnected.',
        };
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: mailQueryKeys.googleAccounts });
    },
  });

  return {
    ...mutation,
    disconnectMailbox: (mailboxId: string) => mutation.mutateAsync(mailboxId),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteGoogleMailboxMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<GoogleMailboxActionResponse, AppHttpError, string>({
    mutationFn: (mailboxId: string) =>
      httpRequest<unknown>({
        method: 'POST',
        url: `/api/mail/google/delete/${mailboxId}`,
      }).then((response) => {
        if (!response.success) {
          throw new AppHttpError(response as never);
        }

        return {
          message: response.message || 'Google mailbox deleted.',
        };
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: mailQueryKeys.googleAccounts });
    },
  });

  return {
    ...mutation,
    deleteMailbox: (mailboxId: string) => mutation.mutateAsync(mailboxId),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useMakeDefaultGoogleMailboxMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<GoogleMailboxActionResponse, AppHttpError, string>({
    mutationFn: (mailboxId: string) =>
      httpRequest<unknown>({
        method: 'POST',
        url: `/api/mail/google/make-default/${mailboxId}`,
      }).then((response) => {
        if (!response.success) {
          throw new AppHttpError(response as never);
        }

        return {
          message: response.message || 'Default mailbox updated.',
        };
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: mailQueryKeys.googleAccounts });
    },
  });

  return {
    ...mutation,
    makeDefaultMailbox: (mailboxId: string) => mutation.mutateAsync(mailboxId),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useSendGoogleMailMutation = () => {
  const mutation = useMutation<GoogleMailboxActionResponse, AppHttpError, SendGoogleMailPayload>({
    mutationFn: (payload) =>
      httpRequest<unknown, SendGoogleMailPayload>({
        method: 'POST',
        url: '/api/mail/google/send',
        data: payload,
      }).then((response) => {
        if (!response.success) {
          throw new AppHttpError(response as never);
        }

        return {
          message: response.message || 'Email sent successfully.',
        };
      }),
  });

  return {
    ...mutation,
    sendMail: (payload: SendGoogleMailPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
