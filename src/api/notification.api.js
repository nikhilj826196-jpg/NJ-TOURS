import axiosInstance from './axios';

export const notificationApi = {
  listNotifications: (params) => axiosInstance.get('/notifications', params),
  getNotificationById: (id) => axiosInstance.get(`/notifications/${id}`),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
};
