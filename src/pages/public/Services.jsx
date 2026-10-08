import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, MapPin, Calendar, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import ServicesSection from '../../components/ServicesSection';

export default function Services({ onSelectService, onOpenBooking }) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 font-sans min-h-screen">

      {/* Services Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white py-16 px-4 sm:px-6 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-[#0B5ED7]_1px,transparent_1px] [background-size:20px_20px] pointer-events-none" />
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Our Premium Travel Services</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
          Professional, safe, and reliable transport solutions tailored to your journeys across India
        </p>
      </div>

      {/* Services List Section */}
      <ServicesSection onSelectService={onSelectService} />

      {/* Service Details Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Custom Built For Every Journey</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Explore details about our three primary operational travel divisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Outstation Cabs",
              desc: "Book comfortable outstation one-way or round-trip transfers with vetted highway-trained chauffeurs. Ideal for weekend getaways and pilgrimage trips.",
              icon: MapPin,
              color: "text-[#0B5ED7] bg-blue-50"
            },
            {
              title: "Local Hourly Rental",
              desc: "Flexible hourly rental cabs with driver allowance included. Hire by the hour (4hr/40km or 8hr/80km packages) for seamless city business or shopping runs.",
              icon: Clock,
              color: "text-[#FF8C00] bg-orange-50"
            },
            {
              title: "Airport Transfers",
              desc: "Guaranteed on-time airport pickups and drop dispatch services. Active monitoring of flight status ensures your driver is waiting when you arrive.",
              icon: Car,
              color: "text-emerald-600 bg-emerald-50"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0B5ED7] text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-blue-500/10">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-bold">Ready to book your premium ride?</h3>
            <p className="text-xs text-blue-100 font-medium">Select your pickup, drop, and vehicle to calculate immediate estimates</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="bg-white hover:bg-blue-50 text-[#0B5ED7] font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer shrink-0"
          >
            Book Instant Ride <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
