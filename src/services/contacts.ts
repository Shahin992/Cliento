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

type ContactOwnerDetails = {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  role: string;
  teamId?: number;
  profilePhoto?: string | null;
  phoneNumber?: string;
  location?: string | null;
  timeZone?: string | null;
  createdAt: string;
  updatedAt: string;
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

export type ContactDetails = ContactListItem & {
  jobTitle?: string | null;
  website?: string | null;
  leadSource?: string;
  status?: string;
  tags?: string[];
  notes?: string | null;
  ownerDetails?: ContactOwnerDetails;
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
const contactDetailsInFlight = new Map<string, Promise<ApiResponse<ContactDetails>>>();

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

export const getContactById = (contactId: string): Promise<ApiResponse<ContactDetails>> => {
  const requestKey = contactId.trim();
  const existingRequest = contactDetailsInFlight.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = http.get<ContactDetails>(`/api/contacts/${requestKey}`).finally(() => {
    contactDetailsInFlight.delete(requestKey);
  });

  contactDetailsInFlight.set(requestKey, request);
  return request;
};
