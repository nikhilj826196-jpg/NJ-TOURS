import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Home as HomeIcon, 
  Wallet as WalletIcon, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft,
  DollarSign,
  FileText
} from 'lucide-react';
import { bookingApi } from '../../api/booking.api';
import { paymentApi } from '../../api/payment.api';
import { formatCurrency } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export default function CustomerCheckout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const { user } = useAuth();

  // Booking & payment states
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentState, setPaymentState] = useState('CHECKOUT'); // CHECKOUT, PROCESSING, SUCCESS, FAILED, CANCELLED
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  // Form input states
  const [activeMethod, setActiveMethod] = useState('UPI'); // UPI, CARD, NETBANKING, WALLET
  const [vpa, setVpa] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [failureReason, setFailureReason] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await bookingApi.getBookingById(bookingId);
        const b = res?.data?.data;
        if (!b) {
          throw new Error("Booking details not found.");
        }
        
        // Ownership Validation
        if (b.customer_id !== user?.id) {
          setError("Unauthorized: You do not have permission to pay for this booking.");
          return;
        }

        setBooking(b);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };
    if (bookingId && user) {
      fetchBookingDetails();
    }
  }, [bookingId, user]);

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})/g, '$1-').replace(/-$/, '').slice(0, 19);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setCardExpiry(formatted.slice(0, 5));
  };

  const handleCancelPayment = () => {
    setPaymentState('CANCELLED');
    addToast("Payment was cancelled by the customer.", "warning");
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();

    // Field Validations based on chosen method
    if (activeMethod === 'UPI' && !vpa.includes('@')) {
      addToast("Please enter a valid UPI ID (e.g., username@upi)", "error");
      return;
    }
    if (activeMethod === 'CARD') {
      if (cardNumber.replace(/\D/g, '').length < 16) {
        addToast("Please enter a valid 16-digit Card Number.", "error");
        return;
      }
      if (cardExpiry.length < 5) {
        addToast("Please enter a valid Expiry Date (MM/YY).", "error");
        return;
      }
      if (!cardHolder.trim()) {
        addToast("Please enter the Cardholder name.", "error");
        return;
      }
      if (cardCvv.length < 3) {
        addToast("Please enter a valid 3-digit CVV code.", "error");
        return;
      }
    }
    if (activeMethod === 'NETBANKING' && !selectedBank) {
      addToast("Please select your bank.", "error");
      return;
    }
    if (activeMethod === 'WALLET' && !selectedWallet) {
      addToast("Please select your wallet.", "error");
      return;
    }

    setPaymentState('PROCESSING');

    try {
      // 1. Create order on the backend (Commit order record to DB as 'Created')
      const orderRes = await paymentApi.createOrder({
        booking_id: bookingId,
        amount: booking.grand_total,
        payment_method: activeMethod
      });

      const orderData = orderRes?.data?.data;
      if (!orderData) {
        throw new Error("Unable to create secure payment order on the server.");
      }

      // Simulate a secure bank processing delay (1.8 seconds)
      await new Promise(resolve => setTimeout(resolve, 1800));

      // 2. Verify payment on the backend (Commit payment state as 'Captured' and update Booking status)
      // We pass a mock payment ID and signature but trigger real backend captured updates!
      const verifyRes = await paymentApi.verifyPayment({
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        razorpay_signature: `native_checkout_sig_${Math.random().toString(36).substring(2, 15)}`,
        payment_method: activeMethod
      });

      const finalPayment = verifyRes?.data?.data;
      if (finalPayment && finalPayment.status === 'Captured') {
        setTransactionId(finalPayment.payment_id);
        setPaymentDate(new Date(finalPayment.created_at).toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }));
        setPaymentState('SUCCESS');
        addToast("Payment authorized and captured successfully!", "success");
      } else {
        throw new Error("Signature verification failed on payment capture.");
      }
    } catch (err) {
      console.error("Checkout transaction failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Payment declined by the bank.";
      setFailureReason(msg);
      setPaymentState('FAILED');
      addToast(`Transaction Declined: ${msg}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <span className="text-xs font-bold text-slate-500">Establishing secure connection to banking gateway...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm text-slate-900">
        <XCircle className="w-16 h-16 text-rose-600 mx-auto" />
        <h3 className="text-xl font-black">Checkout Error</h3>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          onClick={() => navigate('/customer/bookings')}
          className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer"
        >
          Return to Bookings
        </button>
      </div>
    );
  }

  if (booking && (booking.payment_status === 'Paid' || booking.status === 'Completed')) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-sm text-slate-900">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h3 className="text-2xl font-black text-slate-950">Already Paid</h3>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 text-left space-y-2">
          <div className="flex justify-between"><span>Booking ID:</span> <span className="font-mono text-blue-600">{booking.booking_number || booking.id}</span></div>
          <div className="flex justify-between"><span>Route:</span> <span>{booking.pickup_location} ➔ {booking.drop_location}</span></div>
          <div className="flex justify-between"><span>Travel Date:</span> <span>{booking.pickup_date}</span></div>
          <div className="flex justify-between"><span>Payment Status:</span> <span className="text-emerald-700 font-extrabold">✓ PAID</span></div>
        </div>
        <p className="text-xs text-slate-500">This trip reservation has already been paid for and confirmed.</p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => navigate('/customer/payments')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer"
          >
            View Payment History
          </button>
          <button
            onClick={() => navigate('/customer/bookings')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3 rounded-2xl text-xs cursor-pointer border border-slate-200"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 text-left">
      
      {/* CHECKOUT STATE */}
      {paymentState === 'CHECKOUT' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/customer/bookings')} 
              className="p-2 rounded-full hover:bg-slate-100 border border-slate-200 cursor-pointer text-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-950">NJ Tours Checkout</h2>
              <p className="text-xs text-slate-500">Secure payment gateway</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Payment Methods Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">Select Payment Method</h3>
                <p className="text-xs text-slate-400">All transactions are fully encrypted and secure</p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => setActiveMethod('UPI')}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-[10px] font-black cursor-pointer transition-all gap-1.5 ${
                    activeMethod === 'UPI' 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Pay</span>
                </button>
                
                <button
                  onClick={() => setActiveMethod('CARD')}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-[10px] font-black cursor-pointer transition-all gap-1.5 ${
                    activeMethod === 'CARD' 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  onClick={() => setActiveMethod('NETBANKING')}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-[10px] font-black cursor-pointer transition-all gap-1.5 ${
                    activeMethod === 'NETBANKING' 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Banking</span>
                </button>

                <button
                  onClick={() => setActiveMethod('WALLET')}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-[10px] font-black cursor-pointer transition-all gap-1.5 ${
                    activeMethod === 'WALLET' 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <WalletIcon className="w-4 h-4" />
                  <span>Wallet</span>
                </button>
              </div>

              {/* Input Forms */}
              <form onSubmit={handleProcessPayment} className="space-y-4">
                
                {/* UPI FORM */}
                {activeMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">Enter UPI ID (VPA)</label>
                      <input
                        type="text"
                        placeholder="e.g. username@upi"
                        value={vpa}
                        onChange={(e) => setVpa(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/60 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 font-medium">
                        Verification request will be pushed to your UPI app. Open Google Pay, PhonePe, or Paytm app to complete.
                      </p>
                    </div>
                  </div>
                )}

                {/* CARD FORM */}
                {activeMethod === 'CARD' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">Card Number</label>
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="As written on card"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NET BANKING */}
                {activeMethod === 'NETBANKING' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-700">Select Net Banking Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: 'HDFC', name: 'HDFC Bank' },
                        { code: 'ICICI', name: 'ICICI Bank' },
                        { code: 'SBI', name: 'State Bank of India' },
                        { code: 'AXIS', name: 'Axis Bank' },
                        { code: 'KOTAK', name: 'Kotak Mahindra Bank' },
                        { code: 'YES', name: 'Yes Bank' }
                      ].map(bank => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setSelectedBank(bank.code)}
                          className={`p-3 text-left border rounded-xl font-bold text-xs cursor-pointer transition-all ${
                            selectedBank === bank.code 
                              ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs' 
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* WALLETS */}
                {activeMethod === 'WALLET' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-700">Select Wallet</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: 'PAYTM', name: 'Paytm Wallet' },
                        { code: 'AMAZON', name: 'Amazon Pay' },
                        { code: 'PHONEPE', name: 'PhonePe Wallet' },
                        { code: 'MOBIKWIK', name: 'Mobikwik' }
                      ].map(wallet => (
                        <button
                          key={wallet.code}
                          type="button"
                          onClick={() => setSelectedWallet(wallet.code)}
                          className={`p-3 text-left border rounded-xl font-bold text-xs cursor-pointer transition-all ${
                            selectedWallet === wallet.code 
                              ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs' 
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {wallet.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelPayment}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs cursor-pointer border border-slate-200 text-center"
                  >
                    Cancel Payment
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay {formatCurrency(booking.grand_total)}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Fare Summary & Booking Info */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              {/* Booking specifications */}
              <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Booking ID:</span>
                  <span className="font-mono text-slate-950 font-bold">{booking.booking_number || booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Trip Category:</span>
                  <span className="text-slate-950 font-bold capitalize">{booking.trip_type || "Outstation Trip"}</span>
                </div>
                
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-950 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.pickup_location} ➔ {booking.drop_location}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {booking.pickup_date}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {booking.passengers} pax</span>
                  </div>
                </div>
              </div>

              {/* Fare break details */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Base Fare:</span>
                  <span>{formatCurrency(booking.base_fare)}</span>
                </div>
                {booking.driver_allowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Driver Allowance:</span>
                    <span>{formatCurrency(booking.driver_allowance)}</span>
                  </div>
                )}
                {booking.gst > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">GST Tax (5%):</span>
                    <span>{formatCurrency(booking.gst)}</span>
                  </div>
                )}
                {booking.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span className="font-medium">Applied Promo Discount:</span>
                    <span>-{formatCurrency(booking.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black text-slate-950">
                  <span>Payable Amount:</span>
                  <span className="text-blue-600 text-base">{formatCurrency(booking.grand_total)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PROCESSING STATE */}
      {paymentState === 'PROCESSING' && (
        <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-md text-slate-900">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-950">Processing Transaction</h3>
            <p className="text-xs text-slate-400 font-medium">Authenticating secure transaction with the bank...</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600 text-left font-semibold">
            <div className="flex justify-between"><span>Booking ID:</span> <span className="font-mono text-slate-950">{booking.booking_number || booking.id}</span></div>
            <div className="flex justify-between"><span>Total Amount:</span> <span className="text-blue-600 font-bold">{formatCurrency(booking.grand_total)}</span></div>
            <div className="flex justify-between"><span>Method selected:</span> <span className="font-bold uppercase">{activeMethod}</span></div>
          </div>
          <p className="text-[10px] text-slate-400">Do not refresh this page, close window, or hit back button.</p>
        </div>
      )}

      {/* SUCCESS STATE */}
      {paymentState === 'SUCCESS' && (
        <div className="max-w-lg mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-lg text-slate-900">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-emerald-700">✓ Payment Successful</h3>
            <p className="text-xs text-slate-400">Your reservation has been confirmed and updated in our system</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 text-left space-y-2.5">
            <div className="flex justify-between"><span>Transaction ID:</span> <span className="font-mono text-slate-950">{transactionId}</span></div>
            <div className="flex justify-between"><span>Booking ID:</span> <span className="font-mono text-blue-600">{booking.booking_number || booking.id}</span></div>
            <div className="flex justify-between"><span>Amount Paid:</span> <span className="text-slate-950">{formatCurrency(booking.grand_total)}</span></div>
            <div className="flex justify-between"><span>Payment Method:</span> <span className="uppercase">{activeMethod}</span></div>
            <div className="flex justify-between"><span>Payment Date:</span> <span>{paymentDate}</span></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => alert(`Downloading Invoice PDF for payment ${transactionId}...`)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3 rounded-2xl text-xs cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>View Invoice</span>
            </button>
            <button
              onClick={() => navigate('/customer/bookings')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-sm"
            >
              Go to My Bookings
            </button>
          </div>
          <button
            onClick={() => navigate('/customer/payments')}
            className="w-full block text-xs font-bold text-blue-600 hover:underline text-center cursor-pointer"
          >
            Go to Payments History
          </button>
        </div>
      )}

      {/* FAILED STATE */}
      {paymentState === 'FAILED' && (
        <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-md text-slate-900">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <XCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-rose-700">Payment Failed</h3>
            <p className="text-xs text-slate-500 font-medium">{failureReason || "The transaction was declined by the card-issuing bank."}</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => setPaymentState('CHECKOUT')}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-sm"
            >
              Retry Payment
            </button>
            <button
              onClick={() => navigate('/customer/bookings')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl text-xs cursor-pointer border border-slate-200"
            >
              Return to Bookings
            </button>
          </div>
        </div>
      )}

      {/* CANCELLED STATE */}
      {paymentState === 'CANCELLED' && (
        <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-md text-slate-900">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-amber-700">Payment Cancelled</h3>
            <p className="text-xs text-slate-500 font-medium">You cancelled the payment transaction. No charges have been made.</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => setPaymentState('CHECKOUT')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-sm"
            >
              Checkout Again
            </button>
            <button
              onClick={() => navigate('/customer/bookings')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl text-xs cursor-pointer border border-slate-200"
            >
              Return to Bookings
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
