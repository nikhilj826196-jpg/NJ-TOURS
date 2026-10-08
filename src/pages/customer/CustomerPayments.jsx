import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
  X,
  Info,
  FileText,
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';
import { paymentApi } from '../../api/payment.api';
import { bookingApi } from '../../api/booking.api';

export default function CustomerPayments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Selected payment for detail modal/drawer
  const [selectedPayment, setSelectedPayment] = useState(null);
  // Invoice state for structured tax invoice modal
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const fetchPaymentsAndBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, bRes] = await Promise.allSettled([
        paymentApi.listPayments(),
        bookingApi.getMyBookings()
      ]);

      if (pRes.status === 'fulfilled' && pRes.value?.data?.data && Array.isArray(pRes.value.data.data)) {
        setPayments(pRes.value.data.data);
      }

      if (bRes.status === 'fulfilled' && bRes.value?.data?.data && Array.isArray(bRes.value.data.data)) {
        const unpaid = bRes.value.data.data
          .filter(b => (b.payment_status === 'Pending' || b.payment_status === 'Unpaid') && (b.status === 'Pending' || b.status === 'Confirmed'))
          .map(b => ({
            id: b.id,
            bookingNumber: b.booking_number || b.id,
            pickup: b.pickup_location,
            drop: b.drop_location,
            date: b.pickup_date,
            time: b.pickup_time,
            amount: b.grand_total || b.total_amount || 0
          }));
        setUnpaidBookings(unpaid);
      }
    } catch (err) {
      console.error("Failed to load customer payment history:", err);
      setError(err?.message || "Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsAndBookings();
  }, []);

  const handlePayNow = (bookingId) => {
    navigate(`/customer/checkout/${bookingId}`);
  };

  // Summary Metrics calculations
  const totalPaid = payments
    .filter(p => p.status === 'Captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = unpaidBookings.reduce((sum, b) => sum + b.amount, 0) +
    payments
      .filter(p => p.status === 'Created' || p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactions = payments.length;

  const refundedAmount = payments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, p) => sum + (p.refund_amount || p.amount), 0);

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.booking?.booking_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.booking_id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && p.status === 'Captured') ||
      (statusFilter === 'PENDING' && (p.status === 'Created' || p.status === 'Pending')) ||
      (statusFilter === 'FAILED' && p.status === 'Failed') ||
      (statusFilter === 'REFUNDED' && p.status === 'Refunded');

    const matchesMethod =
      methodFilter === 'ALL' ||
      p.payment_method.toUpperCase() === methodFilter.toUpperCase();

    const matchesDate =
      !dateFilter ||
      p.created_at.startsWith(dateFilter);

    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Captured':
      case 'Authorized':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Created':
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Refunded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Captured') return '✓ PAID';
    return status.toUpperCase();
  };

  const handleOpenInvoice = async (paymentId) => {
    setLoadingInvoice(true);
    try {
      const res = await paymentApi.getInvoice(paymentId);
      if (res?.data?.data) {
        setInvoiceDetails(res.data.data);
      } else {
        throw new Error("Unable to fetch invoice details.");
      }
    } catch (err) {
      console.error("Error loading invoice:", err);
      addToast(err?.message || "Failed to load GST invoice details.", "error");
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleDownloadInvoicePDF = () => {
    // Report missing PDF generation endpoint as requested
    console.warn("[API MISSING] Endpoint GET /api/v1/payments/invoice/{payment_id}/pdf is not implemented in backend.");
    addToast("Download Invoice PDF service is currently unavailable. (Missing backend PDF generation endpoint). Please print this screen as a tax receipt.", "warning");
  };

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payments</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your bookings, payments and invoices</p>
        </div>
        
        {/* User avatar on right */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-[#F97316] text-slate-950 flex items-center justify-center font-black text-sm">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-slate-900">{user?.name || "Traveler"}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role || "Customer"}</div>
          </div>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Total Paid</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{formatCurrency(totalPaid)}</div>
          <div className="text-[9px] text-emerald-600 font-bold mt-1">Successfully captured payments</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Pending Amount</div>
          <div className="text-xl sm:text-2xl font-black text-orange-600">{formatCurrency(pendingAmount)}</div>
          <div className="text-[9px] text-slate-500 font-bold mt-1">Bookings awaiting checkout completion</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Total Transactions</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalTransactions}</div>
          <div className="text-[9px] text-slate-500 font-bold mt-1">Overall payment orders generated</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Refunded Amount</div>
          <div className="text-xl sm:text-2xl font-black text-blue-600">{formatCurrency(refundedAmount)}</div>
          <div className="text-[9px] text-slate-500 font-bold mt-1">Returned due to cancellations</div>
        </div>

      </div>

      {/* Pending Unpaid Bookings Section */}
      {unpaidBookings.length > 0 && (
        <div className="bg-orange-50/80 border border-orange-200 p-5 rounded-3xl space-y-3 text-left shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-orange-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" /> Pending Trip Payments ({unpaidBookings.length})
            </h3>
            <span className="text-xs text-orange-700 font-medium">Select a pending reservation to complete payment</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unpaidBookings.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-2xl border border-orange-100 flex flex-wrap justify-between items-center gap-3 shadow-xs">
                <div className="space-y-1 text-xs">
                  <div className="font-mono font-bold text-[#0B5ED7]">{b.bookingNumber}</div>
                  <div className="text-slate-900 font-bold">{b.pickup} ➔ {b.drop}</div>
                  <div className="text-slate-500 font-medium">{b.date} at {b.time} • <strong>{formatCurrency(b.amount)}</strong></div>
                </div>
                <button
                  onClick={() => handlePayNow(b.id, b.amount)}
                  disabled={processingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Filters Strip */}
      <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
          <input
            type="text"
            placeholder="Search ID, Booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
          />
        </div>

        {/* Status Filter */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3 w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Method Filter */}
        <div className="relative flex items-center">
          <CreditCard className="absolute left-3 w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F97316]"
          >
            <option value="ALL">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NET BANKING">Net Banking</option>
            <option value="WALLET">Wallet</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F97316] cursor-pointer"
          />
        </div>

        {/* Clear Filter button */}
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
            setMethodFilter('ALL');
            setDateFilter('');
          }}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
        >
          Reset Filters
        </button>

      </div>

      {/* 3. Payment History / Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Loading state skeleton loader */}
        {loading ? (
          <div className="divide-y divide-slate-100">
            <div className="p-5 border-b border-slate-200 bg-slate-50 animate-pulse h-12 w-full" />
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex justify-between items-center animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100" />
                    <div className="space-y-1.5">
                      <div className="w-28 h-3.5 bg-slate-100 rounded" />
                      <div className="w-20 h-2 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="w-16 h-5 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          
          /* 12. Error State */
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">Failed to connect to database</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
            </button>
          </div>
        ) : filteredPayments.length === 0 ? (
          
          /* 11. Empty State */
          <div className="p-12 text-center space-y-3 bg-slate-50/50">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">No payments yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Your payment history will appear here after you make a booking.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/60">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Tour / Service</th>
                    <th className="p-4">Travel Date</th>
                    <th className="p-4">Payment Date</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => {
                    const bookingNo = p.booking?.booking_number || p.booking_id || 'N/A';
                    const tripRoute = p.booking ? `${p.booking.pickup_location} ➔ ${p.booking.drop_location}` : 'Trip Reservation';
                    const travelDate = p.booking?.pickup_date || 'N/A';
                    const paymentDate = new Date(p.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedPayment(p)}
                      >
                        <td className="p-4 font-mono font-bold text-[#0B5ED7] group-hover:underline">{p.payment_id}</td>
                        <td className="p-4 font-mono text-slate-600">
                          <div>{bookingNo}</div>
                          {p.booking?.status === 'Cancelled' && (
                            <span className="text-rose-600 font-extrabold text-[9px] uppercase tracking-wide">
                              (Cancelled)
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-900 truncate max-w-[150px]">{tripRoute}</td>
                        <td className="p-4 text-slate-500">{travelDate}</td>
                        <td className="p-4 text-slate-500">{paymentDate}</td>
                        <td className="p-4 text-right font-bold text-slate-950">{formatCurrency(p.amount)}</td>
                        <td className="p-4 text-slate-700 capitalize">{p.payment_method.toLowerCase()}</td>
                        <td className="p-4">
                          <span className={`border text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusBadgeClass(p.status)}`}>
                            {getStatusLabel(p.status)}
                          </span>
                        </td>
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenInvoice(p.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors inline-flex items-center"
                            title="View GST Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Stack View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredPayments.map((p) => {
                const bookingNo = p.booking?.booking_number || p.booking_id || 'N/A';
                const tripRoute = p.booking ? `${p.booking.pickup_location} ➔ ${p.booking.drop_location}` : 'Trip Reservation';
                const travelDate = p.booking?.pickup_date || 'N/A';

                return (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-slate-50 transition-all flex flex-col gap-2.5 text-xs text-left"
                    onClick={() => setSelectedPayment(p)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-extrabold text-[#0B5ED7]">{p.payment_id}</span>
                      <span className={`border text-[8px] font-extrabold px-2 rounded-full ${getStatusBadgeClass(p.status)}`}>
                        {getStatusLabel(p.status)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-black text-slate-900 truncate">{tripRoute}</div>
                      <div className="text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                        Booking ID: <span className="font-mono text-slate-700">{bookingNo}</span>
                        {p.booking?.status === 'Cancelled' && (
                          <span className="text-rose-600 font-extrabold text-[9px] uppercase">
                            (Cancelled)
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-medium">Travel Date: {travelDate}</div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                      <div className="font-black text-slate-950 text-sm">{formatCurrency(p.amount)}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInvoice(p.id);
                        }}
                        className="flex items-center gap-1 text-[10px] font-black text-orange-600 hover:underline"
                      >
                        <FileText className="w-3 h-3" /> GST Invoice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* 5. Detail Modal / Drawer */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden animate-fadeIn text-slate-900">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Transaction Details</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedPayment.payment_id}</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500">Transaction Status</span>
                <span className={`border text-[9px] uppercase font-extrabold px-3 py-1 rounded-full ${getStatusBadgeClass(selectedPayment.status)}`}>
                  {getStatusLabel(selectedPayment.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Booking ID</div>
                  <div className="font-mono text-slate-950 mt-0.5">
                    {selectedPayment.booking?.booking_number || selectedPayment.booking_id || 'N/A'}
                    {selectedPayment.booking?.status === 'Cancelled' && (
                      <span className="text-rose-600 font-extrabold text-[9px] ml-1.5 uppercase block md:inline">
                        (Cancelled)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Customer Name</div>
                  <div className="text-slate-950 mt-0.5">{selectedPayment.customer?.full_name || user?.name || "N/A"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Payment Method</div>
                  <div className="text-slate-950 mt-0.5 capitalize">{selectedPayment.payment_method.toLowerCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Payment Date</div>
                  <div className="text-slate-950 mt-0.5">
                    {new Date(selectedPayment.created_at).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Base Fare</span>
                  <span className="text-slate-900">{formatCurrency(selectedPayment.amount - selectedPayment.gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">GST Tax (5%)</span>
                  <span className="text-slate-900">{formatCurrency(selectedPayment.gst)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-950 text-sm">
                  <span>Grand Total Paid</span>
                  <span>{formatCurrency(selectedPayment.amount)}</span>
                </div>
              </div>

              {/* Booking specifications */}
              {selectedPayment.booking && (
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-[10px] text-slate-400 uppercase tracking-wider">Ride Details</h4>
                  
                  <div className="space-y-1.5 font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                      <span>{selectedPayment.booking.pickup_location} ➔ {selectedPayment.booking.drop_location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {selectedPayment.booking.pickup_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {selectedPayment.booking.pickup_time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {selectedPayment.booking.passengers} pax</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice button */}
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  handleOpenInvoice(selectedPayment.id);
                }}
                className="w-full bg-slate-950 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> View Tax Invoice
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Structured Invoice Viewer Modal */}
      {invoiceDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
              <div>
                <h3 className="text-base font-black text-slate-900">Tax Invoice</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">INV-REF: {invoiceDetails.invoice_number}</p>
              </div>
              <button
                onClick={() => setInvoiceDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable invoice page body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-left font-semibold text-slate-700 flex-1">
              
              {/* Logo / Company header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-base font-black text-slate-950">NJ Tours</h4>
                  <p className="text-[9px] text-slate-500 font-medium">Premium Cab Rental & Tours service</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-1">Pune-Mumbai Expressway Highway, India</p>
                </div>
                <div className="text-right text-[10px] font-medium text-slate-500 space-y-0.5">
                  <div>Date: {new Date(invoiceDetails.invoice_date).toLocaleDateString('en-IN')}</div>
                  <div>Receipt: {invoiceDetails.receipt_number}</div>
                  <div>Booking ID: <span className="font-mono text-slate-800 font-bold">{invoiceDetails.booking_number}</span></div>
                </div>
              </div>

              {/* Bill To section */}
              <div>
                <h5 className="text-[9px] text-slate-400 uppercase tracking-widest mb-1.5">Billed To Customer</h5>
                <div className="space-y-0.5 text-slate-950 font-bold">
                  <div>{invoiceDetails.customer_name}</div>
                  <div className="text-slate-500 font-medium">{invoiceDetails.customer_email}</div>
                  <div className="text-slate-500 font-medium">{invoiceDetails.customer_phone}</div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-500 uppercase">
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    <tr>
                      <td className="p-3 text-slate-900">
                        Cab Booking Charges
                        <div className="text-[9px] text-slate-400 font-medium mt-0.5">Route Reservation Ref: #{invoiceDetails.booking_number}</div>
                      </td>
                      <td className="p-3 text-right text-slate-950">{formatCurrency(invoiceDetails.amount)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-500">CGST + SGST (5%)</td>
                      <td className="p-3 text-right text-slate-950">{formatCurrency(invoiceDetails.gst)}</td>
                    </tr>
                    <tr className="bg-slate-50/50 text-sm font-black text-slate-950 border-t border-slate-200">
                      <td className="p-3 text-blue-900">Grand Total Payable</td>
                      <td className="p-3 text-right text-blue-600">{formatCurrency(invoiceDetails.grand_total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Method Used</div>
                  <div className="text-slate-950 mt-0.5 capitalize">{invoiceDetails.payment_method.toLowerCase()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Receipt Status</div>
                  <div className="text-emerald-700 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Captured & Cleared
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Actions Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm"
              >
                Print Receipt
              </button>
              <button
                onClick={handleDownloadInvoicePDF}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
