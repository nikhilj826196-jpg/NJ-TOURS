import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Star,
  Users,
  Headphones,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { COMPANY_INFO } from '../data/toursData';

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tripType: 'Outstation Rental',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const topStats = [
    {
      icon: Star,
      value: "4.9 ★",
      label: t("contact.stats.rating", "Google Verified Rating"),
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      icon: Users,
      value: COMPANY_INFO.happyCustomers || "50,000+",
      label: t("contact.stats.customers", "Happy Customers"),
      color: "text-[#2563EB]",
      bgColor: "bg-blue-50"
    },
    {
      icon: Headphones,
      value: "24×7",
      label: t("contact.stats.support", "Dedicated Live Support"),
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Globe,
      value: `${COMPANY_INFO.citiesCovered || 150}+`,
      label: t("contact.stats.cities", "Cities Covered"),
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  const contactCards = [
    {
      id: "call",
      icon: Phone,
      title: t("contact.cards.callTitle", "Call Us"),
      value: COMPANY_INFO.phone,
      subtitle: t("contact.cards.callSub", "24×7 Customer Support"),
      href: `tel:${COMPANY_INFO.phone?.replace(/\s+/g, '')}`,
      gradient: "from-blue-500 to-blue-600",
      iconColor: "text-white"
    },
    {
      id: "email",
      icon: Mail,
      title: t("contact.cards.emailTitle", "Email"),
      value: COMPANY_INFO.email,
      subtitle: t("contact.cards.emailSub", "Quick Response within 30 Minutes"),
      href: `mailto:${COMPANY_INFO.email}`,
      gradient: "from-[#F97316] to-amber-500",
      iconColor: "text-white"
    },
    {
      id: "office",
      icon: MapPin,
      title: t("contact.cards.officeTitle", "Head Office"),
      value: COMPANY_INFO.fullForm || "National Journey HQ",
      subtitle: COMPANY_INFO.address || "Pune, Maharashtra",
      href: "#",
      gradient: "from-emerald-500 to-teal-600",
      iconColor: "text-white"
    },
    {
      id: "hours",
      icon: Clock,
      title: t("contact.cards.hoursTitle", "Working Hours"),
      value: t("contact.cards.days", "Monday - Sunday"),
      subtitle: t("contact.cards.open24", "Open 24 Hours"),
      href: "#",
      gradient: "from-purple-500 to-indigo-600",
      iconColor: "text-white"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("contact.badge", "24×7 HELPDESK & SUPPORT")}</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight font-serif">
            {t("contact.title", "Get In Touch")}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-[1.6] max-w-[600px] mx-auto text-center">
            {t("contact.subtitle", "We're available around the clock to help you plan your perfect journey across India.")}
          </p>
        </motion.div>

        {/* TOP STATS CARDS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16"
        >
          {topStats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{ y: -5 }}
                className="bg-white p-5 rounded-[20px] border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#F97316] transition-all duration-300 group flex items-center gap-4 text-left cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDE: 4 PREMIUM CARDS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-5 space-y-5"
          >
            {contactCards.map((card) => {
              const CardIcon = card.icon;
              const isCallCard = card.id === 'call';

              return (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white p-5 sm:p-6 rounded-[20px] border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#F97316] transition-all duration-300 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 text-left"
                >
                  <a href={card.href} className="flex items-center gap-4 min-w-0 flex-1 group/link">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105`}>
                      <CardIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${card.iconColor}`} />
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#F97316] block">
                        {card.title}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#0F172A] group-hover/link:text-[#F97316] transition-colors truncate">
                        {card.value}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 truncate">
                        {card.subtitle}
                      </p>
                    </div>
                  </a>

                  {isCallCard && (
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto border-t sm:border-t-0 border-slate-100">
                      <a
                        href={`tel:${COMPANY_INFO.phone?.replace(/\s+/g, '')}`}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all duration-300"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`https://wa.me/${COMPANY_INFO.phone?.replace(/[^0-9]/g, '')}?text=Hello%20NJ%20Tours,%20I%20want%20to%20inquire%20about%20booking%20a%20vehicle.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all duration-300"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* RIGHT SIDE: MODERN CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[20px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
          >
            {submitted ? (
              <div className="text-center py-16 space-y-5">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[14px] flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F172A]">
                  {t("contact.success.title", "Thank You! Inquiry Received")}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t("contact.success.desc1", "Dear")} <strong>{formData.name}</strong>, {t("contact.success.desc2", "our travel desk has logged your request for")} <strong>{formData.phone}</strong>. {t("contact.success.desc3", "An expert manager will reach out within 15-30 minutes.")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm px-8 py-3.5 rounded-[14px] shadow transition-colors inline-flex items-center gap-2"
                >
                  <span>{t("contact.success.button", "Send Another Message")}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">
                      {t("contact.form.title", "Send Us a Message")}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Fill out the details below for instant trip quotes & guidance.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                      {t("contact.form.name", "Full Name")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("contact.form.namePh", "e.g. Rajesh Kumar")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[14px] px-4 py-3.5 text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                      {t("contact.form.phone", "Phone Number")} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[14px] px-4 py-3.5 text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                      {t("contact.form.emailLabel", "Email Address")}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[14px] px-4 py-3.5 text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                      {t("contact.form.tripType", "Subject / Service")}
                    </label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[14px] px-4 py-3.5 text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all duration-200 cursor-pointer"
                    >
                      <option value="Outstation Rental">{t("contact.form.tripOptions.outstation", "Outstation Cab Rental")}</option>
                      <option value="Tempo Traveller">{t("contact.form.tripOptions.tempo", "Tempo Traveller Rental")}</option>
                      <option value="Bus Rental">{t("contact.form.tripOptions.bus", "Luxury Bus Rental")}</option>
                      <option value="Holiday Package">{t("contact.form.tripOptions.package", "Custom Tour Package")}</option>
                      <option value="Corporate / Wedding">{t("contact.form.tripOptions.corp", "Corporate / Event Fleet")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                    {t("contact.form.message", "Message")}
                  </label>
                  <textarea
                    rows="3"
                    placeholder={t("contact.form.messagePh", "Tell us about your trip details, travel dates, passenger count, or questions...")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[14px] p-4 text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all duration-200"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F97316] to-amber-500 hover:from-amber-600 hover:to-[#F97316] text-white font-bold text-base py-4 rounded-[14px] shadow-md hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t("contact.form.submit", "Send Message")}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>

        {/* BOTTOM CTA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-16 bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] text-white rounded-[20px] p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              Need Immediate Assistance?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Call our travel experts now for instant booking confirmation and best price guarantees.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <a
              href={`tel:${COMPANY_INFO.phone?.replace(/\s+/g, '')}`}
              className="bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-sm px-6 py-3.5 rounded-[14px] shadow transition-all duration-200 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#F97316]" />
              <span>Call Now</span>
            </a>
            <a
              href="#contact"
              className="bg-[#F97316] hover:bg-amber-600 text-white font-bold text-sm px-6 py-3.5 rounded-[14px] shadow transition-all duration-200 flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Get Free Quote</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
