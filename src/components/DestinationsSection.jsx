import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Check, ArrowRight, Sparkles, Search, Compass, ShieldCheck, Heart, Coffee, Car, Hotel } from 'lucide-react';
import { DESTINATIONS } from '../data/toursData';

export default function DestinationsSection({ onSelectPackage }) {
  const { t } = useTranslation();

  // Search filter states
  const [searchDest, setSearchDest] = useState('');
  const [searchDuration, setSearchDuration] = useState('');
  const [searchBudget, setSearchBudget] = useState('');

  // Selected filter chips state
  const [selectedDest, setSelectedDest] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');

  const destinationsChips = [
    { value: 'All', key: 'destinations.viewAll' },
    { value: 'Maharashtra', key: 'destinations.categories.maharashtra' },
    { value: 'Goa', key: 'destinations.categories.goa' },
    { value: 'Kashmir', key: 'destinations.categories.kashmir' },
    { value: 'Himachal', key: 'destinations.categories.himachal' },
    { value: 'Kerala', key: 'destinations.categories.kerala' },
    { value: 'Rajasthan', key: 'destinations.categories.rajasthan' }
  ];

  const durationsChips = [
    { value: 'All', key: 'destinations.durations.all' },
    { value: '2 Days', key: 'destinations.durations.2days' },
    { value: '3 Days', key: 'destinations.durations.3days' },
    { value: '5 Days', key: 'destinations.durations.5days' },
    { value: '6 Days', key: 'destinations.durations.6days' }
  ];

  const budgetsChips = [
    { value: 'All', key: 'destinations.budgets.all' },
    { value: 'Under ₹10,000', key: 'destinations.budgets.under10k' },
    { value: '₹10k–₹25k', key: 'destinations.budgets.10k25k' },
    { value: '₹25k–₹50k', key: 'destinations.budgets.25k50k' },
    { value: 'Luxury', key: 'destinations.budgets.luxury' }
  ];

  const filteredPackages = DESTINATIONS.filter((pkg) => {
    const matchSearchDest = searchDest ? t(pkg.nameKey).toLowerCase().includes(searchDest.toLowerCase()) || t(pkg.categoryKey).toLowerCase().includes(searchDest.toLowerCase()) : true;
    const matchSearchDur = searchDuration ? t(pkg.durationKey).toLowerCase().includes(searchDuration.toLowerCase()) : true;
    const matchSearchBud = searchBudget ? pkg.price <= parseInt(searchBudget) : true;
    const matchChipDest = selectedDest === 'All' ? true : pkg.categoryKey.endsWith(selectedDest.toLowerCase());

    let matchChipDur = true;
    if (selectedDuration !== 'All') {
      const daysCount = parseInt(selectedDuration);
      matchChipDur = pkg.itineraryKeys && pkg.itineraryKeys.length === daysCount;
    }

    let matchChipBud = true;
    if (selectedBudget !== 'All') {
      if (selectedBudget === 'Under ₹10,000') matchChipBud = pkg.price < 10000;
      else if (selectedBudget === '₹10k–₹25k') matchChipBud = pkg.price >= 10000 && pkg.price <= 25000;
      else if (selectedBudget === '₹25k–₹50k') matchChipBud = pkg.price > 25000 && pkg.price <= 50000;
      else if (selectedBudget === 'Luxury') matchChipBud = pkg.price > 15000;
    }

    return matchSearchDest && matchSearchDur && matchSearchBud && matchChipDest && matchChipDur && matchChipBud;
  });

  return (
    <div id="packages" className="font-sans">

      {/* 1. PAGE HERO BANNER */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center bg-[#0F172A] text-white overflow-hidden text-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/70 to-[#0F172A]" />

        <div className="relative max-w-5xl mx-auto px-6 space-y-6 z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#F97316]/20">
              <Sparkles className="w-4 h-4" />
              <span>World-Class Holidays</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-serif text-white">
              {t('destinations.title', 'Holiday Tour Packages')}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-semibold max-w-2xl mx-auto">
              {t('destinations.subtitle', 'Fully customized private itineraries with professional chauffeur transport and hotel bookings.')}
            </p>
          </div>

          {/* Interactive Search Bar Widget */}
          <div className="bg-white p-4 rounded-[20px] border border-slate-200 max-w-4xl mx-auto shadow-xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-50 p-2.5 rounded-[14px] border border-slate-200">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('booking.destination', 'Destination')}</label>
              <input
                type="text"
                placeholder="Where to?"
                value={searchDest}
                onChange={(e) => setSearchDest(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-[14px] border border-slate-200">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('booking.estTime', 'Duration')}</label>
              <input
                type="text"
                placeholder="e.g. 5 Days"
                value={searchDuration}
                onChange={(e) => setSearchDuration(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-[14px] border border-slate-200">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-[14px] transition-all shadow flex items-center justify-center gap-2 hover:scale-102 cursor-pointer h-full py-4 sm:py-0"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Search Packages</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. FILTER & PACKAGES GRID */}
      <section className="py-20 bg-white text-[#0F172A] relative">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">

          {/* FILTER CHIPS GRID BOX */}
          <div className="bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-sm space-y-5 text-left">

            {/* Destination Filters */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('destinations.selectStateRegion', 'Select State/Region')}</span>
              <div className="flex flex-wrap gap-2">
                {destinationsChips.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => setSelectedDest(chip.value)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all border cursor-pointer ${selectedDest === chip.value
                        ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {t(chip.key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filters */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('destinations.tripDuration', 'Trip Duration')}</span>
              <div className="flex flex-wrap gap-2">
                {durationsChips.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => setSelectedDuration(chip.value)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all border cursor-pointer ${selectedDuration === chip.value
                        ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {t(chip.key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Filters */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('destinations.costBudgetRange', 'Cost / Budget Range')}</span>
              <div className="flex flex-wrap gap-2">
                {budgetsChips.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => setSelectedBudget(chip.value)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all border cursor-pointer ${selectedBudget === chip.value
                        ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {t(chip.key)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* PACKAGE CARDS GRID (3 Columns Desktop, 2 Tablet, 1 Mobile) */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((pkg) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  key={pkg.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-[20px] overflow-hidden border border-[#E5E7EB] hover:border-[#F97316]/50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative h-64 overflow-hidden bg-slate-900">
                      <img
                        src={pkg.image}
                        alt={t(pkg.nameKey)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-black text-amber-500 flex items-center gap-1 border border-white/10 shadow shadow-slate-950/20">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-[#0F172A]">{pkg.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">({pkg.reviews || 220})</span>
                      </div>

                      {/* Category State Tag */}
                      <div className="absolute top-4 right-4 bg-[#F97316] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#F97316]/50 shadow-md">
                        {t(pkg.categoryKey)}
                      </div>

                      {/* Duration Overlay */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-extrabold text-white">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span>{t(pkg.durationKey)}</span>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 pr-2">
                          <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#F97316] transition-colors leading-tight truncate font-serif">
                            {t(pkg.nameKey)}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="truncate">{t(pkg.categoryKey)}, India</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-400 line-through font-semibold">
                            ₹ {pkg.originalPrice.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xl font-black text-[#2563EB]">
                            ₹ {pkg.price.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block">{t('destinations.perPerson', 'Per Person')}</span>
                        </div>
                      </div>

                      {/* Features Inclusions */}
                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('destinations.inclusions', 'Holiday Inclusions')}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#2563EB] shrink-0" />
                            <span className="truncate">{t('destinations.transport', 'Transport')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hotel className="w-4 h-4 text-[#F97316] shrink-0" />
                            <span className="truncate">{t('destinations.hotel', 'Hotel stay')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="truncate">{t('destinations.meals', 'Meals')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-purple-500 shrink-0" />
                            <span className="truncate">{t('destinations.sightseeing', 'Sightseeing')}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card CTA Footer Buttons */}
                  <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className="bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-bold text-xs py-3 rounded-[14px] border border-[#E5E7EB] transition-colors cursor-pointer"
                    >
                      {t('destinations.viewDetails', 'View Details')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs py-3 rounded-[14px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>{t('destinations.bookNow', 'Book Now')}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
