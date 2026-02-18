import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';

export type BillingCycle = 'monthly' | 'yearly';

export type CreatePackagePayload = {
  code: string;
  name: string;
  description: string;
  billingCycle: BillingCycle;
  hasTrial: boolean;
  trialPeriodDays: number;
  price: {
    amount: number;
    currency: string;
  };
  limits: {
    users: number;
  };
  features: string[];
  isActive: boolean;
  isDefault: boolean;
};

export type PackageResponse = {
  _id: string;
  code: string;
  name: string;
  description: string;
  buyLinkUrl?: string;
  billingCycle: BillingCycle;
  hasTrial: boolean;
  trialPeriodDays: number;
  price: {
    amount: number;
    currency: string;
    stripePriceId?: string;
  };
  limits: {
    users: number;
  };
  features: string[];
  isActive: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const packageQueryKeys = {
  all: ['packages'] as const,
};

export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreatePackagePayload) =>
      appHttp<PackageResponse, CreatePackagePayload>({
        method: 'POST',
        url: '/api/packages',
        data: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: packageQueryKeys.all });
    },
  });

  return {
    ...mutation,
    createPackage: (payload: CreatePackagePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
