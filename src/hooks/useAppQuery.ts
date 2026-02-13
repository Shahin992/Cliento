import {
  keepPreviousData,
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { httpRequest, type HttpRequestConfig } from '../services/api';
import type { ApiResponse } from '../types/api';

export class AppHttpError extends Error {
  readonly statusCode: number;
  readonly details?: string;
  readonly response: ApiResponse<unknown>;

  constructor(response: ApiResponse<unknown>) {
    super(response.details || response.message || 'Request failed.');
    this.name = 'AppHttpError';
    this.statusCode = response.statusCode;
    this.details = response.details;
    this.response = response;
  }
}

export const appHttp = async <TResponse = unknown, TRequest = unknown>(
  config: HttpRequestConfig<TRequest>
): Promise<TResponse> => {
  const response = await httpRequest<TResponse, TRequest>(config);
  if (!response.success) {
    throw new AppHttpError(response as ApiResponse<unknown>);
  }

  return response.data as TResponse;
};

type AppQueryOptions<TResponse, TRequest, TSelected = TResponse> = Omit<
  UseQueryOptions<TResponse, AppHttpError, TSelected, QueryKey>,
  'queryKey' | 'queryFn'
> & {
  queryKey: QueryKey;
  request: HttpRequestConfig<TRequest>;
};

export const useAppQuery = <TResponse = unknown, TRequest = unknown, TSelected = TResponse>(
  options: AppQueryOptions<TResponse, TRequest, TSelected>
): UseQueryResult<TSelected, AppHttpError> => {
  const { queryKey, request, ...queryOptions } = options;

  return useQuery<TResponse, AppHttpError, TSelected, QueryKey>({
    queryKey,
    queryFn: () => appHttp<TResponse, TRequest>(request),
    ...queryOptions,
  });
};

type AppQueryWithPaginationOptions<TResponse, TRequest, TSelected = TResponse> = Omit<
  UseQueryOptions<TResponse, AppHttpError, TSelected, QueryKey>,
  'queryKey' | 'queryFn' | 'placeholderData'
> & {
  queryKey: QueryKey;
  page: number;
  pageSize: number;
  pageParamKey?: string;
  pageSizeParamKey?: string;
  request: HttpRequestConfig<TRequest> & {
    params?: Record<string, unknown>;
  };
};

export const useAppQueryWithPagination = <
  TResponse = unknown,
  TRequest = unknown,
  TSelected = TResponse
>(
  options: AppQueryWithPaginationOptions<TResponse, TRequest, TSelected>
): UseQueryResult<TSelected, AppHttpError> => {
  const {
    queryKey,
    request,
    page,
    pageSize,
    pageParamKey = 'page',
    pageSizeParamKey = 'pageSize',
    ...queryOptions
  } = options;

  return useQuery<TResponse, AppHttpError, TSelected, QueryKey>({
    queryKey: [...queryKey, { page, pageSize }],
    queryFn: () =>
      appHttp<TResponse, TRequest>({
        ...request,
        params: {
          ...request.params,
          [pageParamKey]: page,
          [pageSizeParamKey]: pageSize,
        },
      }),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

type AppMutationOptions<TResponse, TVariables, TContext> = Omit<
  UseMutationOptions<TResponse, AppHttpError, TVariables, TContext>,
  'mutationFn'
> & {
  request: Omit<HttpRequestConfig<TVariables>, 'data'>;
};

export const useAppMutation = <TResponse = unknown, TVariables = unknown, TContext = unknown>(
  options: AppMutationOptions<TResponse, TVariables, TContext>
): UseMutationResult<TResponse, AppHttpError, TVariables, TContext> => {
  const { request, ...mutationOptions } = options;

  return useMutation<TResponse, AppHttpError, TVariables, TContext>({
    mutationFn: (variables) =>
      appHttp<TResponse, TVariables>({
        ...request,
        data: variables,
      }),
    ...mutationOptions,
  });
};
