import { useAppMutation } from '../useAppQuery';

export type SyncCheckoutSessionPayload = {
  sessionId: string;
};

export const useSyncCheckoutSessionMutation = () => {
  const mutation = useAppMutation<unknown, SyncCheckoutSessionPayload>({
    request: {
      method: 'POST',
      url: '/api/subscriptions/sync/checkout-session',
    },
  });

  return {
    ...mutation,
    syncCheckoutSession: (payload: SyncCheckoutSessionPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
