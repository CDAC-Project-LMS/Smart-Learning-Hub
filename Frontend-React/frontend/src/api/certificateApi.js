import axiosClient from './axiosClient';

export const certificateApi = {
  issue: (courseId) =>
    axiosClient.post(`/api/student/certificates/courses/${courseId}`),

  getMine: () =>
    axiosClient.get('/api/student/certificates'),

  getForCourse: (courseId) =>
    axiosClient.get(`/api/student/certificates/courses/${courseId}`)
};