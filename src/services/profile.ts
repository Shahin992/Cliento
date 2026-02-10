import type { ApiResponse } from '../types/api';
import { http } from './api';

export type UpdateProfilePayload = {
  fullName: string;
  companyName: string;
  phoneNumber: string;
  location: string;
  timeZone: string;
};

export const updateProfileDetails = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<unknown>> => {
  try {
    return await http.patch<unknown, UpdateProfilePayload>('/api/users/profile', payload);
  } catch (error) {
    return {
      success: false,
      statusCode: 0,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  } finally {
    // Reserved for future instrumentation/cleanup.
  }
};
