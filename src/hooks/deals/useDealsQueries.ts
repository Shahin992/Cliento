import { useAppQuery } from '../useAppQuery';

type DealPipeline = {
  _id: string;
  name: string;
  isDefault?: boolean;
};

type DealStage = {
  _id: string;
  name: string;
  color?: string | null;
  order?: number;
  isDefault?: boolean;
};

type DealContact = {
  _id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  emails?: string[];
  phones?: string[];
};

type DealOwner = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type DealListItem = {
  _id: string;
  title: string;
  amount: number | null;
  expectedCloseDate: string | null;
  status: string;
  wonAt?: string | null;
  lostAt?: string | null;
  lostReason?: string | null;
  createdBy: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  dealOwner?: DealOwner;
  pipeline?: DealPipeline;
  stage?: DealStage;
  contact?: DealContact;
};

type DealsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type DealsResponse = {
  deals: DealListItem[];
  pagination: DealsPagination;
};

export type DealDetailsItem = {
  _id: string;
  title: string;
  amount: number | null;
  expectedCloseDate: string | null;
  status: string;
  wonAt?: string | null;
  lostAt?: string | null;
  lostReason?: string | null;
  createdBy: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  dealOwner?: DealOwner;
  pipeline?: DealPipeline;
  stage?: DealStage;
  contact?: DealContact;
};

export const dealsQueryKeys = {
  all: ['deals'] as const,
  list: (page: number, limit: number, search?: string, pipelineId?: string, status?: string) =>
    [
      'deals',
      'list',
      {
        page,
        limit,
        search: (search ?? '').trim(),
        pipelineId: (pipelineId ?? '').trim(),
        status: (status ?? '').trim(),
      },
    ] as const,
  detail: (dealId: string) => ['deals', 'detail', dealId] as const,
};

export const useDealsQuery = (
  page: number,
  limit: number,
  search?: string,
  pipelineId?: string,
  status?: string,
) => {
  const normalizedPipelineId = (pipelineId ?? '').trim();
  const normalizedStatus = (status ?? '').trim();
  const query = useAppQuery<DealsResponse>({
    queryKey: dealsQueryKeys.list(page, limit, search, normalizedPipelineId, normalizedStatus),
    request: {
      method: 'GET',
      url: '/api/deals',
      params: {
        page,
        limit,
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(normalizedPipelineId ? { pipelineId: normalizedPipelineId } : {}),
        ...(normalizedStatus ? { status: normalizedStatus } : {}),
      },
    },
  });

  return {
    ...query,
    deals: query.data?.deals ?? [],
    pagination: query.data?.pagination,
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

export const useDealDetailsQuery = (dealId?: string) => {
  const normalizedDealId = (dealId ?? '').trim();
  const query = useAppQuery<DealDetailsItem>({
    queryKey: dealsQueryKeys.detail(normalizedDealId),
    request: {
      method: 'GET',
      url: `/api/deals/${normalizedDealId}`,
    },
    enabled: Boolean(normalizedDealId),
  });

  return {
    ...query,
    deal: query.data,
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
