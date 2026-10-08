import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function NavLinks({ scrolled, onLinkClick }) {
  const location = useLocation();
  const { t } = useTranslation();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navItems = [
    { name: t('nav.home', 'Home'), href: '/', isHash: false },
    { name: t('nav.about', 'About Us'), href: '/about', isHash: false },
    { name: t('nav.services', 'Services'), href: '/#services', isHash: true, hash: '#services' },
    { name: t('nav.vehicles', 'Vehicles'), href: '/#fleet', isHash: true, hash: '#fleet' },
    { name: t('nav.tourPackages', 'Tour Packages'), href: '/#packages', isHash: true, hash: '#packages' },
    { name: t('nav.gallery', 'Gallery'), href: '/#gallery', isHash: true, hash: '#gallery' },
    { name: t('nav.faq', 'FAQ'), path: '/faq', href: '/faq', isHash: false },
    { name: t('nav.contact', 'Contact'), href: '/#contact', isHash: true, hash: '#contact' },
  ];

  const checkIsActive = (link) => {
    if (link.isHash) {
      return location.pathname === '/' && currentHash === link.hash;
    }
    return location.pathname === link.href && !currentHash;
  };

  return (
    <nav className="hidden lg:flex items-center gap-2 xl:gap-3" aria-label="Main Navigation">
      {navItems.map((link) => {
        const isActive = checkIsActive(link);

        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => {
              if (link.isHash) setCurrentHash(link.hash);
              if (onLinkClick) onLinkClick();
            }}
            className={`relative px-4 py-2 text-sm xl:text-[15px] font-semibold tracking-wide transition-all duration-300 group shrink-0 focus:outline-none rounded-full ${isActive
                ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/10 font-bold'
                : scrolled
                  ? 'text-[#0F172A] hover:text-[#F97316]'
                  : 'text-slate-100 hover:text-orange-400'
              }`}
          >
            <span>{link.name}</span>

            {/* Inactive Hover Underline Slide Animation */}
            {!isActive && (
              <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
