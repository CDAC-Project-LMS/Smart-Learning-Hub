import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/api/auth/register', data),
  login: (data) => axiosClient.post('/api/auth/login', data),
  logout: () => axiosClient.post('/api/auth/logout'),
  forgotPassword: (data) => axiosClient.post('/api/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/api/auth/reset-password', data),
  changePassword: (data) => axiosClient.post('/api/auth/change-password', data)
};
