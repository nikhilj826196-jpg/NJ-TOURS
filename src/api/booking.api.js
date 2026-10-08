import axiosInstance from './axios';

export const bookingApi = {
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  listBookings: (params) => axiosInstance.get('/bookings', params),
  getMyBookings: () => axiosInstance.get('/bookings/my-bookings'),
  getUserBookings: (userId) => axiosInstance.get(`/bookings/user/${userId}`),
  getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),
  cancelBooking: (id, cancelData) => axiosInstance.post(`/bookings/${id}/cancel`, cancelData),
  updateBooking: (id, updateData) => axiosInstance.put(`/bookings/${id}`, updateData),
  assignDriver: (id, driverId) => axiosInstance.put(`/bookings/${id}/assign-driver`, { driver_id: driverId }),
  updateStatus: (id, statusData) => axiosInstance.put(`/bookings/${id}/status`, statusData),
  getAllBookings: () => axiosInstance.get('/bookings'),
  calculatePrice: (calcData) => axiosInstance.post('/bookings/calculate-price', calcData)
};
