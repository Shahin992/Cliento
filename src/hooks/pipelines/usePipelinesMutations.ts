import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';
import { pipelineQueryKeys } from './usePipelinesQueries';

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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreatePipelinePayload) =>
      appHttp<CreatePipelineResponse, CreatePipelinePayload>({
        method: 'POST',
        url: '/api/pipelines',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all });
    },
  });

  return {
    ...mutation,
    createPipeline: (payload: CreatePipelinePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export type UpdatePipelinePayload = {
  name?: string;
  isDefault?: boolean;
};

type UpdatePipelineMutationVariables = {
  pipelineId: string;
  payload: UpdatePipelinePayload;
};

type DeletePipelineMutationVariables = {
  pipelineId: string;
  payload: DeletePipelinePayload;
};

export type DeletePipelinePayload = {
  dealAction: 'move' | 'delete';
  targetPipelineId?: string;
};

export const useUpdatePipelineMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ pipelineId, payload }: UpdatePipelineMutationVariables) =>
      appHttp<unknown, UpdatePipelinePayload>({
        method: 'PUT',
        url: `/api/pipelines/${pipelineId}`,
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.detail(variables.pipelineId) });
    },
  });

  return {
    ...mutation,
    updatePipeline: (pipelineId: string, payload: UpdatePipelinePayload) =>
      mutation.mutateAsync({ pipelineId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeletePipelineMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ pipelineId, payload }: DeletePipelineMutationVariables) =>
      appHttp<unknown, DeletePipelinePayload>({
        method: 'DELETE',
        url: `/api/pipelines/${pipelineId}`,
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.detail(variables.pipelineId) });
      await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.stages(variables.pipelineId) });
    },
  });

  return {
    ...mutation,
    deletePipeline: (pipelineId: string, payload: DeletePipelinePayload) =>
      mutation.mutateAsync({ pipelineId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
