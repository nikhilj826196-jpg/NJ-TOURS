import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Save, CheckCircle2, ShieldCheck, Car, Star, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DriverProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || "Suresh Patil",
    email: user?.email || "driver@example.com",
    phone: "+91 98220 11223",
    license: "MH12-2021-0087654",
    licenseExpiry: "2029-05-15",
    experience: "8 Years",
    emergencyName: "Vijay Patil (Brother)",
    emergencyPhone: "+91 98220 99887",
    address: "Flat 202, Shivneri Apartments, Karve Road, Pune - 411004"
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl text-left text-white">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black text-white">Chauffeur Profile & Credentials</h2>
        <p className="text-xs text-slate-400">View and update your commercial driver license details, emergency contacts, and home address</p>
      </div>

      {saved && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Driver profile updated successfully!
        </div>
      )}

      {/* Verification Status Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Verification State</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Police Background Check & Commercial License Verified</div>
          </div>
        </div>
        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Approved Partner
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Full Name</label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="tel"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
              />
            </div>
          </div>
        </div>

        {/* License & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Driving License No.</label>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                disabled
                value={profile.license}
                className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">License Expiry Date</label>
            <input
              type="date"
              disabled
              value={profile.licenseExpiry}
              className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Assigned Vehicle */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <Car className="w-5 h-5 text-[#0B5ED7]" />
          <div className="text-xs">
            <span className="text-slate-500 block uppercase font-bold">Assigned Vehicle</span>
            <span className="text-white font-extrabold">Toyota Innova Crysta ZX (MH 04 ET 4020)</span>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Emergency Contact Person</label>
            <input
              type="text"
              value={profile.emergencyName}
              onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Emergency Contact Phone</label>
            <input
              type="tel"
              value={profile.emergencyPhone}
              onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
            />
          </div>
        </div>

        {/* Home Address */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Residential Address</label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#0B5ED7]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow flex items-center gap-2 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4 text-slate-900" /> Save Profile Details
        </button>
      </form>
    </div>
  );
}
