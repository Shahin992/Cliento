import { useAppQuery } from '../useAppQuery';
import type { ContactDetails, GetContactsResponse } from '../../services/contacts';

export const contactsQueryKeys = {
  all: ['contacts'] as const,
  list: (page: number, limit: number, search?: string) =>
    ['contacts', 'list', { page, limit, search: (search ?? '').trim() }] as const,
  detail: (contactId: string) => ['contacts', 'detail', contactId] as const,
};

export const useContactsQuery = (page: number, limit: number, search?: string) => {
  const query = useAppQuery<GetContactsResponse>({
    queryKey: contactsQueryKeys.list(page, limit, search),
    request: {
      method: 'GET',
      url: '/api/contacts',
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    },
  });

  return {
    ...query,
    contacts: query.data?.contacts ?? [],
    pagination: query.data?.pagination,
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

export const useContactByIdQuery = (contactId?: string) => {
  const normalizedId = (contactId ?? '').trim();
  const query = useAppQuery<ContactDetails>({
    queryKey: contactsQueryKeys.detail(normalizedId),
    request: {
      method: 'GET',
      url: `/api/contacts/${normalizedId}`,
    },
    enabled: Boolean(normalizedId),
  });

  return {
    ...query,
    contact: query.data,
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
