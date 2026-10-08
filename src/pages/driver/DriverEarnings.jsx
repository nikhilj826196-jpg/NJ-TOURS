import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, CreditCard, ArrowDownRight, ArrowUpRight, Calendar, CheckCircle2, Building, RefreshCw, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function DriverEarnings() {
  const { t } = useTranslation();
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const earningsSummary = {
    totalEarnings: 42500,
    walletBalance: 8400,
    completedTrips: 28,
    weeklyBonus: 2500,
    bankName: "HDFC Bank Ltd",
    accountNo: "•••• •••• 4821",
    ifsc: "HDFC0001234"
  };

  const tripPayouts = [
    { id: "NJ-84920", date: "08 Aug 2026", route: "Mumbai ➔ Goa", distance: "590 km", baseFare: 4000, allowance: 500, total: 4500, status: "Transferred" },
    { id: "NJ-84918", date: "07 Aug 2026", route: "Dadar ➔ Mahabaleshwar", distance: "240 km", baseFare: 3200, allowance: 400, total: 3600, status: "Transferred" },
    { id: "NJ-84912", date: "05 Aug 2026", route: "Pune ➔ Shirdi", distance: "190 km", baseFare: 2600, allowance: 300, total: 2900, status: "Transferred" },
    { id: "NJ-84905", date: "03 Aug 2026", route: "Thane ➔ Lonavala", distance: "95 km", baseFare: 1600, allowance: 200, total: 1800, status: "Transferred" }
  ];

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-white text-left">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black text-white">Earnings & Weekly Payouts</h2>
        <p className="text-xs text-slate-400">Track trip revenue, driver allowances, performance bonuses, and bank transfers</p>
      </div>

      {withdrawSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Withdrawal request submitted! ₹8,400 will be credited to HDFC Bank A/C ****4821 within 2 hours.</span>
        </div>
      )}

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Monthly Earnings */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Monthly Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(earningsSummary.totalEarnings)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            28 completed trips this month
          </div>
        </div>

        {/* Wallet / Available Balance */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Available Balance</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            {formatCurrency(earningsSummary.walletBalance)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Ready for instant bank transfer
          </div>
        </div>

        {/* Weekly Performance Bonus */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Performance Bonus</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400 tracking-tight">
            {formatCurrency(earningsSummary.weeklyBonus)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            5-Star Chauffeur Incentive
          </div>
        </div>

        {/* Completed Trips */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Total Completed</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 tracking-tight">
            {earningsSummary.completedTrips} Trips
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            100% On-Time Completion Rate
          </div>
        </div>
      </div>

      {/* Linked Bank Account & Instant Payout Card */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Settlement Account</div>
            <h3 className="text-base font-extrabold text-white">{earningsSummary.bankName}</h3>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              A/C: <span className="text-white font-bold">{earningsSummary.accountNo}</span> • IFSC: <span className="text-amber-400 font-bold">{earningsSummary.ifsc}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          {withdrawing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing Payout...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 text-slate-950" /> Request Instant Payout ({formatCurrency(earningsSummary.walletBalance)})
            </>
          )}
        </button>
      </div>

      {/* Trip Earnings History Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-base font-extrabold text-white">Trip Revenue Breakdown</h3>
          <span className="text-xs text-slate-400 font-medium">Automatic Weekly Transfer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/60">
                <th className="p-4">Trip Ref</th>
                <th className="p-4">Date</th>
                <th className="p-4">Route</th>
                <th className="p-4">Distance</th>
                <th className="p-4">Base Fare</th>
                <th className="p-4">Driver Allowance</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {tripPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{p.id}</td>
                  <td className="p-4 text-slate-300">{p.date}</td>
                  <td className="p-4 text-white font-bold">{p.route}</td>
                  <td className="p-4 text-slate-400 font-mono">{p.distance}</td>
                  <td className="p-4 text-slate-300">{formatCurrency(p.baseFare)}</td>
                  <td className="p-4 text-blue-400 font-bold">+{formatCurrency(p.allowance)}</td>
                  <td className="p-4 font-black text-emerald-400 text-sm">{formatCurrency(p.total)}</td>
                  <td className="p-4">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
