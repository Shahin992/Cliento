import { http } from './api';
import type { ApiResponse } from '../types/api';

export type UploadPhotoResponse = {
  url: string;
  key?: string;
};

export type UploadPhotoPayload = {
  file: File;
  folder: string;
};

export const uploadPhoto = async ({
  file,
  folder,
}: UploadPhotoPayload): Promise<ApiResponse<UploadPhotoResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    return await http.upload<UploadPhotoResponse>('/api/upload/photo', formData);
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
