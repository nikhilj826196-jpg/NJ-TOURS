import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import DriverLayout from '../layouts/DriverLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Lazy loaded page components
const Home = lazy(() => import('../pages/public/Home'));
const About = lazy(() => import('../pages/public/About'));
const FAQPage = lazy(() => import('../pages/public/FAQPage'));
const Services = lazy(() => import('../pages/public/Services'));
const Vehicles = lazy(() => import('../pages/public/Vehicles'));
const TourPackages = lazy(() => import('../pages/public/TourPackages'));
const ContactUs = lazy(() => import('../pages/public/ContactUs'));
const Reviews = lazy(() => import('../pages/public/Reviews'));

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const MyBookings = lazy(() => import('../pages/customer/MyBookings'));
const CustomerProfile = lazy(() => import('../pages/customer/CustomerProfile'));
const CustomerPayments = lazy(() => import('../pages/customer/CustomerPayments'));
const CustomerTracking = lazy(() => import('../pages/customer/CustomerTracking'));
const CustomerCheckout = lazy(() => import('../pages/customer/CustomerCheckout'));

const DriverDashboard = lazy(() => import('../pages/driver/DriverDashboard'));
const AssignedTrips = lazy(() => import('../pages/driver/AssignedTrips'));
const DriverEarnings = lazy(() => import('../pages/driver/DriverEarnings'));
const DriverProfile = lazy(() => import('../pages/driver/DriverProfile'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const BookingsManagement = lazy(() => import('../pages/admin/BookingsManagement'));
const VehiclesManagement = lazy(() => import('../pages/admin/VehiclesManagement'));
const DriversManagement = lazy(() => import('../pages/admin/DriversManagement'));
const AddDriver = lazy(() => import('../pages/admin/AddDriver'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const TourPackagesManagement = lazy(() => import('../pages/admin/TourPackagesManagement'));
const PaymentsManagement = lazy(() => import('../pages/admin/PaymentsManagement'));
const CouponsManagement = lazy(() => import('../pages/admin/CouponsManagement'));
const ReviewsManagement = lazy(() => import('../pages/admin/ReviewsManagement'));
const NotificationsManagement = lazy(() => import('../pages/admin/NotificationsManagement'));
const LiveTracking = lazy(() => import('../pages/admin/LiveTracking'));
const MediaManagement = lazy(() => import('../pages/admin/MediaManagement'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));

const NotFound = lazy(() => import('../pages/errors/NotFound'));
const Unauthorized = lazy(() => import('../pages/errors/Unauthorized'));

function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500">Loading NJ Tours Page...</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export function createRouter(handlers) {
  const { onSearch, onSelectVehicle, onSelectService, onSelectPackage, onOpenBooking, onOpenLogin } = handlers;

  return createBrowserRouter([
    {
      /* Public Nested Routes under MainLayout */
      element: <MainLayout onOpenLogin={onOpenLogin} onOpenBooking={onOpenBooking} />,
      children: [
        {
          path: ROUTES.HOME,
          element: (
            <SuspenseWrapper>
              <Home
                onSearch={onSearch}
                onSelectVehicle={onSelectVehicle}
                onSelectService={onSelectService}
                onSelectPackage={onSelectPackage}
                onOpenBooking={onOpenBooking}
              />
            </SuspenseWrapper>
          )
        },
        { path: ROUTES.ABOUT, element: <SuspenseWrapper><About onOpenBooking={onOpenBooking} /></SuspenseWrapper> },
        { path: ROUTES.FAQ, element: <SuspenseWrapper><FAQPage /></SuspenseWrapper> },
        {
          path: ROUTES.SERVICES,
          element: (
            <SuspenseWrapper>
              <Services onSelectService={onSelectService} onOpenBooking={onOpenBooking} />
            </SuspenseWrapper>
          )
        },
        {
          path: ROUTES.TOUR_PACKAGES,
          element: (
            <SuspenseWrapper>
              <TourPackages onSelectPackage={onSelectPackage} />
            </SuspenseWrapper>
          )
        },
        {
          path: ROUTES.VEHICLES,
          element: (
            <SuspenseWrapper>
              <Vehicles onSelectVehicle={onSelectVehicle} />
            </SuspenseWrapper>
          )
        },
        {
          path: ROUTES.GALLERY,
          element: (
            <SuspenseWrapper>
              <Home
                onSearch={onSearch}
                onSelectVehicle={onSelectVehicle}
                onSelectService={onSelectService}
                onSelectPackage={onSelectPackage}
                onOpenBooking={onOpenBooking}
              />
            </SuspenseWrapper>
          )
        },
        {
          path: ROUTES.CONTACT,
          element: (
            <SuspenseWrapper>
              <ContactUs />
            </SuspenseWrapper>
          )
        },
        {
          path: ROUTES.REVIEWS,
          element: (
            <SuspenseWrapper>
              <Reviews />
            </SuspenseWrapper>
          )
        }
      ]
    },

    /* Auth Nested Routes under AuthLayout */
    {
      element: <AuthLayout />,
      children: [
        { path: ROUTES.LOGIN, element: <SuspenseWrapper><Login /></SuspenseWrapper> },
        { path: ROUTES.REGISTER, element: <SuspenseWrapper><Register /></SuspenseWrapper> },
        { path: ROUTES.FORGOT_PASSWORD, element: <SuspenseWrapper><Login /></SuspenseWrapper> }
      ]
    },

    /* Protected Customer Portal Routes */
    {
      element: <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: ROUTES.CUSTOMER_DASHBOARD, element: <SuspenseWrapper><CustomerDashboard /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_BOOKINGS, element: <SuspenseWrapper><MyBookings /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_MY_BOOKINGS, element: <SuspenseWrapper><MyBookings /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_PROFILE, element: <SuspenseWrapper><CustomerProfile /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_PAYMENTS, element: <SuspenseWrapper><CustomerPayments /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_TRACKING, element: <SuspenseWrapper><CustomerTracking /></SuspenseWrapper> },
            { path: ROUTES.CUSTOMER_CHECKOUT, element: <SuspenseWrapper><CustomerCheckout /></SuspenseWrapper> }
          ]
        }
      ]
    },

    /* Protected Driver Portal Routes */
    {
      element: <ProtectedRoute allowedRoles={[ROLES.DRIVER]} />,
      children: [
        {
          element: <DriverLayout />,
          children: [
            { path: ROUTES.DRIVER_DASHBOARD, element: <SuspenseWrapper><DriverDashboard /></SuspenseWrapper> },
            { path: ROUTES.DRIVER_TRIPS, element: <SuspenseWrapper><AssignedTrips /></SuspenseWrapper> },
            { path: ROUTES.DRIVER_EARNINGS, element: <SuspenseWrapper><DriverEarnings /></SuspenseWrapper> },
            { path: ROUTES.DRIVER_PROFILE, element: <SuspenseWrapper><DriverProfile /></SuspenseWrapper> }
          ]
        }
      ]
    },

    /* Protected Admin HQ Control Routes */
    {
      element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: ROUTES.ADMIN_DASHBOARD, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_USERS, element: <SuspenseWrapper><UsersManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_DRIVERS, element: <SuspenseWrapper><DriversManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_ADD_DRIVER, element: <SuspenseWrapper><AddDriver /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_VEHICLES, element: <SuspenseWrapper><VehiclesManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_BOOKINGS, element: <SuspenseWrapper><BookingsManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_TOUR_PACKAGES, element: <SuspenseWrapper><TourPackagesManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_PAYMENTS, element: <SuspenseWrapper><PaymentsManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_COUPONS, element: <SuspenseWrapper><CouponsManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_REVIEWS, element: <SuspenseWrapper><ReviewsManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_NOTIFICATIONS, element: <SuspenseWrapper><NotificationsManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_LIVE_TRACKING, element: <SuspenseWrapper><LiveTracking /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_MEDIA, element: <SuspenseWrapper><MediaManagement /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_REPORTS, element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper> },
            { path: ROUTES.ADMIN_SETTINGS, element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> }
          ]
        }
      ]
    },

    /* Error Handling Routes */
    { path: ROUTES.UNAUTHORIZED, element: <SuspenseWrapper><Unauthorized /></SuspenseWrapper> },
    { path: ROUTES.NOT_FOUND, element: <SuspenseWrapper><NotFound /></SuspenseWrapper> }
  ]);
}
