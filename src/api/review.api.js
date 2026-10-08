import axiosInstance from './axios';

export const reviewApi = {
  createReview: (reviewData) => axiosInstance.post('/review', reviewData),
  getMyReviews: () => axiosInstance.get('/review/my'),
  listReviews: (params) => axiosInstance.get('/review', params),
  getReviewById: (id) => axiosInstance.get(`/review/${id}`),
  updateReview: (id, updateData) => axiosInstance.put(`/review/${id}`, updateData),
  deleteReview: (id) => axiosInstance.delete(`/review/${id}`),
};
