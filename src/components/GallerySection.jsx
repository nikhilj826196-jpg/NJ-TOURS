import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/toursData';

export default function GallerySection() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Vehicles', 'Destinations'];

  const filteredItems = filter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.categoryKey === (filter === 'Vehicles' ? 'gallery.categories.vehicles' : 'gallery.categories.destinations'));

  return (
    <section id="gallery" className="py-20 bg-white text-[#0F172A] border-t border-[#E5E7EB] font-sans">
      <div className="max-w-[1280px] mx-auto px-6 space-y-10">
        
        {/* Title & Filter Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-[#F97316]/20">
              <Camera className="w-4 h-4 text-[#F97316]" />
              <span>Tour Visual Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight font-serif">
              {t('gallery.title', 'Moments & Destinations')}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`text-xs font-bold px-4 py-2.5 rounded-[14px] border transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-[#E5E7EB]'
                }`}
              >
                {cat === 'All' ? t('destinations.viewAll', 'All Photos') : cat === 'Vehicles' ? t('nav.vehicles', 'Vehicles') : t('nav.tourPackages', 'Destinations')}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={item.id}
                className="relative rounded-[20px] overflow-hidden shadow-sm border border-[#E5E7EB] group h-64 bg-slate-900 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={t(item.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest block mb-0.5">
                    {t(item.categoryKey)}
                  </span>
                  <h4 className="text-base font-bold leading-tight font-serif">{t(item.titleKey)}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
