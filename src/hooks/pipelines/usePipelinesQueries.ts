import { useAppQuery } from '../useAppQuery';

export type PipelineOption = {
  _id: string;
  name: string;
};

export const pipelineQueryKeys = {
  all: ['pipelines'] as const,
};

export const usePipelinesOptionsQuery = (enabled = true) => {
  const query = useAppQuery<PipelineOption[]>({
    queryKey: pipelineQueryKeys.all,
    request: {
      method: 'GET',
      url: '/api/pipelines',
    },
    enabled,
  });

  return {
    ...query,
    pipelines: query.data ?? [],
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

type PipelineStageOption = {
  _id: string;
  name: string;
  color?: string | null;
  order: number;
  isDefault: boolean;
};

type PipelineStagesResponse = {
  _id: string;
  name: string;
  stages: PipelineStageOption[];
};

export const usePipelineStagesQuery = (pipelineId?: string, enabled = true) => {
  const normalizedPipelineId = (pipelineId ?? '').trim();
  const query = useAppQuery<PipelineStagesResponse>({
    queryKey: ['pipelines', 'stages', normalizedPipelineId],
    request: {
      method: 'GET',
      url: `/api/pipelines/${normalizedPipelineId}/stages`,
    },
    enabled: enabled && Boolean(normalizedPipelineId),
  });

  return {
    ...query,
    stages: query.data?.stages ?? [],
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
