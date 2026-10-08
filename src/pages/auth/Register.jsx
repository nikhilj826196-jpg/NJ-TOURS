import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, PhoneCall, Star, ArrowLeft, Car, Award } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import { COMPANY_INFO } from '../../data/toursData';

export default function Register() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">

      <div className="w-full max-w-6xl bg-white rounded-[20px] overflow-hidden shadow-xl border border-[#E5E7EB] grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">

        {/* LEFT SIDE: Visual Brand Banner */}
        <div className="lg:col-span-6 relative bg-[#0F172A] text-white p-5 sm:p-8 md:p-12 flex flex-col justify-between overflow-hidden">

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/90" />

          {/* Header */}
          <div className="relative z-10 space-y-4 text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="NJ Tours Logo"
                className="w-12 h-12 rounded-xl object-cover shadow border border-[#F97316]/40 bg-[#0F172A] group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left">
                <span className="font-black text-xl tracking-tight text-white font-serif">
                  NJ <span className="text-[#F97316]">TOURS</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#F97316]">
                  {COMPANY_INFO.fullForm}
                </span>
              </div>
            </Link>

            <div className="pt-4 space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#F97316]/30 uppercase tracking-wider">
                <Car className="w-3.5 h-3.5" /> {t('hero.safeTravel')}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-serif">
                Join India's Premier Mobility Network
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                Create your NJ Tours account to unlock digital GST invoices, real-time driver GPS tracking link, and priority cab dispatch.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="relative z-10 pt-8 space-y-3 border-t border-slate-800/80 mt-8 text-left">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 backdrop-blur-md flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 text-[#F97316] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t('booking.noHiddenCharges')}</h4>
                <p className="text-[11px] text-slate-400">Transparent billing & clear itemized receipts</p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 backdrop-blur-md flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-blue-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t('hero.support247')}</h4>
                <p className="text-[11px] text-slate-400">24x7 phone assistance throughout your tour</p>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="relative z-10 pt-6 text-left">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('auth.returnToHome')}
            </Link>
          </div>

        </div>

        {/* RIGHT SIDE: Form Container */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <RegisterForm />
        </div>

      </div>

    </div>
  );
}
