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

type MarkDealWonPayload = {
  dealId: string;
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
    mutationFn: (payload: MarkDealLostPayload) =>
      appHttp<unknown, MarkDealLostPayload>({
        method: 'POST',
        url: '/api/deals/lost',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    markDealLost: (payload: MarkDealLostPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useMarkDealWonMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: MarkDealWonPayload) =>
      appHttp<unknown, MarkDealWonPayload>({
        method: 'POST',
        url: '/api/deals/won',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dealsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    markDealWon: (payload: MarkDealWonPayload) => mutation.mutateAsync(payload),
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
