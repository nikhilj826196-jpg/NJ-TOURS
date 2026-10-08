import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, ThumbsUp, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/toursData';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-[#F8FAFC] text-[#0F172A] border-t border-[#E5E7EB] relative overflow-hidden font-sans">
      
      <div className="max-w-[1280px] mx-auto px-6 space-y-12 relative z-10">
        
        {/* Section Title & Google Reviews Badge Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="text-left space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#F97316]/20 select-none">
              <ThumbsUp className="w-4 h-4" />
              <span>{t('testimonials.verifiedFeedback', 'Verified Customer Feedback')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight font-serif leading-tight">
              {t('testimonials.title', 'Trusted by 50,000+ Travelers')}
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {t('testimonials.subtitle', 'Read authentic reviews from families, corporate delegates, and holiday travelers across India.')}
            </p>
          </div>

          {/* Google Reviews Trust Card */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E5E7EB] flex items-center gap-4 shrink-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-xl text-white shadow-inner">
              G
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="text-sm font-black text-[#0F172A] ml-1">4.9 / 5.0</span>
              </div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">{t('testimonials.basedOnReviews', 'Based on 2,450+ Google Reviews')}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('testimonials.verifiedProfile', 'Verified Business Profile')}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid (2 Columns Desktop/Tablet, 1 Mobile) */}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          {TESTIMONIALS.map((tItem) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
              }}
              whileHover={{ y: -6 }}
              key={tItem.id}
              className="bg-white p-6 rounded-[20px] border border-[#E5E7EB] space-y-4 text-left relative shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-slate-100 absolute top-6 right-6 pointer-events-none" />

              {/* Stars & Date */}
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(tItem.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
                <span className="text-xs font-bold text-slate-400 ml-2">{t(tItem.dateKey)}</span>
                <span className="bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#2563EB]/25 ml-auto">
                  {t('testimonials.googleVerified', 'Verified Check')}
                </span>
              </div>

              {/* Comment Quote */}
              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed italic">
                "{t(tItem.commentKey)}"
              </p>

              {/* Passenger Bio */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <img
                  src={tItem.avatar}
                  alt={t(tItem.nameKey)}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                    <span>{t(tItem.nameKey)}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-xs font-semibold text-[#F97316]">{t(tItem.tripKey)}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{t(tItem.locationKey)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
