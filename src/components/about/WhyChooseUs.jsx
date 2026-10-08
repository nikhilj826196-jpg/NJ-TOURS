import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, Radio, Sparkles, Tag, Headphones, Clock, Users, Shield } from 'lucide-react';

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const features = [
    { titleKey: 'about.features.professionalDrivers.title', descKey: 'about.features.professionalDrivers.desc', icon: UserCheck },
    { titleKey: 'about.features.gpsEnabled.title', descKey: 'about.features.gpsEnabled.desc', icon: Radio },
    { titleKey: 'about.features.sanitizedFleet.title', descKey: 'about.features.sanitizedFleet.desc', icon: Sparkles },
    { titleKey: 'about.features.affordablePricing.title', descKey: 'about.features.affordablePricing.desc', icon: Tag },
    { titleKey: 'about.features.customerSupport.title', descKey: 'about.features.customerSupport.desc', icon: Headphones },
    { titleKey: 'about.features.onTimePickup.title', descKey: 'about.features.onTimePickup.desc', icon: Clock },
    { titleKey: 'about.features.experiencedTeam.title', descKey: 'about.features.experiencedTeam.desc', icon: Users },
    { titleKey: 'about.features.secureBooking.title', descKey: 'about.features.secureBooking.desc', icon: Shield },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t('about.whyChooseUsTitle') || 'Why Choose NJ Tours?'}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            {t('about.whyChooseUsSubtitle') || "Discover what sets National Journey apart as India's premier transport service"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-500/50 hover:bg-white transition-all space-y-2.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">{t(f.titleKey)}</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">{t(f.descKey)}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
