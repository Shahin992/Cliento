import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';
import type { CreateContactPayload } from '../../services/contacts';
import { contactsQueryKeys } from './useContactsQueries';

type ContactIdPayload = { contactId: string };
type UpdateContactPayload = { contactId: string; payload: CreateContactPayload };

export const useCreateContactMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateContactPayload) =>
      appHttp<unknown, CreateContactPayload>({
        method: 'POST',
        url: '/api/contacts',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactsQueryKeys.all });
    },
  });

  return {
    ...mutation,
    createContact: (payload: CreateContactPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ contactId, payload }: UpdateContactPayload) =>
      appHttp<unknown, CreateContactPayload>({
        method: 'PUT',
        url: `/api/contacts/${contactId}`,
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: contactsQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: contactsQueryKeys.detail(variables.contactId) });
    },
  });

  return {
    ...mutation,
    updateContact: (contactId: string, payload: CreateContactPayload) =>
      mutation.mutateAsync({ contactId, payload }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ contactId }: ContactIdPayload) =>
      appHttp<unknown>({
        method: 'DELETE',
        url: `/api/contacts/${contactId}`,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: contactsQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: contactsQueryKeys.detail(variables.contactId) });
    },
  });

  return {
    ...mutation,
    deleteContact: (contactId: string) => mutation.mutateAsync({ contactId }),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
