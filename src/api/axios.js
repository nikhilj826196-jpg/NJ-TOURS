import { localStorageHelper } from '../utils/localStorage';

// Determines backend URL based on host env and optional VITE_API_BASE_URL
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api/v1';
  }
  return '/api/v1';
};

const BASE_URL = getBaseUrl();

class RealAxiosClient {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(method, endpoint, data = null) {
    const token = localStorageHelper.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const config = {
      method: method.toUpperCase(),
      headers,
    };

    if (data && method.toLowerCase() !== 'get' && method.toLowerCase() !== 'delete') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const resData = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorageHelper.clearAuth();
        }
        const detailMsg = Array.isArray(resData?.errors) && resData.errors.length > 0
          ? (typeof resData.errors[0] === 'string' ? resData.errors[0] : resData.errors[0].message)
          : (resData?.detail || resData?.message || `API Error: ${response.status}`);
        throw new Error(detailMsg);
      }
      
      return { status: response.status, data: resData };
    } catch (error) {
      console.error(`[API ERROR] ${method.toUpperCase()} ${endpoint}:`, error);
      throw error;
    }
  }

  get(endpoint) { return this.request('GET', endpoint); }
  post(endpoint, data) { return this.request('POST', endpoint, data); }
  put(endpoint, data) { return this.request('PUT', endpoint, data); }
  delete(endpoint) { return this.request('DELETE', endpoint); }
}

export const axiosInstance = new RealAxiosClient();
export default axiosInstance;
