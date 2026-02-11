import { http } from './api';
import type { ApiResponse } from '../types/api';

export type CreateContactAddressPayload = {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  country?: string;
};

export type CreateContactPayload = {
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  emails?: string[];
  phones?: string[];
  address?: CreateContactAddressPayload;
};

export const createContact = (payload: CreateContactPayload): Promise<ApiResponse<unknown>> =>
  http.post<unknown, CreateContactPayload>('/api/contacts', payload);
