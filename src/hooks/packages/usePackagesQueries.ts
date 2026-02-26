import { useAppQuery } from '../useAppQuery';

export type BillingCycle = 'monthly' | 'yearly';

export type BillingPackage = {
  _id: string;
  code: string;
  name: string;
  description: string;
  buyLinkUrl?: string;
  hasTrial: boolean;
  trialPeriodDays: number;
  billingCycle: BillingCycle;
  price: {
    amount: number;
    currency: string;
    stripePriceId?: string;
  };
  limits: {
    users: number;
  };
  features: string[];
  isDefault: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type BillingPackagesResponse = {
  packages: BillingPackage[];
};

type PackagesPublicFilters = {
  planType: string | null;
  billingCycle: BillingCycle | null;
};

export const packageQueryKeys = {
  all: ['packages'] as const,
  public: (filters: PackagesPublicFilters) => ['packages', 'public', filters] as const,
};

export const usePackagesQuery = (filters: PackagesPublicFilters) => {
  const query = useAppQuery<BillingPackagesResponse>({
    queryKey: packageQueryKeys.public(filters),
    request: {
      method: 'POST',
      url: '/api/packages/public',
      data: filters,
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    packages: query.data?.packages ?? [],
    loading: query.isLoading,
    fetching: query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
