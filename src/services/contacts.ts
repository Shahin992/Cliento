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
  companyName?: string;
  photoUrl?: string;
  emails?: string[];
  phones?: string[];
  address?: CreateContactAddressPayload;
};

type ContactAddress = {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};

export type ContactListItem = {
  _id: string;
  ownerId: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  emails: string[];
  phones: string[];
  companyName?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  address?: ContactAddress;
};

export type ContactsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetContactsResponse = {
  contacts: ContactListItem[];
  pagination: ContactsPagination;
};

export type GetContactsParams = {
  page: number;
  limit: number;
  search?: string;
};

const contactsListInFlight = new Map<string, Promise<ApiResponse<GetContactsResponse>>>();

export const createContact = (payload: CreateContactPayload): Promise<ApiResponse<unknown>> =>
  http.post<unknown, CreateContactPayload>('/api/contacts', payload);

export const getContacts = ({
  page,
  limit,
  search,
}: GetContactsParams): Promise<ApiResponse<GetContactsResponse>> => {
  const requestKey = JSON.stringify({
    page,
    limit,
    search: (search ?? '').trim(),
  });

  const existingRequest = contactsListInFlight.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = http
    .get<GetContactsResponse>('/api/contacts', {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    })
    .finally(() => {
      contactsListInFlight.delete(requestKey);
    });

  contactsListInFlight.set(requestKey, request);
  return request;
};
