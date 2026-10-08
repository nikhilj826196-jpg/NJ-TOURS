import axiosInstance from './axios';

export const couponApi = {
  validateCoupon: (data) => axiosInstance.post('/coupons/validate', data),
  applyCoupon: (data) => axiosInstance.post('/coupons/apply', data),
  listCoupons: () => axiosInstance.get('/coupons')
};

export default couponApi;
