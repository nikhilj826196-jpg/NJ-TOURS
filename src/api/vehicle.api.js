import axiosInstance from './axios';

export const vehicleApi = {
  async listVehicles(params = {}) {
    let query = '/vehicles';
    const isAvail = params.isAvailable !== undefined ? params.isAvailable : params.is_available;
    if (isAvail !== undefined) {
      query += `?is_available=${isAvail}`;
    }
    return axiosInstance.get(query);
  },

  async getVehicleById(id) {
    return axiosInstance.get(`/vehicles/${id}`);
  }
};
