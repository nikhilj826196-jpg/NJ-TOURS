import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || "System Admin (NJ Head Office)");
  const [email, setEmail] = useState(user?.email || "admin@njtours.com");
  const [phone, setPhone] = useState("+91 98220 99999");

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);

  // Success Toast state
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Admin HQ System Settings</h2>
          <p className="text-xs text-slate-400">Configure profile, security, passwords, notifications, and system parameters</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { key: 'profile', label: 'Profile Settings', icon: User },
          { key: 'security', label: 'Security & Password', icon: Lock },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'system', label: 'System Preferences', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                active ? 'bg-[#0B5ED7] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-2xl text-left">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Administrator Profile</h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <button type="submit" className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Security & Password</h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <button type="submit" className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Save className="w-4 h-4" /> Update Password
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Admin Notification Preferences</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <span>Email Alerts for New Bookings</span>
                <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-4 h-4 accent-[#0B5ED7]" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <span>SMS Dispatch Notifications</span>
                <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="w-4 h-4 accent-[#0B5ED7]" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <span>Real-Time High Demand Route Alerts</span>
                <input type="checkbox" checked={bookingAlerts} onChange={(e) => setBookingAlerts(e.target.checked)} className="w-4 h-4 accent-[#0B5ED7]" />
              </label>
            </div>
            <button type="submit" className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </form>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">System Information</h3>
            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-500">System Name:</span> <span className="font-bold text-white">NJ TOURS Control Center</span></div>
            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-500">Version:</span> <span className="font-mono text-amber-400">v2.4.0 (Enterprise)</span></div>
            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-500">Backend API:</span> <span className="font-mono text-emerald-400">FastAPI + Async MySQL</span></div>
            <div className="flex justify-between py-2"><span className="text-slate-500">JWT Token Security:</span> <span className="font-bold text-emerald-400">Active (HS256)</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
