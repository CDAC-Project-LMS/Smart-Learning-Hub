import axiosClient from './axiosClient';

export const aiApi = {
  chat: (message, courseId) => axiosClient.post('/api/ai/chat', { message, courseId })
};
