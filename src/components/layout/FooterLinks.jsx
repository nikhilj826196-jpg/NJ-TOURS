import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FooterQuickLinks() {
  const { t } = useTranslation();
  const links = [
    { nameKey: 'nav.home', href: '/' },
    { nameKey: 'nav.about', href: '/about' },
    { nameKey: 'nav.services', href: '/#services' },
    { nameKey: 'nav.tourPackages', href: '/#packages' },
    { nameKey: 'nav.vehicles', href: '/#fleet' },
    { nameKey: 'nav.faq', href: '/faq' },
    { nameKey: 'nav.contact', href: '/#contact' },
  ];

  return (
    <div className="space-y-3 text-left">
      <h4 className="text-sm font-black text-white uppercase tracking-wider">{t('footer.quickLinks', 'Quick Links')}</h4>
      <ul className="space-y-2 text-xs font-semibold text-slate-400">
        {links.map((link) => (
          <li key={link.nameKey}>
            <Link to={link.href} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span className="text-amber-500">›</span> {t(link.nameKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterServicesLinks() {
  const { t } = useTranslation();
  const services = [
    { nameKey: 'services.carRentalOutstation', href: '/#services' },
    { nameKey: 'services.busRentalVolvo', href: '/#services' },
    { nameKey: 'services.tempoMaharaja', href: '/#services' },
    { nameKey: 'services.airportExpress', href: '/#services' },
    { nameKey: 'services.corporateMobility', href: '/#services' },
    { nameKey: 'services.holidayPackages', href: '/#packages' },
    { nameKey: 'services.weddingConvoy', href: '/#services' },
  ];

  return (
    <div className="space-y-3 text-left">
      <h4 className="text-sm font-black text-white uppercase tracking-wider">{t('footer.ourServices', 'Our Services')}</h4>
      <ul className="space-y-2 text-xs font-semibold text-slate-400">
        {services.map((svc) => (
          <li key={svc.nameKey}>
            <Link to={svc.href} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span className="text-blue-500">›</span> {t(svc.nameKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
