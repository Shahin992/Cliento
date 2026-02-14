import { useAppMutation } from '../useAppQuery';

export type CreateDealPayload = {
  ownerId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  amount: number | null;
  contactId: string;
  expectedCloseDate: string | null;
};

export const useCreateDealMutation = () => {
  const mutation = useAppMutation<unknown, CreateDealPayload>({
    request: {
      method: 'POST',
      url: '/api/deals',
    },
  });

  return {
    ...mutation,
    createDeal: (payload: CreateDealPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
