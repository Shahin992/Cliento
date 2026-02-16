import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '../useAppQuery';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | string;
export type TaskPriority = 'low' | 'medium' | 'high' | string;

export type TaskListItem = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: string | { _id: string; name?: string; email?: string } | null;
  owner?: { _id: string; name?: string; email?: string } | null;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TasksPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TasksListResponse = {
  tasks: TaskListItem[];
  pagination?: TasksPagination;
};

type TasksEnvelopeResponse = {
  data?: TasksListResponse;
};

type TasksResponseData = TasksListResponse | TaskListItem[] | TasksEnvelopeResponse;

const isTasksListResponse = (value: unknown): value is TasksListResponse =>
  value !== null && typeof value === 'object' && 'tasks' in value;

const isTasksEnvelopeResponse = (value: unknown): value is TasksEnvelopeResponse =>
  value !== null && typeof value === 'object' && 'data' in value;

const toTaskList = (data?: TasksResponseData) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (isTasksListResponse(data)) return data.tasks ?? [];
  if (isTasksEnvelopeResponse(data) && data.data) return data.data.tasks ?? [];
  return [];
};

const toPagination = (data?: TasksResponseData) => {
  if (!data || Array.isArray(data)) return undefined;
  if (isTasksListResponse(data)) return data.pagination;
  if (isTasksEnvelopeResponse(data) && data.data) return data.data.pagination;
  return undefined;
};

export const tasksQueryKeys = {
  all: ['tasks'] as const,
  list: (
    page: number,
    limit: number,
    search?: string,
    status?: string,
    priority?: string,
    assignedTo?: string,
  ) =>
    [
      'tasks',
      'list',
      {
        page,
        limit,
        search: (search ?? '').trim(),
        status: (status ?? '').trim(),
        priority: (priority ?? '').trim(),
        assignedTo: (assignedTo ?? '').trim(),
      },
    ] as const,
  detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
};

export const useTasksQuery = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  priority?: string,
  assignedTo?: string,
) => {
  const normalizedSearch = (search ?? '').trim();
  const normalizedStatus = (status ?? '').trim();
  const normalizedPriority = (priority ?? '').trim();
  const normalizedAssignedTo = (assignedTo ?? '').trim();

  const query = useAppQuery<TasksResponseData>({
    queryKey: tasksQueryKeys.list(
      page,
      limit,
      normalizedSearch,
      normalizedStatus,
      normalizedPriority,
      normalizedAssignedTo,
    ),
    request: {
      method: 'GET',
      url: '/api/tasks',
      params: {
        page,
        limit,
        ...(normalizedSearch ? { search: normalizedSearch } : {}),
        ...(normalizedStatus ? { status: normalizedStatus } : {}),
        ...(normalizedPriority ? { priority: normalizedPriority } : {}),
        ...(normalizedAssignedTo ? { assignedTo: normalizedAssignedTo } : {}),
      },
    },
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    tasks: toTaskList(query.data),
    pagination: toPagination(query.data),
    loading: query.isLoading || query.isFetching,
    fetching: query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
