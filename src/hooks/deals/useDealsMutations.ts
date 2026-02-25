import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appHttp } from '../useAppQuery';
import { dealsQueryKeys } from './useDealsQueries';

export type CreateDealPayload = {
  ownerId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  amount: number | null;
  contactId: string;
  expectedCloseDate: string | null;
};

export type UpdateDealPayload = {
  pipelineId: string;
  stageId: string;
  title: string;
  amount: number | null;
  contactId: string;
  expectedCloseDate: string | null;
};

type UpdateDealMutationVariables = {
  dealId: string;
  payload: UpdateDealPayload;
};

type MarkDealLostPayload = {
  dealId: string;
  lostReason: string;
};

type MarkDealLostMutationVariables = {
  payload: MarkDealLostPayload;
  options?: {
    skipInvalidate?: boolean;
  };
};

type MarkDealWonPayload = {
  dealId: string;
};

type MarkDealWonMutationVariables = {
  payload: MarkDealWonPayload;
  options?: {
    skipInvalidate?: boolean;
  };
};

type DeleteDealPayload = {
  dealId: string;
};

export const useCreateDealMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateDealPayload) =>
      appHttp<unknown, CreateDealPayload>({
        method: 'POST',
        url: '/api/deals',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    createDeal: (payload: CreateDealPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateDealMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ dealId, payload }: UpdateDealMutationVariables) =>
      appHttp<unknown, UpdateDealPayload>({
        method: 'PUT',
        url: `/api/deals/${dealId}`,
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    updateDeal: (dealId: string, payload: UpdateDealPayload) =>
      mutation.mutateAsync({ dealId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useMarkDealLostMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ payload }: MarkDealLostMutationVariables) =>
      appHttp<unknown, MarkDealLostPayload>({
        method: 'POST',
        url: '/api/deals/lost',
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      if (variables.options?.skipInvalidate) {
        return;
      }
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    markDealLost: (
      payload: MarkDealLostPayload,
      options?: MarkDealLostMutationVariables['options']
    ) => mutation.mutateAsync({ payload, options }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useMarkDealWonMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ payload }: MarkDealWonMutationVariables) =>
      appHttp<unknown, MarkDealWonPayload>({
        method: 'POST',
        url: '/api/deals/won',
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      if (variables.options?.skipInvalidate) {
        return;
      }
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    markDealWon: (
      payload: MarkDealWonPayload,
      options?: MarkDealWonMutationVariables['options']
    ) => mutation.mutateAsync({ payload, options }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteDealMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ dealId }: DeleteDealPayload) =>
      appHttp<unknown>({
        method: 'DELETE',
        url: `/api/deals/${dealId}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    deleteDeal: (dealId: string) => mutation.mutateAsync({ dealId }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
