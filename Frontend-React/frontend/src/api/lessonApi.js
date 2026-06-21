import axiosClient from './axiosClient';

export const lessonApi = {
  getForCourse: (courseId) => axiosClient.get(`/api/courses/${courseId}/lessons`),
  add: (courseId, data) => axiosClient.post(`/api/instructor/courses/${courseId}/lessons`, data),
  update: (lessonId, data) => axiosClient.put(`/api/instructor/lessons/${lessonId}`, data),
  remove: (lessonId) => axiosClient.delete(`/api/instructor/lessons/${lessonId}`),
  markComplete: (lessonId) => axiosClient.post(`/api/student/lessons/${lessonId}/complete`)
};
