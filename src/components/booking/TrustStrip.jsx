import React from 'react';
import { Star, Users, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustStrip() {
  const items = [
    { label: '4.9 Rating (12,400+ Reviews)', icon: Star, color: 'text-amber-400 fill-amber-400' },
    { label: '50,000+ Happy Customers', icon: Users, color: 'text-blue-500' },
    { label: 'Secure Payment', icon: Lock, color: 'text-purple-500' },
    { label: 'Instant Confirmation', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
            <Icon className={`w-4 h-4 ${item.color}`} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
