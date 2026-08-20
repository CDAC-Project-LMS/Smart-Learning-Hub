import axiosClient from './axiosClient';

export const reviewApi = {
  getForCourse: (courseId, params) => axiosClient.get(`/api/courses/${courseId}/reviews`, { params }),
  add: (courseId, data) => axiosClient.post(`/api/student/courses/${courseId}/reviews`, data)
};
