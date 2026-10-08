import React from 'react';

export default function Statistics() {
  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '250+', label: 'Vehicles Fleet' },
    { value: '100,000+', label: 'Trips Completed' },
    { value: '150+', label: 'Cities Covered' },
    { value: '15+', label: 'Years Experience' },
    { value: '98%', label: 'Customer Satisfaction' },
  ];

  return (
    <section className="py-16 bg-slate-950 text-white border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1.5 hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl sm:text-4xl font-black text-gradient-gold">{s.value}</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
