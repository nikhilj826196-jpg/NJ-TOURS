import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, FileCheck, CheckCircle2, Lock, Shield } from 'lucide-react';

export default function Certifications() {
  const { t } = useTranslation();
  const certs = [
    { titleKey: 'about.certifications.items.gst.title', descKey: 'about.certifications.items.gst.desc', icon: FileCheck },
    { titleKey: 'about.certifications.items.permit.title', descKey: 'about.certifications.items.permit.desc', icon: Award },
    { titleKey: 'about.certifications.items.drivers.title', descKey: 'about.certifications.items.drivers.desc', icon: ShieldCheck },
    { titleKey: 'about.certifications.items.registered.title', descKey: 'about.certifications.items.registered.desc', icon: CheckCircle2 },
    { titleKey: 'about.certifications.items.insured.title', descKey: 'about.certifications.items.insured.desc', icon: Lock },
  ];

  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-black px-3.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-400" /> {t("about.certifications.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{t("about.certifications.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold">{t("about.certifications.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left">
          {certs.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.titleKey} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-400 transition-all space-y-3 group shadow-xl hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-white leading-snug">{t(c.titleKey)}</h3>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">{t(c.descKey)}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
