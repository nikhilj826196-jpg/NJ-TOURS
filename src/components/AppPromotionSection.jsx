import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Smartphone, MapPin, Bell, ShieldCheck, Radio } from 'lucide-react';

export default function AppPromotionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      
      {/* Section Container */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Badges */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-extrabold px-4 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" /> {t('appPromo.badge', 'Next-Gen Mobile Mobility')}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t('appPromo.title1', 'Download the ')}<span className="bg-gradient-to-r from-amber-400 via-amber-200 to-blue-400 bg-clip-text text-transparent">NJ Tours</span>{t('appPromo.title2', ' App')}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-xl">
              {t('appPromo.desc', 'Book outstation cabs, track driver location in real-time, generate digital GST invoices, and get instant 24x7 SOS emergency support — all from your phone.')}
            </p>

            {/* App Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('appPromo.features.tracking.title', 'Live Satellite Tracking')}</h4>
                  <p className="text-xs text-slate-400">{t('appPromo.features.tracking.desc', 'Share trip ETA with family')}</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-start gap-3 hover:border-blue-400/50 hover:bg-slate-800 transition-all duration-300">
                <Bell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('appPromo.features.notifications.title', 'Instant Notifications')}</h4>
                  <p className="text-xs text-slate-400">{t('appPromo.features.notifications.desc', 'Driver & cab arrival updates')}</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-start gap-3 hover:border-emerald-400/50 hover:bg-slate-800 transition-all duration-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('appPromo.features.sos.title', 'SOS Emergency Alert')}</h4>
                  <p className="text-xs text-slate-400">{t('appPromo.features.sos.desc', 'Direct 24x7 control room hotline')}</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-start gap-3 hover:border-purple-400/50 hover:bg-slate-800 transition-all duration-300">
                <Radio className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('appPromo.features.gst.title', 'Digital GST Invoices')}</h4>
                  <p className="text-xs text-slate-400">{t('appPromo.features.gst.desc', 'Instant PDF download after trip')}</p>
                </div>
              </div>
            </div>

            {/* App Store Download Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => alert("Google Play Store Download link initiated!")}
                className="bg-slate-800 hover:bg-slate-700 text-white p-3 px-5 rounded-xl border border-slate-700 shadow-sm flex items-center gap-3 transition-colors"
              >
                <div className="text-xl">▶</div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{t('appPromo.store.getItOn', 'GET IT ON')}</div>
                  <div className="text-sm font-bold text-white">{t('appPromo.store.googlePlay', 'Google Play')}</div>
                </div>
              </button>

              <button
                onClick={() => alert("Apple App Store Download link initiated!")}
                className="bg-slate-800 hover:bg-slate-700 text-white p-3 px-5 rounded-xl border border-slate-700 shadow-sm flex items-center gap-3 transition-colors"
              >
                <div className="text-xl"></div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{t('appPromo.store.downloadOn', 'DOWNLOAD ON THE')}</div>
                  <div className="text-sm font-bold text-white">{t('appPromo.store.appStore', 'App Store')}</div>
                </div>
              </button>
            </div>

          </motion.div>

          {/* Right Mobile Mockup Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-72 sm:w-80 h-[560px] bg-slate-950 rounded-[45px] p-4 border-4 border-slate-700 shadow-2xl ring-1 ring-white/20 flex flex-col justify-between">
              
              {/* Phone Speaker Notch */}
              <div className="w-28 h-5 bg-slate-900 mx-auto rounded-b-2xl mb-4 border-b border-slate-800 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Phone Screen UI */}
              <div className="bg-slate-900 rounded-[30px] p-4 flex-1 flex flex-col justify-between overflow-hidden border border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 font-black text-xs flex items-center justify-center text-white">NJ</div>
                      <span className="text-xs font-bold text-white">{t('footer.company', 'National Journey')}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">{t('appPromo.phoneUi.live', 'LIVE')}</span>
                  </div>

                  <div className="bg-blue-600 rounded-2xl p-3 text-white">
                    <div className="text-[10px] opacity-80 uppercase font-bold">{t('appPromo.phoneUi.activeBooking', 'Active Booking #NJ892')}</div>
                    <div className="text-sm font-extrabold">{t('appPromo.phoneUi.route', 'Mumbai ➔ Mahabaleshwar')}</div>
                    <div className="text-xs text-amber-300 font-semibold mt-1">{t('appPromo.phoneUi.driverAssigned', 'MH 04 ET 4020 • Driver Assigned')}</div>
                  </div>

                  <div className="bg-slate-800 rounded-2xl p-3 text-xs space-y-2 border border-slate-700">
                    <div className="flex justify-between text-slate-300">
                      <span>{t('appPromo.phoneUi.pickupTime', 'Pickup Time')}</span>
                      <strong className="text-white">{t('appPromo.phoneUi.timeToday', '07:30 AM Today')}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('appPromo.phoneUi.estFare', 'Estimated Fare')}</span>
                      <strong className="text-amber-400">₹ 3,450</strong>
                    </div>
                  </div>

                  <div className="h-28 rounded-2xl overflow-hidden relative border border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=500&q=80"
                      alt="Map View"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                      <span className="text-[10px] bg-slate-900 text-amber-400 px-3 py-1 rounded-full font-extrabold shadow">{t('appPromo.phoneUi.trackingActive', '📍 Live Tracking Active')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500 text-slate-950 text-xs font-extrabold py-2.5 rounded-xl text-center shadow">
                  {t('appPromo.phoneUi.cancelSos', 'CANCEL / SOS SUPPORT')}
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-32 h-1 bg-slate-600 mx-auto mt-3 rounded-full" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
