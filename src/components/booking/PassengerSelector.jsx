import React from 'react';
import { Users, Minus, Plus } from 'lucide-react';

export default function PassengerSelector({ value, onChange }) {
  const increment = () => onChange(Math.min(value + 1, 56));
  const decrement = () => onChange(Math.max(value - 1, 1));

  return (
    <div className="bg-[#F8FAFC] h-[56px] px-3.5 rounded-[14px] border border-[#E5E7EB] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:bg-white transition-all flex flex-col justify-center text-left">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Passengers
          </label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
            <span className="text-xs font-bold text-[#0F172A]">{value} {value === 1 ? 'Person' : 'People'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-white p-1 rounded-[10px] border border-[#E5E7EB] shadow-sm">
          <button
            type="button"
            onClick={decrement}
            disabled={value <= 1}
            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs font-black text-[#0F172A]">{value}</span>
          <button
            type="button"
            onClick={increment}
            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
