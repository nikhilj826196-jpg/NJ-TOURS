import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';

export default function SearchButton({ loading }) {
  const { t } = useTranslation();

  return (
    <button
      type="submit"
      disabled={loading}
      className="relative w-full h-[56px] bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-extrabold text-sm rounded-[14px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/15 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] disabled:opacity-75 overflow-hidden group"
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-white relative z-10" />
          <span className="relative z-10">{t('booking.searching')}</span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10 uppercase tracking-wider font-extrabold">{t('booking.searchVehicles')}</span>
        </>
      )}
    </button>
  );
}
