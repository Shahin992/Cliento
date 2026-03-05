import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { appHttp } from '../useAppQuery';

type ConversationsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ConversationItem = {
  _id: string;
  method: string;
  direction: 'incoming' | 'outgoing';
  contactId: string;
  contactEmail: string;
  subject: string | null;
  body: string | null;
  from: string;
  to: string[];
  participants: string[];
  externalMessageId: string;
  externalThreadId: string;
  sentAt: string;
  createdAt: string;
};

type ConversationsResponse = {
  conversations: ConversationItem[];
  pagination: ConversationsPagination;
};

export const conversationsQueryKeys = {
  all: ['conversations'] as const,
  list: (contactId: string, limit: number) =>
    ['conversations', 'list', { contactId: contactId.trim(), limit }] as const,
};

export const useConversationsInfiniteQuery = (contactId?: string, limit = 10, enabled = true) => {
  const normalizedContactId = (contactId ?? '').trim();
  const shouldQuery = enabled && Boolean(normalizedContactId);

  const query = useInfiniteQuery({
    queryKey: conversationsQueryKeys.list(normalizedContactId, limit),
    queryFn: ({ pageParam = 1 }) =>
      appHttp<ConversationsResponse>({
        method: 'GET',
        url: '/api/conversations',
        params: {
          page: pageParam,
          limit,
          contactId: normalizedContactId,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled: shouldQuery,
  });

  const conversations = useMemo(() => {
    const items = query.data?.pages.flatMap((page) => page.conversations) ?? [];
    const seen = new Set<string>();
    const deduped: ConversationItem[] = [];

    for (const item of items) {
      if (seen.has(item._id)) continue;
      seen.add(item._id);
      deduped.push(item);
    }

    return deduped;
  }, [query.data]);

  const latestPagination = query.data?.pages[query.data.pages.length - 1]?.pagination;

  return {
    ...query,
    conversations,
    pagination: latestPagination,
    loading: query.isPending || (query.isFetching && !query.data),
    initialLoading: query.isPending || (query.isFetching && !query.data),
    refreshing: query.isRefetching && !query.isFetchingNextPage,
    loadingMore: query.isFetchingNextPage,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
