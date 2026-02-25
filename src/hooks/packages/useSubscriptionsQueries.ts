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

export const subscriptionQueryKeys = {
  current: ['subscriptions', 'current'] as const,
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
