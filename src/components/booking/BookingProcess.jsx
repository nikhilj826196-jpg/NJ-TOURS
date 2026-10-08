import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, CheckCircle, CreditCard, Compass } from 'lucide-react';

export default function BookingProcess() {
  const { t } = useTranslation();

  const steps = [
    {
      num: '01',
      titleKey: 'booking.steps.step1.title',
      descKey: 'booking.steps.step1.desc',
      icon: Search,
    },
    {
      num: '02',
      titleKey: 'booking.steps.step2.title',
      descKey: 'booking.steps.step2.desc',
      icon: CheckCircle,
    },
    {
      num: '03',
      titleKey: 'booking.steps.step3.title',
      descKey: 'booking.steps.step3.desc',
      icon: CreditCard,
    },
    {
      num: '04',
      titleKey: 'booking.steps.step4.title',
      descKey: 'booking.steps.step4.desc',
      icon: Compass,
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          {t('booking.processTitle', 'Simple 4-Step Booking Process')}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {t('booking.processSubtitle', 'Book your trip in just four easy steps.')}
        </p>
      </div>

      {/* 4 Steps Grid (Equal width & equal height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative group bg-slate-50/60 hover:bg-white rounded-3xl p-6 border border-gray-200/80 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between h-full text-left"
            >
              {/* Top Row: Large Icon (48px box) & Step Number Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black tracking-widest text-slate-400 group-hover:text-orange-500 bg-white group-hover:bg-orange-500/10 px-3 py-1 rounded-full border border-gray-200/60 group-hover:border-orange-500/20 transition-colors">
                  {step.num}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1 flex flex-col justify-end">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-500 transition-colors font-button">
                  {t(step.titleKey)}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
