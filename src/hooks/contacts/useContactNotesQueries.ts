import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { appHttp } from '../useAppQuery';

type ContactNotesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ContactNote = {
  _id: string;
  contactId: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
};

type ContactNotesResponse = {
  notes: ContactNote[];
  pagination: ContactNotesPagination;
};

export const contactNotesQueryKeys = {
  all: ['contact-notes'] as const,
  byContact: (contactId: string) => ['contact-notes', contactId] as const,
  list: (contactId: string, limit: number) => ['contact-notes', contactId, 'list', limit] as const,
};

export const useContactNotesInfiniteQuery = (contactId?: string, limit = 10, enabled = true) => {
  const normalizedContactId = (contactId ?? '').trim();

  const query = useInfiniteQuery({
    queryKey: contactNotesQueryKeys.list(normalizedContactId, limit),
    queryFn: ({ pageParam = 1 }) =>
      appHttp<ContactNotesResponse>({
        method: 'GET',
        url: '/api/contact-notes',
        params: {
          contactId: normalizedContactId,
          page: pageParam,
          limit,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled: enabled && Boolean(normalizedContactId),
    refetchOnWindowFocus: false,
  });

  const notes = useMemo(() => {
    const items = query.data?.pages.flatMap((page) => page.notes ?? []) ?? [];
    const seen = new Set<string>();
    const deduped: ContactNote[] = [];

    for (const item of items) {
      if (!item?._id || seen.has(item._id)) continue;
      seen.add(item._id);
      deduped.push(item);
    }

    return deduped;
  }, [query.data]);

  return {
    ...query,
    notes,
  };
};
