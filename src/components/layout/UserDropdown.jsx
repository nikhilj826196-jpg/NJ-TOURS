import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, Car, Settings, LogOut, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export default function UserDropdown({ scrolled }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const getDashboardRoute = () => {
    const role = (user.role || '').toUpperCase();
    if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (role === ROLES.DRIVER) return ROUTES.DRIVER_DASHBOARD;
    return ROUTES.CUSTOMER_DASHBOARD;
  };

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'NJ';

  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  const getRoleBadgeStyle = () => {
    const role = (user.role || '').toUpperCase();
    if (role === ROLES.ADMIN) {
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
    if (role === ROLES.DRIVER) {
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    }
    return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Modern Styled Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`group relative p-[1.5px] rounded-2xl transition-all duration-300 shrink-0 cursor-pointer shadow-md hover:shadow-xl ${
          open ? 'ring-2 ring-[#F97316]/50 scale-[1.02]' : 'hover:scale-[1.02]'
        }`}
      >
        {/* Glowing Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#F97316] via-amber-400 to-blue-600 opacity-70 group-hover:opacity-100 transition-opacity blur-[1px]" />

        {/* Inner Content Container */}
        <div
          className={`relative flex items-center gap-2 rounded-[14.5px] px-2.5 sm:px-3 py-1 sm:py-1.5 transition-all duration-300 backdrop-blur-xl ${
            scrolled
              ? 'bg-slate-900/90 text-white hover:bg-slate-900'
              : 'bg-slate-950/80 text-white hover:bg-slate-900/90 border border-white/10'
          }`}
        >
          {/* Avatar Icon Container with Online Status Badge */}
          <div className="relative shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#F97316] via-amber-500 to-orange-600 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg shadow-orange-500/30 border border-white/20 uppercase tracking-wide">
              {initials}
            </div>
            {/* Pulsing Emerald Active Indicator Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950" />
            </span>
          </div>

          {/* User Name Preview (Visible on Tablet & Desktop) */}
          <div className="hidden sm:flex flex-col text-left leading-none pr-1">
            <span className="text-[11px] font-black text-white truncate max-w-[80px] md:max-w-[100px] tracking-tight">
              {firstName}
            </span>
            <span className="text-[9px] font-bold text-amber-400/90 uppercase tracking-wider mt-0.5">
              {user.role || 'Member'}
            </span>
          </div>

          {/* Rotatable Chevron Down Arrow */}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-300 group-hover:text-amber-400 transition-transform duration-300 shrink-0 ${
              open ? 'rotate-180 text-amber-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2.5 w-64 bg-slate-900/95 text-white backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-950/80 border border-slate-800 z-50 overflow-hidden animate-fadeIn">
          
          {/* Top Decorative Gradient Line */}
          <div className="h-1 w-full bg-gradient-to-r from-[#F97316] via-amber-400 to-blue-500" />

          {/* User Profile Card Header */}
          <div className="p-4 bg-slate-800/60 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-amber-500 font-black text-white text-sm flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0 border border-white/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-black text-white truncate tracking-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">{user.email || user.phone}</div>
              
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${getRoleBadgeStyle()}`}>
                  <Sparkles className="w-2.5 h-2.5" />
                  {user.role || 'CUSTOMER'}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="p-2 space-y-1 text-xs font-bold text-left">
            <Link
              to={getDashboardRoute()}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span>{t('userMenu.dashboard', 'Dashboard')}</span>
            </Link>

            {(user.role || '').toUpperCase() === ROLES.CUSTOMER && (
              <Link
                to={ROUTES.CUSTOMER_BOOKINGS}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Car className="w-4 h-4" />
                </div>
                <span>{t('userMenu.myBookings', 'My Bookings')}</span>
              </Link>
            )}

            <Link
              to={(user.role || '').toUpperCase() === ROLES.ADMIN ? ROUTES.ADMIN_SETTINGS : ROUTES.CUSTOMER_PROFILE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span>{t('userMenu.myProfile', 'My Profile & Settings')}</span>
            </Link>
          </div>

          {/* Logout Action Footer */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/40">
            <button
              onClick={() => {
                setOpen(false);
                logout();
                navigate(ROUTES.HOME);
              }}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span>{t('userMenu.logout', 'Logout Account')}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
