import axiosClient from './axiosClient';

export const courseApi = {
  getAll: (params) => axiosClient.get('/api/courses', { params }),
  getById: (id) => axiosClient.get(`/api/courses/${id}`),
  search: (keyword, params) => axiosClient.get('/api/courses/search', { params: { keyword, ...params } }),
  getByCategory: (category, params) => axiosClient.get(`/api/courses/category/${category}`, { params }),

  // Instructor
  create: (data) => axiosClient.post('/api/instructor/courses', data),
  update: (id, data) => axiosClient.put(`/api/instructor/courses/${id}`, data),
  remove: (id) => axiosClient.delete(`/api/instructor/courses/${id}`),
  uploadImage: (id, imageUrl) =>
    axiosClient.patch(`/api/instructor/courses/${id}/image`, null, { params: { imageUrl } }),
  getMine: (params) => axiosClient.get('/api/instructor/courses/mine', { params }),

  // Admin
  getAllAdmin: (params) => axiosClient.get('/api/admin/courses', { params }),
  removeAdmin: (id) => axiosClient.delete(`/api/admin/courses/${id}`)
};
