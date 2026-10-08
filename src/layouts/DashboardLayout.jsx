import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, User, CreditCard, LogOut, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navItems = [
    { label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard, path: ROUTES.CUSTOMER_DASHBOARD },
    { label: t('nav.myBookings', 'My Bookings'), icon: Car, path: ROUTES.CUSTOMER_BOOKINGS },
    { label: t('nav.profile', 'My Profile'), icon: User, path: ROUTES.CUSTOMER_PROFILE },
    { label: t('nav.payments', 'Payments'), icon: CreditCard, path: ROUTES.CUSTOMER_PAYMENTS },
    { label: t('nav.liveTracking', 'Live Tracking'), icon: MapPin, path: ROUTES.CUSTOMER_TRACKING },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white py-3 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="NJ Tours Logo" className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 bg-slate-950" />
          <div>
            <span className="font-extrabold text-base text-white">NJ <span className="text-amber-500">TOURS</span></span>
            <span className="text-[9px] block text-amber-400 font-bold uppercase">{t('dashboard.customer', 'Customer Portal')}</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher scrolled={true} />
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{user?.name || t('nav.customer', 'Customer')}</div>
            <div className="text-[10px] text-slate-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 px-3 py-2 rounded-xl transition-all border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('auth.logout', 'Logout')}</span>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white rounded-3xl p-5 border border-slate-200 shadow-md hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 px-3 mb-2">{t('nav.customerMenu', 'Customer Menu')}</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 text-xs font-bold p-3 rounded-2xl transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{t('nav.needTripHelp', 'Need Trip Help?')}</span>
            </div>
            <p className="text-[11px] text-slate-600">{t('nav.callDesk', 'Call our 24x7 desk at +91 98765 43210')}</p>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md overflow-hidden">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
