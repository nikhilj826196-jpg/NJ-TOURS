import React from 'react';
import { useTranslation } from 'react-i18next';
// from 'react';
import { Car, MapPin, Calendar, Clock, Phone, Navigation } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function AssignedTrips() {
  const { t } = useTranslation();
  const trips = [
    {
      id: "TRIP-9081",
      route: "Mumbai ➔ Goa",
      pickup: "Bandra West, Mumbai at 07:00 AM",
      passenger: "Rajesh Sharma",
      phone: "+91 98765 43210",
      date: "05 Aug 2026",
      fare: 11800,
      status: "Upcoming"
    },
    {
      id: "TRIP-8812",
      route: "Pune ➔ Mahabaleshwar",
      pickup: "Swargate, Pune at 06:30 AM",
      passenger: "Anand Verma",
      phone: "+91 98220 11990",
      date: "28 Jul 2026",
      fare: 2499,
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6 text-white">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black">Assigned Chauffeur Duties</h2>
        <p className="text-xs text-slate-400">View upcoming passenger trips & duty history</p>
      </div>

      <div className="space-y-4">
        {trips.map((t) => (
          <div key={t.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-amber-400 font-mono">{t.id}</span>
                <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase ${t.status === 'Upcoming' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                  {t.status}
                </span>
              </div>
              <div className="text-sm font-black text-emerald-400">{formatCurrency(t.fare)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Route & Pickup:</span>
                <div className="font-bold text-white mt-0.5">{t.route}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{t.pickup}</div>
              </div>

              <div>
                <span className="text-slate-500">Passenger Info:</span>
                <div className="font-bold text-white mt-0.5">{t.passenger}</div>
                <div className="text-amber-400 text-[11px] mt-0.5">{t.phone}</div>
              </div>
            </div>

            {t.status === 'Upcoming' && (
              <button
                onClick={() => alert(`Starting Live GPS for ${t.id}`)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-white" />
                <span>START TELEMATICS TRIP NAVIGATION</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
