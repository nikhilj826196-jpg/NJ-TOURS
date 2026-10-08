import React from 'react';
import { useTranslation } from 'react-i18next';
import SocialLinks from '../layout/SocialLinks';

export default function TeamSection() {
  const { t } = useTranslation();
  const team = [
    {
      nameKey: 'about.team.members.nikhil.name',
      roleKey: 'about.team.members.nikhil.role',
      descKey: 'about.team.members.nikhil.desc',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    },
    {
      nameKey: 'about.team.members.rajesh.name',
      roleKey: 'about.team.members.rajesh.role',
      descKey: 'about.team.members.rajesh.desc',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    },
    {
      nameKey: 'about.team.members.priya.name',
      roleKey: 'about.team.members.priya.role',
      descKey: 'about.team.members.priya.desc',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    },
    {
      nameKey: 'about.team.members.amitabh.name',
      roleKey: 'about.team.members.amitabh.role',
      descKey: 'about.team.members.amitabh.desc',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("about.team.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            {t("about.team.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {team.map((member) => (
              <div
                key={member.nameKey}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={member.image}
                      alt={t(member.nameKey)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base font-black text-white">{t(member.nameKey)}</h3>
                      <p className="text-xs font-bold text-amber-400">{t(member.roleKey)}</p>
                    </div>
                  </div>
  
                  <div className="p-5">
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {t(member.descKey)}
                    </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <SocialLinks />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
