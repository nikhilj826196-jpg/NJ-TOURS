export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  TOUR_PACKAGES: '/tours',
  VEHICLES: '/vehicles',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  FAQ: '/faq',
  REVIEWS: '/reviews',

  // Auth Routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',

  // Customer Routes
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_BOOKINGS: '/customer/bookings',
  CUSTOMER_MY_BOOKINGS: '/customer/my-bookings',
  CUSTOMER_BOOKING_DETAILS: '/customer/bookings/:id',
  CUSTOMER_PAYMENTS: '/customer/payments',
  CUSTOMER_TRACKING: '/customer/live-tracking',
  CUSTOMER_CHECKOUT: '/customer/checkout/:bookingId',

  // Driver Routes
  DRIVER_DASHBOARD: '/driver/dashboard',
  DRIVER_TRIPS: '/driver/trips',
  DRIVER_TRIP_DETAILS: '/driver/trips/:id',
  DRIVER_EARNINGS: '/driver/earnings',
  DRIVER_PROFILE: '/driver/profile',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_ADD_DRIVER: '/admin/drivers/add',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_TOUR_PACKAGES: '/admin/tour-packages',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_LIVE_TRACKING: '/admin/live-tracking',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_REPORTS: '/admin/reports',

  // Errors
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*'
};
