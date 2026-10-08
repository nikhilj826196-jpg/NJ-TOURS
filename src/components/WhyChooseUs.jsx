import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UserCheck, Headphones, Navigation, DollarSign, Shield, ThumbsUp, Radio, MapPin, CheckCircle } from 'lucide-react';

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: UserCheck,
      title: t('about.features.drivers.title', "Professional & Uniformed Drivers"),
      description: t('about.features.drivers.desc', "Police verified, highly trained chauffeurs fluent in local languages and route expertise for stress-free travel."),
      badge: t('about.features.drivers.badge', "Verified 100%")
    },
    {
      icon: Headphones,
      title: t('about.features.support.title', "24×7 Dedicated Support"),
      description: t('about.features.support.desc', "Round the clock phone & WhatsApp assistance for route queries, booking modifications, or emergency dispatch."),
      badge: t('about.features.support.badge', "Always Active")
    },
    {
      icon: Navigation,
      title: t('about.features.gps.title', "Real-time Live GPS Tracking"),
      description: t('about.features.gps.desc', "Every vehicle is equipped with live satellite GPS tracking & SOS emergency button for ultimate peace of mind."),
      badge: t('about.features.gps.badge', "Smart Tech")
    },
    {
      icon: DollarSign,
      title: t('about.features.pricing.title', "Affordable & Transparent Pricing"),
      description: t('about.features.pricing.desc', "No hidden charges or unexpected toll surcharges. Clear itemized bill provided before trip start."),
      badge: t('about.features.pricing.badge', "Best Rates")
    },
    {
      icon: Shield,
      title: t('about.features.fleet.title', "Safe & Sanitized Fleet"),
      description: t('about.features.fleet.desc', "Deep sanitized cabs, speed governors, seatbelts for all passengers, and regular multi-point safety audits."),
      badge: t('about.features.fleet.badge', "Safety First")
    },
    {
      icon: ThumbsUp,
      title: t('about.features.punctual.title', "Trusted & Punctual Service"),
      description: t('about.features.punctual.desc', "99.8% on-time pickup record across 150+ cities in India with guaranteed vehicle replacement on backup."),
      badge: t('about.features.punctual.badge', "On-Time Guarantee")
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
            {t('about.whyChooseUsAdvantage', 'The National Journey Advantage')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('about.whyChooseUsTitle', 'Why Choose NJ Tours?')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            {t('about.whyChooseUsSubtitle', "We don't just provide vehicles — we deliver memorable, safe, and world-class journeys backed by modern technology.")}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 border border-blue-500/10 flex items-center justify-center transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:shadow-blue-500/25 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('about.standardProtocol', 'Standard Quality Protocol')}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Live GPS Tracker Interactive Demo Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-slate-900 rounded-2xl p-7 text-white border border-slate-800"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5" />
                <span>{t('about.gpsDemo.badge', 'LIVE VEHICLE GPS TELEMATICS DEMO')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {t('about.gpsDemo.title', 'Track Your Cab & Driver Location Real-Time')}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                {t('about.gpsDemo.desc', "As soon as your booking is confirmed, receive a live SMS/WhatsApp tracking link to monitor your vehicle's speed, route, ETA, and driver phone details.")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400">{t('about.gpsDemo.driverStatus', 'Driver Status:')}</span> <strong className="text-emerald-400">{t('about.gpsDemo.onDuty', 'On Duty (Verified)')}</strong>
                </div>
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400">{t('about.gpsDemo.currentSpeed', 'Current Speed:')}</span> <strong className="text-amber-400">{t('about.gpsDemo.safeLimit', '62 km/h (Safe Limit)')}</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{t('about.gpsDemo.tripRoute', 'Trip: Mumbai ➔ Pune Express Highway')}</div>
                      <div className="text-[10px] text-slate-400">{t('about.gpsDemo.vehicleInfo', 'MH 12 AB 9822 • Innova Crysta')}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full border border-blue-500/40 font-bold">
                    {t('about.gpsDemo.eta', 'ETA: 42 Mins')}
                  </span>
                </div>

                {/* Simulated Route Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300">
                    <span>{t('about.gpsDemo.mumbai', 'Mumbai (Bandra)')}</span>
                    <span className="text-amber-400">{t('about.gpsDemo.lonavala', 'Lonavala Ghat')}</span>
                    <span>{t('about.gpsDemo.pune', 'Pune (Swargate)')}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 w-[68%] rounded-full relative" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
