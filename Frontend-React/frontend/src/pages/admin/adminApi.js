import axiosClient from './axiosClient';

export const adminApi = {
  getStudents: (params) => axiosClient.get('/api/admin/students', { params }),
  getInstructors: (params) => axiosClient.get('/api/admin/instructors', { params }),
  getAllUsers: (params) => axiosClient.get('/api/admin/users', { params }),
  setUserStatus: (userId, active) =>
    axiosClient.patch(`/api/admin/users/${userId}/status`, null, { params: { active } }),
  deleteUser: (userId) => axiosClient.delete(`/api/admin/users/${userId}`),
  getDashboardStats: () => axiosClient.get('/api/admin/dashboard')
};
