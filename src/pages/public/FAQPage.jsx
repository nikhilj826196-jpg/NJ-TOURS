import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const { t } = useTranslation();
  const faqs = [
    {
      q: "Are toll taxes, state driver allowances, and parking fees included in the fare?",
      a: "Our base fare estimates include the vehicle per-km charge and driver day allowance. Toll taxes, state border entry permits, and airport parking fees are payable directly at official booths or itemized transparently in your final bill."
    },
    {
      q: "How far in advance should I book a Tempo Traveller or Volvo Coach?",
      a: "For weekend family trips and peak wedding season, we recommend booking 3 to 7 days prior. However, emergency outstation cab bookings can be fulfilled within 60 minutes."
    },
    {
      q: "Are your drivers police-verified and safe for solo women & family travel?",
      a: "Yes! 100% of our chauffeurs undergo mandatory background verification, possess valid commercial licenses, and wear clean uniforms. All cabs feature live GPS satellite tracking."
    },
    {
      q: "What happens if a vehicle breaks down during an outstation trip?",
      a: "National Journey guarantees 100% trip continuity. In the rare event of mechanical issues, a replacement cab of identical or higher category is dispatched within 45 to 60 minutes."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="pt-32 pb-20 bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#F97316]/20">
            <HelpCircle className="w-4 h-4 text-[#F97316]" /> 
            <span>{t('faq.badge', 'Help & Guidance')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight font-serif">
            {t('faq.title', 'Frequently Asked Questions')}
          </h1>
          <p className="text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            {t('faq.subtitle', 'Everything you need to know about our outstation cab rentals, billing policy, and safety standards.')}
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm overflow-hidden transition-all duration-200">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 font-bold text-base text-[#0F172A] flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
              >
                <span className="font-serif">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#F97316] shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-1">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
