import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle2, ShieldCheck, Calendar, MapPin, Users, Car, CreditCard, Lock, Eye, EyeOff, User, UserPlus, Star, Hotel, Coffee, ArrowRight, ArrowLeft, Mail, Phone, Minus, Plus, Loader } from 'lucide-react';
import { bookingApi } from '../api/booking.api';
import { vehicleApi } from '../api/vehicle.api';
import { couponApi } from '../api/coupon.api';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

/* ================= 1. BOOKING & FARE ESTIMATE MODAL ================= */
export function BookingModal({ isOpen, onClose, initialData }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useNotification();

  // Step states: 1 = Details Entry & Live Estimate, 2 = Available Vehicles, 3 = Booking Summary, 4 = Confirmation Success
  const [step, setStep] = useState(1);
  
  // Customer Info states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Trip Info states
  const [tripType, setTripType] = useState('One Way'); // One Way, Round Trip, Local, Airport
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(4);
  const [selectedVehicleType, setSelectedVehicleType] = useState('Sedan'); // Sedan, SUV, Traveller, Bus
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');
  const [promoErrorMsg, setPromoErrorMsg] = useState('');

  // Loaded database data
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedDbVehicle, setSelectedDbVehicle] = useState(null);
  
  // Estimation states
  const [distanceKm, setDistanceKm] = useState(150);
  const [estDuration, setEstDuration] = useState('3 Hours');
  const [fareEstimate, setFareEstimate] = useState(null);
  const [estimatingFare, setEstimatingFare] = useState(false);

  // Flow control states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const vehicleCategoryMapping = {
    'Sedan': 'Sedan',
    'SUV': 'SUV',
    'Traveller': 'Tempo Traveller',
    'Bus': 'Bus'
  };

  const vehicleDetails = {
    'Sedan': { name: 'Executive Sedan', seats: '4+1 Seats', price: '₹2,500', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80' },
    'SUV': { name: 'Premium SUV', seats: '6+1 Seats', price: '₹3,500', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80' },
    'Traveller': { name: 'Tempo Traveller', seats: '12-17 Seats', price: '₹6,000', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80' },
    'Bus': { name: 'Luxury Tourist Bus', seats: '45 Seats', price: '₹15,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80' }
  };

  // Pre-fill fields on modal load
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAppliedPromo(null);
      setPromoCode('');
      setPromoSuccessMsg('');
      setPromoErrorMsg('');
      
      if (user) {
        setCustomerName(user.full_name || user.name || '');
        setCustomerPhone(user.phone || '');
        setCustomerEmail(user.email || '');
      }

      if (initialData) {
        if (initialData.pickupCity || initialData.pickupLocation) {
          setPickupLocation(initialData.pickupCity || initialData.pickupLocation || '');
        }
        if (initialData.destinationCity || initialData.destination || initialData.drop_location) {
          setDestination(initialData.destinationCity || initialData.destination || initialData.drop_location || '');
        }
        if (initialData.journeyDate || initialData.pickup_date) {
          setJourneyDate(initialData.journeyDate || initialData.pickup_date || '');
        }
        if (initialData.pickupTime || initialData.pickup_time) {
          setPickupTime(initialData.pickupTime || initialData.pickup_time || '10:00 AM');
        }
        if (initialData.passengers) {
          setPassengers(Number(initialData.passengers));
        }
        if (initialData.tripType) {
          const tripTypeMap = {
            'outstation-one-way': 'One Way',
            'outstation-round': 'Round Trip',
            'local-hourly': 'Local',
            'airport': 'Airport',
            'One Way': 'One Way',
            'Round Trip': 'Round Trip',
            'Local': 'Local',
            'Airport': 'Airport'
          };
          setTripType(tripTypeMap[initialData.tripType] || 'One Way');
        }
        if (initialData.selectedVehicleObj?.category || initialData.category) {
          const cat = initialData.selectedVehicleObj?.category || initialData.category;
          const revMap = {
            'Sedan': 'Sedan',
            'SUV': 'SUV',
            'Tempo Traveller': 'Traveller',
            'Bus': 'Bus'
          };
          setSelectedVehicleType(revMap[cat] || 'Sedan');
        }
      } else {
        const today = new Date().toISOString().split('T')[0];
        setJourneyDate(today);
      }
    }
  }, [isOpen, initialData, user]);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setPickupLocation(data.display_name);
            addToast("Current location loaded successfully!", "success");
          } else {
            setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        addToast("GPS Permission denied or unavailable.", "warning");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Live Estimate calculation
  React.useEffect(() => {
    if (!isOpen) return;
    if (!pickupLocation || !destination || !journeyDate || !selectedVehicleType) {
      setFareEstimate(null);
      return;
    }

    const strConcat = (pickupLocation + destination).toLowerCase().replace(/\s/g, '');
    let computedDistance = 150;
    if (strConcat.length > 0) {
      let hash = 0;
      for (let i = 0; i < strConcat.length; i++) {
        hash = strConcat.charCodeAt(i) + ((hash << 5) - hash);
      }
      computedDistance = Math.abs(hash % 300) + 80;
    }
    setDistanceKm(computedDistance);
    
    const hrs = Math.ceil(computedDistance / 60);
    const mins = Math.round((computedDistance % 60) * 0.9);
    setEstDuration(`${hrs}h ${mins > 0 ? mins + 'm' : ''}`);

    const fetchEstimate = async () => {
      setEstimatingFare(true);
      try {
        const vRes = await vehicleApi.listVehicles({ isAvailable: true });
        const dbVehs = vRes?.data?.data || [];
        const targetCategory = vehicleCategoryMapping[selectedVehicleType];
        const matchVeh = dbVehs.find(v => v.category === targetCategory) || dbVehs[0];
        
        if (matchVeh) {
          const daysVal = tripType === 'Round Trip' ? 2 : 1;
          const calcRes = await bookingApi.calculatePrice({
            vehicle_id: matchVeh.id,
            trip_type: tripType === 'Round Trip' ? 'Round Trip' : (tripType === 'Local' ? 'Local' : (tripType === 'Airport' ? 'Airport' : 'One Way')),
            distance_km: computedDistance,
            days: daysVal
          });
          if (calcRes?.data?.data) {
            setFareEstimate(calcRes.data.data);
          }
        }
      } catch (err) {
        console.error("Live fare estimate failed:", err);
      } finally {
        setEstimatingFare(false);
      }
    };

    fetchEstimate();
  }, [pickupLocation, destination, journeyDate, selectedVehicleType, tripType, isOpen]);

  // Promo Code Handler
  const handleApplyPromo = async () => {
    setPromoErrorMsg('');
    setPromoSuccessMsg('');
    if (!promoCode.trim()) {
      setPromoErrorMsg("Please enter a coupon code.");
      return;
    }
    if (!fareEstimate) {
      setPromoErrorMsg("Enter trip details first.");
      return;
    }

    try {
      const res = await couponApi.validateCoupon({
        coupon_code: promoCode.trim().toUpperCase(),
        booking_amount: fareEstimate.grand_total
      });
      const coupon = res?.data?.data;
      if (coupon) {
        setAppliedPromo(coupon);
        setPromoSuccessMsg(`Promo Code Applied! Saved ₹${coupon.discount_value}`);
        addToast(`Promo code '${coupon.coupon_code}' applied!`, "success");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Invalid or expired promo code.";
      setPromoErrorMsg(msg);
      addToast(msg, "error");
    }
  };

  const getGrandTotal = () => {
    if (!fareEstimate) return 0;
    let total = fareEstimate.grand_total;
    if (appliedPromo) {
      total = Math.max(0, total - appliedPromo.discount_value);
    }
    return total;
  };

  // Passenger counter helpers
  const handleIncrement = () => passengers < 50 && setPassengers(prev => prev + 1);
  const handleDecrement = () => passengers > 1 && setPassengers(prev => prev - 1);

  // Form Validation
  const isFormValid = () => {
    if (!pickupLocation || pickupLocation.trim().length < 3) return false;
    if (!destination || destination.trim().length < 3) return false;
    if (!journeyDate) return false;
    if (!pickupTime) return false;
    if (!customerName || customerName.trim().length < 3) return false;
    const phoneClean = customerPhone.trim().replace(/\D/g, '');
    if (phoneClean.length < 10) return false;
    if (tripType === 'Round Trip') {
      if (!returnDate) return false;
      if (new Date(returnDate) < new Date(journeyDate)) return false;
    }
    return true;
  };

  // Step 1: SEARCH VEHICLES
  const handleSearchVehicles = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      addToast("Please fill in all required fields correctly.", "error");
      return;
    }
    if (!user) {
      addToast("Please login first before searching and placing a booking.", "error");
      return;
    }

    setLoadingVehicles(true);
    try {
      const vRes = await vehicleApi.listVehicles({ isAvailable: true });
      const dbVehs = vRes?.data?.data || [];
      const targetCategory = vehicleCategoryMapping[selectedVehicleType];
      const matched = dbVehs.filter(v => v.category === targetCategory);
      setVehicles(matched.length > 0 ? matched : dbVehs);
      setStep(2);
    } catch (err) {
      addToast("Error fetching matching vehicles.", "error");
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Step 2: Select a vehicle card
  const handleSelectDbVehicle = (veh) => {
    setSelectedDbVehicle(veh);
    setStep(3);
  };

  // Helper to compute estimation breakdown for specific database vehicles
  const computeVehicleFare = (veh) => {
    const days = tripType === 'Round Trip' ? 2 : 1;
    const kmFare = distanceKm * veh.per_km_rate;
    const dayFare = days * veh.per_day_rate;
    const base = Math.max(kmFare, dayFare);
    const allowance = 300 * days;
    const subtotal = base + allowance;
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    let finalTotal = total;
    if (appliedPromo) {
      finalTotal = Math.max(0, finalTotal - appliedPromo.discount_value);
    }
    return {
      base_fare: Math.round(base),
      driver_allowance: Math.round(allowance),
      gst: Math.round(gst),
      grand_total: Math.round(total),
      final_total: Math.round(finalTotal)
    };
  };

  // Step 3: CONFIRM BOOKING
  const handleConfirmBooking = async () => {
    if (!selectedDbVehicle) return;
    setBookingLoading(true);

    try {
      const payload = {
        vehicle_id: selectedDbVehicle.id,
        trip_type: tripType === 'Round Trip' ? 'Round Trip' : (tripType === 'Local' ? 'Local' : (tripType === 'Airport' ? 'Airport' : 'One Way')),
        pickup_location: pickupLocation.trim(),
        drop_location: destination.trim(),
        pickup_date: journeyDate,
        pickup_time: pickupTime + (customTime ? ` (${customTime})` : ''),
        return_date: tripType === 'Round Trip' ? returnDate : null,
        passengers: Number(passengers),
        distance_km: Number(distanceKm),
        estimated_duration: estDuration
      };

      const res = await bookingApi.createBooking(payload);
      const bookingData = res?.data?.data;

      if (bookingData?.booking_number) {
        setCreatedBooking(bookingData);
        // Apply Coupon on backend if validated
        if (appliedPromo) {
          try {
            await couponApi.applyCoupon({
              booking_id: bookingData.id,
              coupon_code: appliedPromo.coupon_code
            });
          } catch (cErr) {
            console.warn("Backend coupon apply warning:", cErr);
          }
        }
        addToast(`Booking ${bookingData.booking_number} created successfully!`, 'success');
        setStep(4);
      } else {
        throw new Error(res?.data?.message || "Failed to confirm booking.");
      }
    } catch (err) {
      const detailMsg = err?.response?.data?.detail;
      const apiMsg = typeof detailMsg === 'string' ? detailMsg : (Array.isArray(detailMsg) ? detailMsg[0]?.msg : null);
      const finalErr = apiMsg || err?.response?.data?.message || err?.message || "Booking failed.";
      addToast(finalErr, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDoneAndClose = () => {
    onClose();
    window.location.href = ROUTES.CUSTOMER_MY_BOOKINGS;
  };

  const handlePayNow = () => {
    onClose();
    if (createdBooking) {
      window.location.href = `/customer/checkout/${createdBooking.id}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/60 relative overflow-hidden text-slate-900 animate-fadeIn">
        
        {/* Sticky Header with Dark Navy Styling */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              Step {step} of 4 • {step === 1 ? 'Configure Trip' : (step === 2 ? 'Select Fleet' : (step === 3 ? 'Confirm details' : 'Booking Success'))}
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white">
              {step === 1 && 'Book Private Chauffeur Cab'}
              {step === 2 && 'Choose Your Fleet Vehicle'}
              {step === 3 && 'Verify Booking Details'}
              {step === 4 && 'Trip Reservation Confirmed!'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 bg-slate-50/50">
          
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Input fields left - 7 cols */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Trip Type Selectable Pills */}
                <div className="space-y-2 text-left">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Trip Type *</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['One Way', 'Round Trip', 'Local', 'Airport'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTripType(type)}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-center ${
                          tripType === type 
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSearchVehicles} className="space-y-4 text-left">
                  
                  {/* Customer Information Sub-Header */}
                  <div className="border-t border-slate-200 pt-3">
                    <h4 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-3">Passenger Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter passenger name"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Mobile Number (WhatsApp) *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trip details */}
                  <div className="border-t border-slate-200 pt-3 space-y-3.5">
                    <h4 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Route details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Pickup location */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">Pickup Location *</label>
                          <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={gpsLoading}
                            className="text-[9px] font-black text-orange-600 hover:text-orange-700 transition-colors uppercase cursor-pointer"
                          >
                            {gpsLoading ? 'Locating...' : '📍 Use Current Location'}
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          placeholder="Enter pickup location"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Destination */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Destination *</label>
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter drop location or city"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Journey Date */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Journey Date *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={journeyDate}
                          onChange={(e) => setJourneyDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Pickup Time */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Pickup Time *</label>
                        <div className="flex gap-2">
                          <select
                            value={pickupTime}
                            onChange={(e) => {
                              if (e.target.value === 'CUSTOM') {
                                setShowCustomTime(true);
                                setPickupTime('');
                              } else {
                                setShowCustomTime(false);
                                setPickupTime(e.target.value);
                              }
                            }}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600 flex-1"
                          >
                            {['06:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'].map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                            <option value="CUSTOM">Custom Time...</option>
                          </select>
                          {showCustomTime && (
                            <input
                              type="text"
                              required
                              value={customTime}
                              onChange={(e) => setCustomTime(e.target.value)}
                              placeholder="e.g. 10:15 AM"
                              className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600 w-28"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Return Date (Round trip only) */}
                    {tripType === 'Round Trip' && (
                      <div className="animate-fadeIn">
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Return Date *</label>
                        <input
                          type="date"
                          required
                          min={journeyDate || new Date().toISOString().split('T')[0]}
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Passengers & Vehicle Category selection */}
                  <div className="border-t border-slate-200 pt-3 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Fleet preferences</h4>
                      
                      {/* Passengers Counter */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-700 uppercase mr-1">Passengers *</span>
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={passengers <= 1}
                            className="px-2 py-1.5 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-black text-slate-900">{passengers}</span>
                          <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={passengers >= 50}
                            className="px-2 py-1.5 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Type Radio Category Selectors */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Sedan', 'SUV', 'Traveller', 'Bus'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedVehicleType(type)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                            selectedVehicleType === type 
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-full h-16 rounded-lg overflow-hidden bg-slate-100 mb-2">
                            <img src={vehicleDetails[type].img} alt={type} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{type}</span>
                            <span className="block text-[10px] text-slate-500 font-bold">{vehicleDetails[type].seats}</span>
                            <span className="block text-xs font-bold text-blue-600 mt-1">{vehicleDetails[type].price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Search Cabs button */}
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                  >
                    <span>SEARCH VEHICLES</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              </div>

              {/* Live Fare Estimation Right Column - 5 cols */}
              <div className="lg:col-span-5 space-y-5 text-left">
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">LIVE FARE ESTIMATE</h4>
                    <p className="text-[10px] text-slate-500">Subject to change based on selected car models</p>
                  </div>

                  {estimatingFare ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2">
                      <Loader className="w-8 h-8 animate-spin text-orange-500" />
                      <span className="text-[10px] text-slate-400">Computing fare rates...</span>
                    </div>
                  ) : fareEstimate ? (
                    <div className="space-y-4">
                      {/* Big fare display */}
                      <div className="py-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">APPROXIMATE FARE</span>
                        <div className="text-3.5xl font-black text-orange-500">
                          ₹ {getGrandTotal().toLocaleString('en-IN')}
                          {appliedPromo && (
                            <span className="text-xs text-slate-400 line-through font-medium ml-2">
                              ₹ {fareEstimate.grand_total.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Breakdowns */}
                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                        <div className="flex justify-between">
                          <span>Base Rental Charge ({distanceKm} KM):</span>
                          <span>₹ {fareEstimate.base_fare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Driver Allowance & Bata:</span>
                          <span>₹ {fareEstimate.driver_allowance.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST Gov Tax (5%):</span>
                          <span>₹ {fareEstimate.gst.toLocaleString('en-IN')}</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-emerald-400 font-bold">
                            <span>Promo Code Discount:</span>
                            <span>- ₹ {appliedPromo.discount_value.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>

                      {/* General specifications */}
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Estimated Time:</span>
                          <strong className="text-slate-200">{estDuration}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Toll Taxes:</span>
                          <span className="text-emerald-500 font-bold">INCLUDED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Driver Allowance:</span>
                          <span className="text-emerald-500 font-bold">INCLUDED</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Please enter route details and choose a category to calculate estimation.
                    </div>
                  )}

                  {/* Promo Code section */}
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Promo Code (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 flex-1 uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoSuccessMsg && <p className="text-[10px] text-emerald-400 font-bold">{promoSuccessMsg}</p>}
                    {promoErrorMsg && <p className="text-[10px] text-rose-400 font-bold">{promoErrorMsg}</p>}
                  </div>

                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-left">
              <div className="flex items-center gap-2 text-slate-600">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to details</span>
                </button>
              </div>

              {loadingVehicles ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader className="w-10 h-10 animate-spin text-blue-600" />
                  <span className="text-sm text-slate-500">Searching active fleet availability...</span>
                </div>
              ) : vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map(veh => {
                    const priceBreakdown = computeVehicleFare(veh);
                    return (
                      <div
                        key={veh.id}
                        className="bg-white border border-slate-200/80 rounded-2xl p-4 flex gap-4 hover:shadow transition-shadow items-center justify-between"
                      >
                        <div className="flex gap-4 items-center">
                          <img
                            src={veh.image_url || vehicleDetails[selectedVehicleType]?.img}
                            alt={veh.name}
                            className="w-24 h-16 object-cover rounded-xl shrink-0"
                          />
                          <div>
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              {veh.category}
                            </span>
                            <h4 className="text-base font-black text-slate-900 mt-0.5">{veh.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <span>👥 {veh.seating_capacity} Seats</span>
                              <span>❄️ {veh.is_ac ? 'AC' : 'Non AC'}</span>
                              <span className="capitalize">🛢️ {veh.fuel_type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-black text-blue-600">
                            ₹ {priceBreakdown.final_total.toLocaleString('en-IN')}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectDbVehicle(veh)}
                            className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded-lg uppercase transition-colors mt-1 cursor-pointer"
                          >
                            Select Vehicle
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  No active fleet vehicles found in this category.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-6 space-y-5 text-left">
              <div>
                <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">BOOKING SUMMARY</h4>
                <p className="text-xs text-slate-500">Please confirm your selection below before reservation creation</p>
              </div>

              <div className="border-t border-slate-100 py-3 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="text-slate-950 font-bold">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Number:</span>
                  <span className="text-slate-950 font-bold">{customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Location:</span>
                  <span className="text-slate-950 font-bold">{pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-slate-950 font-bold">{destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Journey Date:</span>
                  <span className="text-slate-950 font-bold">
                    {journeyDate.split('-').reverse().join('-')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Time:</span>
                  <span className="text-slate-950 font-bold">{pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Passengers:</span>
                  <span className="text-slate-950 font-bold">{passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle selected:</span>
                  <span className="text-slate-950 font-bold">{selectedDbVehicle?.name}</span>
                </div>
                {tripType === 'Round Trip' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Return Date:</span>
                    <span className="text-slate-950 font-bold">
                      {returnDate.split('-').reverse().join('-')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-slate-900">
                  <span>Grand Total Estimated:</span>
                  <span className="text-lg text-blue-600">
                    ₹ {computeVehicleFare(selectedDbVehicle).final_total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-5 py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={bookingLoading}
                  onClick={handleConfirmBooking}
                  className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex-1 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {bookingLoading ? 'Reserving...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-md mx-auto text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Booking Reservation Created!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Booking Number: <strong className="text-blue-600 font-mono text-sm">#{createdBooking?.booking_number}</strong><br/>
                  Our travel assistant will send vehicle details to <strong className="text-slate-800">{customerPhone}</strong> shortly.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-semibold text-slate-600">
                <div>Passenger: <span className="text-slate-900">{customerName}</span></div>
                <div>Amount: <span className="text-blue-600 font-bold">₹ {createdBooking?.grand_total?.toLocaleString('en-IN')}</span></div>
                <div>Booking Status: <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{createdBooking?.status}</span></div>
                <div>Payment Status: <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{createdBooking?.payment_status}</span></div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleDoneAndClose}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors cursor-pointer flex-1"
                >
                  Done & Close
                </button>
                <button
                  onClick={handlePayNow}
                  className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex-1 cursor-pointer uppercase"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}


/* ================= 2. PACKAGE ITINERARY MODAL ================= */
export function PackageModal({ isOpen, onClose, pkg }) {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user && isOpen) {
      setInquiryName(prev => prev || user.full_name || user.name || '');
      setInquiryPhone(prev => prev || user.phone || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !pkg) return null;

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setLoading(true);

    try {
      if (!user) {
        const userEmail = `${inquiryPhone.replace(/\D/g, '')}@njtours.com`;
        const userPhone = inquiryPhone.replace(/\D/g, '');
        try {
          await authService.register({
            fullName: inquiryName.trim(),
            email: userEmail,
            phone: userPhone,
            password: "Password123!",
            role: "Customer"
          });
        } catch (regErr) {}
        try {
          await login({ email: userEmail, password: "Password123!" });
        } catch (loginErr) {}
      }

      let targetVehicleId = null;
      try {
        const vListRes = await vehicleApi.listVehicles({ is_available: true });
        if (vListRes?.data?.data && Array.isArray(vListRes.data.data) && vListRes.data.data.length > 0) {
          targetVehicleId = vListRes.data.data[0].id;
        }
      } catch (vErr) {}

      if (targetVehicleId) {
        const today = new Date().toISOString().split('T')[0];
        const payload = {
          vehicle_id: targetVehicleId,
          trip_type: "Local",
          pickup_location: "Mumbai / Pune City",
          drop_location: t(pkg.nameKey) || "Tour Destination",
          pickup_date: inquiryDate || today,
          pickup_time: "08:00 AM",
          passengers: 4,
          distance_km: 250.0,
          estimated_duration: t(pkg.durationKey) || "Full Day"
        };
        await bookingApi.createBooking(payload);
      }
    } catch (err) {
      console.warn("Package booking notice:", err);
    } finally {
      setLoading(false);
      setIsSent(true);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setInquiryName('');
    setInquiryPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-xl border border-slate-200 relative my-8 flex flex-col text-slate-900">
        
        {/* Modal Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 transition-colors shadow border border-white/10"
          aria-label="Close package details"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          /* SUCCESS SUBMIT SCREEN */
          <div className="p-8 text-center space-y-5 py-16">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900">{t('modals.inquiryReceived', 'Inquiry Received!')}</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t('modals.inquiryThanks', 'Thank you for choosing NJ Tours. Our holiday planner will contact you within 15 minutes to customize your itinerary.')}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left max-w-sm mx-auto text-xs space-y-1 font-semibold text-slate-600">
              <div>{t('modals.packageName', 'Package Name:')} <span className="text-slate-950">{t(pkg.nameKey)}</span></div>
              <div>{t('modals.departureDate', 'Departure Date:')} <span className="text-slate-950">{inquiryDate}</span></div>
              <div>{t('modals.travelerName', 'Traveler Name:')} <span className="text-slate-950">{inquiryName}</span></div>
            </div>
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-8 py-3.5 rounded-xl transition-all shadow-md"
            >
              {t('modals.doneClose', 'Done & Close')}
            </button>
          </div>
        ) : (
          /* INTERACTIVE PACKAGE FORM AND CONTENT */
          <div className="flex flex-col">
            
            {/* Image Banner Header */}
            <div className="relative h-64 bg-slate-950 shrink-0">
              <img src={pkg.image} alt={t(pkg.nameKey)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                <span className="text-[10px] bg-orange-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {t(pkg.categoryKey)} {t('nav.tourPackages')} • {t(pkg.durationKey)}
                </span>
                <h3 className="text-2xl sm:text-3.5xl font-black">{t(pkg.nameKey)}</h3>
                <div className="flex items-center gap-1 text-xs text-orange-400 font-bold mt-1">
                  <Star className="w-4 h-4 fill-orange-400" />
                  <span>{pkg.rating} ({pkg.reviews} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Split Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto max-h-[50vh] text-left">
              
              {/* Left Column: Itinerary list */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                    {t('modals.dayWiseDetailedItinerary', 'Day-Wise Detailed Itinerary')}
                  </h4>
                  <div className="space-y-3.5 pt-3">
                    {(pkg.itineraryKeys || []).map((item) => (
                      <div key={item.day} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                            {t('modals.day', 'Day')} {item.day}
                          </span>
                          <h5 className="text-xs font-black text-slate-900">{t(item.titleKey)}</h5>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">{t(item.descKey)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hotel, Vehicle, and Inquiry form */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Hotel & Vehicle specs */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{t('modals.premiumInclusions', 'Premium Inclusions')}</h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>{t('modals.stay', 'Stay:')}</strong> {pkg.hotelKey ? t(pkg.hotelKey) : "3★ Deluxe Valley Resort / Stay"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500 shrink-0" />
                      <span><strong>{t('modals.vehicle', 'Vehicle:')}</strong> {t('modals.privateAc', 'Private AC')} {pkg.vehicleKey ? t(pkg.vehicleKey) : "Sedan / Hatchback Cab"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>{t('modals.meals', 'Meals:')}</strong> {t('modals.mealsIncludedDesc', 'Breakfast & Buffet Dinners included')}</span>
                    </div>
                  </div>
                </div>

                {/* Package Exclusions note */}
                <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 text-xs space-y-1">
                  <div className="font-bold text-red-800">{t('modals.packageExcludes', 'Package Excludes:')}</div>
                  <ul className="list-disc list-inside text-red-600 font-medium text-[11px] space-y-0.5">
                    <li>{t('modals.flightsTrain', 'Flights / Train tickets (extra cost)')}</li>
                    <li>{t('modals.monumentsGuides', 'Personal monument entry tickets & guides')}</li>
                    <li>{t('modals.laundryTips', 'Laundry, tips & alcoholic drinks')}</li>
                  </ul>
                </div>

                {/* Lead Capture Booking Form */}
                <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{t('modals.planMyJourney', 'Plan My Journey')}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{t('modals.freeQuoteDesc', 'Free instant custom holiday quote')}</p>
                  </div>

                  <form onSubmit={handleSubmitInquiry} className="space-y-3">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus-within:border-orange-500 transition-colors">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5">{t('modals.yourName', 'Your Name')}</label>
                      <input 
                        type="text" 
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder={t('auth.fullName', 'Enter passenger full name')} 
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus-within:border-orange-500 transition-colors">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5">{t('auth.mobileNumber', 'Mobile Number (WhatsApp)')} *</label>
                      <input 
                        type="tel" 
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX" 
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus-within:border-orange-500 transition-colors">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5">{t('modals.travelDate', 'Travel Date')}</label>
                      <input 
                        type="date" 
                        value={inquiryDate}
                        onChange={(e) => setInquiryDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow shadow-orange-500/25 flex items-center justify-center gap-1.5"
                    >
                      <span>{t('modals.getFreeQuote', 'Get Free Custom Quote')}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </form>
                </div>

              </div>

            </div>

            {/* Modal Bottom Sticky Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 font-black block uppercase">{t('modals.startingPackagePrice', 'Starting package price')}</span>
                <span className="text-2xl font-black text-blue-600">
                  ₹ {pkg.price.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-500 font-semibold">/ {t('fleet.day', 'Person')}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                >
                  {t('modals.doneClose', 'Close')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSent(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 border border-orange-400/40"
                >
                  {t('hero.bookNow', 'Book Package')}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


export function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!emailRegex.test(emailOrPhone.trim())) {
          throw new Error("Please enter a valid email address.");
        }
        const cleanPhone = phone.trim().replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          throw new Error("Please enter a valid 10-digit Indian mobile number.");
        }

        await authService.register({
          fullName: fullName.trim() || "NJ Customer",
          email: emailOrPhone.trim(),
          phone: cleanPhone,
          password: password,
          role: 'Customer'
        });
        alert("Account registered successfully! Please login now.");
        setIsRegister(false);
      } else {
        const res = await login({
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone.replace(/\D/g, '')}@njtours.com`,
          password: password
        });
        alert("Logged in successfully!");
        onClose();
        if (res?.user?.role === ROLES.ADMIN) {
          window.location.href = ROUTES.ADMIN_DASHBOARD;
        } else if (res?.user?.role === ROLES.DRIVER) {
          window.location.href = ROUTES.DRIVER_DASHBOARD;
        } else {
          window.location.href = ROUTES.CUSTOMER_DASHBOARD;
        }
      }
    } catch (err) {
      console.warn("Auth process error:", err);
      if (isRegister) {
        setErrorMsg(err?.message || "Registration failed. Ensure password has 8+ chars, 1 uppercase & 1 symbol (e.g. Password123!)");
      } else {
        setErrorMsg(err?.message || "Invalid email/phone or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden text-left animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? t('auth.createAccount', 'Welcome to NJ Tours!') : t('auth.welcomeBack', 'Welcome Back!')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {isRegister 
                ? t('auth.registerSubtitle', 'Register an account for instant cab booking & tracking') 
                : t('auth.loginJourney', 'Login to continue your journey with NJ Tours')}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('modals.fullName', 'Full Name')}
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.fullNamePlaceholder', 'Enter passenger full name')}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email or Phone Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isRegister ? t('auth.email', 'Email Address') : t('modals.emailOrPhone', 'Email or Phone')}
              </label>
              <div className="relative flex items-center">
                {isRegister ? (
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
                ) : (
                  <User className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
                )}
                <input
                  type={isRegister ? "email" : "text"}
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={isRegister ? "name@example.com" : t('modals.emailOrPhonePlaceholder', 'Enter email or phone number')}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            {/* Mobile Phone Number (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('auth.mobileNumber', 'Mobile Number')}
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('modals.password', 'Password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('modals.passwordPlaceholder', 'Enter your password')}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password Row */}
            {!isRegister && (
              <div className="flex items-center justify-between text-xs font-medium pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#F97316] rounded border-slate-300 focus:ring-[#F97316] cursor-pointer"
                  />
                  <span>{t('auth.rememberMe', 'Remember me')}</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Please use demo login or register password.")}
                  className="font-bold text-[#F97316] hover:text-[#EA580C] hover:underline cursor-pointer"
                >
                  {t('auth.forgotPassword', 'Forgot Password?')}
                </button>
              </div>
            )}

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isRegister ? t('auth.createAccountBtn', 'Create Account') : t('auth.login', 'Login')}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
              or
            </span>
          </div>

          {/* Secondary Action / Toggle Register */}
          <div className="text-center space-y-2">
            <span className="text-xs text-slate-500 font-medium block">
              {isRegister ? t('auth.alreadyUser', 'Already have an account?') : t('auth.newToNj', 'New to NJ Tours?')}
            </span>
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
              className="w-full bg-white hover:bg-orange-50/50 text-[#F97316] font-bold text-xs sm:text-sm py-3 rounded-2xl border border-[#F97316] hover:border-[#EA580C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-[#F97316]" />
              <span>{isRegister ? t('auth.loginLink', 'Login to Existing Account') : t('auth.createNewAccount', 'Create New Account')}</span>
            </button>
          </div>

          {/* Footer Terms */}
          <p className="text-center text-[11px] text-slate-400 font-medium pt-2">
            By continuing, you agree to our{' '}
            <span className="font-bold text-slate-700 hover:underline cursor-pointer">Terms & Conditions</span>
            {' '}and{' '}
            <span className="font-bold text-slate-700 hover:underline cursor-pointer">Privacy Policy</span>
          </p>

        </div>

      </div>
    </div>
  );
}
