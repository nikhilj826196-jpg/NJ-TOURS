import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, ShieldCheck, FileCheck, UserCheck, Lightbulb, Clock } from 'lucide-react';

export default function CoreValues() {
  const { t } = useTranslation();
  const values = [
    { titleKey: 'about.coreValues.items.customer.title', descKey: 'about.coreValues.items.customer.desc', icon: HeartHandshake, color: 'text-rose-500 bg-rose-50' },
    { titleKey: 'about.coreValues.items.safety.title', descKey: 'about.coreValues.items.safety.desc', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { titleKey: 'about.coreValues.items.transparency.title', descKey: 'about.coreValues.items.transparency.desc', icon: FileCheck, color: 'text-amber-500 bg-amber-50' },
    { titleKey: 'about.coreValues.items.professionalism.title', descKey: 'about.coreValues.items.professionalism.desc', icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
    { titleKey: 'about.coreValues.items.innovation.title', descKey: 'about.coreValues.items.innovation.desc', icon: Lightbulb, color: 'text-purple-600 bg-purple-50' },
    { titleKey: 'about.coreValues.items.reliability.title', descKey: 'about.coreValues.items.reliability.desc', icon: Clock, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("about.coreValues.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            {t("about.coreValues.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.titleKey}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {t(v.titleKey)}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {t(v.descKey)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
