import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppMutation, appHttp } from '../useAppQuery';
import type {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  VerifyOtpPayload,
} from '../../types/auth';
import type { User } from '../../types/user';

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ProfilePhotoPayload = {
  profilePhoto: string;
};

export const useSignInMutation = () => {
  const mutation = useAppMutation<User, SignInPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/signin',
    },
  });

  const signIn = (payload: SignInPayload) => mutation.mutateAsync(payload);

  return {
    ...mutation,
    signIn,
    loading: mutation.isPending,
    hasError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useSignUpMutation = () => {
  const mutation = useAppMutation<unknown, SignUpPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/signup',
    },
  });

  const signUp = (payload: SignUpPayload) => mutation.mutateAsync(payload);

  return {
    ...mutation,
    signUp,
    loading: mutation.isPending,
    hasError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useForgotPasswordMutation = () => {
  const mutation = useAppMutation<unknown, ForgotPasswordPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/forgot-password',
    },
  });

  return {
    ...mutation,
    forgotPassword: (payload: ForgotPasswordPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useVerifyOtpMutation = () => {
  const mutation = useAppMutation<unknown, VerifyOtpPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/verify-otp',
    },
  });

  return {
    ...mutation,
    verifyOtp: (payload: VerifyOtpPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useResetPasswordMutation = () => {
  const mutation = useAppMutation<unknown, ResetPasswordPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/reset-password',
    },
  });

  return {
    ...mutation,
    resetPassword: (payload: ResetPasswordPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useChangePasswordMutation = () => {
  const mutation = useAppMutation<unknown, ChangePasswordPayload>({
    request: {
      method: 'POST',
      url: '/api/auth/change-password',
    },
  });

  return {
    ...mutation,
    changePassword: (payload: ChangePasswordPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useAppMutation<unknown, void>({
    request: {
      method: 'POST',
      url: '/api/auth/logout',
    },
  });

  return {
    ...mutation,
    logout: async () => {
      try {
        return await mutation.mutateAsync(undefined);
      } finally {
        await queryClient.cancelQueries();
        queryClient.clear();
      }
    },
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

export const useUpdateProfilePhotoMutation = () => {
  const mutation = useMutation({
    mutationFn: (payload: ProfilePhotoPayload) =>
      appHttp<unknown, ProfilePhotoPayload>({
        method: 'PATCH',
        url: '/api/users/profile-photo',
        data: payload,
      }),
  });

  return {
    ...mutation,
    updateProfilePhoto: (payload: ProfilePhotoPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
