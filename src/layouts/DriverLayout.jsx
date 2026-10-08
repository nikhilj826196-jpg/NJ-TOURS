import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, DollarSign, User, LogOut, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function DriverLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const driverNav = [
    { label: t('nav.driverDashboard', 'Driver Dashboard'), icon: LayoutDashboard, path: ROUTES.DRIVER_DASHBOARD },
    { label: t('nav.assignedTrips', 'Assigned Trips'), icon: Car, path: ROUTES.DRIVER_TRIPS },
    { label: t('nav.earningsPayouts', 'Earnings & Payouts'), icon: DollarSign, path: ROUTES.DRIVER_EARNINGS },
    { label: t('nav.driverProfile', 'Driver Profile'), icon: User, path: ROUTES.DRIVER_PROFILE },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-slate-950 py-3.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="NJ Tours Logo" className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 bg-slate-950" />
          <div>
            <span className="font-extrabold text-base text-white">NJ <span className="text-emerald-400">{t('driver.portalTitle', 'DRIVER PORTAL')}</span></span>
            <span className="text-[9px] block text-emerald-400 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> {t('driver.telematicsActive', 'GPS TELEMATICS ACTIVE')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher scrolled={true} />
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{user?.name || t('driver.partner', 'Driver Partner')}</div>
            <div className="text-[10px] text-emerald-400">MH 04 ET 4020 (Innova Crysta)</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 transition-all"
          >
            <LogOut className="w-4 h-4" /> {t('auth.exit', 'Exit')}
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-2xl hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500 px-3 mb-2">{t('driver.controls', 'Driver Controls')}</div>
            {driverNav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 text-xs font-bold p-3 rounded-2xl transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/60 text-xs text-emerald-300 space-y-1">
            <div className="font-extrabold">{t('driver.dutyStatus', 'Duty Status: ON DUTY')}</div>
            <div className="text-[10px] text-slate-400">{t('driver.dutyManager', 'Duty Manager: Bandra Control Room')}</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
