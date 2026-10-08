import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Clock, Crosshair, Tag, Check } from 'lucide-react';
import VehicleSelector from './VehicleSelector';
import PassengerSelector from './PassengerSelector';
import SearchButton from './SearchButton';

export default function BookingForm({ activeTab, onSearch, onVehicleChange }) {
  const { t } = useTranslation();
  const [pickupCity, setPickupCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [journeyDate, setJourneyDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [pickupTime, setPickupTime] = useState('07:00');
  const [vehicleType, setVehicleType] = useState('innova-crysta');
  const [passengers, setPassengers] = useState(4);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVehicleSelect = (val) => {
    setVehicleType(val);
    if (onVehicleChange) onVehicleChange(val);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setPickupCity('Pune Expressway (Current Location)'),
        () => setPickupCity('Mumbai Airport T2')
      );
    } else {
      setPickupCity('Mumbai Airport T2');
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSearch({
        tripType: activeTab,
        pickupCity: pickupCity || 'Mumbai',
        destinationCity: destinationCity || 'Goa',
        journeyDate,
        returnDate: activeTab === 'outstation-round' ? returnDate : 'N/A',
        pickupTime,
        vehicleType,
        passengers,
        promoCode: promoApplied ? promoCode : null
      });
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        
        {/* Pickup Field */}
        <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center">
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {t('booking.pickup')}
            </label>
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="text-[9px] font-bold text-[#F97316] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Crosshair className="w-2.5 h-2.5 text-[#F97316]" /> {t('booking.gps')}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
            <input
              type="text"
              placeholder={t('booking.pickupPlaceholder')}
              value={pickupCity}
              onChange={(e) => setPickupCity(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Destination Field */}
        <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            {t('booking.destination')}
          </label>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
            <input
              type="text"
              placeholder={t('booking.destinationPlaceholder')}
              disabled={activeTab === 'local-hourly'}
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none disabled:opacity-40"
            />
          </div>
        </div>

        {/* Journey Date */}
        <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            {t('booking.journeyDate')}
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Return Date */}
        {activeTab === 'outstation-round' ? (
          <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              {t('booking.returnDate')}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              {t('booking.pickupTime')}
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        )}

      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        
        {/* Vehicle Selector */}
        <VehicleSelector value={vehicleType} onChange={handleVehicleSelect} />

        {/* Passenger Stepper */}
        <PassengerSelector value={passengers} onChange={setPassengers} />

        {/* Promo Code Input */}
        <div className="bg-[#F8FAFC] h-[56px] px-4 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all text-left flex flex-col justify-center">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            {t('booking.promoCode')}
          </label>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#F97316] shrink-0" />
            <input
              type="text"
              placeholder={t('booking.promoPlaceholder')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#0F172A] placeholder-slate-400 uppercase focus:outline-none"
            />
            {promoCode && (
              <button
                type="button"
                onClick={handleApplyPromo}
                className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md shrink-0 cursor-pointer"
              >
                {promoApplied ? <Check className="w-3 h-3" /> : t('booking.apply')}
              </button>
            )}
          </div>
        </div>

        {/* Search Button */}
        <SearchButton loading={loading} />

      </div>

    </form>
  );
}
