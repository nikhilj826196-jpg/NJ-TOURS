import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Car, 
  Bus, 
  Compass, 
  Building2, 
  Plane, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Lock,
  Headphones,
  UserCheck,
  BadgePercent,
  ThumbsUp,
  Star
} from 'lucide-react';
import { COMPANY_INFO } from '../data/toursData';

export default function Footer() {
  const { t } = useTranslation();
  
  const phoneDigits = COMPANY_INFO.phone ? COMPANY_INFO.phone.replace(/[^0-9]/g, '') : '919322512345';

  const quickLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.about', 'About Us'), path: '/about' },
    { name: t('nav.services', 'Services'), path: '/#services' },
    { name: t('nav.fleet', 'Fleet'), path: '/#fleet' },
    { name: t('nav.tourPackages', 'Tour Packages'), path: '/#packages' },
    { name: t('nav.gallery', 'Gallery'), path: '/#gallery' },
    { name: t('nav.faq', 'FAQ'), path: '/faq' },
    { name: t('nav.contact', 'Contact'), path: '/#contact' }
  ];

  const services = [
    { name: t('services.items.carRental.title', 'Car Rental'), icon: Car, path: '/#services' },
    { name: t('services.items.busRental.title', 'Bus Rental'), icon: Bus, path: '/#services' },
    { name: t('services.items.tempo.title', 'Tempo Traveller'), icon: Compass, path: '/#services' },
    { name: 'Corporate Transport', icon: Building2, path: '/#services' },
    { name: 'Airport Transfer', icon: Plane, path: '/#services' },
    { name: 'Holiday Packages', icon: Sparkles, path: '/#packages' },
    { name: 'Wedding Transport', icon: Heart, path: '/#services' },
    { name: 'School Trips', icon: GraduationCap, path: '/#services' }
  ];

  const trustBadges = [
    { icon: ShieldCheck, text: "Verified Business" },
    { icon: Lock, text: "Secure Booking" },
    { icon: Headphones, text: "24×7 Support" },
    { icon: UserCheck, text: "Licensed Drivers" },
    { icon: Compass, text: "GPS Enabled Fleet" },
    { icon: BadgePercent, text: "No Hidden Charges" },
    { icon: ThumbsUp, text: "100% Customer Satisfaction" }
  ];

  const socials = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      hoverColor: 'group-hover:text-[#1877F2]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      hoverColor: 'group-hover:text-[#E4405F]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 .013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      hoverColor: 'group-hover:text-[#0A66C2]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      hoverColor: 'group-hover:text-[#FF0000]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/${phoneDigits}`,
      hoverColor: 'group-hover:text-[#25D366]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'Twitter (X)',
      url: 'https://twitter.com',
      hoverColor: 'group-hover:text-[#1DA1F2]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#070B1A] text-slate-400 py-14 border-t border-[#1F2937] font-sans text-[15px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 space-y-14">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 text-center md:text-left">
          
          {/* Column 1: Company Section */}
          <div className="space-y-5 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="NJ Tours Logo"
                className="w-12 h-12 rounded-xl object-cover border border-[#F97316]/40 bg-[#070B1A]"
              />
              <div className="flex flex-col text-center md:text-left gap-0.5">
                <span className="font-black text-xl tracking-wide text-[#F97316] uppercase leading-tight font-serif">
                  NJ TOURS
                </span>
                <span className="font-bold text-[11px] text-white tracking-tight leading-tight">
                  {COMPANY_INFO.fullForm}
                </span>
                <span className="font-bold text-[9px] text-[#FB923C] tracking-wider uppercase leading-tight">
                  {COMPANY_INFO.subTagline}
                </span>
              </div>
            </Link>
            
            <p className="text-[15px] leading-relaxed text-slate-400 font-normal max-w-[320px]">
              <strong>{t('footer.tagline', 'Your Journey, Our Responsibility.')}</strong>
              <br className="mb-2"/>
              Premium Tours & Travels company providing Car Rental, Bus Rental, Tempo Traveller, Corporate Transport, Airport Transfers and Holiday Packages across India.
            </p>

            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-3.5 py-1.5 rounded-full select-none">
              <span className="text-xs font-bold text-[#F97316] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F97316] text-[#F97316]" /> 4.9 Rating
              </span>
              <span className="w-1 h-1 bg-slate-500 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-300">50,000+ Happy Customers</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-serif tracking-wider text-[22px] border-b border-[#1F2937] pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-[15px] font-medium flex flex-col items-center md:items-start">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-[#F97316] hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#F97316] opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden md:inline-block" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-serif tracking-wider text-[22px] border-b border-[#1F2937] pb-2">
              Services
            </h4>
            <ul className="space-y-2.5 text-[15px] font-medium flex flex-col items-center md:items-start">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <li key={service.name}>
                    <Link 
                      to={service.path} 
                      className="hover:text-[#F97316] hover:translate-x-1.5 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <IconComponent className="w-4 h-4 text-slate-500 group-hover:text-[#F97316] transition-colors duration-300" />
                      <span>{service.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-serif tracking-wider text-[22px] border-b border-[#1F2937] pb-2">
              Contact
            </h4>
            <div className="space-y-3.5 text-[15px] font-medium text-slate-300 flex flex-col items-center md:items-start">
              <a 
                href={`tel:${COMPANY_INFO.phone?.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-[#F97316] font-bold hover:underline"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a 
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2.5 hover:text-[#F97316] transition-colors duration-300 max-w-full truncate"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">{COMPANY_INFO.email}</span>
              </a>
              <div className="flex items-center md:items-start justify-center md:justify-start gap-2.5 leading-relaxed text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address || "National Journey HQ, Pune, Maharashtra"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Open 24×7</span>
              </div>
              <div className="pt-1">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider inline-block">
                  24×7 Support Badge
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Badges Chips Row */}
        <div className="border-t border-[#1F2937] pt-8 flex flex-wrap items-center justify-center gap-3">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="bg-[#111827] px-4 py-2 rounded-full border border-[#1F2937] flex items-center gap-2 select-none hover:border-[#F97316]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              >
                <Icon className="w-4 h-4 text-[#F97316] shrink-0" />
                <span className="text-[11px] font-bold text-slate-300 leading-tight">
                  {badge.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Social Icons Strip & Bottom Bar Divider */}
        <div className="border-t border-[#1F2937] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Secure Global Connect
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Connect with us for active promotions, trip stories, and daily packages updates.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="group w-9 h-9 rounded-full bg-[#111827] text-slate-400 hover:text-white flex items-center justify-center border border-[#1F2937] hover:border-slate-700 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:-translate-y-1 shadow-md hover:shadow-orange-500/10 shrink-0"
              >
                <span className={`transition-colors duration-300 ${s.hoverColor}`}>{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-8 border-t border-[#1F2937] flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 font-semibold text-[11px]">
          <div className="text-center md:text-left space-y-0.5">
            <div>
              © {new Date().getFullYear()} NJ Tours. All rights reserved.
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              Designed & Developed by NJ Tours
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#F97316] transition-colors duration-300">Privacy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#F97316] transition-colors duration-300">Terms</a>
            <a href="#refund" onClick={(e) => e.preventDefault()} className="hover:text-[#F97316] transition-colors duration-300">Refund</a>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-[#F97316] transition-colors duration-300">Cookies</a>
            <a href="#sitemap" onClick={(e) => e.preventDefault()} className="hover:text-[#F97316] transition-colors duration-300">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
