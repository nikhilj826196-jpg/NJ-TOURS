import React from 'react';
import { Car, Compass, ArrowRight } from 'lucide-react';

export default function CallToAction({ onOpenBooking }) {
  return (
    <section className="relative py-24 bg-slate-950 text-white overflow-hidden">
      
      {/* Luxury Travel Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950" />

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
          NATIONAL JOURNEY MOBILITY
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-serif">
          Ready For Your Next Journey?
        </h2>
        
        <p className="text-slate-300 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
          Book your next trip with NJ Tours and travel with confidence. Experience business class comfort, transparent billing, and 24x7 support.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenBooking}
            className="btn-shimmer text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition-transform flex items-center gap-2.5"
          >
            <Car className="w-5 h-5 text-slate-950" />
            <span>Book Now</span>
          </button>

          <a
            href="/#packages"
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 group"
          >
            <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            <span>View Tour Packages</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
