import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, MapPin, Radio, CheckCircle2, Phone, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { bookingApi } from '../../api/booking.api';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [driverBookings, setDriverBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDriverData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await bookingApi.getMyBookings();
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setDriverBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load driver dashboard metrics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();

    // Auto-refresh statistics every 45 seconds
    const intervalId = setInterval(() => {
      fetchDriverData();
    }, 45000);

    return () => clearInterval(intervalId);
  }, []);

  const assignedCount = driverBookings.filter(b => b.status === "Assigned" || b.status === "Ongoing" || b.status === "Confirmed").length;
  const totalEarnings = driverBookings.reduce((sum, b) => sum + (b.grand_total || 0), 0);

  return (
    <div className="space-y-8 text-white">
      
      {/* Driver Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase">
              {t('dashboard.driver')}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Telematics Sync
            </div>
          </div>
          <h2 className="text-2xl font-black">{user?.name || "Driver Console"}</h2>
          <p className="text-xs text-slate-300">Duty Status: <strong className="text-amber-400">On Duty & Verified</strong></p>
        </div>
        <button
          onClick={fetchDriverData}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Metrics */}
      {error ? (
        <div className="bg-slate-900 p-8 rounded-2xl border border-rose-800/40 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-slate-200 font-bold text-base">Unable to load dashboard statistics.</p>
          <button 
            onClick={fetchDriverData}
            className="px-5 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('dashboard.todaysTrips')}</div>
            <div className="text-3xl font-black text-amber-400">{assignedCount} Assigned</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('dashboard.monthlyEarnings')}</div>
            <div className="text-3xl font-black text-emerald-400">{formatCurrency(totalEarnings)}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('dashboard.driverRating')}</div>
            <div className="text-3xl font-black text-blue-400">4.95 ⭐</div>
          </div>
        </div>
      )}

      {/* Active Trip Card */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black text-white">{t('dashboard.activeDuty')}</h3>
          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
            PICKUP AT 07:00 AM
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Pickup: <strong className="text-white">Bandra West, Mumbai</strong> ➔ Drop: <strong className="text-white">Calangute, Goa</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Passenger: <strong className="text-white">Rajesh Sharma (+91 98765 43210)</strong></span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => alert("GPS Navigation started!")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl">
            {t('dashboard.startNavigation')}
          </button>
          <button onClick={() => alert("Passenger called!")} className="bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl border border-slate-700">
            {t('dashboard.callPassenger')}
          </button>
        </div>
      </div>

    </div>
  );
}
