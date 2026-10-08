import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, Car, Calendar, Package, CreditCard, 
  Tag, Star, Bell, Navigation, Image as ImageIcon, Settings, LogOut, 
  Menu, X, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const adminNav = [
    { label: t('nav.overviewDashboard', 'Dashboard'), icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { label: t('nav.usersMgmt', 'Users'), icon: Users, path: ROUTES.ADMIN_USERS },
    { label: t('nav.driversFleet', 'Drivers'), icon: UserCheck, path: ROUTES.ADMIN_DRIVERS },
    { label: t('nav.fleetVehicles', 'Vehicles'), icon: Car, path: ROUTES.ADMIN_VEHICLES },
    { label: t('nav.bookingsMgmt', 'Bookings'), icon: Calendar, path: ROUTES.ADMIN_BOOKINGS },
    { label: t('nav.tourPackages', 'Tour Packages'), icon: Package, path: ROUTES.ADMIN_TOUR_PACKAGES },
    { label: t('nav.payments', 'Payments'), icon: CreditCard, path: ROUTES.ADMIN_PAYMENTS },
    { label: t('nav.coupons', 'Coupons'), icon: Tag, path: ROUTES.ADMIN_COUPONS },
    { label: t('nav.reviews', 'Reviews'), icon: Star, path: ROUTES.ADMIN_REVIEWS },
    { label: t('nav.notifications', 'Notifications'), icon: Bell, path: ROUTES.ADMIN_NOTIFICATIONS },
    { label: t('nav.liveTracking', 'Live Tracking'), icon: Navigation, path: ROUTES.ADMIN_LIVE_TRACKING },
    { label: t('nav.media', 'Media'), icon: ImageIcon, path: ROUTES.ADMIN_MEDIA },
    { label: t('nav.systemSettings', 'Settings'), icon: Settings, path: ROUTES.ADMIN_SETTINGS },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-slate-950 py-3 px-4 sm:px-6 border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B5ED7] flex items-center justify-center font-black text-white text-base shadow-sm">
              NJ
            </div>
            <div>
              <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                NJ TOURS
                <span className="text-[10px] bg-[#FF8C00] text-slate-950 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  HQ
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Your Journey, Our Responsibility.
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher scrolled={true} />
          
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{user?.name || "System Admin"}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold uppercase">Administrator</div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            title="Logout Admin Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex w-full relative">
        
        {/* Desktop Left Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden lg:flex flex-col justify-between shrink-0 p-4 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Admin Control Center
              </div>
            </div>

            <nav className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all ${
                      active
                        ? 'bg-[#0B5ED7] text-white shadow-md font-extrabold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Profile */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#0B5ED7]/20 border border-[#0B5ED7]/40 text-[#0B5ED7] flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email || "admin@njtours.com"}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Session
              </span>
              <span>v2.4</span>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              onClick={() => setMobileOpen(false)} 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            />

            {/* Content Drawer */}
            <div className="relative bg-slate-950 border-r border-slate-800 w-72 max-w-[80vw] flex flex-col justify-between p-4 h-full z-10 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-sm text-white">NJ TOURS ADMIN</h3>
                    <p className="text-[10px] text-slate-400">Control Center Navigation</p>
                  </div>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {adminNav.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all ${
                          active
                            ? 'bg-[#0B5ED7] text-white shadow-md font-extrabold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0B5ED7] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{user?.name || "Admin"}</div>
                    <div className="text-[10px] text-slate-400">{user?.email || "admin@njtours.com"}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-rose-600/20 text-rose-400 border border-rose-600/30 py-2 rounded-xl hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
