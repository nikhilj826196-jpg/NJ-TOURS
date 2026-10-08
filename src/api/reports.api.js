import axiosInstance from './axios';

export const reportsApi = {
  getBookingReport: (params) => axiosInstance.get('/reports/bookings', params),
  getRevenueReport: (params) => axiosInstance.get('/reports/revenue', params),
  getDriverReport: () => axiosInstance.get('/reports/drivers'),
  getVehicleReport: () => axiosInstance.get('/reports/vehicles'),
  getCustomerReport: () => axiosInstance.get('/reports/customers'),
  getPackageReport: () => axiosInstance.get('/reports/packages'),
};
