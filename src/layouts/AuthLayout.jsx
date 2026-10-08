import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COMPANY_INFO } from '../data/toursData';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="NJ Tours Logo" className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 bg-slate-950" />
          <div>
            <span className="font-extrabold text-lg text-white">NJ <span className="text-amber-500">TOURS</span></span>
            <span className="text-[9px] block text-amber-400 font-semibold tracking-wider uppercase">{COMPANY_INFO.fullForm}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher scrolled={true} />
          <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all">
            <ArrowLeft className="w-4 h-4" /> {t('auth.backToHome', 'Back to Home')}
          </Link>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-md w-full mx-auto my-12 z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 z-10">
        © 2026 {COMPANY_INFO.name} ({COMPANY_INFO.fullForm}). {COMPANY_INFO.tagline}
      </footer>
    </div>
  );
}
