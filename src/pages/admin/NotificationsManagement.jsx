import React, { useState } from 'react';
import { Bell, Send, Plus, Users, UserCheck, Search, CheckCircle2, X } from 'lucide-react';

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState([
    { id: "NOTIF-101", title: "Monsoon Special Offer Launched", message: "Flat 15% discount on all Mumbai to Lonavala weekend car rentals!", target: "All Users", date: "2026-02-08 11:00", status: "Sent", recipientsCount: 2840 },
    { id: "NOTIF-102", title: "Driver Incentive & Bonus Scheme", message: "Complete 10 outstation trips this week to earn ₹2,500 cash bonus.", target: "Drivers Only", date: "2026-02-06 09:30", status: "Sent", recipientsCount: 185 },
    { id: "NOTIF-103", title: "System Maintenance Scheduled", message: "Server upgrades scheduled for midnight between 01:00 AM - 02:00 AM.", target: "All Users", date: "2026-02-01 16:00", status: "Sent", recipientsCount: 2840 }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Users');

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    const count = target === 'Drivers Only' ? 185 : target === 'Customers Only' ? 2655 : 2840;

    const newNotif = {
      id: `NOTIF-${101 + notifications.length}`,
      title,
      message,
      target,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: "Sent",
      recipientsCount: count
    };

    setNotifications([newNotif, ...notifications]);
    setIsModalOpen(false);
    setTitle('');
    setMessage('');
    setTarget('All Users');
  };

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Broadcast Notifications</h2>
          <p className="text-xs text-slate-400">Send push notifications & system alerts to customers or drivers</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
          <Send className="w-4 h-4" /> Broadcast New Notification
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-extrabold text-sm text-white">
          Broadcast History
        </div>
        <div className="divide-y divide-slate-800">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-amber-400">{n.id}</span>
                  <h4 className="text-sm font-extrabold text-white">{n.title}</h4>
                  <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {n.target}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
                <div className="text-[11px] text-slate-500 font-medium">
                  Delivered to {n.recipientsCount} users • {n.date}
                </div>
              </div>

              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {n.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSendNotification} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#0B5ED7]" /> Broadcast System Notification
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notification Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Special Holiday Discount" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Audience</label>
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="All Users">All Users (Customers & Drivers)</option>
                  <option value="Customers Only">Customers Only</option>
                  <option value="Drivers Only">Drivers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message Body</label>
                <textarea rows="4" required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type notification message..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
