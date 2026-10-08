import axiosInstance from './axios';

export const adminApi = {
  getDashboardStats: () => axiosInstance.get('/admin/dashboard/stats'),
};
