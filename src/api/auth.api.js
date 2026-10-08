import axiosInstance from './axios';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  verifyOtp: (otpData) => axiosInstance.post('/auth/verify-otp', otpData),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  getProfile: () => axiosInstance.get('/auth/me')
};
