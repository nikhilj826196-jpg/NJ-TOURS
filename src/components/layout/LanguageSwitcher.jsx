import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ scrolled }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🌐' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🌐' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center rounded-[12px] sm:rounded-[14px] border transition-all duration-300 shadow-sm shrink-0 cursor-pointer ${
          scrolled 
            ? 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-slate-200/90 text-[#0F172A] bg-slate-50/80 hover:bg-white hover:border-[#F97316]' 
            : 'w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] border-white/20 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-[#F97316]'
        }`}
      >
        <Globe className="w-4.5 h-4.5 text-[#F97316] shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-[16px] shadow-xl border border-[#E5E7EB] py-1.5 z-50 animate-fadeIn text-[#0F172A]">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 text-left">
            Select Language
          </div>

          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors ${
                    isSelected ? 'bg-orange-50 text-[#F97316] font-black' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F97316]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
