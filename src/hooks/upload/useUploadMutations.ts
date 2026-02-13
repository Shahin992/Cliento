import { useMutation } from '@tanstack/react-query';
import { appHttp } from '../useAppQuery';

export type UploadPhotoResponse = {
  url: string;
  key?: string;
};

export type UploadPhotoPayload = {
  file: File;
  folder: string;
};

export const useUploadPhotoMutation = () => {
  const mutation = useMutation({
    mutationFn: ({ file, folder }: UploadPhotoPayload) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      return appHttp<UploadPhotoResponse, FormData>({
        method: 'POST',
        url: '/api/upload/photo',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  return {
    ...mutation,
    uploadPhoto: (payload: UploadPhotoPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};
