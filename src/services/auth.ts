import { http } from './api';
import type {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  VerifyOtpPayload,
} from '../types/auth';

export const signUp = (payload: SignUpPayload) =>
  http.post<unknown, SignUpPayload>('/api/auth/signup', payload);

export const signIn = (payload: SignInPayload) =>
  http.post<unknown, SignInPayload>('/api/auth/signin', payload);

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  http.post<unknown, ForgotPasswordPayload>('/api/auth/forgot-password', payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  http.post<unknown, VerifyOtpPayload>('/api/auth/verify-otp', payload);

export const resetPassword = (payload: ResetPasswordPayload) =>
  http.post<unknown, ResetPasswordPayload>('/api/auth/reset-password', payload);

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = (payload: ChangePasswordPayload) =>
  http.post<unknown, ChangePasswordPayload>('/api/auth/change-password', payload);
