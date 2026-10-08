import React from 'react';
import ContactSection from '../../components/ContactSection';

export default function ContactUs() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white py-16 px-4 sm:px-6 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-[#0B5ED7]_1px,transparent_1px] [background-size:20px_20px] pointer-events-none" />
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Contact NJ Tours</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
          Get in touch with our head office or reach our 24/7 operational control room
        </p>
      </div>

      {/* Form & Map Section */}
      <ContactSection />

    </div>
  );
}
