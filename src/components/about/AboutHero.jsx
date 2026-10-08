import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Car, Phone, ShieldCheck, Headphones, Users } from 'lucide-react';
import { COMPANY_INFO } from '../../data/toursData';

export default function AboutHero({ onOpenBooking }) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-slate-950 text-white overflow-hidden min-h-[560px] flex items-center">
      
      {/* Travel Background with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/90" />

      {/* Decorative Glow Mesh */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 text-xs font-bold text-slate-300 backdrop-blur-md">
              <Link to="/" className="hover:text-amber-400 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-amber-400">{t('nav.about')}</span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
                {COMPANY_INFO.fullForm} • {COMPANY_INFO.subTagline}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight font-serif">
                {t('about.title')} <span className="text-gradient-gold">NJ Tours</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                {t('about.subtitle')}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('hero.safeTravel')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 backdrop-blur-md">
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>{t('hero.support247')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 backdrop-blur-md">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{t('hero.happyCustomers')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="btn-shimmer text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Car className="w-4 h-4 text-slate-950" />
                <span>{t('hero.bookNow')}</span>
              </button>

              <a
                href="/#contact"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{t('nav.contact')}</span>
              </a>
            </div>

          </div>

          {/* Right Premium Luxury Coach Image Card */}
          <div className="lg:col-span-5 relative flex justify-end">
            <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl border border-white/15 animate-float group">
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80"
                alt="NJ Tours Luxury Coach Bus"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                BUSINESS CLASS FLEET
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-left">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">National Journey Fleet</div>
                <div className="text-lg font-black text-white">Luxury Air-Suspension Volvo & BharatBenz Coaches</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
