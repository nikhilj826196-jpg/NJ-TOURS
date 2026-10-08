import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2, Clock, Eye, Phone, MapPin, Search, Filter, X, User, Car, Shield, DollarSign, Check, XCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { bookingApi } from '../../api/booking.api';
import { driverApi } from '../../api/driver.api';
import { vehicleApi } from '../../api/vehicle.api';
import { useNotification } from '../../context/NotificationContext';

export default function BookingsManagement() {
  const { t } = useTranslation();
  const { addToast } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit actions state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [assignDriverId, setAssignDriverId] = useState('');
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [changeStatus, setChangeStatus] = useState('');
  const [changePaymentStatus, setChangePaymentStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, driversRes, vehiclesRes] = await Promise.all([
        bookingApi.listBookings(),
        driverApi.listDrivers(),
        vehicleApi.listVehicles()
      ]);
      
      if (bookingsRes?.data?.data && Array.isArray(bookingsRes.data.data)) {
        setBookings(bookingsRes.data.data);
      }
      if (driversRes?.data?.data && Array.isArray(driversRes.data.data)) {
        setDrivers(driversRes.data.data);
      }
      if (vehiclesRes?.data?.data && Array.isArray(vehiclesRes.data.data)) {
        setVehicles(vehiclesRes.data.data);
      }
    } catch (err) {
      console.error("Failed to load booking admin dashboard data:", err);
      addToast("Failed to load live booking, chauffeur or fleet data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetails = (b) => {
    setSelectedBooking(b);
    setAssignDriverId(b.driver_id || '');
    setAssignVehicleId(b.vehicle_id || '');
    setChangeStatus(b.status || 'Pending');
    setChangePaymentStatus(b.payment_status || 'Pending');
    setIsDetailsOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedBooking) return;
    setLoading(true);
    try {
      await bookingApi.updateBooking(selectedBooking.id, {
        driver_id: assignDriverId || null,
        vehicle_id: assignVehicleId || null,
        status: changeStatus,
        payment_status: changePaymentStatus
      });
      addToast("Booking details updated successfully!", "success");
      setIsDetailsOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save changes:", err);
      addToast(err?.message || "Failed to update booking. Make sure selection is valid.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const ref = b.booking_number || b.id || '';
    const custName = b.customer?.full_name || '';
    const pick = b.pickup_location || '';
    const drop = b.drop_location || '';
    
    const matchesSearch = ref.toLowerCase().includes(term) ||
                          custName.toLowerCase().includes(term) ||
                          pick.toLowerCase().includes(term) ||
                          drop.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">{t("dash.bookingsMgmt", "Bookings Management")}</h2>
          <p className="text-xs text-slate-400">Monitor dispatch status, assign chauffeurs, and manage customer bookings</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center gap-2 border border-slate-700 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Booking Ref, Customer, Pickup or Destination..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Assigned">Assigned</option>
            <option value="Started">Started</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/50">
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pickup → Destination</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Fare</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading customer bookings...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No matching customer trip reservations found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{b.booking_number || b.id.slice(0, 8)}</td>
                    <td className="p-4 text-white font-bold">
                      <div>{b.customer?.full_name || 'Walk-in'}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{b.customer?.phone}</div>
                    </td>
                    <td className="p-4 text-slate-300 text-[11px]">{b.pickup_location} ➔ {b.drop_location}</td>
                    <td className="p-4 text-slate-400">{b.vehicle ? `${b.vehicle.name || b.vehicle.model_name} (${b.vehicle.vehicle_number})` : 'Unassigned'}</td>
                    <td className="p-4 text-slate-400">{b.driver?.user?.full_name || 'Unassigned'}</td>
                    <td className="p-4 font-black text-emerald-400">{formatCurrency(b.grand_total || b.total_amount || b.base_fare || 0)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold border ${
                        b.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        b.status === 'Started' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        b.status === 'Confirmed' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                        b.status === 'Assigned' ? 'bg-indigo-950 text-indigo-400 border-indigo-800' :
                        b.status === 'Pending' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                        'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleOpenDetails(b)} className="bg-[#0B5ED7] hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto cursor-pointer">
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details & Actions Modal */}
      {isDetailsOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Booking Details & Dispatch</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">{selectedBooking.booking_number || selectedBooking.id}</span>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold"><span className="text-slate-400">Customer:</span> <span className="text-white">{selectedBooking.customer?.full_name || 'Walk-in'} ({selectedBooking.customer?.phone || 'N/A'})</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Pickup:</span> <span className="text-slate-200">{selectedBooking.pickup_location}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Destination:</span> <span className="text-slate-200">{selectedBooking.drop_location}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Date & Time:</span> <span className="text-slate-300">{selectedBooking.pickup_date} at {selectedBooking.pickup_time}</span></div>
                <div className="flex justify-between font-bold"><span className="text-slate-400">Fare:</span> <span className="text-emerald-400">{formatCurrency(selectedBooking.grand_total || selectedBooking.base_fare || 0)}</span></div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Assign Chauffeur (Driver)</label>
                <select
                  value={assignDriverId}
                  onChange={(e) => setAssignDriverId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">Unassigned / Keep Unchanged</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.user_id}>{d.user?.full_name} ({d.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Assign Fleet Vehicle</label>
                <select
                  value={assignVehicleId}
                  onChange={(e) => setAssignVehicleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">Select Fleet Vehicle / Keep Unchanged</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model_name} ({v.vehicle_number})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Booking Status</label>
                  <select
                    value={changeStatus}
                    onChange={(e) => setChangeStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Started">Started</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={changePaymentStatus}
                    onChange={(e) => setChangePaymentStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsDetailsOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
              <button onClick={handleSaveChanges} className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
