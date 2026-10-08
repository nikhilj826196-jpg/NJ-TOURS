import axiosInstance from './axios';

export const paymentApi = {
  createOrder: (data) => axiosInstance.post('/payments/create-order', data),
  verifyPayment: (data) => axiosInstance.post('/payments/verify', data),
  refundPayment: (data) => axiosInstance.post('/payments/refund', data),
  listPayments: (status) => {
    let query = '/payments/history';
    if (status) {
      query += `?status=${status}`;
    }
    return axiosInstance.get(query);
  },
  getInvoice: (paymentId) => axiosInstance.get(`/payments/invoice/${paymentId}`),
  getPaymentById: (paymentId) => axiosInstance.get(`/payments/${paymentId}`),
  getPaymentStatus: (bookingId) => axiosInstance.get(`/payments/status/${bookingId}`)
};

export default paymentApi;
