import { useAppQuery } from '../useAppQuery';

type SubscriptionCard = {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

type SubscriptionPackage = {
  _id: string;
  code: string;
  name: string;
  billingCycle: string;
  limits?: {
    users?: number;
  };
  price: {
    amount: number;
    currency: string;
    stripePriceId: string;
  };
};

export type CurrentSubscription = {
  _id: string;
  stripeSubscriptionId: string;
  amount: number;
  billingCycle: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  card?: SubscriptionCard | null;
  cards?: SubscriptionCard[];
  createdAt: string;
  currency: string;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  isCurrent: boolean;
  latestEventId: string | null;
  latestInvoiceId: string | null;
  packageId: SubscriptionPackage | null;
  status: string;
  stripeCustomerId: string;
  stripePriceId: string;
  quantity?: number;
  trialEnd: string | null;
  trialStart: string | null;
  updatedAt: string;
  userId: string;
};

export type SubscriptionTransaction = {
  invoice?: {
    id?: string;
    number?: string;
    status?: string | null;
    currency?: string | null;
    amountPaid?: number | null;
    amountDue?: number | null;
    hostedInvoiceUrl?: string | null;
    invoicePdfUrl?: string | null;
    createdAt?: string | null;
  } | null;
  card?: {
    brand?: string | null;
    last4?: string | null;
  } | null;
  subscription?: {
    packageId?: {
      name?: string | null;
      billingCycle?: string | null;
    } | null;
  } | null;
};

type SubscriptionTransactionsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type SubscriptionTransactionsResponse = {
  transactions: SubscriptionTransaction[];
  pagination?: SubscriptionTransactionsPagination;
};

type SubscriptionTransactionsResult = SubscriptionTransactionsResponse | SubscriptionTransaction[];

export const subscriptionQueryKeys = {
  current: ['subscriptions', 'current'] as const,
  transactions: (page: number, limit: number) =>
    ['subscriptions', 'transactions', { page, limit }] as const,
};

export const useCurrentSubscriptionQuery = () => {
  const query = useAppQuery<CurrentSubscription | null>({
    queryKey: subscriptionQueryKeys.current,
    request: {
      method: 'GET',
      url: '/api/subscriptions/me/current',
    },
    retry: false,
  });

  return {
    ...query,
    currentSubscription: query.data ?? null,
    loading: query.isLoading || query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};

export const useSubscriptionTransactionsQuery = (page = 1, limit = 10, enabled = true) => {
  const query = useAppQuery<SubscriptionTransactionsResult>({
    queryKey: subscriptionQueryKeys.transactions(page, limit),
    request: {
      method: 'GET',
      url: '/api/subscriptions/me/transactions',
      params: { page, limit },
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    transactions: Array.isArray(query.data) ? query.data : query.data?.transactions ?? [],
    pagination: Array.isArray(query.data) ? null : query.data?.pagination ?? null,
    loading: query.isLoading || query.isFetching,
    isInitialLoading: query.isLoading,
    isFetching: query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
