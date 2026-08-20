import axiosClient from './axiosClient';

export const quizApi = {
  getForCourse: (courseId) => axiosClient.get(`/api/courses/${courseId}/quizzes`),
  getForAttempt: (quizId) => axiosClient.get(`/api/quizzes/${quizId}/attempt`),
  submit: (quizId, data) => axiosClient.post(`/api/quizzes/${quizId}/submit`, data),
  getMyAttempts: (quizId) => axiosClient.get(`/api/student/quizzes/${quizId}/attempts`),

  // Instructor
  create: (courseId, data) => axiosClient.post(`/api/instructor/courses/${courseId}/quizzes`, data),
  getForCourseInstructor: (courseId) => axiosClient.get(`/api/instructor/courses/${courseId}/quizzes`),
  removeQuiz: (quizId) => axiosClient.delete(`/api/instructor/quizzes/${quizId}`),
  addQuestion: (quizId, data) => axiosClient.post(`/api/instructor/quizzes/${quizId}/questions`, data),
  updateQuestion: (questionId, data) => axiosClient.put(`/api/instructor/questions/${questionId}`, data),
  removeQuestion: (questionId) => axiosClient.delete(`/api/instructor/questions/${questionId}`)
};
