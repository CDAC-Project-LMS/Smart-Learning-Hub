import axiosClient from './axiosClient';

export const userApi = {
  getProfile: () => axiosClient.get('/api/profile'),
  updateProfile: (data) => axiosClient.put('/api/profile', data)
};
