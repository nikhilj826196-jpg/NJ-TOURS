import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Navigation, Clock, Plane } from 'lucide-react';

export default function BookingTabs({ activeTab, onTabChange }) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'outstation-round', label: t('booking.outstationRound'), icon: Car },
    { id: 'one-way', label: t('booking.oneWay'), icon: Navigation },
    { id: 'local-hourly', label: t('booking.localHourly'), icon: Clock },
    { id: 'airport', label: t('booking.airport'), icon: Plane }
  ];

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3.5 mb-5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
