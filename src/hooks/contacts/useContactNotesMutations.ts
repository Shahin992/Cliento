import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appHttp } from '../useAppQuery';
import { contactNotesQueryKeys } from './useContactNotesQueries';

type CreateContactNotePayload = {
  contactId: string;
  body: string;
};

type UpdateContactNotePayload = {
  noteId: string;
  contactId: string;
  body: string;
};

type DeleteContactNotePayload = {
  noteId: string;
  contactId: string;
};

const invalidateContactNotes = async (queryClient: ReturnType<typeof useQueryClient>, contactId: string) => {
  await queryClient.invalidateQueries({
    queryKey: contactNotesQueryKeys.byContact(contactId),
  });
};

export const useCreateContactNoteMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateContactNotePayload) =>
      appHttp<unknown, CreateContactNotePayload>({
        method: 'POST',
        url: '/api/contact-notes',
        data: payload,
      }),
    onSuccess: async (_data, variables) => {
      await invalidateContactNotes(queryClient, variables.contactId);
    },
  });

  return {
    ...mutation,
    createContactNote: (payload: CreateContactNotePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateContactNoteMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ noteId, body }: UpdateContactNotePayload) =>
      appHttp<unknown, { body: string }>({
        method: 'PUT',
        url: `/api/contact-notes/${noteId}`,
        data: { body },
      }),
    onSuccess: async (_data, variables) => {
      await invalidateContactNotes(queryClient, variables.contactId);
    },
  });

  return {
    ...mutation,
    updateContactNote: (payload: UpdateContactNotePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useDeleteContactNoteMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ noteId }: DeleteContactNotePayload) =>
      appHttp<unknown>({
        method: 'DELETE',
        url: `/api/contact-notes/${noteId}`,
      }),
    onSuccess: async (_data, variables) => {
      await invalidateContactNotes(queryClient, variables.contactId);
    },
  });

  return {
    ...mutation,
    deleteContactNote: (payload: DeleteContactNotePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
