import React, { useState, useEffect } from 'react';
import { Phone, Menu, Car, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import NavLinks from './layout/NavLinks';
import UserDropdown from './layout/UserDropdown';
import MobileDrawer from './layout/MobileDrawer';
import LanguageSwitcher from './layout/LanguageSwitcher';
import { COMPANY_INFO } from '../data/toursData';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Glassmorphism Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3.5'
          }`}
      >
        <div
          className={`max-w-[1280px] mx-auto px-3.5 sm:px-6 rounded-[20px] flex items-center justify-between transition-all duration-300 border ${scrolled
              ? 'h-[62px] bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-2xl shadow-slate-900/15 text-[#0F172A]'
              : 'h-[72px] bg-[#0F172A]/85 backdrop-blur-xl border-white/15 text-white shadow-xl shadow-slate-950/20'
            }`}
        >
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0 select-none hover:scale-105 transition-transform duration-300">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="NJ Tours Logo"
                className={`rounded-xl object-cover border border-[#F97316]/50 bg-[#0F172A] group-hover:border-[#F97316] transition-all duration-300 ${scrolled ? 'w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]' : 'w-[46px] h-[46px] sm:w-[54px] sm:h-[54px]'
                  }`}
              />
            </div>

            <div className="flex flex-col text-left justify-center gap-0.5 min-w-0">
              <span className={`font-extrabold tracking-[1px] uppercase text-[#F97316] leading-none font-serif transition-all duration-300 ${scrolled ? 'text-[18px] sm:text-[21px]' : 'text-[20px] sm:text-[25px]'
                }`}>
                NJ TOURS
              </span>
              <span className={`font-semibold tracking-tight leading-none transition-all duration-300 hidden sm:block ${scrolled ? 'text-[11px] text-slate-500' : 'text-[13px] text-[#CBD5E1]'
                }`}>
                {COMPANY_INFO.fullForm} - Tours & Travels and Transport
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <NavLinks scrolled={scrolled} />
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Language Switcher (Visible on Mobile & Desktop) */}
            <div className="relative z-50">
              <LanguageSwitcher scrolled={scrolled} />
            </div>

            {/* Login Action Button (Visible on Mobile & Desktop) */}
            {user ? (
              <UserDropdown scrolled={scrolled} />
            ) : (
              <motion.button
                type="button"
                onClick={onOpenLogin}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center rounded-[12px] sm:rounded-[14px] border transition-all duration-300 shrink-0 cursor-pointer ${scrolled
                    ? 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-slate-200/90 text-[#0F172A] bg-slate-50/80 hover:border-[#F97316] hover:bg-slate-900 hover:text-white'
                    : 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-white/20 text-white bg-white/10 hover:border-[#F97316] hover:bg-white/20'
                  }`}
              >
                <User className="w-4.5 h-4.5 text-slate-300 group-hover:text-[#F97316] shrink-0" />
              </motion.button>
            )}

            {/* Call Action Button (Desktop) */}
            <motion.a
              href={`tel:${COMPANY_INFO.phone?.replace(/\s+/g, '')}`}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`hidden xl:flex items-center gap-2 text-xs font-bold px-4 rounded-[14px] border transition-all duration-300 shrink-0 ${scrolled
                  ? 'h-[44px] border-slate-200/90 text-[#0F172A] bg-slate-50/80 hover:border-[#F97316]/40 hover:bg-orange-50 hover:text-[#F97316]'
                  : 'h-[44px] border-white/20 text-white bg-white/10 hover:bg-white/20 hover:border-white/40'
                }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="hidden xl:inline">{COMPANY_INFO.phone}</span>
            </motion.a>

            {/* Book Now Button (Desktop) */}
            <motion.button
              type="button"
              onClick={onOpenBooking}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex h-[44px] bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-bold text-xs px-5 rounded-[14px] transition-all duration-300 items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 shrink-0"
            >
              <Car className="w-4 h-4 text-white shrink-0" />
              <span className="uppercase tracking-wider font-extrabold">{t('hero.bookNow', 'Book Now')}</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden flex items-center justify-center rounded-[12px] sm:rounded-[14px] border transition-all duration-300 group shrink-0 cursor-pointer ${scrolled
                  ? 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-slate-200 text-[#0F172A] hover:bg-slate-50'
                  : 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-white/20 text-white hover:bg-white/10'
                }`}
              aria-label="Open navigation menu"
            >
              <Menu className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenLogin={onOpenLogin}
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
