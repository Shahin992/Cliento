import { useAppMutation } from '../useAppQuery';

type CreatePipelineStagePayload = {
  name: string;
  color?: string | null;
};

type CreatePipelinePayload = {
  name: string;
  stages: CreatePipelineStagePayload[];
};

type CreatePipelineStageResponse = {
  _id: string;
  name: string;
  color?: string | null;
  order: number;
  isDefault: boolean;
};

export type CreatePipelineResponse = {
  _id: string;
  name: string;
  stages: CreatePipelineStageResponse[];
};

export const useCreatePipelineMutation = () => {
  const mutation = useAppMutation<CreatePipelineResponse, CreatePipelinePayload>({
    request: {
      method: 'POST',
      url: '/api/pipelines',
    },
  });

  return {
    ...mutation,
    createPipeline: (payload: CreatePipelinePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
