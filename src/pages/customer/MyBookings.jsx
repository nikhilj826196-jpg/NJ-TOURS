import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, MapPin, Calendar, Clock, Download, CheckCircle2, RefreshCw, X, Info, AlertTriangle, Users, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { bookingApi } from '../../api/booking.api';
import { paymentApi } from '../../api/payment.api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function MyBookings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal and Cancellation state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [otherReason, setOtherReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getMyBookings();
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map(b => ({
          uuid: b.id,
          id: b.booking_number || b.id,
          pickup: b.pickup_location,
          drop: b.drop_location,
          date: b.pickup_date,
          time: b.pickup_time,
          vehicle: b.vehicle ? `${b.vehicle.name || b.vehicle.brand + ' ' + b.vehicle.model_name} (${b.vehicle.vehicle_number})` : "Assigned Vehicle",
          status: b.status || "Confirmed",
          paymentStatus: b.payment_status || "Pending",
          amount: b.grand_total || b.total_amount || 0,
          driver: b.driver?.user?.full_name ? `${b.driver.user.full_name} (${b.driver.user.phone})` : "Assigning Chauffeur...",
          tripType: b.trip_type,
          passengers: b.passengers,
          distance: b.distance_km,
          duration: b.estimated_duration,
          baseFare: b.base_fare,
          driverAllowance: b.driver_allowance,
          tollCharges: b.toll_charges,
          parkingCharges: b.parking_charges,
          extraCharges: b.extra_charges,
          discount: b.discount,
          gst: b.gst,
          grandTotal: b.grand_total,
          cancellationReason: b.cancellation_reason,
          cancelledAt: b.cancelled_at
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error("Failed to load customer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayNow = (bookingId) => {
    navigate(`/customer/checkout/${bookingId}`);
  };

  const handleConfirmCancellation = async () => {
    if (!selectedBooking) return;
    const finalReason = cancelReason === 'Other' ? otherReason : cancelReason;
    setSubmittingCancel(true);
    try {
      await bookingApi.cancelBooking(selectedBooking.uuid, { reason: finalReason });
      
      addToast("Your booking was cancelled successfully.", "success");
      
      const updatedStatus = "Cancelled";
      const updatedReason = finalReason;
      const updatedTime = new Date().toISOString();
      
      setSelectedBooking(prev => prev ? {
        ...prev,
        status: updatedStatus,
        cancellationReason: updatedReason,
        cancelledAt: updatedTime
      } : null);
      
      setBookings(prevList => prevList.map(b => b.uuid === selectedBooking.uuid ? {
        ...b,
        status: updatedStatus,
        cancellationReason: updatedReason,
        cancelledAt: updatedTime
      } : b));

      setIsCancelModalOpen(false);
      setCancelReason('Change of plans');
      setOtherReason('');
    } catch (err) {
      console.error("Cancellation error:", err);
      addToast(err?.response?.data?.message || err?.message || "Failed to cancel booking.", "error");
    } finally {
      setSubmittingCancel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Trip Bookings</h2>
          <p className="text-xs text-slate-500">Track current outstation trips and download past GST tax invoices</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          {bookings.length} Total {bookings.length === 1 ? 'Booking' : 'Bookings'}
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
            <span>Loading your trip reservations...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            No trip reservations found. Click "Book Now" on the home page to reserve a trip!
          </div>
        ) : (
          bookings.map((b) => (
          <div key={b.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-blue-600 font-mono">{b.id}</span>
                <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase border ${
                  b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                  b.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {b.status}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                  b.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-orange-50 text-orange-700 border-orange-300'
                }`}>
                  {b.paymentStatus === 'Paid' ? '✓ Paid' : 'Unpaid'}
                </span>
              </div>
              <div className="text-sm font-black text-slate-900">
                {formatCurrency(b.amount)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-slate-500 font-medium">Route Details:</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{b.pickup} ➔ {b.drop}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500 font-medium">Date & Time:</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>{b.date} at {b.time}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-slate-600">
                Vehicle: <strong>{b.vehicle}</strong> • Driver: <strong>{b.driver}</strong>
              </div>
              <div className="flex gap-2">
                {(b.status === 'Pending' || b.status === 'Confirmed') && b.paymentStatus === 'Pending' && (
                  <button
                    onClick={() => handlePayNow(b.uuid, b.amount)}
                    disabled={processingPayment}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-xl border border-slate-300 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" /> View Details
                </button>
                <button
                  onClick={() => alert(`Downloading Invoice PDF for ${b.id}...`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Invoice
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Trip Booking Details</h3>
                <span className="text-xs font-mono text-blue-600 font-bold">{selectedBooking.id}</span>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-medium">Booking Status</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                    selectedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    selectedBooking.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    selectedBooking.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {selectedBooking.status}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                    selectedBooking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-orange-50 text-orange-700 border-orange-300'
                  }`}>
                    {selectedBooking.paymentStatus === 'Paid' ? '✓ Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Route & Schedule</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-900 text-sm font-bold">{selectedBooking.pickup} ➔ {selectedBooking.drop}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date: <strong>{selectedBooking.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Time: <strong>{selectedBooking.time}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Passengers: <strong>{selectedBooking.passengers} pax</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span>Trip Type: <strong>{selectedBooking.tripType}</strong></span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium border-t border-slate-200 pt-2 mt-2">
                    Distance: <strong>{selectedBooking.distance} km</strong> • Duration: <strong>{selectedBooking.duration}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Chauffeur & Fleet Assignment</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Assigned Chauffeur</span>
                    <div className="text-slate-900 font-bold mt-0.5">{selectedBooking.driver}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Fleet Vehicle</span>
                    <div className="text-slate-900 font-bold mt-0.5">{selectedBooking.vehicle}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Fare Breakdown</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Base Fare</span>
                    <span>{formatCurrency(selectedBooking.baseFare)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Driver Allowance</span>
                    <span>{formatCurrency(selectedBooking.driverAllowance)}</span>
                  </div>
                  {selectedBooking.gst > 0 && (
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>GST Tax (5%)</span>
                      <span>{formatCurrency(selectedBooking.gst)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-950 text-sm">
                    <span>Total Price (Inclusive of Tax)</span>
                    <span className="text-blue-600">{formatCurrency(selectedBooking.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.status === 'Cancelled' && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1.5">
                  <h4 className="text-[10px] text-rose-800 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cancellation Details
                  </h4>
                  <div className="text-slate-700 text-xs">
                    Reason: <strong>{selectedBooking.cancellationReason || 'N/A'}</strong>
                  </div>
                  {selectedBooking.cancelledAt && (
                    <div className="text-slate-500 text-[10px] font-medium">
                      Cancelled on: {new Date(selectedBooking.cancelledAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedBooking(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold text-xs cursor-pointer text-center border border-slate-200">
                Close Details
              </button>
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && selectedBooking.paymentStatus === 'Pending' && (
                <button
                  onClick={() => handlePayNow(selectedBooking.uuid, selectedBooking.grandTotal)}
                  disabled={processingPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Pay Now
                </button>
              )}
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-xs cursor-pointer text-center"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl relative text-slate-900 border border-slate-200">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Cancel Booking?
              </h3>
              <p className="text-xs text-slate-500 mt-1">Please confirm details before cancelling. This action cannot be undone.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Booking ID:</span> <span className="font-mono text-slate-900">{selectedBooking.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Tour/Service:</span> <span className="text-slate-900">{selectedBooking.pickup} ➔ {selectedBooking.drop}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Travel Date:</span> <span className="text-slate-900">{selectedBooking.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Amount:</span> <span className="text-slate-900">{formatCurrency(selectedBooking.grandTotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Current Status:</span> <span className="text-slate-900 uppercase font-black">{selectedBooking.status}</span></div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Cancellation Reason:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Travel date changed">Travel date changed</option>
                <option value="Found another vehicle">Found another vehicle</option>
                <option value="Personal reason">Personal reason</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {cancelReason === 'Other' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">Provide details for 'Other reason':</label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Type your cancellation reason here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 min-h-[80px]"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancelReason('Change of plans');
                  setOtherReason('');
                }}
                disabled={submittingCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold text-xs cursor-pointer text-center border border-slate-200 disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={submittingCancel || (cancelReason === 'Other' && !otherReason.trim())}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-xs cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submittingCancel ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

