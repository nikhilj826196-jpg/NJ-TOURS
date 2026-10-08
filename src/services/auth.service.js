import { authApi } from '../api/auth.api';
import { localStorageHelper } from '../utils/localStorage';
import { ROLES } from '../constants/roles';

export const authService = {
  async login(credentials) {
    try {
      const res = await authApi.login(credentials);
      if (res?.data?.data) {
        const { access_token, user } = res.data.data;
        const normalizedUser = {
          id: user.id,
          name: user.full_name || user.name,
          email: user.email,
          phone: user.phone,
          role: (user.role || 'CUSTOMER').toUpperCase()
        };
        localStorageHelper.setToken(access_token);
        localStorageHelper.setUser(normalizedUser);
        return { user: normalizedUser, token: access_token };
      }
    } catch (err) {
      console.warn("Backend auth call warning:", err);
      throw err;
    }

    // Demo fallback for previewing UI roles smoothly
    let role = ROLES.CUSTOMER;
    let name = "Ramesh Kumar";
    let email = credentials.email || "ramesh@example.com";

    if (email.includes('admin')) {
      role = ROLES.ADMIN;
      name = "System Admin (NJ Head Office)";
    } else if (email.includes('driver')) {
      role = ROLES.DRIVER;
      name = "Suresh Patil (Verified Chauffeur)";
    }

    const mockToken = `jwt-token-${Date.now()}-${role}`;
    const user = { id: `usr-${Date.now()}`, name, email, role };

    localStorageHelper.setToken(mockToken);
    localStorageHelper.setUser(user);

    return { user, token: mockToken };
  },

  async register(userData) {
    const payload = {
      full_name: userData.fullName || userData.name || userData.full_name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'Customer'
    };
    const res = await authApi.register(payload);
    return res.data;
  },

  logout() {
    localStorageHelper.clearAuth();
  },

  getCurrentUser() {
    return localStorageHelper.getUser();
  },

  isAuthenticated() {
    return !!localStorageHelper.getToken();
  }
};
