import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '../useAppQuery';

export type PipelineOption = {
  _id: string;
  name: string;
  isDefault?: boolean;
};

export const pipelineQueryKeys = {
  all: ['pipelines'] as const,
  list: (page: number, limit: number, search?: string) =>
    ['pipelines', 'list', { page, limit, search: (search ?? '').trim() }] as const,
  options: ['pipelines', 'options'] as const,
  detail: (pipelineId: string) => ['pipelines', 'detail', pipelineId] as const,
  stages: (pipelineId: string) => ['pipelines', 'stages', pipelineId] as const,
};

export type PipelineStageOption = {
  _id: string;
  name: string;
  color?: string | null;
  order?: number;
  isDefault?: boolean;
};

export type PipelineListItem = PipelineOption & {
  stages?: PipelineStageOption[];
  createdAt?: string;
  updatedAt?: string;
};

export type PipelinesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type PipelinesListResponse = {
  pipelines: PipelineListItem[];
  pagination: PipelinesPagination;
};

type PipelinesResponseData = PipelinesListResponse | PipelineListItem[];

const toPipelineList = (data?: PipelinesResponseData) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.pipelines ?? [];
};

const toPagination = (data?: PipelinesResponseData) => {
  if (!data || Array.isArray(data)) return undefined;
  return data.pagination;
};

export const usePipelinesQuery = (page: number, limit: number, search?: string) => {
  const query = useAppQuery<PipelinesResponseData>({
    queryKey: pipelineQueryKeys.list(page, limit, search),
    request: {
      method: 'GET',
      url: '/api/pipelines',
      params: {
        page,
        limit,
        ...(search?.trim() ? { search: search.trim() } : {}),
      },
    },
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    pipelines: toPipelineList(query.data),
    pagination: toPagination(query.data),
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

export const usePipelinesOptionsQuery = (enabled = true) => {
  const query = useAppQuery<PipelinesResponseData>({
    queryKey: pipelineQueryKeys.options,
    request: {
      method: 'GET',
      url: '/api/pipelines',
      params: {
        page: 1,
        limit: 500,
      },
    },
    enabled,
  });

  return {
    ...query,
    pipelines: toPipelineList(query.data),
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

type PipelineStagesResponse = {
  _id: string;
  name: string;
  stages: PipelineStageOption[];
};

export const usePipelineByIdQuery = (pipelineId?: string) => {
  const normalizedPipelineId = (pipelineId ?? '').trim();
  const query = useAppQuery<PipelineListItem>({
    queryKey: pipelineQueryKeys.detail(normalizedPipelineId),
    request: {
      method: 'GET',
      url: `/api/pipelines/${normalizedPipelineId}`,
    },
    enabled: Boolean(normalizedPipelineId),
  });

  return {
    ...query,
    pipeline: query.data,
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

export const usePipelineStagesQuery = (pipelineId?: string, enabled = true) => {
  const normalizedPipelineId = (pipelineId ?? '').trim();
  const query = useAppQuery<PipelineStagesResponse>({
    queryKey: pipelineQueryKeys.stages(normalizedPipelineId),
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
