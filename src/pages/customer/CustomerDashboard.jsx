import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Clock, CheckCircle2, Shield, Calendar, MapPin, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { bookingApi } from '../../api/booking.api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCustomerData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await bookingApi.getMyBookings();
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map(b => ({
          id: b.booking_number || b.id,
          route: `${b.pickup_location} ➔ ${b.drop_location}`,
          vehicle: b.vehicle ? `${b.vehicle.name || b.vehicle.brand + ' ' + b.vehicle.model_name}` : "Assigned Vehicle",
          date: b.pickup_date,
          status: b.status || "Confirmed",
          amount: b.grand_total || b.total_amount || 0,
          driver: b.driver?.user?.full_name ? `${b.driver.user.full_name}` : "Assigning..."
        }));
        setRecentBookings(mapped);
      }
    } catch (err) {
      console.error("Failed to load customer dashboard bookings:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();

    // Auto-refresh statistics every 45 seconds
    const intervalId = setInterval(() => {
      fetchCustomerData();
    }, 45000);

    return () => clearInterval(intervalId);
  }, []);

  const totalTrips = recentBookings.length;
  const activeTrips = recentBookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase">
            {t('dashboard.customer')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Welcome Back, {user?.name || "Traveler"}!</h2>
          <p className="text-xs text-blue-100 font-light">Manage your upcoming journeys, download GST invoices, and track your driver real-time.</p>
        </div>
        <button
          onClick={fetchCustomerData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer disabled:opacity-50 z-10 shrink-0"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Overview Metric Cards */}
      {error ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-slate-800 font-bold text-base">Unable to load dashboard statistics.</p>
          <button 
            onClick={fetchCustomerData}
            className="px-5 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalTrips} {totalTrips === 1 ? 'Trip' : 'Trips'}</div>
              <div className="text-xs text-slate-500 font-medium">{t('dashboard.totalBookings')}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{activeTrips} Active</div>
              <div className="text-xs text-slate-500 font-medium">Upcoming Ride</div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">Gold VIP</div>
              <div className="text-xs text-slate-500 font-medium">Membership Tier</div>
            </div>
          </div>
        </div>
      )}

      {/* Active/Recent Bookings Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">{t('dashboard.recentBookings')}</h3>
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5">{t('dashboard.bookingId')}</th>
                <th className="p-3.5">{t('dashboard.route')}</th>
                <th className="p-3.5">{t('dashboard.vehicle')}</th>
                <th className="p-3.5">{t('dashboard.date')}</th>
                <th className="p-3.5">{t('dashboard.status')}</th>
                <th className="p-3.5">{t('dashboard.fare')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading your trip reservations...</span>
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                    No trip reservations found yet. Click "Book Now" on the home page to reserve your first trip!
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 font-semibold">
                    <td className="p-3.5 font-mono text-blue-600 font-bold">{b.id}</td>
                    <td className="p-3.5 text-slate-900">{b.route}</td>
                    <td className="p-3.5 text-slate-600">{b.vehicle}</td>
                    <td className="p-3.5 text-slate-500">{b.date}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(b.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
