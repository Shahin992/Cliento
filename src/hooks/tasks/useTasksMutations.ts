import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';
import { tasksQueryKeys, type TaskPriority, type TaskStatus } from './useTasksQueries';

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: null;
};

type UpdateTaskMutationVariables = {
  taskId: string;
  payload: TaskPayload;
};

type DeleteTaskMutationVariables = {
  taskId: string;
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: TaskPayload) =>
      appHttp<unknown, TaskPayload>({
        method: 'POST',
        url: '/api/tasks',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all });
    },
  });

  return {
    ...mutation,
    createTask: (payload: TaskPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ taskId, payload }: UpdateTaskMutationVariables) =>
      appHttp<unknown, TaskPayload>({
        method: 'PUT',
        url: `/api/tasks/${taskId}`,
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.detail(variables.taskId) });
    },
  });

  return {
    ...mutation,
    updateTask: (taskId: string, payload: TaskPayload) => mutation.mutateAsync({ taskId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ taskId }: DeleteTaskMutationVariables) =>
      appHttp<unknown>({
        method: 'DELETE',
        url: `/api/tasks/${taskId}`,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.detail(variables.taskId) });
    },
  });

  return {
    ...mutation,
    deleteTask: (taskId: string) => mutation.mutateAsync({ taskId }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
