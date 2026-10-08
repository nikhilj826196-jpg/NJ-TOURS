import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VEHICLE_FLEET } from '../../data/toursData';

export default function FareEstimator({ vehicleType }) {
  const { t } = useTranslation();
  const selected = VEHICLE_FLEET.find(v => v.id === vehicleType) || VEHICLE_FLEET[2];

  const estFare = `₹ ${selected.baseFare.toLocaleString('en-IN')}`;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
      
      {/* Fare Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">{t('booking.approxFare')}</div>
          <div className="text-base font-black text-white flex items-center gap-2">
            <span>{estFare}</span>
            <span className="text-[10px] text-slate-400 font-normal">({selected.name} @ ₹{selected.pricePerKm}/km)</span>
          </div>
        </div>
      </div>

      {/* Included Amenities Checklist */}
      <div className="flex flex-wrap items-center gap-4 text-slate-300 font-bold text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('booking.tollIncluded')}</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{t('booking.driverIncluded')}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{t('booking.estTime')}: <strong>3 hrs 15 mins</strong></span>
        </div>
      </div>

    </div>
  );
}
