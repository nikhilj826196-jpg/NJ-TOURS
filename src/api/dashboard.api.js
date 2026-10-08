import axiosInstance from './axios';

export const dashboardApi = {
  getOverview: () => axiosInstance.get('/dashboard/overview'),
  getRevenueAnalytics: () => axiosInstance.get('/dashboard/revenue'),
  getBookingAnalytics: () => axiosInstance.get('/dashboard/bookings'),
  getDriverAnalytics: () => axiosInstance.get('/dashboard/drivers'),
  getVehicleAnalytics: () => axiosInstance.get('/dashboard/vehicles'),
  getCustomerAnalytics: () => axiosInstance.get('/dashboard/customers'),
};
