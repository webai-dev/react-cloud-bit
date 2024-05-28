import { apiService } from 'utils/api';

export const imageUpload = file => {
  let data = new FormData();
  data.append('photo', file);

  return apiService.post(`photos`, data, { headers: { 'content-type': 'multipart/form-data' } });
};
