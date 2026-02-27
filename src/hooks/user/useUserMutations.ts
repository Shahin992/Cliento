import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';
import { userQueryKeys } from './useUserQueries';

export type CreateUserPayload = {
  fullName: string;
  email: string;
  role?: 'ADMIN' | 'MEMBER';
  companyName?: string;
  phoneNumber?: string;
};

export type UpdateUserPayload = {
  fullName: string;
  role?: 'ADMIN' | 'MEMBER';
  companyName?: string;
  phoneNumber?: string;
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      appHttp<unknown, CreateUserPayload>({
        method: 'POST',
        url: '/api/users',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.teamUsers });
    },
  });

  return {
    ...mutation,
    createUser: (payload: CreateUserPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserPayload }) =>
      appHttp<unknown, UpdateUserPayload>({
        method: 'PUT',
        url: `/api/users/${userId}`,
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.teamUsers });
    },
  });

  return {
    ...mutation,
    updateUser: (userId: string, payload: UpdateUserPayload) =>
      mutation.mutateAsync({ userId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      appHttp<unknown>({
        method: 'DELETE',
        url: `/api/users/${userId}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.teamUsers });
    },
  });

  return {
    ...mutation,
    deleteUser: (userId: string) => mutation.mutateAsync({ userId }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
