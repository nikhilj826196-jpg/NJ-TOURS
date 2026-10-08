import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Car,
  Compass,
  ArrowRight,
  Star,
  MapPin,
  BadgeCheck,
  Users,
  Navigation,
  ChevronDown
} from 'lucide-react';
import BookingSearchCard from './BookingSearchCard';
import { COMPANY_INFO } from '../data/toursData';

export default function HeroSection({ onSearch, onOpenBooking }) {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center bg-slate-900 text-[#0F172A] overflow-hidden">

      {/* Cinematic Scenic Background Image with High Visibility */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="NJ Tours Highway Travel Background"
          className="w-full h-full object-cover object-center opacity-45 filter brightness-105 contrast-110 scale-105"
        />
        {/* Balanced Light Overlay for Crisp Text & Rich Image Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-[#F1F5F9]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]" />
      </div>

      {/* Ambient Color Glows */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-orange-500/15 via-amber-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-0 w-[550px] h-[550px] bg-gradient-to-tr from-blue-500/10 to-orange-500/5 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="relative max-w-[1280px] mx-auto px-6 w-full space-y-16">

        {/* Top Hero Layout: Text & Image Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* Left Text Column (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* 1. Google Rating Badge */}
            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs font-bold text-slate-800 shadow-md shadow-slate-200/60 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300/80 transition-all duration-300 select-none group cursor-default"
            >
              {/* Animated Stars */}
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.6,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.6)]" />
                  </motion.div>
                ))}
              </div>

              <div className="h-3.5 w-[1px] bg-slate-200" />

              <span className="text-slate-900 font-extrabold text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                <span className="text-orange-600 font-black">4.9</span>
                <span className="text-slate-700 font-bold">Google Rating</span>
                <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">(1,250+ Reviews)</span>
              </span>
            </motion.div>

            {/* 2. Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-serif">
              Your Journey, <br />
              <span className="text-[#FF8C00] font-serif">
                Our Responsibility.
              </span>
            </h1>

            {/* 3. Subtitle */}
            <p className="text-slate-700 text-[18px] sm:text-[20px] font-semibold leading-[1.7] max-w-xl">
              Safe, comfortable and reliable travel solutions for every journey across India.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenBooking}
                className="w-full sm:w-auto bg-[#FF8C00] hover:bg-[#E07B00] text-white font-black text-sm px-8 py-3.5 rounded-[14px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 btn-ripple-white relative overflow-hidden"
              >
                <Car className="w-4.5 h-4.5 text-white" />
                <span>Book Now</span>
              </motion.button>

              <motion.a
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/vehicles"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm px-7 py-3.5 rounded-[14px] border border-[#E2E8F0] hover:border-[#0B5ED7]/50 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer btn-ripple-orange relative overflow-hidden text-center"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4 text-[#0B5ED7] group-hover:translate-x-2 transition-transform duration-300" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Image Column (6 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px]">

              {/* Main Image Wrapper Card */}
              <div className="relative rounded-[20px] overflow-hidden border border-[#E5E7EB] shadow-lg bg-white p-3.5">
                <div className="relative rounded-[16px] overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                    alt="NJ Tours Premium Luxury Coach"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Verified Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-[#F97316] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Verified Fleet</span>
                  </div>
                </div>

                {/* Instant Booking Status bar */}
                <div className="mt-3.5 p-3 rounded-[12px] bg-slate-50 border border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
                      <Navigation className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#64748B] font-medium">Instant Reservation</div>
                      <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                        Luxury Bus & Cab Fleet
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Check Cabs
                  </button>
                </div>
              </div>

              {/* Floating Stat 1: 50,000+ Customers (Top-Left) */}
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                className="hidden sm:flex absolute -top-5 -left-6 bg-white border border-[#E5E7EB] px-4 py-3 rounded-[16px] shadow-md items-center gap-3 z-20 cursor-default select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-[#0F172A] leading-none">50k+</div>
                  <div className="text-[10px] font-semibold text-[#64748B] mt-0.5">Happy Customers</div>
                </div>
              </motion.div>

              {/* Floating Stat 2: 250+ Vehicles (Middle-Right) */}
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                className="hidden sm:flex absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white border border-[#E5E7EB] px-4 py-3 rounded-[16px] shadow-md items-center gap-3 z-20 cursor-default select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-[#0F172A] leading-none">{COMPANY_INFO.fleetSize || "250"}+</div>
                  <div className="text-[10px] font-semibold text-[#64748B] mt-0.5">Luxury Fleet</div>
                </div>
              </motion.div>

              {/* Floating Stat 3: 150+ Cities (Bottom-Left) */}
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                className="hidden sm:flex absolute -bottom-5 -left-6 bg-white border border-[#E5E7EB] px-4 py-3 rounded-[16px] shadow-md items-center gap-3 z-20 cursor-default select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-[#0F172A] leading-none">{COMPANY_INFO.citiesCovered || 150}+</div>
                  <div className="text-[10px] font-semibold text-[#64748B] mt-0.5">Cities Covered</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* Booking Search Widget (Integrated cleanly below split grid) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-20 pt-4"
        >
          <BookingSearchCard onSearch={onSearch} />
        </motion.div>

        {/* Scroll Indicator */}
        <div className="flex justify-center items-center pt-8">
          <motion.a
            href="#services"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#F97316] select-none"
          >
            <span>Explore NJ Services</span>
            <ChevronDown className="w-4 h-4" />
          </motion.a>
        </div>

      </div>

      {/* Wave Transition Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none select-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] fill-[#F8FAFC]"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,22,86.43,35.43,158.4,68.25,241,71.4,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}
