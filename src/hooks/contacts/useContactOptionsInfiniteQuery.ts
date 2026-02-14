import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { appHttp } from '../useAppQuery';

export type ContactOption = {
  _id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
};

type ContactOptionsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ContactOptionsResponse = {
  contacts: ContactOption[];
  pagination: ContactOptionsPagination;
};

export const contactOptionsQueryKeys = {
  all: ['contacts', 'options'] as const,
  list: (search: string, limit: number) =>
    ['contacts', 'options', { search: search.trim(), limit }] as const,
};

export const useContactOptionsInfiniteQuery = (search: string, limit = 10, enabled = true) => {
  const normalizedSearch = search.trim();

  const query = useInfiniteQuery({
    queryKey: contactOptionsQueryKeys.list(normalizedSearch, limit),
    queryFn: ({ pageParam = 1 }) =>
      appHttp<ContactOptionsResponse>({
        method: 'GET',
        url: '/api/contacts/options',
        params: {
          page: pageParam,
          limit,
          ...(normalizedSearch ? { search: normalizedSearch } : {}),
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled,
  });

  const contacts = useMemo(() => {
    const items = query.data?.pages.flatMap((page) => page.contacts) ?? [];
    const seen = new Set<string>();
    const deduped: ContactOption[] = [];

    for (const item of items) {
      if (seen.has(item._id)) continue;
      seen.add(item._id);
      deduped.push(item);
    }

    return deduped;
  }, [query.data]);

  return {
    ...query,
    contacts,
  };
};
