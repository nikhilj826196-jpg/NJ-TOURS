import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, Phone, User, Car, Home, Info, Briefcase, Palmtree, GalleryHorizontal, HelpCircle, Mail, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_INFO } from '../../data/toursData';
import { useAuth } from '../../context/AuthContext';
import SocialLinks from './SocialLinks';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileDrawer({ isOpen, onClose, onOpenLogin, onOpenBooking }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard handler for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: t('nav.home'), href: '/', icon: Home, isHash: false },
    { name: t('nav.about'), href: '/about', icon: Info, isHash: false },
    { name: t('nav.services'), href: '/#services', icon: Briefcase, isHash: true, hash: '#services' },
    { name: t('nav.tourPackages'), href: '/#packages', icon: Palmtree, isHash: true, hash: '#packages' },
    { name: t('nav.vehicles'), href: '/#fleet', icon: Car, isHash: true, hash: '#fleet' },
    { name: t('nav.gallery'), href: '/#gallery', icon: GalleryHorizontal, isHash: true, hash: '#gallery' },
    { name: t('nav.faq'), href: '/faq', icon: HelpCircle, isHash: false },
    { name: t('nav.contact'), href: '/#contact', icon: Mail, isHash: true, hash: '#contact' },
  ];

  const checkIsActive = (link) => {
    if (link.isHash) {
      return location.pathname === '/' && currentHash === link.hash;
    }
    return location.pathname === link.href && !currentHash;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Full-Height Drawer Container with Smooth translate-x Animation */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-50 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="NJ Tours Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-md border border-amber-500/40 bg-slate-950"
                  />
                  <div className="text-left">
                    <span className="font-black text-base text-slate-900 leading-none block">
                      NJ <span className="text-amber-500">TOURS</span>
                    </span>
                    <span className="text-[9px] block text-blue-600 font-extrabold uppercase mt-0.5">
                      {COMPANY_INFO.fullForm}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <LanguageSwitcher scrolled={true} />
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="py-4 space-y-1 text-left">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = checkIsActive(link);

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => {
                        if (link.isHash) setCurrentHash(link.hash);
                        onClose();
                      }}
                      className={`flex items-center justify-between text-xs font-bold py-3 px-3.5 rounded-xl transition-all border-l-4 ${isActive
                          ? 'border-amber-500 bg-amber-50 text-amber-600 font-black shadow-sm'
                          : 'border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-300'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-4 text-left">
              {/* Guest User Card */}
              {!user ? (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{t('drawer.guestUser')}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{t('drawer.loginToManage')}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'NJ'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black text-slate-900 truncate">{user.name}</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">{user.role} {t('drawer.member', 'Member')}</div>
                  </div>
                </div>
              )}

              {/* 24x7 Call Helpline */}
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 py-2.5 rounded-xl border border-blue-200"
              >
                <Phone className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>
                  {t('nav.support')}: {COMPANY_INFO.phone}
                </span>
              </a>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {!user && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogin();
                    }}
                    className="flex items-center justify-center gap-1.5 border border-blue-600 text-blue-700 hover:bg-blue-50 font-bold text-xs py-3 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{t('nav.login')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className={`flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow transition-all ${user ? 'col-span-2' : ''
                    }`}
                >
                  <Car className="w-4 h-4 text-slate-950" />
                  <span>{t('hero.bookNow')}</span>
                </button>
              </div>

              {/* Social Media Icons */}
              <div className="pt-2 border-t border-slate-100 flex justify-center">
                <SocialLinks />
              </div>

              {/* Footer Notice */}
              <div className="text-center text-[10px] text-slate-400 font-medium">
                © 2026 <strong className="text-slate-600">NJ Tours</strong> • {COMPANY_INFO.fullForm}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
