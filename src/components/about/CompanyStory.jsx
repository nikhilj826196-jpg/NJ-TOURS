import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../../data/toursData';

export default function CompanyStory() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Established 2012</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {t('about.ourStory')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Founded with a singular vision to revolutionize road travel across India, <strong>{COMPANY_INFO.name} ({COMPANY_INFO.fullForm})</strong> started as a modest fleet of premium cabs. Over the last decade, our relentless commitment to customer safety, transparent pricing, and punctual service has transformed us into one of India’s most trusted mobility platforms.
            </p>

            <p className="text-slate-600 text-sm font-normal leading-relaxed">
              Whether it’s a family weekend getaway to Goa, a spiritual pilgrimage to Tirupati, or managing VIP corporate delegations in Volvo coaches, our 250+ verified vehicle fleet ensures every mile is smooth, comfortable, and memorable.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">Safety First</h4>
                  <p className="text-[11px] text-slate-500">24x7 telematics tracking & double verified drivers</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                <Award className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">Zero Hidden Tolls</h4>
                  <p className="text-[11px] text-slate-500">Clear itemized billing with GST invoices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Travel Illustration Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                alt="NJ Tours Fleet and Travel Story"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-1">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">National Journey Fleet</div>
                <div className="text-lg font-black">Connecting 150+ Cities Across India</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
