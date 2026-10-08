import React from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, Users, Bus, Globe, Award, Sparkles } from 'lucide-react';

export default function Timeline() {
  const { t } = useTranslation();
  const milestones = [
    { year: '2012', titleKey: 'about.timeline.milestones.started.title', descKey: 'about.timeline.milestones.started.desc', icon: Rocket },
    { year: '2015', titleKey: 'about.timeline.milestones.customers1k.title', descKey: 'about.timeline.milestones.customers1k.desc', icon: Users },
    { year: '2018', titleKey: 'about.timeline.milestones.expansion.title', descKey: 'about.timeline.milestones.expansion.desc', icon: Bus },
    { year: '2021', titleKey: 'about.timeline.milestones.online.title', descKey: 'about.timeline.milestones.online.desc', icon: Globe },
    { year: '2024', titleKey: 'about.timeline.milestones.customers50k.title', descKey: 'about.timeline.milestones.customers50k.desc', icon: Award },
    { year: '2026', titleKey: 'about.timeline.milestones.platform.title', descKey: 'about.timeline.milestones.platform.desc', icon: Sparkles },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("about.timeline.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">{t("about.timeline.subtitle")}</p>
        </div>

        {/* Vertical Timeline with Icons */}
        <div className="relative border-l-2 border-blue-600 ml-4 sm:ml-32 space-y-10 text-left">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.year} className="relative pl-10 group">
                
                {/* Milestone Icon Badge */}
                <div className="absolute -left-[18px] top-0.5 w-9 h-9 rounded-full bg-blue-600 border-4 border-white shadow text-white flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Year Label */}
                <div className="sm:absolute sm:-left-28 sm:top-1 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-2 sm:mb-0">
                  {m.year}
                </div>

                {/* Content Card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-500 transition-all space-y-1">
                  <h3 className="text-base font-black text-slate-900">{t(m.titleKey)}</h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{t(m.descKey)}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
