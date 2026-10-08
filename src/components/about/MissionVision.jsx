import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Sparkles } from 'lucide-react';

export default function MissionVision() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Mission Glassmorphism Card */}
          <div className="glass-dark p-8 sm:p-10 rounded-[32px] border border-white/10 shadow-2xl space-y-4 hover:border-amber-500/50 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Target className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Our Commitment
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{t('about.mission')}</h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              "To provide safe, comfortable, affordable and memorable travel experiences for every customer through disciplined operations, transparent pricing, and 24x7 customer support."
            </p>
          </div>

          {/* Vision Glassmorphism Card */}
          <div className="glass-dark p-8 sm:p-10 rounded-[32px] border border-white/10 shadow-2xl space-y-4 hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Eye className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Our Aspiration
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{t('about.vision')}</h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              "To become India's most trusted Tours, Travels and Transport company through innovation, quality service, sustainable fleet practices and relentless customer satisfaction."
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
