import { useAppMutation } from '../useAppQuery';

export type UpdateProfilePayload = {
  fullName: string;
  companyName: string;
  phoneNumber: string;
  location: string;
  timeZone: string;
};

export const useUpdateProfileDetailsMutation = () => {
  const mutation = useAppMutation<unknown, UpdateProfilePayload>({
    request: {
      method: 'PATCH',
      url: '/api/users/profile',
    },
  });

  return {
    ...mutation,
    updateProfileDetails: (payload: UpdateProfilePayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
