import axiosInstance from './axios';

export const driverApi = {
  async createDriver(driverData) {
    return axiosInstance.post('/drivers', driverData);
  },

  async listDrivers() {
    return axiosInstance.get('/drivers');
  },

  async getDriverById(id) {
    return axiosInstance.get(`/drivers/${id}`);
  },

  async assignVehicle(driverId, vehicleId) {
    return axiosInstance.put(`/drivers/${driverId}/assign-vehicle`, { vehicle_id: vehicleId });
  }
};
