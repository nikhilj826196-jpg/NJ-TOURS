import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, UserCheck, Car, Calendar, DollarSign, Clock, 
  Plus, ArrowUpRight, ArrowDownRight, Eye, CheckCircle2, 
  AlertCircle, Star, Bell, Shield, MapPin, Tag, Loader, RefreshCw, X, Check, Phone, Mail, User
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { dashboardApi } from '../../api/dashboard.api';
import { bookingApi } from '../../api/booking.api';
import { adminApi } from '../../api/admin.api';
import { driverApi } from '../../api/driver.api';
import { vehicleApi } from '../../api/vehicle.api';
import { reportsApi } from '../../api/reports.api';
import { reviewApi } from '../../api/review.api';
import { notificationApi } from '../../api/notification.api';
import { useNotification } from '../../context/NotificationContext';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { addToast } = useNotification();
  const [timeRange, setTimeRange] = useState('weekly');

  // Backend real states
  const [overview, setOverview] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [bookingAnalytics, setBookingAnalytics] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [recentBookingsList, setRecentBookingsList] = useState([]);
  const [recentUsersList, setRecentUsersList] = useState([]);
  const [recentReviewsList, setRecentReviewsList] = useState([]);
  const [recentNotificationsList, setRecentNotificationsList] = useState([]);
  const [driversList, setDriversList] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Booking management modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignDriverId, setAssignDriverId] = useState('');
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [changeStatus, setChangeStatus] = useState('Pending');
  const [changePaymentStatus, setChangePaymentStatus] = useState('Pending');
  const [updating, setUpdating] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [
        statsRes,
        overviewRes,
        revenueRes,
        bookingAnalyticsRes,
        allBookingsRes,
        customersRes,
        reviewsRes,
        notificationsRes,
        driversRes,
        vehiclesRes
      ] = await Promise.allSettled([
        adminApi.getDashboardStats(),
        dashboardApi.getOverview(),
        dashboardApi.getRevenueAnalytics(),
        dashboardApi.getBookingAnalytics(),
        bookingApi.getAllBookings(),
        reportsApi.getCustomerReport(),
        reviewApi.listReviews(),
        notificationApi.listNotifications(),
        driverApi.listDrivers(),
        vehicleApi.listVehicles()
      ]);

      let loaded = false;

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setAdminStats(statsRes.value.data);
        loaded = true;
      }

      if (overviewRes.status === 'fulfilled' && overviewRes.value?.data?.data) {
        setOverview(overviewRes.value.data.data);
        loaded = true;
      }

      if (revenueRes.status === 'fulfilled' && revenueRes.value?.data?.data) {
        setRevenueAnalytics(revenueRes.value.data.data);
      }

      if (bookingAnalyticsRes.status === 'fulfilled' && bookingAnalyticsRes.value?.data?.data) {
        setBookingAnalytics(bookingAnalyticsRes.value.data.data);
      }

      if (allBookingsRes.status === 'fulfilled' && allBookingsRes.value?.data?.data) {
        const rawBookings = allBookingsRes.value.data.data || [];
        setRecentBookingsList(rawBookings.slice(0, 10)); // Take top 10 recent bookings from MySQL
      }

      if (customersRes.status === 'fulfilled' && customersRes.value?.data?.data) {
        const rawCustomers = customersRes.value.data.data || [];
        setRecentUsersList(rawCustomers.slice(0, 5));
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data?.data) {
        const rawReviews = reviewsRes.value.data.data || [];
        setRecentReviewsList(rawReviews.slice(0, 5));
      }

      if (notificationsRes.status === 'fulfilled' && notificationsRes.value?.data?.data) {
        const rawNotifs = notificationsRes.value.data.data || [];
        setRecentNotificationsList(rawNotifs.slice(0, 5));
      }

      if (driversRes.status === 'fulfilled' && driversRes.value?.data?.data) {
        setDriversList(driversRes.value.data.data || []);
      }

      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value?.data?.data) {
        setVehiclesList(vehiclesRes.value.data.data || []);
      }

      if (statsRes.status === 'rejected' && overviewRes.status === 'rejected' && !loaded) {
        setError(true);
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh statistics every 45 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 45000);

    return () => clearInterval(intervalId);
  }, []);

  // Modal actions
  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setAssignDriverId(booking.driver_id || (booking.driver?.id || ''));
    setAssignVehicleId(booking.vehicle_id || (booking.vehicle?.id || ''));
    setChangeStatus(booking.status || 'Pending');
    setChangePaymentStatus(booking.payment_status || 'Pending');
    setIsModalOpen(true);
  };

  const handleSaveBookingUpdate = async () => {
    if (!selectedBooking) return;
    setUpdating(true);
    try {
      await bookingApi.updateBooking(selectedBooking.id, {
        driver_id: assignDriverId || null,
        vehicle_id: assignVehicleId || null,
        status: changeStatus,
        payment_status: changePaymentStatus
      });

      if (assignDriverId && assignDriverId !== selectedBooking.driver_id) {
        await bookingApi.assignDriver(selectedBooking.id, assignDriverId);
      }

      addToast("Booking details and driver assignment saved successfully!", "success");
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update booking:", err);
      addToast(err?.message || "Failed to update booking details. Please try again.", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Dynamic Dashboard Summary Metrics from MySQL
  const stats = [
    { 
      title: "Total Users", 
      value: adminStats ? adminStats.total_users.toLocaleString('en-IN') : (overview?.total_users ? overview.total_users.toLocaleString('en-IN') : "0"), 
      trend: "Total registered accounts", 
      icon: Users, 
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20" 
    },
    { 
      title: "Total Drivers", 
      value: adminStats ? adminStats.total_drivers.toLocaleString('en-IN') : (overview?.total_drivers ? overview.total_drivers.toLocaleString('en-IN') : "0"), 
      trend: adminStats ? `${adminStats.active_drivers} active on duty` : "Active chauffeurs", 
      icon: UserCheck, 
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
    },
    { 
      title: "Total Vehicles", 
      value: adminStats ? adminStats.total_vehicles.toLocaleString('en-IN') : (overview?.total_vehicles ? overview.total_vehicles.toLocaleString('en-IN') : "0"), 
      trend: adminStats ? `${adminStats.available_vehicles} available now` : "Fleet inventory", 
      icon: Car, 
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20" 
    },
    { 
      title: "Total Bookings", 
      value: adminStats ? adminStats.total_bookings.toLocaleString('en-IN') : (overview?.total_bookings ? overview.total_bookings.toLocaleString('en-IN') : "0"), 
      trend: adminStats ? `${adminStats.weekly_bookings} this week` : "All trip reservations", 
      icon: Calendar, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20" 
    },
    { 
      title: "Total Revenue", 
      value: adminStats ? formatCurrency(adminStats.total_revenue) : (overview?.total_revenue ? formatCurrency(overview.total_revenue) : "₹0"), 
      trend: "Total captured payments", 
      icon: DollarSign, 
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20" 
    },
    { 
      title: "Pending Bookings", 
      value: adminStats ? adminStats.pending_bookings.toString() : "0", 
      trend: "Requires dispatch action", 
      icon: Clock, 
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20" 
    },
  ];

  // Dynamic status breakdown
  const statusCounts = bookingAnalytics?.bookings_by_status || {
    "Completed": overview?.completed_trips || 0,
    "Confirmed": 0,
    "Assigned": 0,
    "Pending": adminStats?.pending_bookings || 0,
    "Cancelled": overview?.cancelled_trips || 0
  };

  const totalStatusSum = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  const statusItems = [
    { status: "Completed", count: statusCounts["Completed"] || statusCounts["COMPLETED"] || 0, color: "bg-emerald-500", text: "text-emerald-400" },
    { status: "Confirmed", count: statusCounts["Confirmed"] || statusCounts["CONFIRMED"] || 0, color: "bg-blue-500", text: "text-blue-400" },
    { status: "Assigned", count: statusCounts["Assigned"] || statusCounts["ASSIGNED"] || 0, color: "bg-amber-500", text: "text-amber-400" },
    { status: "Pending", count: statusCounts["Pending"] || statusCounts["PENDING"] || 0, color: "bg-orange-500", text: "text-orange-400" },
    { status: "Cancelled", count: statusCounts["Cancelled"] || statusCounts["CANCELLED"] || 0, color: "bg-rose-500", text: "text-rose-400" }
  ];

  // Dynamic Chart Series from Backend (last 7 days)
  const chartLabels = revenueAnalytics?.revenue_chart?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revSeries = revenueAnalytics?.revenue_chart?.series?.find(s => s.name === "Revenue (INR)")?.data || [0, 0, 0, 0, 0, 0, 0];
  const bkSeries = revenueAnalytics?.revenue_chart?.series?.find(s => s.name === "Bookings Count")?.data || [0, 0, 0, 0, 0, 0, 0];

  const maxRev = Math.max(...revSeries, 1);
  const maxBk = Math.max(...bkSeries, 1);

  return (
    <div className="space-y-6 text-slate-100 pb-8 font-sans">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin HQ Control Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Real-time operational metrics fetched live from FastAPI & MySQL Database.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <Link to={ROUTES.ADMIN_VEHICLES} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Add Vehicle
          </Link>
          <Link to={ROUTES.ADMIN_ADD_DRIVER} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Add Driver
          </Link>
          <Link to={ROUTES.ADMIN_TOUR_PACKAGES} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Tour Package
          </Link>
          <Link to={ROUTES.ADMIN_COUPONS} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
            <Tag className="w-4 h-4" /> Coupon
          </Link>
        </div>
      </div>

      {/* 6 Top Statistics Cards */}
      {error ? (
        <div className="bg-slate-950 p-8 rounded-2xl border border-rose-800/40 text-center space-y-4 my-2">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-slate-200 font-bold text-base">Unable to load dashboard statistics.</p>
          <button 
            onClick={fetchDashboardData}
            className="px-5 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Total Users", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { title: "Total Drivers", icon: UserCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { title: "Total Vehicles", icon: Car, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
            { title: "Total Bookings", icon: Calendar, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { title: "Total Revenue", icon: DollarSign, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
            { title: "Pending Bookings", icon: Clock, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.title}</span>
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon className="w-4 h-4 opacity-40" />
                  </div>
                </div>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-slate-400 tracking-tight">Loading...</span>
                </div>
                
                <div className="mt-2 h-3 bg-slate-800/60 rounded-full w-2/3"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.title}</span>
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white tracking-tight">{item.value}</span>
                </div>
                
                <div className="mt-1 text-[11px] text-slate-500 font-medium">
                  {item.trend}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking & Revenue Overview (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">Booking & Revenue Overview</h3>
              <p className="text-xs text-slate-400">Live 7-day bookings and revenue aggregates from database</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              {['daily', 'weekly', 'monthly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTimeRange(type)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${timeRange === type ? 'bg-[#0B5ED7] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Graph Representation with Database Real Data */}
          {loading ? (
            <div className="h-64 flex items-center justify-center border-b border-slate-800/80 text-xs text-slate-500 gap-2">
              <Loader className="w-5 h-5 animate-spin text-[#0B5ED7]" />
              <span>Loading revenue graph from MySQL...</span>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800/80">
              {chartLabels.map((lbl, i) => {
                const bkVal = bkSeries[i] || 0;
                const revVal = revSeries[i] || 0;

                const bkHeight = maxBk > 0 ? Math.max(10, Math.round((bkVal / maxBk) * 100)) : 10;
                const revHeight = maxRev > 0 ? Math.max(10, Math.round((revVal / maxRev) * 100)) : 10;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      <div 
                        style={{ height: `${bkHeight}%` }} 
                        className="w-1/2 bg-[#0B5ED7] rounded-t-md group-hover:bg-blue-400 transition-all"
                        title={`Bookings: ${bkVal}`}
                      />
                      <div 
                        style={{ height: `${revHeight}%` }} 
                        className="w-1/2 bg-[#FF8C00] rounded-t-md group-hover:bg-amber-400 transition-all"
                        title={`Revenue: ₹${revVal.toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{lbl}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#0B5ED7]" /> Bookings Count
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#FF8C00]" /> Revenue (INR)
            </span>
          </div>
        </div>

        {/* Booking Status Distribution (1 Column) */}
        <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-white">Booking Status Breakdown</h3>
            <p className="text-xs text-slate-400">Current trip lifecycle distribution</p>
          </div>

          <div className="space-y-3 pt-2">
            {statusItems.map((item, idx) => {
              const pctVal = Math.round((item.count / totalStatusSum) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{item.status}</span>
                    <span className={item.text}>{item.count} ({pctVal}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className={`h-full ${item.color}`} style={{ width: `${pctVal}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white">Recent Ride Bookings</h3>
            <p className="text-xs text-slate-400">Live booking queue & driver dispatch management</p>
          </div>
          <Link to={ROUTES.ADMIN_BOOKINGS} className="text-xs font-bold text-[#0B5ED7] hover:underline flex items-center gap-1">
            View All Bookings <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Route</th>
                <th className="py-3 px-3">Fare</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {recentBookingsList.length > 0 ? (
                recentBookingsList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{b.booking_number || b.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{b.customer?.full_name || b.customer_name || 'Passenger'}</td>
                    <td className="py-3 px-3 text-slate-300">{b.vehicle?.name || b.vehicle_name || 'Fleet Vehicle'}</td>
                    <td className="py-3 px-3 text-slate-300">{b.driver?.full_name || b.driver_name || 'Unassigned'}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{b.pickup_location} → {b.drop_location}</td>
                    <td className="py-3 px-3 font-bold text-white">₹{(b.grand_total || b.total_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        String(b.status).toLowerCase() === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        String(b.status).toLowerCase() === 'assigned' || String(b.status).toLowerCase() === 'ongoing' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        String(b.status).toLowerCase() === 'confirmed' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                        String(b.status).toLowerCase() === 'pending' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                        'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenModal(b)}
                        className="text-slate-400 hover:text-white inline-flex p-1.5 bg-slate-900 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        title="View & Manage Booking"
                      >
                        <Eye className="w-4 h-4 text-[#0B5ED7]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {loading ? (
                      <div className="flex justify-center items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-[#0B5ED7]" />
                        <span>Fetching real database records...</span>
                      </div>
                    ) : 'No bookings found in MySQL database.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Columns: Recent Users, Reviews, Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Users */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0B5ED7]" /> Recent Users
            </h4>
            <Link to={ROUTES.ADMIN_USERS} className="text-[11px] font-bold text-[#0B5ED7] hover:underline">View All</Link>
          </div>
          <div className="space-y-2.5">
            {recentUsersList.length > 0 ? (
              recentUsersList.map((u, i) => (
                <div key={u.id || i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{u.full_name || u.customer_name || u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.email || u.phone || 'Verified User'}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded uppercase">
                    {u.role || 'Customer'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic text-center py-4">No recent users found.</div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Recent Reviews
            </h4>
            <Link to={ROUTES.ADMIN_REVIEWS} className="text-[11px] font-bold text-[#0B5ED7] hover:underline">View All</Link>
          </div>
          <div className="space-y-2.5">
            {recentReviewsList.length > 0 ? (
              recentReviewsList.map((r, i) => (
                <div key={r.id || i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{r.customer_name || r.user?.full_name || 'Passenger'}</span>
                    <span className="text-amber-400">⭐ {r.rating || 5}.0</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">"{r.comment || r.title || 'Great trip experience.'}"</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic text-center py-4">No reviews submitted yet.</div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> System Alerts
            </h4>
            <Link to={ROUTES.ADMIN_NOTIFICATIONS} className="text-[11px] font-bold text-[#0B5ED7] hover:underline">View All</Link>
          </div>
          <div className="space-y-2.5">
            {recentNotificationsList.length > 0 ? (
              recentNotificationsList.map((n, i) => (
                <div key={n.id || i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{n.title || n.subject || 'System Event'}</span>
                    <span className="text-[10px] text-slate-500">{n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{n.message || n.body || n.recipient}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic text-center py-4">No active system alerts.</div>
            )}
          </div>
        </div>

      </div>

      {/* Admin Booking Management & Driver Assignment Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md font-bold">
                  {selectedBooking.booking_number || selectedBooking.id}
                </span>
                <h3 className="text-lg font-black text-white mt-1">Admin Booking Management</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 bg-slate-900 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Customer & Route Details */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 text-xs text-blue-400">
                  <User className="w-4 h-4" /> Customer & Route Info
                </h4>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-slate-400">Customer:</span>
                    <div className="font-bold text-white">{selectedBooking.customer?.full_name || selectedBooking.customer_name || 'Passenger'}</div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Pickup: <strong className="text-white">{selectedBooking.pickup_location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Drop: <strong className="text-white">{selectedBooking.drop_location}</strong></span>
                  </div>
                  <div>
                    <span className="text-slate-400">Journey Date:</span>
                    <div className="font-bold text-white">{selectedBooking.pickup_date} at {selectedBooking.pickup_time || '08:00 AM'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Passengers:</span>
                    <div className="font-bold text-white">{selectedBooking.passengers || 1} Passengers</div>
                  </div>
                </div>
              </div>

              {/* Fare & Fleet Info */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 text-xs text-amber-400">
                  <Car className="w-4 h-4" /> Vehicle & Fare Summary
                </h4>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-slate-400">Requested Vehicle:</span>
                    <div className="font-bold text-white">{selectedBooking.vehicle?.name || selectedBooking.vehicle_name || 'Standard Vehicle'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Estimated Distance:</span>
                    <div className="font-bold text-white">{selectedBooking.distance_km || 0} km</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Grand Total Fare:</span>
                    <div className="text-base font-black text-emerald-400">₹{(selectedBooking.grand_total || selectedBooking.total_amount || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Admin Dispatch & Driver Assignment Form */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5 text-purple-400">
                <Shield className="w-4 h-4" /> Dispatch Controls & Driver Assignment
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Driver Assignment Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Assign Driver:</label>
                  <select
                    value={assignDriverId}
                    onChange={(e) => setAssignDriverId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0B5ED7]"
                  >
                    <option value="">-- Select Chauffeur --</option>
                    {driversList.map((d) => (
                      <option key={d.id} value={d.id || d.user_id}>
                        {d.full_name || d.user?.full_name || d.name || `Driver (${d.id})`} {d.license_number ? `[${d.license_number}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Booking Status Update */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Booking Lifecycle Status:</label>
                  <select
                    value={changeStatus}
                    onChange={(e) => setChangeStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0B5ED7]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Started">Started / Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status Update */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Payment Status:</label>
                  <select
                    value={changePaymentStatus}
                    onChange={(e) => setChangePaymentStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0B5ED7]"
                  >
                    <option value="Pending">Pending / Unpaid</option>
                    <option value="Paid">Paid / Captured</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex justify-end items-center gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBookingUpdate}
                disabled={updating}
                className="px-5 py-2 bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
