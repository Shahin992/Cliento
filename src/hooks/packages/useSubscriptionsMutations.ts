import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp, useAppMutation } from '../useAppQuery';
import { subscriptionQueryKeys } from './useSubscriptionsQueries';

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

type CreateSetupIntentResponse = {
  clientSecret: string;
};

type AttachPaymentMethodPayload = {
  paymentMethodId: string;
};

type UpdateCardPayload = {
  paymentMethodId: string;
};

export const useCreateSetupIntentMutation = () => {
  const mutation = useMutation({
    mutationFn: () =>
      appHttp<CreateSetupIntentResponse>({
        method: 'POST',
        url: '/api/subscriptions/me/setup-intent',
      }),
  });

  return {
    ...mutation,
    createSetupIntent: () => mutation.mutateAsync(),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useAttachPaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: AttachPaymentMethodPayload) =>
      appHttp<unknown, AttachPaymentMethodPayload>({
        method: 'POST',
        url: '/api/subscriptions/me/payment-method',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.current });
    },
  });

  return {
    ...mutation,
    attachPaymentMethod: (payload: AttachPaymentMethodPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useMakeDefaultCardMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: UpdateCardPayload) =>
      appHttp<unknown, UpdateCardPayload>({
        method: 'POST',
        url: '/api/subscriptions/me/make-default-card',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.current });
    },
  });

  return {
    ...mutation,
    makeDefaultCard: (payload: UpdateCardPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useRemoveCardMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: UpdateCardPayload) =>
      appHttp<unknown, UpdateCardPayload>({
        method: 'POST',
        url: '/api/subscriptions/me/remove-card',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.current });
    },
  });

  return {
    ...mutation,
    removeCard: (payload: UpdateCardPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
