import { http } from './api';
import type { SignInPayload, SignUpPayload } from '../types/auth';

export const signUp = (payload: SignUpPayload) =>
  http.post<unknown, SignUpPayload>('/api/auth/signup', payload);

export const signIn = (payload: SignInPayload) =>
  http.post<unknown, SignInPayload>('/api/auth/signin', payload);
