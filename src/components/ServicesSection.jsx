import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Car, Bus, Compass, Plane, Building2, Sparkles, Heart, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../data/toursData';

const iconMap = {
  Car: Car,
  Bus: Bus,
  Compass: Compass,
  Plane: Plane,
  Building2: Building2,
  Sparkles: Sparkles,
  Heart: Heart,
  GraduationCap: GraduationCap
};

export default function ServicesSection({ onSelectService }) {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-20 bg-[#F8FAFC] text-[#0F172A] border-t border-[#E5E7EB] relative overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto px-6 relative space-y-16">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-3 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#F97316]/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>{t('services.comprehensiveSolutions', 'COMPREHENSIVE SOLUTIONS')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight font-serif leading-tight">
            {t('services.title', 'Our Services')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            {t('services.subtitle', 'Reliable Transport Solutions for Every Need')}
          </p>
        </motion.div>

        {/* 4-Column Desktop / 2-Column Tablet / 1-Column Mobile Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {SERVICES.map((svc) => {
            const IconComponent = iconMap[svc.icon] || Car;

            return (
              <motion.div
                key={svc.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectService(svc)}
                className="bg-white p-7 rounded-[20px] border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#F97316]/40 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Glowing top line accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] via-amber-400 to-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-5">
                  {/* Top Header: Icon & Optional Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/10 to-[#F97316]/20 text-[#F97316] border border-[#F97316]/15 flex items-center justify-center group-hover:from-[#F97316] group-hover:to-orange-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 shrink-0 shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {svc.badgeKey && (
                      <span className="bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                        {t(svc.badgeKey)}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#F97316] transition-colors duration-300 font-serif">
                      {t(svc.titleKey)}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {t(svc.descriptionKey)}
                    </p>
                  </div>

                  {/* Key Inclusions / Features List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{t('booking.driverIncluded', 'Professional Chauffeur')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{t('booking.tollIncluded', 'Toll & Taxes Included')}</span>
                    </div>
                  </div>
                </div>

                {/* Learn More Button CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F172A] group-hover:text-[#F97316] transition-colors duration-300">
                  <span className="font-button tracking-wide uppercase text-[11px] font-extrabold">Learn More</span>
                  <ArrowRight className="w-4 h-4 text-[#F97316] transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
