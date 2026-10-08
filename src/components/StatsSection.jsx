import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { COMPANY_INFO } from '../data/toursData';

function AnimatedCounter({ value, prefix = "", suffix = "", className = "" }) {
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('en-IN'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        if (!hasAnimated) {
          const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;
          animate(count, numericValue, { duration: 2, ease: "easeOut" });
          setHasAnimated(true);
        }
      }}
      className={className}
    >
      {prefix}<motion.span>{rounded}</motion.span>{suffix}
    </motion.div>
  );
}

export default function StatsSection() {
  const { t } = useTranslation();
  return (
    <section className="py-8 bg-slate-950 text-white border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center items-center">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <AnimatedCounter 
              value={COMPANY_INFO.happyCustomers} 
              className="text-2xl font-bold text-amber-400"
            />
            <div className="text-left text-xs font-bold text-slate-300 leading-tight whitespace-pre-line">
              {t("stats.happyCustomers")}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <AnimatedCounter 
              value={COMPANY_INFO.fleetSize} 
              suffix="+"
              className="text-2xl font-bold text-blue-400"
            />
            <div className="text-left text-xs font-bold text-slate-300 leading-tight">
              {t("stats.vehicles")}
            </div>
          </div>

          {/* Center Gold NJ Emblem */}
          <div className="hidden lg:flex items-center justify-center">
            <img src="/logo.png" alt="NJ Logo" className="w-12 h-12 rounded-xl object-cover border border-amber-500/40" />
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <AnimatedCounter 
              value={COMPANY_INFO.tripsCompleted} 
              className="text-2xl font-bold text-emerald-400"
            />
            <div className="text-left text-xs font-bold text-slate-300 leading-tight whitespace-pre-line">
              {t("stats.tripsCompleted")}
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <AnimatedCounter 
              value={COMPANY_INFO.citiesCovered} 
              suffix="+"
              className="text-2xl font-bold text-purple-400"
            />
            <div className="text-left text-xs font-bold text-slate-300 leading-tight whitespace-pre-line">
              {t("stats.citiesCovered")}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
