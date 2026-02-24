import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from 'axios';
import type { ApiResponse } from '../types/api';
import { store } from '../app/store';
import { clearAuth } from '../features/auth/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_CLINTO_SERVER_BASE_URL ?? 'https://api.example.com',
  timeout: 10000,
  withCredentials: true,
});

export type HttpRequestConfig<TRequest = unknown> = Omit<
  AxiosRequestConfig<TRequest>,
  'method' | 'url' | 'data'
> & {
  method?: Method;
  url: string;
  data?: TRequest;
};

const normalizeError = <TResponse>(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.'
): ApiResponse<TResponse> => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 0;
    const data = error.response?.data as Partial<ApiResponse<TResponse>> | undefined;

    if (statusCode === 401 || statusCode === 403) {
      store.dispatch(clearAuth());
    }

    return {
      success: false,
      statusCode,
      message: data?.message || error.message || fallbackMessage,
      details: data?.details,
      data: data?.data,
      token: data?.token,
    };
  }

  return {
    success: false,
    statusCode: 0,
    message: fallbackMessage,
  };
};

export const httpRequest = async <TResponse = unknown, TRequest = unknown>(
  config: HttpRequestConfig<TRequest>
): Promise<ApiResponse<TResponse>> => {
  const { method = 'GET', url, data, ...rest } = config;

  try {
    const response = await api.request<
      ApiResponse<TResponse>,
      AxiosResponse<ApiResponse<TResponse>>,
      TRequest
    >({
      method,
      url,
      data,
      ...rest,
    });
    return response.data;
  } catch (error) {
    return normalizeError<TResponse>(error);
  }
};

export const http = {
  get: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse>({ url, ...config, method: 'GET' }),
  post: <TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse, TRequest>({ url, data, ...config, method: 'POST' }),
  put: <TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse, TRequest>({ url, data, ...config, method: 'PUT' }),
  patch: <TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse, TRequest>({ url, data, ...config, method: 'PATCH' }),
  delete: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse>({ url, ...config, method: 'DELETE' }),
  upload: <TResponse = unknown>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig<FormData>
  ): Promise<ApiResponse<TResponse>> =>
    httpRequest<TResponse, FormData>({
      url,
      data,
      ...config,
      method: 'POST',
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }),
};
