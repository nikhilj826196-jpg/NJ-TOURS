import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Tag } from 'lucide-react';
import BookingTabs from './booking/BookingTabs';
import BookingForm from './booking/BookingForm';
import FareEstimator from './booking/FareEstimator';
import BookingProcess from './booking/BookingProcess';
import TrustStrip from './booking/TrustStrip';

export default function BookingSearchCard({ onSearch }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('outstation-round');
  const [selectedVehicleType, setSelectedVehicleType] = useState('innova-crysta');

  return (
    <div className="w-full space-y-3">
      
      {/* Promotional Banner Above Widget */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl flex flex-wrap items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-slate-950" />
          <span>{t('booking.bannerText')}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-lg text-[11px] font-bold">
          <Tag className="w-3.5 h-3.5" /> {t('booking.coupon')}
        </div>
        </div>

      {/* Main Widget Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5 border border-slate-200 shadow-md">
        
        {/* Instant Fare Estimator Badge */}
        <div className="flex justify-start">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-orange-500/20">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Instant Fare Estimator</span>
          </div>
        </div>
        
        {/* Booking Tabs */}
        <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Booking Form */}
        <BookingForm
          activeTab={activeTab}
          onSearch={onSearch}
          onVehicleChange={setSelectedVehicleType}
        />

        {/* Expanded Fare Estimator Strip */}
        <FareEstimator vehicleType={selectedVehicleType} />

        {/* 6. Easy 4-Step Booking Process */}
        <BookingProcess />

        {/* 7. Trust Indicators Strip */}
        <TrustStrip />

      </div>

    </div>
  );
}
